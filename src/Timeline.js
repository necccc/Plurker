plurker.Timeline = new Class({

	Implements: Options,

	options: {
		initialPlurks: {}
	},

	initialize: function(options){
		this.setOptions(options);

		this.tpl = new plurker.Template(plurker.tpl.timeline);
		this.tpl = $(this.tpl.run());

		this.timeLine = {};

		this.setupTimeline();

		this.plurks = new plurker.PlurkStorage();

		plurker.setContent(this.tpl);

		this.timelineTpl = $('#Timeline ul');

//window.nativeWindow.height = 300;

		for (var i=0 ; i < this.options.initialPlurks.length ; i++) {

			this.plurkFactory(this.options.initialPlurks[i]);
			this.plurks.addPlurkById(this.options.initialPlurks[i]);

		}

		//this.update();
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

	plurkFactory: function (plurkData) {
		var newplurk = new plurker.Plurk(plurkData);

		this.timelineTpl.append(newplurk.render());

		this.timeLine[plurkData.plurk_id] = newplurk;
	},

	setupTimeline: function() {

	},

	update: function() {
		plurker.api.get(
			plurker.api.GETPLURKS,
			{},
			this.onUpdateResponse.bind(this),
			this.onUpdateError.bind(this)
		);
	},

	onUpdateResponse: function (response) {

		LOG(response)

	},

	onUpdateError: function () {
		error = jQuery.parseJSON(response.responseText);
		LOG(error.error_text);
	}

});