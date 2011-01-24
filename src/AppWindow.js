plurker.Window = new Class({

	Extends: plurker.Chrome,

	Implements: Options,

	options: {},

	initialize: function(options){
		this.parent(options); // inits Chrome

		LOG('application');

		this.users = new plurker.UserStorage();
		this.avatars = new plurker.AvatarStorage();

		// watch login event
		new plurker.Account({
			onLogin: this.onLogin.bind(this)
		});


	},

	onLogin: function (loginResponse) {

		this.users.getUserById(loginResponse.user_info.id, this.setUser.bind(this));

		for(var id in loginResponse.plurks_users) {
			// kaptunk kapcsibol 10 usert akiket lehet precahelni DB-be
			this.users.getUserById(id, function() {});
		}

		new plurker.Timeline({
			initialPlurks: loginResponse.plurks
		});



// kapott plurkoket is db-be ha nincsenek meg ott
// ha ott vannak updatelni az adataikat

// majd lehet oket kitenni a listaba, updatelni a chrome kinezetet


	},

	setUser: function (userData) {
		//LOG(userData);
		this.user = userData;
	},

	getUser: function () {
		return this.user;
	}



});