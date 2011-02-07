plurker.Window = new Class({

	Extends: plurker.Chrome,

	Implements: Options,

	options: {},

	initialize: function(options){
		this.parent(options); // inits Chrome

		LOG('discussion window');

		this.discussion = new plurker.Discussion(window.plurkDiscussionData);
	}

});