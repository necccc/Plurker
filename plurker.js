$(document).ready(function(){			
	$('form#PlurkForm').hide();
	$('a').externalURL();
	$('*').each(function(i,s){s.oncontextmenu = function() { return false; }});
	
});

/*
 * JSON parse inside non-application sandbox
 */
$(window).load(function(){
	window.externalParseJSON = document.getElementById('frameId').contentWindow.childSandboxBridge.parseJSON;		
});


/**
 * PLURK_PATHS  - plurk URLs
 *  
 */
PLURK_PATHS = {
    http_base            : 'http://www.plurk.com',
    login                : 'http://www.plurk.com/Users/login?redirect_page=main',
    getCompletion        : 'http://www.plurk.com/Users/getCompletion',
	fan_user			 : 'http://www.plurk.com/Users/setFollowingTL', //  friend_id (uid), value (1,0)
	fan_get				 : 'http://www.plurk.com/Friends/getFansByOffset', //offset 0 (int), user_id (uid)
	fans_friends_get	 : 'http://www.plurk.com/Friends/getFriendsAndFansByOffset', //offset 0 (int), user_id (uid)
	plurk_add            : 'http://www.plurk.com/TimeLine/addPlurk',
    plurk_respond        : 'http://www.plurk.com/Responses/add',
    plurk_get            : 'http://www.plurk.com/TimeLine/getPlurks',
    plurk_get_responses  : 'http://www.plurk.com/Responses/get2',
    plurk_get_unread     : 'http://www.plurk.com/TimeLine/getUnreadPlurks',
    plurk_mute           : 'http://www.plurk.com/TimeLine/setMutePlurk',
    plurk_delete         : 'http://www.plurk.com/TimeLine/deletePlurk',
		
    notification         : 'http://www.plurk.com/Notifications',
    notification_accept  : 'http://www.plurk.com/Notifications/allow',
    notification_makefan : 'http://www.plurk.com/Notifications/allowDontFollow',
    notification_deny    : 'http://www.plurk.com/Notifications/deny',
    friends_get          : 'http://www.plurk.com/Users/friends_get',
    friends_block        : 'http://www.plurk.com/Friends/blockUser',
    friends_remove_block : 'http://www.plurk.com/Friends/removeBlock',
    friends_get_blocked  : 'http://www.plurk.com/Friends/getBlockedByOffset',
    user_get_info        : 'http://www.plurk.com/Users/fetchUserInfo',
	logout				 : 'http://www.plurk.com/Users/logout'
}




/**
 * plurker namespace & app
 * 
 */
var plurker = function (){
	
	return {
		start: function(){
			plurker.AppUpdater.check( plurker.user )
		},
		
		user: function(){
			$('div#Bottom').hide();
			plurker.user = new plurker.User(plurker.lang);
		},
		lang: function(){
// itt lehet a nemtudloginolni gond!					
			plurker.lang = new plurker.Lang(this.user.session.default_lang, plurker.messages)
		},
		messages: function(){	
			
			$('span#Avatar').html(['<img src="http://avatars.plurk.com/',this.user.page.uid,'-medium.gif" /><span></span>'].join(''))

			this.menu = new air.NativeMenu();
			temp = this.menu.addItem(new air.NativeMenuItem( plurker.lang.read("Visit profile") ));
			temp.data = {
				action: 'profile',
				uid: plurker.user.session.uid
			};
			temp = this.menu.addItem(new air.NativeMenuItem( plurker.lang.read("Sign out [%s]",this.user.page.nick_name ) ));
			temp.data = {
				action: 'logout'
			};
			
			for (var item = 0; item < this.menu.items.length; item++){
				this.menu.items[item].addEventListener(air.Event.SELECT, function(event){
					$(event).stop();
					jQuery.later(plurker.Actions,1,event.target.data.action,event.target.data)
				});
			}
			
			$('span#Avatar')[0].addEventListener( 'contextmenu' ,function(event) {
			    plurker.menu.display(window.nativeWindow.stage, event.clientX, event.clientY);
			});
			$('span#Avatar')[0].addEventListener( 'click' ,function(event) {
			    plurker.menu.display(window.nativeWindow.stage, event.clientX, event.clientY);
			});
			
			
			
			$('form#PlurkForm select option').each(function(i,s){
				try{ s.innerHTML = plurker.lang.read(s.value) || '' }catch(e){}				
			})
			Chrome.onResize();
			window.nativeWindow.height = 500;	
			$('div#Bottom').show();
			$('form#LoginForm').hide();
			plurker.messages = new plurker.PlurkList(this.user.page.uid, plurker.display);
		},
		updateInterval: null,
		display: function(){
			this.updateInterval = setInterval(function(){ plurker.messages.reload(); }, 15000 );									
			this.messages.load();			

		},
		menu: null
	};
	
}(); // singleton



plurker.NickNameById = function( _uid ){
	plurk.UserFactory.get(_uid, function( _nick, _uid ){ $('.userId'+_uid).html(_nick) });
}

plurker.menuItemSelectHandler = function(e){
	LOG(e)
}






/*
 * 
 * 
 * Loading=Betöltés
 * 
 * saving...=mentés…
 *       My Account=Fiókom
      My Friends=Barátaim
      My Profile=Profilom
      
      Sign out [%s]=Kijelentkezés [%s]
      
      Plurk language=Plörk nyelve
      
     An unknown error happened.=Ismeretlen hiba történt.
      
      
      only my friends=csak a barátaim
      
      

      
      
blokkolas eseten
ha vki blokkol engem 
	akkor responses lekerdezesekor 403 es "Access was denied to this resource." responseText
	nemtudom megnezni az illeto profiljat
	nem latom az illeto plurkjeit
	
aki blokkol, az tovabbra is latja a plurkjeim

ha en postolok aki engem blokkol, tud kommentelni, latja a postokat, en a sajat postomra tudok kommentelni


POST http://www.plurk.com/Users/getUpdateableData
page_uid	207910
{"packs_hash": null, "karma_class": "red", "plurks_count": 6, "response_count": 0, "karma_change": -0.16, "karma": 0.0}
      
      
 */





//http://www.plurk.com/Friends/getMyFriendsCompletion   teljes kapcsolati lista





/*

plurker.userMenuHandler = {
	deleteplurk
} 

*/





/**
 * plurker uses jScrollPane
 */
plurker.Scroll = function(){
	$('div#PlurkScroll').jScrollPane({showArrows:true, scrollbarWidth: 17,arrowSize: 21,scrollbarOnLeft: true});
}







	