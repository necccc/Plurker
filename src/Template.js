plurker.Template = new Class({

	_func: null,//compiled function
	_value: null,//raw string

	initialize: function(value, options) {

		if (typeof(value) != 'string') {
			if (typeof(value) != 'undefined') {
				LOG("param (defined, yet not a string): ", value);
			}
			//$.console.trace();
			throw ("Template is missing or param is not a string, cannot initialize!"); // new Error-t nem mindig kapja el a firebug - ha mar lud...
		}

		this._value = value.replace(/[\r\n]/g, "");

		this.options = options || {};

		this._parser = new plurker.TemplateParser();

		//may postpone the compile phase
		if (!this.options.lazy) {
			this.compile();
		}
	},

	//generate pseudocode and store in _func
	compile: function() {
		this._func = this._parser.compile(this._value);
	},

	//run template with given json object
	//and automatically add the label group if we have one
	run: function(locals) {
		var context = {
			__run: this._func
		};

		locals = (locals)? locals : {};

		$extend(context, locals);

		// tpl compile utan a context menthetetlenul
		// az iframeben maradt, oda kell pakolni a valtozoinkat
		addTplVars(locals);

		return context.__run();
	}

});