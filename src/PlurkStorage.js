plurker.PlurkStorage = new Class({

	Extends: plurker.Storage,

	Implements: Options,

	options: {},

	initialize: function(options){
		this.parent(options);
	},

	onDBReady: function() {

		LOG("NOW, I WOULD USE THE DB PLEASE!");

	},

	getPlurkById: function () {},

	addPlurkById: function (plurkData, receiveCallback) {

		this._getLocalPlurk(
			plurkData.plurk_id,
			function(){},
			this._putPlurk.bind(this, {
				plurkData: plurkData,
				receiveCallback: receiveCallback
			})
		);

	},

	_putPlurk: function (args) {

		var q = this.prepareForQuery('plurks'),
			sql = 'INSERT INTO plurks (' + q.fields + ') ' +
					'VALUES (' + q.values + ')',
			dataObj = {};

		for (var i in args.plurkData) {
			if (q.fields.indexOf(i) > -1) {
				if (i == "posted") {
					dataObj[':' + i] = new Date(args.plurkData[i]);
				}
				else {
					dataObj[':' + i] = args.plurkData[i];
				}
			}
		}

		if (typeof dataObj[':qualifier_translated'] == 'undefined') {
			dataObj[':qualifier_translated'] = '';
		}

		this.query({
			sql: sql,
			data: dataObj,
			success: (args.receiveCallback) ? args.receiveCallback : function () {},
			error: function (event) {
				LOG('plurkdata save ERROR');
				LOG("Error message:");
				LOG(event.error.message);
				LOG("Details:");
				LOG(event.error.details);
				LOG(dataObj);
			}
		});
	},


	_getLocalPlurk: function (plurk_id, receiveCallback) {

		var sql = "SELECT * FROM plurks WHERE plurk_id == :plurkid";

		this.query({
			sql: sql,
			data: {
				':plurkid': plurk_id
			},
			success: this._localPlurkResult.bindWithEvent(this, {
				plurkId: plurk_id,
				receiveCallback: receiveCallback,
				errorCallback: (arguments[2]) ? arguments[2] : false
			}),
			error:  this._localPlurkResult.bindWithEvent(this, {
				plurkId: plurk_id,
				receiveCallback: receiveCallback,
				errorCallback: (arguments[2]) ? arguments[2] : false
			})
		});

	},

	_localPlurkResult: function(response, args) {

		if( !response.success ) {
			if (args.errorCallback) {
				args.errorCallback.call(this, args);
			}
			return;
		}

		if( response.success && response.length < 1 && args.errorCallback) {
			args.errorCallback.call(this, args);
			return;
		} else {
			// remote needed
			this._getRemotePlurk(args.plurkId, args.receiveCallback);
			return;
		}

		// TODO: adja vissza az eredmenyt

		// TODO: ha volt plurk, es van args.plurkData, akkor UPDATE

		args.receiveCallback.call(this, response);

	},


	_getRemotePlurk: function () {
//		LOG("_getRemotePlurk")
	}


});