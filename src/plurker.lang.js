/**
 * @author nec@shell8.net
 * @classDescription 	
 * @param {Object} _lang
 * @param {Object} _callBack
 */
plurker.Lang = function( _lang , _callBack ){
	plurker.user.element.find('.info').html('Getting language...').show();
	this.callBack = _callBack;
	this.language = {};
	var that=this;
	
//lang cache	
	$.ajax({
		type: "GET",
		url: ['http://www.plurk.com/i18n/',_lang,'/LC_MESSAGES/messages.js'].join(''),
		success: function(msg){
			plurker.user.element.find('.info').html('Translating...').show();
			var langObject= msg.replace('babel.Translations.load(','').replace(').install();','');
/*
	var f = air.File.applicationDirectory.resolvePath('lang_'+_lang+'.json');
	var fs = new air.FileStream();
		fs.open(f, air.FileMode.WRITE);
		fs.writeUTFBytes(langObject);
		fs.close();
*/
				langObject = externalParseJSON(langObject);
				that.language = langObject.messages;
				that.callBack.call(plurker);
		},
		error: function(){
			var f = air.File.applicationDirectory.resolvePath('lang_en.json');
			var fs = new air.FileStream();
				fs.open(f, air.FileMode.READ);				
			var en = fs.readUTFBytes(fs.bytesAvailable);
				fs.close();				
			
				langObject = externalParseJSON(en);
				that.language = langObject.messages;
				that.callBack.call(plurker);				
		}
	});
}
plurker.Lang.prototype.read = function( _key ){	
	var ret = (typeof this.language[_key] == 'string')?this.language[_key]:_key;	
	if(typeof arguments[1] == 'string') {
		ret = ret.split("%s").join(arguments[1]);
	}
	return ret;
}
