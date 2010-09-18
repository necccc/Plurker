plurker.Schema = new Class({

	initialize: function(){
	},

	schema: {
		plurks: {
			plurk_id:             'INTEGER PRIMARY KEY',
			responses_seen:       'INTEGER',
			qualifier:            'TEXT',
			response_count:       'INTEGER',
			limited_to:           'BLOB',
			no_comments:          'INTEGER',
			is_unread:            'INTEGER',
			lang:                 'TEXT',
			content_raw:          'TEXT',
			user_id:              'INTEGER',
			plurk_type:           'INTEGER',
			content:              'TEXT',
			qualifier_translated: 'TEXT',
			posted:               'DATE',
			owner_id:             'INTEGER'
		},

		responses: {
			id:          'INTEGER PRIMARY KEY',
			plurk_id:    'INTEGER',
			content:     'TEXT',
			content_raw: 'TEXT',
			lang:        'TEXT',
			posted:      'DATE',
			qualifier:   'TEXT DEFAULT ""',
			user_id:     'INTEGER'
		},

		users: {
			id:                'INTEGER PRIMARY KEY',
			display_name:      'TEXT',
			is_channel:        'INTEGER DEFAULT 0',
			nick_name:         'TEXT',
			has_profile_image: 'INTEGER DEFAULT 0',
			location:          'TEXT DEFAULT ""',
			date_of_birth:     'DATE',
			relationship:      'TEXT DEFAULT ""',
			avatar:            'INTEGER DEFAULT 0',
			full_name:         'TEXT DEFAULT ""',
			gender:            'INTEGER DEFAULT 1',
			page_title:        'TEXT DEFAULT ""',
			recruited:         'INTEGER DEFAULT 0',
			karma:             'REAL DEFAULT 0'
		}
	}
});