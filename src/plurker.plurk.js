/**
 * @author nec@shell8.net
 * @classDescription 	
 * @param {Object} data
 */
plurker.Plurk = function( data , is_prepend ){
	this.data = data;
	this.data.posted = new Date(this.data.posted);
	this.owner = null;
	this.responseList = {}
	this.refreshTimer = 0;
	
	var that = this;
	var content = ['<li id="plurk',data.plurk_id,'">',
		'<span class="minimage"><img src="http://avatars.plurk.com/',data.owner_id,'-small.gif" alt=""></span>',
		'<div class="',(data.is_unread==0)?'unread':'','">',
		'<a href="#" class="user">',plurker.UserFactory.get( data.owner_id , this , this.getUser ).nick_name,'</a> ',
		'<em>',plurker.lang.read(data.qualifier) || '','</em> ',
		data.content,
		'<span class="responses ',(data.response_count>0)?'':'empty','">',
		'<small>@ ',postedAgo(data.posted),'</small> #',
		(eval(data.response_count-data.responses_seen) > 0)?['<strong class="count">',data.response_count,'</strong>'].join(''):['<span class="count">',data.response_count,'</span>'].join(''),'</span>',
		'</div>','<ul class="responses"></ul><span class="responseClose"></span>',
	'</li>'].join('')
	

		
		var position = false;
		
		$('ul#Plurks').children().each(function(i,s){
			var num = s.id.replace('plurk','')
			if(!position && num < data.plurk_id) position = num;
		});

		if (position) {
			$('ul#Plurks li#plurk' + position).before(content);
		} else {
			$('ul#Plurks').append(content)
		}
		
		
	

	this.element = $('li#plurk'+data.plurk_id);

	//plurker.UserFactory.get( data.owner_id , this ,  )
	this.setUpMenu( data.owner_id );
	
	this.element
		.find('span.responses')
			.click(function(){ if (/*that.data.response_count > 0 && */!$(this).hasClass('open')) {
				$(this).addClass('open');
				that.getResponses();
				that.periodicalRefresh(true);
			} })
			.end()
		.find('span.responseClose')
			.click(function(){ 
				$(this).hide().parent().find('ul.responses').hide().end().find('span.responses').removeClass('open');
				$(this).parent().find('ul.responses li').remove()
				that.periodicalRefresh(false); 
				plurker.Scroll();				
			})
			.end()
		.find('a:not(.user)')
			.externalURL()
			.end()
		.find('ul.responses').hide();
		
	return this;
}
plurker.Plurk.prototype.getUser = function( _data ){
	this.owner = _data;
	try{this.element.find('.user').html(this.owner.nick_name)}catch(e){}
}
plurker.Plurk.prototype.getResponses = function(){
	this.element.find('ul.responses li').remove();
	var that=this;
	$.ajax({
		type: "POST",
		url: PLURK_PATHS.plurk_get_responses,
		data: {
			plurk_id: this.data.plurk_id
		},
		success: function(msg){
			try{
				var responses = externalParseJSON(msg);
				that.element.find('ul.responses, span.responseClose').show();
				for(var i in responses.responses){
					try{that.responseList[responses.responses[i].id] = new plurker.Response(that.element.find('ul.responses'), responses.responses[i])} catch(e){} 
				}
				that.element.find('ul.responses').append(['<li class="add"><form><input type="text"  maxlength="140" /><input type="image" src="images/icon_add.gif" /></form></li>'].join(''))
				that.element.find('ul.responses li form').submit(function(event){
					$(event).eventStop();
					that.addResponse();
				}).end().
				find('ul.responses li form input[image]').click(function(event){
					$(event).eventStop();
					that.addResponse();
				}).end();
				
			}catch(e){
				LOG(e)
				return false;
			}
			plurker.Scroll();
		}
	});	
}
plurker.Plurk.prototype.addResponse = function(){

	if (this.element.find('input[type=text]').val() != '') {
		var that = this;
		$.ajax({
			type: "POST",
			url: PLURK_PATHS.plurk_respond,
			data: {
				posted: gmdate(),
				qualifier: ':', // TODO
				content: this.element.find('input[type=text]').val(),
				lang: plurker.user.session.default_lang,
				uid: plurker.user.session.uid,
				p_uid: this.data.owner_id,
				plurk_id: this.data.plurk_id
			},
			success: function(msg){
			
				try{
					var response = externalParseJSON(msg);
					that.responseList[response.object.id] = 
						new plurker.Response(that.element.find('ul.responses'), response.object, true)
					that.element.find('input[type=text]').val('').end()
								.find('span.responses .count').html( parseInt(that.element.find('span.responses .count').html(),10)+1 )
				}catch(e){
					LOG(e)
					return false;
				}			
				
			}
		});
	}
}

plurker.Plurk.prototype.periodicalRefresh = function( _bool ){
	var that = this;
	if(_bool) {
		this.refreshTimer = setInterval( function(){that.refreshResponses(); }, 20000 )
	} else {
		clearInterval(this.refreshTimer)
	}
	
}

plurker.Plurk.prototype.refresh = function( data ){
	this.data = data;
	var that = this;
	this.element.find("span.responses").html([
		'<small>@ ',postedAgo(data.posted),'</small> #',
		(eval(data.response_count-data.responses_seen) > 0)?['<strong class="count">',data.response_count,'</strong>'].join(''):['<span class="count">',data.response_count,'</span>'].join('')
	].join(''))
	if (data.is_unread != 0) {
		this.element.find("div").css('fontStyle','normal');
	}
	if (data.response_count > 0) {
		this.element.find('span.responses').removeClass('empty').click(function(){
			if (that.data.response_count > 0 && !$(this).hasClass('open')) {
				$(this).addClass('open');
				that.getResponses();
			}
		});
	}
	
	if(this.element.find('ul.responses li').length > 0 && this.element.find('ul.responses li').length < data.response_count) {
		this.refreshResponses();
	}
}
plurker.Plurk.prototype.refreshResponses = function(){

// TODO - updatelje a szamot is, ne toroljon, adjon hozza	
	
	this.element.find('ul.responses li').remove();
	var that=this;
	$.ajax({
		type: "POST",
		url: PLURK_PATHS.plurk_get_responses,
		data: {
			plurk_id: this.data.plurk_id
		},
		success: function(msg){
			try{
				var responses = externalParseJSON(msg);
				for(var i in responses.responses){
					that.responseList[responses.responses[i].id] = new plurker.Response(that.element.find('ul.responses'), responses.responses[i])
				}
				that.element.find('ul.responses').append(['<li class="add"><form id="reponseAdd',responses.responses[i].id,'"><input type="text" /><input type="image" src="images/icon_add.gif" /></form></li>'].join(''))
			}catch(e){
				LOG(e)
				return false;
			}
		}
	});	
}
plurker.Plurk.prototype.setUpMenu = function( user_id ){
	
	var user_id = user_id
	var that=this;
	
	var tmpMnuHandler = function(event){
		$(event).eventStop();
		
		plurker.UserFactory.getUserInstance(user_id).getMenu();

		if (that.data.owner_id == plurker.user.session.uid) {
			delete plurker.UserFactory.getUserInstance(user_id).menu;
			plurker.UserFactory.getUserInstance(user_id).menu = new air.NativeMenu();
			temp = plurker.UserFactory.getUserInstance(user_id).menu.addItem(new air.NativeMenuItem(plurker.lang.read("Delete")));
			temp.data = {
				action: 'del', plurk_id: that.data.plurk_id
			};
			for (var item = 0; item < plurker.UserFactory.getUserInstance(user_id).menu.items.length; item++) {
				plurker.UserFactory.getUserInstance(user_id).menu.items[item].addEventListener(air.Event.SELECT, function(event){
					$(event).eventStop();
					jQuery.later(plurker.Actions,1,event.target.data.action,event.target.data)
				});
			}
		}		
	 	plurker.UserFactory.getUserInstance(user_id).menu.display(window.nativeWindow.stage, event.clientX, event.clientY);
	}
		
	this.element
		.find('a.user')
	 		.listen('contextmenu' , tmpMnuHandler )
			.listen( 'click' , tmpMnuHandler)
			.end()
		.find('span.minimage')
			.listen('contextmenu' , tmpMnuHandler )
			.listen( 'click' , tmpMnuHandler)
			.end();		

}
