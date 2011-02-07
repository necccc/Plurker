plurker.Discussion = new Class({

	Implements: Options,

	options: {
	},

	initialize: function(options){
		this.setOptions(options);

		this.users = new plurker.UserStorage();
		this.avatars = new plurker.AvatarStorage();
		this.responses = new plurker.ResponseStorage();

		this.responses.getResponsesFor(this.options.plurk_id,
			this.displayResponses.bind(this),
			this.displayError.bind(this));

		this.list = new plurker.Template(plurker.tpl.discussionList);

		this.list = $(this.list.run());

		plurker.setContent(this.list);
	},

	displayResponses: function (data) {

		var dLen = data.length,
			item,
			i;

		for (i = 0 ; i< dLen ; i++) {

			item = new plurker.DiscussionItem(data[i]);
			$('#Discussion ul').prepend(item.render());

		}

	},

	displayError: function(){
		LOG('error');
	}
});