/**
 * @author nec@shell8.net
 * @classDescription	plurker user object, handles login, user data, logout
 * @param {Object} _callback
 */
plurker.User = function( _callback ) {
	var that=this;
	this.session = null;
	this.page = null;
	this.fans = null;
	
	this.callBack = _callback;
	
//clear session
	this.logout();

	this.element = $('form#LoginForm');
	var autoLogin = air.EncryptedLocalStore.getItem("autoLogin");
	var storedUser = air.EncryptedLocalStore.getItem("userName");
	var storedPass = air.EncryptedLocalStore.getItem("userPass");

// if autologin	
	if( storedUser && storedPass && autoLogin) {		
		var u = storedUser.readUTFBytes(storedUser.length);
		var p =	storedPass.readUTFBytes(storedPass.length);			
		this.element.find('input[name=name]').val(u);
		this.element.find('input[name=password]').val(p);
		this.element.find('input#Remember').attr('checked','chekced');
		this.element.find('input#AutoLogin').attr('checked','chekced');
		this.login(u,p);
		return this;
	}

// if remember me
	if( storedUser && storedPass ) {
		this.element.find('input[name=name]').val(storedUser.readUTFBytes(storedUser.length));
		this.element.find('input[name=password]').val(storedPass.readUTFBytes(storedPass.length));
		this.element.find('input#Remember').attr('checked','chekced');
		$('input#AutoLogin').removeAttr('disabled');
	}	

	this.element.submit( function(e){
		$(e).eventStop();
		that.submit();
	}).find('input[type=submit]').click(function(e){
		$(e).eventStop();
		that.submit();
	}).end()
	.find('input#Remember').change(function(){
		if($(this).attr('checked')){
			$('input#AutoLogin').removeAttr('disabled');
		} else {
			$('input#AutoLogin').attr('disabled','disabled');
		}
	})
	return this;
}

plurker.User.prototype.submit = function(){	
	this.element.find('.error').html('');
	this.login(this.element.find('input[name=name]').val(), this.element.find('input[name=password]').val())
}

plurker.User.prototype.save = function(){

	var bytesUser = new air.ByteArray(); 
	bytesUser.writeUTFBytes( this.element.find('input[name=name]').val() ); 
	air.EncryptedLocalStore.setItem("userName", bytesUser);
	
	var bytesPass = new air.ByteArray(); 
	bytesPass.writeUTFBytes( this.element.find('input[name=password]').val() ); 
	air.EncryptedLocalStore.setItem("userPass", bytesPass);
	
}

plurker.User.prototype.unsave = function(){
	air.EncryptedLocalStore.removeItem("userName");
	air.EncryptedLocalStore.removeItem("userPass");
}

plurker.User.prototype.setAutoLogin = function( _bool ){
	if (_bool) {
		var auto = new air.ByteArray();
		auto.writeUTFBytes('true');
		air.EncryptedLocalStore.setItem("autoLogin", auto);
	} else {
		air.EncryptedLocalStore.removeItem("autoLogin");
	}	
}
plurker.User.prototype.login = function( _user, _pass){
	this.element.find('.info').html('Logging in...').show();
	var that=this;
	$.ajax({
		type: "POST",
		url: PLURK_PATHS.login,
		data: {
			nick_name: _user,
			password: _pass
		},
		success: function(msg){
			that.element.find('.info').html('Loading...').show();
			var rxp = /var GLOBAL = \{.*"uid": ([\d]+),.*\}/gim;
			var myArray = msg.match(rxp);			
			try{
				myArray= externalParseJSON(myArray[0].split(' = ')[1]);
				that.session = myArray.session_user;
				that.page = myArray.page_user;
				
// get friends, fans				
				new plurker.FansFriends(that.session.uid);				
// save credentials if login is OK, and remember is required				
				if( that.element.find('input#Remember').attr('checked') ) {
					that.save();
				} else {
					that.unsave();
				}
// set autologin if reqiuired				
				if( that.element.find('input#AutoLogin').attr('checked') ) {
					that.setAutoLogin( true );
				} else {
					that.setAutoLogin( false );
				}
				
// going towards nirvana				
				that.callBack.call(plurker);
			}catch(e){
				LOG(e)
				myArray = {};
				myArray.session_user = false;
				myArray.page_user = false;
				that.element.find('.error').html('Login error.').show();
			}
		}
	});
}

plurker.User.prototype.logout = function(){
	$.ajax({
		type: "POST",
		url: PLURK_PATHS.logout
	});
}