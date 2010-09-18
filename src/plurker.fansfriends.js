/**
 * @author nec@shell8.net
 * @classDescription 	
 */
plurker.FansFriends = function(_uid){
	
	plurker.user.element.find('.info').html('Loading friends...').show();
	
	$.ajax({
		type: "POST",
		url: PLURK_PATHS.fans_friends_get,
		data: {
			offset: 0, 
			user_id: _uid
		},
		success: function(msg){
			plurker.user.element.find('.info').html('Parsing friends...').show();
			
			var fans = externalParseJSON(msg);			
			var ret = {};
			for(var i in fans) {
				ret[fans[i].uid] = fans[i];
			}
			plurker.user.fans = ret;
			
		}
	});
}