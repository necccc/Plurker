plurker.ResponseStorage = new Class({

	Extends: plurker.Storage,

	Implements: Options,

	options: {},

	initialize: function(options){
		this.parent(options);
	},

	onDBReady: function() {

		LOG("ResponseStorage NOW, I WOULD USE THE DB PLEASE!");

	},

	getResponsesFor: function (plurk_id, receiveCallback, errorCallback) {

		var passArgs =  {
				plurk_id: plurk_id,
				receiveCallback: receiveCallback,
				errorCallback: (errorCallback[2]) ? errorCallback[2] : false
			};

		this._getLocal(plurk_id, passArgs);

	},

	_getLocal: function (plurk_id, passArgs) {

		var sql = "SELECT * FROM responses WHERE plurk_id == :plurk_id";

		this.query({
			sql: sql,
			data: {
				':plurk_id': plurk_id
			},
			success: this._localResult.bindWithEvent(this, passArgs),
			error: this._localResult.bindWithEvent(this, passArgs)
		});

	},

	_localResult: function (result, passArgs) {

		if( !result.success ) {
			return;
		}

		if (result.success && result.length < 1) {
			//empty
			this._getRemote(passArgs.plurk_id, passArgs);
		}

		//van local is, nezzuk meg azert, hatha van tobb
		this._getRemote(passArgs.plurk_id, passArgs, result);
	},


	_getRemote: function (plurk_id, passArgs, localResults) {

		var data = {};

		data.plurk_id = plurk_id;

		if(typeof localResults !== 'undefined') {
			data.from_response = localResults.length;
		}

		passArgs.localResults = localResults;

		plurker.api.get(
			plurker.api.GETRESPONSES,
			data,
			this._remoteResult.bindWithEvent(this, passArgs)
		);

	},

	_remoteResult: function (data, passArgs) {
		var rLen = data.responses.length;

		for (var i = 0 ; i< rLen ; i++) {
			this._store(data.responses[i]);
		}

		result = $.merge(passArgs.localResults.data, data.responses);
		passArgs.receiveCallback.call(this, result);
	},

	_store: function (reponseInfo) {
		// elvileg itt nem kene conflictnak lennie


		// megis van vmiert neha


		var q = this.prepareForQuery('responses'),
			sql = 'INSERT INTO responses (' + q.fields + ') ' +
					'VALUES (' + q.values + ')',
			dataObj = {},
			receiveCallback = false;

		for (var i in reponseInfo) {
			if (q.fields.indexOf(i) > -1) {
				if (i == "posted") {
					dataObj[':' + i] = new Date(reponseInfo[i]);
				} else {
					dataObj[':' + i] = reponseInfo[i];
				}
			}
		}

		this.query({
			sql: sql,
			data: dataObj,
			success: (receiveCallback) ? receiveCallback : function () {},
			error: function (event) {
				LOG('response save ERROR' + "\n" +
					"Error message:"  + "\n" +
						event.error.messag + "\n" +
					"Details:"  + "\n" +
						event.error.details + "\n" +
					"Sql:" + "\n" +
						sql);
			}
		});


	}

	/*

	getResponsesFor

		_getLocalData
			true:
				_getRemoteOffset (latest)
				_store
				return;
			false:
				_getRemoteOffset (now)
				_store
				return;

	putResponsesFor


	 */
});