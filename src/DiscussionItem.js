plurker.DiscussionItem = new Class({

	Implements: Options,

	options: {
		id: 0,
		content: '',
		content_raw: '',
		plurk_id: 0,
		posted: '',
		qualifier: '',
		qualifier_translated: '',
		user_id: 0
	},

	initialize: function (options) {
		this.setOptions(options);

		this.user = false;

		this.users = new plurker.UserStorage();

		this.tpl = new plurker.Template(plurker.tpl.discussionItem);
		//

		this.users.getUserById(this.options.user_id, this.setUser.bind(this));

		this.newWindow = false;
	},

	setUser: function (ownerData) {
		this.user = ownerData;

		this.element
			.find('.owner img').attr('src', this.user.avatars.small).end()
			.find('.owner strong').text(this.user.display_name);


	},

	render: function(callback) {

		if (this.user) {
			this.element = $(this.tpl.run({
				lazy: false,
				avatar: this.user.avatars.small,
				owner: this.user.display_name,
				content: this.options.content
			}));
		} else {
			this.element = $(this.tpl.run({
				lazy: true,
				content: this.options.content
			}));
		}

		return this.element;

	}
});