/**
 * @author nec@shell8.net
 * @classDescription 	custom chrome handler, controller
 */



var Chrome = function(){	
	$(document).ready(function(){ Chrome.initialize(); });	
	return {
		unfocus: 0,
		options: {
			exitOnClose		: false,
			minimizable		: true,
			maximizable		: false,					
			resizable		: true,
			fadeInactive	: false,
			alwaysInFront	: false,
			fadeAnimStart	: true
		},
		application: null,
		initialize : function(){
			window.chrome = this;
			
			
			$('div#Head').mousedown(function(){ 	Chrome.move(); });
			$('span#Close').click(function(){ 		Chrome.close(); });
			$('span#Minimize').click(function(){ 	Chrome.minimize(); });	
			
			
			this.onResize();
			
			if (this.options.resizable) {
				$('span#ResizeBottomRight').mousedown(function(){
					Chrome.resize('BR');
				});
				$('span#ResizeBottomLeft').mousedown(function(){
					Chrome.resize('BL');
				});			
				$('span#ResizeTopLeft').mousedown(function(){
					Chrome.resize('TL');
				});	
				$('span#ResizeTopRight').mousedown(function(){
					Chrome.resize('TR');
				});					
				window.nativeWindow.addEventListener(air.Event.RESIZE, function(e){
					Chrome.onResize(e);
				});
			}
			window.nativeWindow.alwaysInFront = this.options.alwaysInFront;
			if (this.options.fadeInactive) {
				$('body').mouseout(function(e){
					Chrome.getFocus();
					clearTimeout(Chrome.unfocus);
					Chrome.unfocus = $.later(Chrome, 5000, 'unFocus');
				})
			}
			this.application.call();
			$('body').css({ opacity: '0.1'});
			window.nativeWindow.visible = true;
			if(this.options.fadeAnimStart){
				$('body').animate({ opacity: '1'}, 300);	
			} else {
				$('body').css({ opacity: '1'});
			}		
		},// init Ends
		loader: function( _bool ){
			if(_bool){
				$('div#Loader').show();
			}else {
				$('div#Loader').hide();
			}
		},
		move : function(){ window.nativeWindow.startMove();},
		minimize : function() { window.nativeWindow.minimize(); },
		close : function() { 
			var that = this;
			$('body').animate({ opacity: '0'}, 300, function(){				
				var eExit = new air.Event(air.Event.EXITING, true, true);
				air.NativeApplication.nativeApplication.dispatchEvent(eExit);											
				air.NativeApplication.nativeApplication.exit();
			});
		 },
		resize : function(orientation) { window.nativeWindow.startResize(orientation);	},
		onResize : function(event){
			try {
				height = event.afterBounds.height;
				width = event.afterBounds.width;
			} catch(e){
				height = window.nativeWindow.height;
				width = window.nativeWindow.width;
			}
			$('body').css({ height: eval(height-32)  });
			$('div#WrapperShadow').css({ height: eval(height-14),width: eval(width-10)  });
			$('div#Wrapper').css({ height: eval(height-24),width: eval(width-20)  });
			$('form#PlurkForm input[type=text]').css({ width: eval(width-85)  });
			$('.jScrollPaneContainer').css({ height: eval(height-145),width: eval(width-24)   });
			$('div#PlurkScroll').css({ height: eval(height-145),width: eval(width-32)   });
			plurker.Scroll();
		}		
	}	
}();
