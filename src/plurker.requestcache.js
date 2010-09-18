/**
 * @author nec@shell8.net
 * @classDescription 	
 */

/**
 * RequestCache singleton
 * 
 */
var RequestCache = function(){
	var cache = {};
	return {
		add: function( _rqid , _scopeObject , _callBackFunc ){
			cache[_rqid] = (typeof cache[_rqid] == 'object')?cache[_rqid]:new Array();
			cache[_rqid].push({
				scope: _scopeObject,
				callback: _callBackFunc
			});
		},
		get: function(_rqid){
			return cache[_rqid];
		}
	};
}(); // singleton