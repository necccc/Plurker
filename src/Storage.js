plurker.Storage = new Class({

	Implements: [Options, plurker.AIRStorage],

	options: {},

	initialize: function(options){
		this.setOptions(options);
		this.connect();
	},

	onDBReady: function() {}

});