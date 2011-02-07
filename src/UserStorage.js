plurker.UserStorage = new Class({

	Extends: plurker.Storage,

	Implements: Options,

	options: {},

	initialize: function(options){
		this.parent(options);

		this.avatars = new plurker.AvatarStorage();
	},

	onDBReady: function() {

		LOG("UserStorage NOW, I WOULD USE THE DB PLEASE!");

	},

	getUserById: function (id, receiveCallback) {
		this._getLocalUser(id, receiveCallback);
	},

	addUserById: function (userInfo, receiveCallback) {
		this._putLocalUser(userInfo, receiveCallback);
	},

	_getLocalUser: function (id, receiveCallback) {

		var sql = "SELECT * FROM users WHERE id == :userid";

		this.query({
			sql: sql,
			data: {
				':userid': id
			},
			success: this._localUserResult.bindWithEvent(this, {
				userId: id,
				receiveCallback: receiveCallback,
				errorCallback: (arguments[2]) ? arguments[2] : false
			}),
			error:  this._localUserResult.bindWithEvent(this, {
				userId: id,
				receiveCallback: receiveCallback,
				errorCallback: (arguments[2]) ? arguments[2] : false
			})
		});

	},

	_localUserResult: function(result, args) {

		if( !result.success ) {
			return;
		}

		if( result.success && result.length < 1 ) {
			// remote needed
			this._getRemoteUser(args.userId, args.receiveCallback);
			return;
		}

		this.avatars.getAvatarByUser(result.data[0], this._avatarResult.bindWithEvent(this, {
				userInfo: result.data[0],
				receiveCallback: args.receiveCallback
		}));

	},

	_putLocalUser: function (userInfo, receiveCallback) {

		var q = this.prepareForQuery('users'),
			sql = 'INSERT INTO users (' + q.fields + ') ' +
					'VALUES (' + q.values + ')',
			dataObj = {};

		for (var i in userInfo) {
			if (q.fields.indexOf(i) > -1) {
				if (i == "date_of_birth") {
					dataObj[':' + i] = new Date(userInfo[i]);
				} else {
					dataObj[':' + i] = userInfo[i];
				}
			}
		}

		this.query({
			sql: sql,
			data: dataObj,
			success: (receiveCallback) ? receiveCallback : function () {},
			error: function (event) {
				LOG('userdata save ERROR');
				LOG("Error message:");
				LOG(event.error.message);
				LOG("Details:");
				LOG(event.error.details);
			}
		});
	},



	_getRemoteUser: function(id, receiveCallback) {

		//PUBLICPROFILE
		plurker.api.get(
			plurker.api.PUBLICPROFILE,
			{
				user_id: id
			},
			this._remoteUserResult.bindWithEvent(this, {
				receiveCallback: receiveCallback
			})
		);

	},

	_remoteUserResult: function(response, args) {
		if( typeof response.user_info != 'undefined') {

			// write local data
			// TODO
			this._putLocalUser(response.user_info);

			// get image
			this.avatars.getAvatarByUser(response.user_info, this._avatarResult.bindWithEvent(this, {
				userInfo: response.user_info,
				receiveCallback: args.receiveCallback
			}));
		}
	},

	_avatarResult: function (avatars, args) {
		var userInfo = args.userInfo;
		userInfo.avatars = avatars;
		args.receiveCallback.call(this, userInfo);
	}


});