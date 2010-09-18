/**
 * @author nec@shell8.net
 * @classDescription 	
 */
plurker.Actions = function() {	
		function get(url, params){
			var callback = (typeof arguments[2] == 'function')?arguments[2]:false;
			$.ajax({
				type: "GET",
				url: url,
				data: params,
				success: function(msg){
					try{
						if(callback)callback.call();
						plurker.messages.reload();
						return true;
					}catch(e){
						LOG(e)
						return false;
					}
				}
			});
		}
		
		function post(url, params){
			var callback = (typeof arguments[2] == 'function')?arguments[2]:false;
			$.ajax({
				type: "POST",
				url: url,
				data: params,
				success: function(msg){
					try{
						if(callback)callback.call();
						plurker.messages.reload();
						return true;
					}catch(e){
						LOG(e)
						return false;
					}
				}
			});
		}
	
	return {
		logout: function( data ){
			plurker.user.logout();
			plurker.messages.unload();
			clearInterval(plurker.updateInterval);
			delete plurker.messages;
			delete plurker.user;
			delete plurker.lang;
			
			Chrome.onResize();
			window.nativeWindow.height = 300;	
			$('div#Bottom,div#PlurkScroll,.jScrollPaneContainer,form#PlurkForm,.info,.error').hide();
			$('input:disabled:checked').removeAttr('disabled');
			$('form#LoginForm').show();
						
			
		},
		follow: function( data ){
//			LOG('follow user '+data.uid)
			post(PLURK_PATHS.fan_user, {friend_id: data.uid, value:	1 },function(){ plurker.UserFactory.refresh(data.uid) } )
		},
		nofollow: function( data ){
//			LOG('do not follow user '+data.uid)
			post(PLURK_PATHS.fan_user, {friend_id: data.uid, value:	0 },function(){ plurker.UserFactory.refresh(data.uid) } )		
		},
		add: function( data ){},
		remove: function( data ){},
		block: function( data ){
//			LOG('block user '+data.uid)
			get(PLURK_PATHS.friends_block, {block_uid: data.uid },function(){ plurker.UserFactory.refresh(data.uid) });
		},
		unblock: function( data ){
//			LOG('unblock user '+data.uid)
			post(PLURK_PATHS.friends_remove_block, {friend_id: data.uid},function(){ plurker.UserFactory.refresh(data.uid) } )
		},
		profile: function( data ){
			
			LOG(data)
			
			plurker.UserFactory.get( data.uid, window, function(){openExternalURL('http://www.plurk.com/user/'+arguments[0].nick_name)} );			
		},
		del: function( data ){
//			LOG('delete plurk '+data.plurk_id)			
			plurker.messages.remove(data.plurk_id)
		}
	};	
}(); // singleton