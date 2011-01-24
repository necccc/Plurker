plurker.Schema = new Class({

	initialize: function(){
	},

	prepareForQuery: function (table) {

		var schema = this.schema[table],
			fields = [],
			values = [];

		if (!this.schema[table]) {
			return {
				fields: '',
				values: ''
			};
		}

		for ( var field in schema) {
			fields.push(field);
			values.push(':' + field);
		}

		fields = fields.join(',');
		values = values.join(',');

		return {
			fields: fields,
			values: values
		};
	},

	schema: {
		plurks: {
			content:              'TEXT',
			content_raw:          'TEXT',
			is_unread:            'INTEGER',
			lang:                 'TEXT',
			limited_to:           'BLOB',
			no_comments:          'INTEGER',
			owner_id:             'INTEGER',
			plurk_id:             'INTEGER PRIMARY KEY',
			plurk_type:           'INTEGER',
			posted:               'DATE',
			qualifier:            'TEXT',
			qualifier_translated: 'TEXT',
			response_count:       'INTEGER',
			responses_seen:       'INTEGER',
			user_id:              'INTEGER'
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