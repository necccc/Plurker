/**
 * @author nec@shell8.net
 * @classDescription 	
 */
plurker.UserFactory = function(){
	var userCache = {};
	var requestCache = {};
	return {
		get: function( _uid,_scope,_callback ){
			RequestCache.add(_uid,_scope,_callback);			
			if( typeof userCache[_uid] != 'object' && RequestCache.get(_uid).length < 2 )  {				
				var that=this;
				$.ajax({
					type: "POST",
					url: PLURK_PATHS.user_get_info,
					data: {
						user_id: _uid
					},
					success: function(msg){
						msg = msg
							.split('new Date("').join('"')
							.split('GMT")').join('GMT"');
						var userObject = externalParseJSON(msg);				
						var userinstance = new plurker.UserInstance(_uid, userObject)
						that.save(_uid, userinstance );						
						userinstance.get( _callback , _scope );
						
					}
				});
				
				return {nick_name: '...'}; // return a dummy userInstance
				
			} else if (  typeof userCache[_uid] == 'object' ){

				return userCache[_uid].get( _callback , _scope );

			} else {	
				return {nick_name: '...'}; // return a dummy userInstance
			}
		},
		getUserInstance: function(_uid){
			return userCache[_uid];
		},
		save: function(_uid, data){
			userCache[_uid] = data;
		},
		refresh: function( _uid ){
			$.ajax({
					type: "POST",
					url: PLURK_PATHS.user_get_info,
					data: {
						user_id: _uid
					},
					success: function(msg){
						msg = msg
							.split('new Date("').join('"')
							.split('GMT")').join('GMT"');
						var userObject = externalParseJSON(msg);
						plurker.UserFactory.getUserInstance( _uid ).update(userObject)
					}
			});
		}
	}	
}(); // factory singleton