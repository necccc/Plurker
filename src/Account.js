plurker.Account = new Class({

	Implements: Options,

	options: {},

	initialize: function(options){

		LOG('Account');

		this.tpl = new plurker.Template( plurker.tpl.loginform );

	}

});