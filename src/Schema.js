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
			avatar:            'INTEGER DEFAULT 0',
			date_of_birth:     'DATE',
			display_name:      'TEXT',
			full_name:         'TEXT DEFAULT ""',
			gender:            'INTEGER DEFAULT 1',
			has_profile_image: 'INTEGER DEFAULT 0',
			karma:             'REAL DEFAULT 0',
			location:          'TEXT DEFAULT ""',
			nick_name:         'TEXT',
			recruited:         'INTEGER DEFAULT 0',
			relationship:      'TEXT DEFAULT ""'
		}
	}
});