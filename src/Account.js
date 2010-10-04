plurker.Account = new Class({

	Implements: Options,

	options: {},

	initialize: function(options){

		this.tpl = new plurker.Template( plurker.tpl.loginform );
		this.tpl = $( this.tpl.run() );

		this.setupLoginForm();

		plurker.setContent(this.tpl);

		this.users = new plurker.UserStorage();

	},

	setupLoginForm: function() {

		this.tpl.find('#LoginForm').submit( this.onSubmit.bind(this) );

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
			this.onLoginReponse.bind(this)
		);
	},

	onLoginReponse: function(response) {
		//LOG(response);

		this.users.getUserById(response.user_info.id, this.setUser.bind(this));

	},

	setUser: function(user) {
		LOG(user)
	},

});