plurker.AIRStorage = new Class({

	Implements: Options,

	Implements: plurker.Schema,

	options: {
		dbFile: "PlurkerDB.db"
	},

	initialize: function (options) {
		this.setOptions(options);
	},

	connect: function () {

		if (!plurker.db) {

			// no instance of db connection,
			// this should be the one and only connection instance,
			// so do a schema check first

			var file = air.File.applicationStorageDirectory,
				conn;

			this.dbFile = file.resolvePath(this.options.dbFile);



			this.schemaCheck();

			conn = new air.SQLConnection();

			conn.addEventListener(air.SQLEvent.OPEN, this.dbOpenHandler.bind(this));
			conn.addEventListener(air.SQLErrorEvent.ERROR, this.dbErrorHandler.bind(this));
			conn.openAsync(this.dbFile);
		} else {
			this.db = plurker.db;
		}
	},

	dbOpenHandler: function (e) {
		//LOG("air.SQLEvent.OPEN");

		this.db = plurker.db = e.currentTarget;
		this.onDBReady();
	},

	dbErrorHandler: function (e) {
		LOG("air.SQLErrorEvent.ERROR");
		LOG(e);
	},

	schemaCheck: function () {

		var conn = new air.SQLConnection(),
			schema;

		conn.addEventListener(air.SQLError, this.dbErrorHandler.bind(this) );

		try {
			conn.open(this.dbFile, air.SQLMode.CREATE);
			this.conn = conn;
			conn.loadSchema(air.SQLTableSchema);
			schema = conn.getSchemaResult();

			$each(schema.tables, this.checkTable, this );

		} catch (error) {
			if(error.errorID == 3115){
				this.schemaCreate();
			}
		}

		this.conn.close();
		delete this.conn;
		delete conn;

	},

	schemaCreate: function () {

		$each( this.schema, function( columnObj, table){
			this.createTable( table, columnObj );
		},this);

	},

	checkTable: function (tableSchema) {

		var table = this.schema[tableSchema.name],
			columns = {};

		$each(tableSchema.columns, function (columnSchema){
			columns[columnSchema.name] = columnSchema;
		}, this);

		for (var name in table) {
			if (!($chk(columns[name])
					&& table[name].contains(columns[name].dataType) )
			) {
				this.alterTableAddCol(tableSchema.name, name, table[name] );
			}
		}
	},

	createTable: function (table, columnObj) {

		var createStmt = new air.SQLStatement(),
			sql = 'CREATE TABLE IF NOT EXISTS #table# ( #columns# );',
			columns = [];

		createStmt.sqlConnection = this.conn;

		sql = sql.replace('#table#', table);

		for (var name in columnObj ) {
			columns.push( name+" "+columnObj[name] );
		}

		sql = sql.replace('#columns#', columns.join(', ') );

		createStmt.text = sql;

		try {
			createStmt.execute();
		} catch (error) {
			LOG("Error message:", error.message);
			LOG("Details:", error.details);
		}
	},

	alterTableAddCol: function (table, column, column_attr) {

		var createStmt = new air.SQLStatement(),
			sql = 'ALTER TABLE #table# ADD COLUMN #column# #column_attr#;';

		createStmt.sqlConnection = this.conn;

		sql = sql.replace('#table#', table)
				.replace('#column#', column)
				.replace('#column_attr#', column_attr);

		createStmt.text = sql;

		try {
			createStmt.execute();
		} catch (error) {
			LOG("Error message:", error.message);
			LOG("Details:", error.details);
		}
	},

	query: function (queryData) {

		var _statement = new air.SQLStatement(),
			_params = queryData.data || false;

		_statement.sqlConnection = this.db;
		_statement.text = queryData.sql;

		if (_params) {
			for (var i in _params) {
				_statement.parameters[i] = _params[i];
			}
		}

		_statement.addEventListener(air.SQLEvent.RESULT, this.resultWrapper.bindWithEvent(this, queryData.success));
		_statement.addEventListener(air.SQLErrorEvent.ERROR, this.resultWrapper.bindWithEvent(this, queryData.error));

		_statement.execute();

	},

	resultWrapper: function (evt, callback) {

		var result, data;

		if (evt.type === 'result') {

			result = evt.target.getResult();
			data = ( !!result.data ) ? result.data : [];

			callback.call(this, {
				success: result.complete,
				data: data,
				length: data.length
			});

			return;
		}

		if (evt.type === 'error') {

			callback.call(this, {
				success: false,
				error: {
					message: evt.text,
					description: evt.error,
					details: evt.error.details,
					code: evt.errorID
				}
			});

			return;
		}



	}

});