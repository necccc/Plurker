plurker.Plurk = new Class({

	Implements: Options,

	options: {
		content: '',
		content_raw: '',
		is_unread: '1',
		lang: 'en',
		limited_to: '',
		no_comments: 0,
		owner_id: 0,
		plurk_id: 0,
		plurk_type: 0,
		posted: '',
		qualifier: '',
		qualifier_translated: '',
		response_count: 0,
		responses_seen: 0,
		user_id: 0
	},

	initialize: function (options) {
		this.setOptions(options);

		this.owner = false;

		this.users = new plurker.UserStorage();

		this.tpl = new plurker.Template(plurker.tpl.plurk);
		//

		this.users.getUserById(this.options.owner_id, this.setOwner.bind(this));
	},

	setOwner: function (ownerData) {
		this.owner = ownerData;

		this.element
			.find('.owner img').attr('src', this.owner.avatars.small).end()
			.find('.owner strong').text(this.owner.display_name);


	},
	/*

		1=[object Object]
	{
	content=Vezetékesről palackos gázra átszerelés (szakember) mennyibe kerül? alkatrész kell?
	content_raw=Vezetékesről palackos gázra átszerelés (szakember) mennyibe kerül? alkatrész kell?
	favorers=
	favorite=false
	favorite_count=0
	is_unread=1
	lang=en
	limited_to=null
	no_comments=0
	owner_id=6437509
	plurk_id=614875410
	plurk_type=0
	posted=Fri, 14 Jan 2011 20:12:45 GMT
	qualifier=:
	qualifier_translated=
	response_count=1
	responses_seen=0
	user_id=188140
	}
	 */

	render: function(callback) {

		if (this.owner) {
			this.element = $(this.tpl.run({
				lazy: false,
				avatar: this.owner.avatars.small,
				owner: this.owner.display_name,
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