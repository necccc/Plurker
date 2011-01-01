plurker.Account = new Class({

	Implements: Options,

	options: {
		onLogin: function () {}
	},

	initialize: function(options){
		this.setOptions(options);

		this.tpl = new plurker.Template( plurker.tpl.loginform );
		this.tpl = $( this.tpl.run() );

		this.setupLoginForm();

		plurker.setContent(this.tpl);
	},

	setupLoginForm: function() {

		this.tpl.find('#LoginForm').submit( this.onSubmit.bindWithEvent(this) );

	},

	onSubmit: function(e) {
		e = new Event(e);

		e.stop();


		var user = this.tpl.find('input[name=username]').val(),
			pass = this.tpl.find('input[name=password]').val();


		this.submitLogin(user,pass);

	},

	submitLogin: function(user, pass) {
		plurker.api.sget(
			plurker.api.USERLOGIN,
			{
					username: user,
					password: pass
			},
			this.onLoginReponse.bind(this),
			this.onErrorReponse.bind(this)
		);
	},

	onLoginReponse: function(response) {
		this.options.onLogin.call(this, response);
	},

	onErrorReponse: function(response) {
		error = jQuery.parseJSON(response.responseText);
		LOG(error.error_text);
	}

});