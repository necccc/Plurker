/**
 * @author nec@shell8.net
 * @classDescription utility functions 	
 */

/**
 * {Void}	LOG
 * 			debug logging to AIR introspector window
 * @param {Object} testObject
 */
function LOG (testObject){
	air.Introspector.Console.dump(testObject);
	//return false;
}			

/**
 * {Void}	openExternalURL
 * 			Opens url in browser instead of AIR application window
 * 
 * @param {String} href
 */
function openExternalURL(href) {
	var request = new air.URLRequest(href);
	try { air.navigateToURL(request); } catch (e) {}
}

/**
 * {String}	gmdate
 * 			returns GM formatted datestring from current date
 */
function gmdate(){
	var T=new Date();
	return [T.getUTCFullYear(),'-',T.getUTCMonth()+1,'-',T.getUTCDate(),'T',T.getUTCHours(),':',T.getUTCMinutes(),':',T.getUTCSeconds()].join('');
}

/**
 * {String}	postedAgo
 * 			returns formatted string according to elapsed time since the given date in the parameter
 * 		
 * 			TODO: language independent version	
 * 
 * @param {Object} date
 */
function postedAgo( date ) {
	
	if(typeof date != 'object')date = new Date(date)
	
	var end = new Date();
	var currentDayStart = new Date(end.getFullYear(), end.getMonth(), end.getDate(),0,0,0);

	var minutesAgo = Math.round ( (end.getTime() - date.getTime() )/1000/60 );
	var isYesterDay = Math.round ( (currentDayStart.getTime() - date.getTime() )/1000/60 );
	
	if( minutesAgo < 60 ) {
		return minutesAgo+" min ago";
	} else if (minutesAgo > 60 && isYesterDay < 0 ){
		return Math.round(minutesAgo/60)+" hours ago";
	} else {
		return [date.getFullYear(),'/',date.getMonth()+1,'/',date.getDate(),' ',date.getHours(),':',date.getMinutes()].join('');
	}	
}

/**
 * {Void}	TypeCounter
 * 			singleton utility class for counting input characters
 */
var TypeCounter = function(){
	
	var indicator = '<span id="TypeCounterIndicator"></span>';
	
	
	return {
		/**
		 * 	handles target element onchange events
		 */
		handler: function( _event, _object ){
			if($('span#TypeCounterIndicator').length < 1){ TypeCounter.initialize() }			
			TypeCounter.check(this);
		},
		check: function ( _object ) {
			if($('span#TypeCounterIndicator').length < 1){ this.initialize() }
			
			this.indicator.show()
			
			LOG( _object.value.length );
			
			return false;
		},
		initialize: function(){
			$('body').append(this.indicator);
			this.indicator = $('span#TypeCounterIndicator');
		}
	};
}(); // singleton






