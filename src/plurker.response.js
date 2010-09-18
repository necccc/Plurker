/**
 * @author nec@shell8.net
 * @classDescription 	
 * @param {Object} parent
 * @param {Object} data
 */

plurker.Response = function( parent, data ){
	this.data = data;
	this.data.posted = new Date(this.data.posted);
	this.owner = {};
	var that = this;
	if (arguments[2]) { // ilyenkor a form ele kell tenni
		parent.find('li.add').before(['<li id="response', data.id, '"><a href="" class="user"></a><em></em></li>'].join(''));
	} else {
		parent.append(['<li id="response', data.id, '"><a href="" class="user"></a><em></em></li>'].join(''));
	}
	this.element = $('li#response'+data.id);

	this.element.html([
		'<a href="" class="user">',plurker.UserFactory.get( data.user_id , this , this.getUser ).nick_name,'</a> ',
		'<em>',plurker.lang.read(data.qualifier),'</em> ',
		data.content].join(''));

	this.element.find('a').externalURL();

	this.setUpMenu(data.user_id)

	return this;
}
plurker.Response.prototype.getUser = function( _data ){
	this.owner = _data;
	this.element.find('.user').html(_data.nick_name)
}
plurker.Response.prototype.setUpMenu = function( user_id ){
	
	var user_id = user_id
	var that=this;
	
	var tmpMnuHandler = function(event){
		$(event).stop();
		
		plurker.UserFactory.getUserInstance(user_id).getMenu();

		if (that.data.owner_id == plurker.user.session.uid) {
			delete plurker.UserFactory.getUserInstance(user_id).menu;
			plurker.UserFactory.getUserInstance(user_id).menu = new air.NativeMenu();

		}		
	 	plurker.UserFactory.getUserInstance(user_id).menu.display(window.nativeWindow.stage, event.clientX, event.clientY);
	}
		
	this.element.find('a.user')
		.listen('contextmenu' , tmpMnuHandler )
		.listen( 'click' , tmpMnuHandler)	

}

