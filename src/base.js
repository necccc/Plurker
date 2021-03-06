function LOG (testObject){
	air.Introspector.Console.dump(testObject);
}

var plurker = {};

/*

plurker.Crome




plurker.Account
	handles user log in template, events, secure storage

plurker.Timeline
	handles plurks, plurk updates, plurk storage and retrieval

plurker.Plurk
	handles a single plurk, controls, events

plurker.Discussion
	handles a plurk discussion

plurker.AppWindow
plurker.DiscussionWindow

*/

plurker.db = false;
plurker.tpl = {};

plurker.api = {
	key: "mzI1IsnSl31hRdRIjHk8MJWVsx6AooKd",
	url: function(uri, secure){
		var sec = secure || false,
			proto = (sec)? 'https://':'http://';

		return proto + "www.plurk.com" + uri;
	},
	get: function(command, params, callback){
		// 4. arg lehet error callback handler
		if(arguments[3]) {
			$.ajax({
				url: plurker.api.url(command),
				type: "GET",
				data: $merge(params, {api_key:plurker.api.key }),
				dataType: "json",
				success: callback,
				error: arguments[3]
			});
		} else {
			$.getJSON(
				plurker.api.url(command),
				$merge(params, {api_key:plurker.api.key }),
				callback
			);
		}
	},
	post: function(command, params, callback){
		$.ajax({
			url:  plurker.api.url(command, true),
			data: $merge(params, {api_key:plurker.api.key }),
			type: "POST",
			dataType: 'json',
			success: callback
		});
	},
	sget: function(command, params, callback){
		// 4. arg lehet error callback handler
		if(arguments[3]) {
			$.ajax({
				url: plurker.api.url(command, true),
				type: "GET",
				data: $merge(params, {api_key:plurker.api.key }),
				dataType: "json",
				success: callback,
				error: arguments[3]
			});
		} else {
			$.getJSON(
				plurker.api.url(command, true),
				$merge(params, {api_key:plurker.api.key }),
				callback
			);
		}
	},
	spost: function(command, params, callback){
		$.ajax({
			url:  plurker.api.url(command),
			data: $merge(params, {api_key:plurker.api.key }),
			type: "POST",
			dataType: 'json',
			success: callback
		});
	},
	USERLOGIN: '/API/Users/login',
	PUBLICPROFILE: '/API/Profile/getPublicProfile',

	GETPLURK: '/API/Timeline/getPlurk',
	GETPLURKS: '/API/Timeline/getPlurks',

	/**
	Required parameters:
		plurk_id: The plurk that the responses belong to.
		from_response: Only fetch responses from an offset - could be 5, 10 or 15.
	 */
	GETRESPONSES: '/API/Responses/get',

	/**
	Required parameters:
		plurk_id: The plurk that the responses should be added to.
		content: The response's text.
		qualifier: The Plurk's qualifier, must be in English. Can be following: Show example data
	 */
	RESPONSEADD: '/API/Responses/responseAdd',

	/**
	Required parameters:
		response_id: The id of the response to delete.
		plurk_id: The plurk that the response belongs to.
	 */
	RESPONSEDELETE: '/API/Responses/responseDelete',

	DUMMY: ''
};

plurker.toArray = function(obj){
	return Array.prototype.slice.call(obj);
};


plurker.strings = {

	zeroPad: function(n, count) {
		n = n + "";
		while (n.length < count) {
			n = "0" + n;
		}
		return n;
	},

	/**
	 * truncateByLength - truncate string by length, cuts between words
	 *
	 * @param {String} str - string to be truncated
	 * @param {Number} len - length to cut at
	 * @param {Boolean} dots - optional, put dots at the end?
	 */
	truncateByLength: function(str, len, dots) {

		if (str.length < len)
			return str;
		var parts = str.split(' '),
			pLen = parts.length,
			c = 0,
			max = len,
			ret = [];

		if (parts.length == 1) { // no spaces!
			ret = parts[0].substr(0, len);
		} else {
			for (var i = 0; i < pLen; i++) {
				if (c < max) {
					ret.push(parts[i]);
					c += parts[i].length + 1;
				} else {
					break;
				}
			}
			ret = ret.join(' ');
		}

		if (dots) {
			ret += '...';
		}
		return ret;
	},

	/**
	 * Takes a JS Date object and returns a string representing how
	 * long ago the date represents.
	 *
	 * @param {Object} _date
	 */
	prettyDate: function(_date) {
		var date = new Date(_date),
			diff = (((new Date()).getTime() - date.getTime()) / 1000),
			day_diff = Math.floor(diff / 86400);

		if (isNaN(day_diff) || day_diff < 0)
			return;

		return day_diff == 0 && (
				diff < 30 && "just now" ||
				diff < 60 && "half minute ago" ||
				diff < 120 && "a minute ago" ||
				diff < 3600 && "#n# minutes ago".replace(/#n#/, Math.floor(diff / 60) ) ||
				diff < 7200 && "one hour ago" ||
				diff < 86400 && "#n# hours ago".replace(/#n#/, Math.floor(diff / 3600) ) ) ||
			day_diff == 1 && "yesterday" ||
			day_diff > 1 && "#n# days ago".replace(/#n#/, day_diff);
	},

	/**
	 * creates a concatenated timestamp + rand num,
	 * without the dot, for absolute randomness
	 * used for avoid cached calls
	 */
	rndTimestamp: function(){
		return ((new Date()).getTime() + Math.random()+'').replace('.','');
	}

};
