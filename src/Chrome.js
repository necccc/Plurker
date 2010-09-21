plurker.Chrome = new Class({

	Implements: Options,

	options: {
		exitOnClose		: false,
		minimizable		: true,
		maximizable		: false,
		resizable		: true,
		fadeInactive	: false,
		alwaysInFront	: false,
		fadeAnimStart	: true
	},

	unfocus: 0,

	initialize: function(options){
		this.setOptions(options);

		$('div#Head').mousedown(  this.move.bind(this) );
		$('span#Close').click(    this.close.bind(this) );
		$('span#Minimize').click( this.minimize.bind(this) );

		window.nativeWindow.alwaysInFront = this.options.alwaysInFront;

		if (this.options.fadeInactive) {
			$('body').mouseout(this.onBlur.bindWithEvent(this));
		}

		this.onResize();

		if (this.options.resizable) {
			$('span#ResizeBottomRight').mousedown( this.resize.bind(this, 'BR') );
			$('span#ResizeBottomLeft').mousedown( this.resize.bind(this, 'BL') );
			$('span#ResizeTopLeft').mousedown( this.resize.bind(this, 'TL') );
			$('span#ResizeTopRight').mousedown( this.resize.bind(this, 'TR') );

			window.nativeWindow.addEventListener(air.Event.RESIZE, this.onResize.bindWithEvent(this));
		}
		window.nativeWindow.alwaysInFront = this.options.alwaysInFront;

	},


	loader: function( _bool ){
		if(_bool){
			$('div#Loader').show();
		}else {
			$('div#Loader').hide();
		}
	},

	move : function(){
		window.nativeWindow.startMove();
	},

	minimize : function() {
		window.nativeWindow.minimize();
	},

	close : function() {
		var eExit = new air.Event(air.Event.EXITING, true, true);
		air.NativeApplication.nativeApplication.dispatchEvent(eExit);
		air.NativeApplication.nativeApplication.exit();
	},

	resize : function(orientation) {
		window.nativeWindow.startResize(orientation);
	},

	onBlur: function(e){
		this.getFocus();
		clearTimeout(this.unfocus);
		this.unfocus = this.unFocus.delay(5000, this);
	},

	onResize: function(e) {

		var height = (typeof e != "undefined" )? e.afterBounds.height : window.nativeWindow.height,
			width = (typeof e != "undefined" )? e.afterBounds.width : window.nativeWindow.width;

		$('body').css({
			height: ~~height - 32
		});
		$('div#Wrapper').css({
			height: ~~height - 24,
			width: ~~width - 20
		});
		$('form#PlurkForm input[type=text]').css({
			width: ~~width - 85
		});
		$('.jScrollPaneContainer').css({
			height: ~~height - 145,
			width: ~~width - 24
		});
		$('div#PlurkScroll').css({
			height: ~~height - 145,
			width: ~~width - 32
		});
	}
});