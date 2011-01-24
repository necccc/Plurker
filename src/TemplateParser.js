plurker.TemplateParser = new Class({

	Implements: Options,

	_extractContext: false,
	_singleQuote: '__Q%Q__',

	regex: /<%=?(.*?)%>/g,

	initialize: function(options) {
		this.setOptions(options);
	},

	preProcessBody: function(s) {
		return s;
	},

	preProcessInner: function(s) {
		return s;
	},

	compile: function(value) {
		var start = 0,
			squote = this._singleQuote,
			body = value,
			pre = "",
			post = "",
			that = this,
			innerDebug = 1; // !!!!lehet hasznalni debughoz!!!!

		value = this.preProcessBody(value);
		body = value.replace(this.regex, function(matchedString, group, offset, fullString) {

			//protect single quotes from being escaped inside pure javascript
			group = group.replace(/'/g, squote);

			// php functions
			group = that.preProcessInner(group);

			if (matchedString.charAt(2) == "=") {
				//simple equal
				var replace = [squote , ";\n" , "  __out += " , group , ";\n", "  __out += " , squote ];
			} else {
				//inline js
				var replace = [squote , ";\n" , "  " , group , "\n", "  __out += " , squote ];
			}
			return replace.join('');
		});

		var funcBody = ("var __out = " + squote + body + squote + "; return __out;\n")
			.replace(/'/g, "\\'")
			.replace(new RegExp(squote, 'g'), "'");

		//this to T
		pre += "var T = this;\n";

		//force extract context
		if (this._extractContext) {
			if (innerDebug) {
				pre += "try { ";
			}
			pre += "with(this){";
			post += "}";
			if (innerDebug) {
				post += "} catch(e) {"+
					" LOG(e);"+
					" LOG('scope ' + this.toString());"+
					" if (this.__run) { LOG({evaledCode:this.__run+''}); }"+ // sajnos a \n-eket mar kiharapja, de a semminel tobb
					" }";
			}
		}

		return ffactory(pre + funcBody + post);
	}

});
