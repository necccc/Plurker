plurker.UserStorage = new Class({

	Extends: plurker.Storage,

	Implements: Options,

	options: {},

	initialize: function(options){
		this.parent(options);
	},

	onDBReady: function() {

		LOG("UserStorage NOW, I WOULD USE THE DB PLEASE!");

	},



	getUserById: function(id, receiveCallback) {

		this.getLocalUser(id,receiveCallback);
	},


	getLocalUser: function(id,receiveCallback) {

		var sql = "SELECT * FROM users WHERE id == :userid";

		this.query({
			sql: sql,
			data: {
				':userid': id
			},
			success: this.localUserResult.bindWithEvent(this, id, receiveCallback),
			error:  this.localUserResult.bindWithEvent(this, id, receiveCallback)
		});
	},

	localUserResult: function(response, id, receiveCallback) {

		if( !response.success ) {
			return;
		}

		if( response.success && response.length < 1 ) {
			// remote get needed
			this.getRemoteUser(id, receiveCallback);
			return;
		}

		receiveCallback.call(this, response.data);
		return;

	},


	getRemoteUser: function(id, receiveCallback) {

		//PUBLICPROFILE
		plurker.api.get(
			plurker.api.PUBLICPROFILE,
			{
				user_id: id
			},
			this.remoteUserResult.bindWithEvent(this, id, receiveCallback)
		);

	},

	remoteUserResult: function(response, id, receiveCallback) {
		LOG(response)

		if( typeof response.user_info != 'undefined') {
			// get image, write data
			this.getUserImageRemote(id,response.user_info);
		}
	},

	getUserImage: function(id) {
		//
	},

	getUserImageRemote: function(id, userInfo) {
		//
LOG(userInfo);

		if( userInfo.has_profile_image == 1 && userInfo.avatar != null) {
//http://avatars.plurk.com/{user_id}-small{avatar}.gif
//http://avatars.plurk.com/{user_id}-medium{avatar}.gif
		}

		if (userInfo.has_profile_image == 1 && userInfo.avatar == null) {
//http://avatars.plurk.com/{user_id}-small.gif
//http://avatars.plurk.com/{user_id}-medium.gif

		}

		if (userInfo.has_profile_image == 0 ) {
//http://www.plurk.com/static/default_small.gif
//http://www.plurk.com/static/default_medium.gif
		}

	}

});