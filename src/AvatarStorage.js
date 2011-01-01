plurker.AvatarStorage = new Class({

	//Extends: plurker.Storage,

	Implements: Options,

	options: {
		dirName: "avatars"
	},

	initialize: function(options){
		//this.parent(options);

		this.dir = air.File.applicationStorageDirectory.resolvePath(this.options.dirName);

		if (!this.dir.exists) {
			// create dir
			this.dir.createDirectory();
		}
	},

	getAvatarByUser: function(userInfo, receiveCallback) {
		this._getLocalAvatar(userInfo, receiveCallback);
	},


	_getLocalAvatar: function(userInfo, receiveCallback) {

		// read files from
		//		air.File.applicationStorageDirectory  /avatars/userInfo:userId/

		var path = this.dir.resolvePath(userInfo.id);

		if (!path.exists) {
			// nincs meg
			path.createDirectory();
			this._getRemoteAvatar(userInfo, receiveCallback);
			return;
		}

		// maga a ket file letezik e
		small = path.resolvePath('small.gif');
		medium = path.resolvePath('medium.gif');

		if (small.exists && medium.exists) {
			receiveCallback.call(this, {
				small: small.url,
				medium: medium.url
			});
			return;
		} else {
			this._getRemoteAvatar(userInfo, receiveCallback);
		}


	},

	_getRemoteAvatar: function(userInfo, receiveCallback) {

		// download these files to
		// air.File.applicationStorageDirectory  /avatars/:userId/

		var path = this.dir.resolvePath(userInfo.id),
			pathS,
			pathM,
			small,
			medium,
			requestS,
			requestM,
			fileStreamS,
			fileStreamM;

		if( userInfo.has_profile_image == 1 && userInfo.avatar !== 0) {
			//http://avatars.plurk.com/{user_id}-small{avatar}.gif
			//http://avatars.plurk.com/{user_id}-medium{avatar}.gif
			url = "http://avatars.plurk.com/";
			small = userInfo.id + "-small" + userInfo.avatar + ".gif";
			medium = userInfo.id + "-medium" + userInfo.avatar + ".gif";
		}

		if (userInfo.has_profile_image == 1 && userInfo.avatar === 0) {
			//http://avatars.plurk.com/{user_id}-small.gif
			//http://avatars.plurk.com/{user_id}-medium.gif
			url = "http://avatars.plurk.com/";
			small = userInfo.id + "-small.gif";
			medium = userInfo.id + "-medium.gif";
		}

		if (userInfo.has_profile_image === 0 ) {
			//http://www.plurk.com/static/default_small.gif
			//http://www.plurk.com/static/default_medium.gif
			url = "http://www.plurk.com/static/";
			small = "default_small.gif";
			medium = "default_medium.gif";
		}

		pathS = path.resolvePath('small.gif');
		pathM = path.resolvePath('medium.gif');

		requestS = new air.URLRequest(url + small);

		fileStreamS = new air.URLLoader();
		fileStreamS.dataFormat = air.URLLoaderDataFormat.BINARY;
		fileStreamS.addEventListener(air.Event.COMPLETE, this._saveFile.bindWithEvent(this, {
			userInfo: userInfo,
			path: pathS,
			receiveCallback: receiveCallback
		}));
		fileStreamS.load(requestS);

		requestM = new air.URLRequest(url + medium);

		fileStreamM = new air.URLLoader();
		fileStreamM.dataFormat = air.URLLoaderDataFormat.BINARY;
		fileStreamM.addEventListener(air.Event.COMPLETE, this._saveFile.bindWithEvent(this, {
			userInfo: userInfo,
			path: pathM,
			receiveCallback: receiveCallback
		}));
		fileStreamM.load(requestM);

	},

	_saveFile: function (response, args) {

		var stream = new air.FileStream();

		stream.open(args.path, air.FileMode.WRITE);
		stream.writeBytes(response.target.data);
		stream.close();

		this._remoteResult(args.userInfo, args.receiveCallback);
	},

	_remoteResult: function(userInfo, receiveCallback) {

		var small = this.dir.resolvePath(userInfo.id + "/small.gif"),
			medium = this.dir.resolvePath(userInfo.id + "/medium.gif");

		if (small.exists && medium.exists) {
			receiveCallback.call(this, {
				small: small.url,
				medium: medium.url
			});
			return;
		}
	}

});