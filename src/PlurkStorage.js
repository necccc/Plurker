plurker.PlurkStorage = new Class({

	Extends: plurker.Storage,

	Implements: Options,

	options: {},

	initialize: function(options){
		this.parent(options);
	},

	onDBReady: function() {

		LOG("NOW, I WOULD USE THE DB PLEASE!")

	}

});