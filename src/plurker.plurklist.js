/**
 * @author nec@shell8.net
 * @classDescription 	
 * @param {Object} _uid
 */
plurker.PlurkList = function( _uid ){	
	this.uid = _uid;
	this.cache = {};
	var that = this;
	$('div#PlurkScroll,.jScrollPaneContainer').show();
	$('form#PlurkForm').show().submit( function(e){
		$(e).stop();
		if( TypeCounter.check( $(this).find('input[type=text]') ) ) that.write();
		
	}).find('input[type=submit]').click(function(e){
		$(e).stop();
		that.write();
	}).end().find('input[type=text]').keydown(TypeCounter.handler);
	this.load();
}
plurker.PlurkList.prototype.cacheWrite = function(_key, _data){
	this.cache[_key] = _data;
}
plurker.PlurkList.prototype.cacheRead = function( _key ){
	return this.cache[_key] || false; 
}
plurker.PlurkList.prototype.load = function(){
	var that=this;
	$.ajax({
		type: "POST",
		url: PLURK_PATHS.plurk_get,
		data: {
			user_id: this.uid
		},
		success: function(msg){
			try{
				msg = msg
						.split('new Date("').join('"')
						.split('GMT")').join('GMT"');					
				var plurks = externalParseJSON(msg);
				for(var k in plurks) {
					that.add(plurks[k]);
				}
				plurker.Scroll();
				setInterval(function(){ plurker.messages.reload(); }, 20000 );		
			}catch(e){
				LOG(e)
				return false;
			}

		}
	});
}
plurker.PlurkList.prototype.add = function( data ){
	this.cacheWrite( data.plurk_id, new plurker.Plurk(data , arguments[1]) );
}
plurker.PlurkList.prototype.reload = function(){
	var that=this;
	$.ajax({
		type: "POST",
		url: PLURK_PATHS.plurk_get,
		data: {
			user_id: this.uid
		},
		success: function(msg){
			try{
				msg = msg
						.split('new Date("').join('"')
						.split('GMT")').join('GMT"');					
				var plurks = externalParseJSON(msg);
				
				
				for(var k in plurks) {
					that.refresh(plurks[k]);
// ha van uj 

//window.nativeWindow.notifyUser(air.NotificationType.INFORMATIONAL)	


					
				}
			}catch(e){
				LOG(e)
				return false;
			}
			plurker.Scroll();
		}
	});
}
plurker.PlurkList.prototype.refresh = function( data ){
	if( !this.cacheRead(data.plurk_id) ) {
		this.add(data, true);
	} else {
		this.cacheRead(data.plurk_id).refresh(data);
	}
}
plurker.PlurkList.prototype.write = function(){	
	if( $('form#PlurkForm input[type=text]').val() != '' ){
		var that=this;
		$.ajax({
			type: "POST",
			url: PLURK_PATHS.plurk_add,
			data: {
				posted: 		gmdate(),
				qualifier:		$('form#PlurkForm select').val(),
				content:		$('form#PlurkForm input[type=text]').val(),
				lang:			plurker.user.session.default_lang,				
				uid:			plurker.user.session.uid,
				no_comments:	0
			},
			success: function(msg){
				$('form#PlurkForm input[type=text]').val('');
				plurker.messages.reload();
			}
		});			
	}	
}
plurker.PlurkList.prototype.remove = function( plurk_id ){
	
	this.cache[plurk_id] = null;
	delete this.cache[plurk_id];
	$('li#plurk'+plurk_id).remove();
	
	$.ajax({
		type: "POST",
		url: PLURK_PATHS.plurk_delete,
		data: {plurk_id: plurk_id },
		success: function(msg){
			try{
				plurker.messages.reload();
				return true;
			}catch(e){
				LOG(e)
				return false;
			}
		}
	});
	
}

plurker.PlurkList.prototype.unload = function(  ){
	
	for (var plurk_id in this.cache) {
		this.cache[plurk_id] = null;
		delete this.cache[plurk_id];
		$('li#plurk' + plurk_id).remove();
	}
}
