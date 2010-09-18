/**
 * @author nec@shell8.net
 * @classDescription 	
 *	@param {String} userID
 * 	@param {Object} userdata
 */
plurker.UserInstance = function( userID , userdata ){
	
	this.user_id = userID;
	this.userData = userdata;
	this.menu = false;
	
	return this;	
}
/** 
 *	@param {String} key
 *	or
 *	@param {Object} callback
 *	@param {Object} scope
 */
plurker.UserInstance.prototype.get = function( ){
	if( typeof arguments[0] == 'string'){
		return this.userData[arguments[0]];
	} else if((typeof arguments[0] == 'function' || typeof arguments[0] == 'object' ) && typeof arguments[1] == 'object' ){
		arguments[0].call( arguments[1] , this.userData );	
		if(RequestCache.get(this.user_id).length > 0){
			var u = RequestCache.get(this.user_id);
			for(var r in u){
				u[r].callback.call(u[r].scope,this.userData)
			}
		}	
	}
	return this.userData;
}
plurker.UserInstance.prototype.update = function( data ){
	this.userData = data;
}
/**
 * 	plurker.UserInstance.prototype.getMenu
 */
plurker.UserInstance.prototype.getMenu = function( ){
	var that = this;
	
	if (this.menu) {
		delete this.menu;
	}
		
	this.userData.relationship = this.userData.relationship.split('_')
	for (var n in this.userData.relationship) {
		this.userData.relationship[n] = this.userData.relationship[n].charAt(0).toUpperCase() + this.userData.relationship[n].substring(1);
	}
	this.userData.relationship = this.userData.relationship.join(' ')
	
	
	var birth = new Date();
	birth.setTime((new Date()).getTime() - (new Date(this.userData.date_of_birth)).getTime())
	var temp, menu;
	this.menu = new air.NativeMenu();
	temp = this.menu.addItem(new air.NativeMenuItem(this.userData.full_name));
	temp.enabled = false;
	temp = this.menu.addItem(new air.NativeMenuItem([plurker.lang.read((this.userData.gender == 1) ? "male" : "female").toLowerCase(), ', ', plurker.lang.read("Age:").toLowerCase(), ' ', birth.getFullYear() - 1970, ', ', plurker.lang.read(this.userData.relationship.toString()).toLowerCase()].join('')));
	temp.enabled = false;
	temp = this.menu.addItem(new air.NativeMenuItem(this.userData.location));
	temp.enabled = false;
	

	this.menu.addItem(new air.NativeMenuItem("", true));
	temp = this.menu.addItem(new air.NativeMenuItem(plurker.lang.read("Visit profile")));
	temp.data = {
		action: 'profile',
		uid: this.userData.uid
	};
	this.menu.addItem(new air.NativeMenuItem("", true));
	if (this.userData.is_blocked == 1) {
		temp = this.menu.addItem(new air.NativeMenuItem(plurker.lang.read("Unblock")));
		temp.data = {
			action: 'unblock',
			uid: this.userData.uid
		};
	}
	else {
		temp = this.menu.addItem(new air.NativeMenuItem(plurker.lang.read("Block")));
		temp.data = {
			action: 'block',
			uid: this.userData.uid
		};
	}
	if (this.userData.are_friends) {
		temp = this.menu.addItem(new air.NativeMenuItem(plurker.lang.read("Remove %s as friend", this.userData.nick_name)));
		temp.data = {
			action: 'remove',
			uid: this.userData.uid
		};
	}
	else {
		temp = this.menu.addItem(new air.NativeMenuItem(plurker.lang.read("Add %s as friend", this.userData.nick_name)));
		temp.data = {
			action: 'add',
			uid: this.userData.uid
		};
	}
	temp = this.menu.addItem(new air.NativeMenuItem(plurker.lang.read("Don't follow %s plurks", this.userData.nick_name)));
	temp.data = {
		action: 'nofollow',
		uid: this.userData.uid
	};
		
	for (var item = 0; item < this.menu.items.length; item++) {
		this.menu.items[item].addEventListener(air.Event.SELECT, that.menuEventParser);
	}
	
	var tmpMnuHandler = function(event){
		that.menu.display(window.nativeWindow.stage, event.clientX, event.clientY);
	}
	
	return this.menu;
	
	
}
/**
 * 	plurker.UserInstance.prototype.menuEventParser
 * 	@param {Object} event
 */
plurker.UserInstance.prototype.menuEventParser = function(event){
	$(event).stop();
	jQuery.later(plurker.Actions,1,event.target.data.action,event.target.data)
}
