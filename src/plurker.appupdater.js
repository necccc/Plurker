/**
 * @author nec@shell8.net
 * @classDescription	application updater
 */
plurker.AppUpdater = function(){
	
	var options = {
		updaterURL: "http://nec.shell8.net/plurker/downloads/update.xml",
		updateOnStart: true
	};
	
	var messages = {
			titleUpdate:	"New Update Available",
			confirmUpdate: 	"New version is available from plurker, do you want to install?\n\nDescription: \n",
			successUpdate: 	"Update is succesful, plurker now restarts...",
			errorUpdate: 	"Update failed :(",
			progressUpdate:	"Updating...",
			yes:			"Yes please!",
			no:				"Nope, thx."
	},	current  = {
			version: 0,
			file: null
	},	release = {
			notes: null,
			version: 0,
			file: null
	}

 	var appXML = air.NativeApplication.nativeApplication.applicationDescriptor;
 	var xmlObject = (new DOMParser()).parseFromString(appXML, "text/xml");
	current.version = parseFloat(xmlObject.getElementsByTagName('version')[0].firstChild.nodeValue,10);
	current.file =xmlObject.getElementsByTagName('filename')[0].firstChild.nodeValue
	
	function getUpdateVersion (){
		var that = this;
		var XMLHttp = new XMLHttpRequest();
		XMLHttp.onreadystatechange = function () {
			if (XMLHttp.readyState === 4) {
				var response = XMLHttp.responseXML;
				var releaseNotes = response.getElementsByTagName("releasenotes")[0];
				if (typeof releaseNotes === "object" && releaseNotes.firstChild) {
					release.notes = releaseNotes.firstChild.nodeValue;
				}
				var latestVersion = response.getElementsByTagName("latestversion")[0];
				if (typeof latestVersion === "object" && latestVersion.firstChild) {
					release.version = parseFloat(latestVersion.firstChild.nodeValue, 10);
				}
				var releaseFile = response.getElementsByTagName("file")[0];
				if (typeof releaseFile === "object" && releaseFile.firstChild) {
					release.file = releaseFile.firstChild.nodeValue;
				}	
				if (release.version > current.version){
					updateWindow();
				} else {
					plurker.AppUpdater.callback.call();
				}
			}
		};
		XMLHttp.open("GET", options.updaterURL, true);
		XMLHttp.send(null);
	}
	
	function updateWindow(){		
		var that = this;				
		if ( confirm(messages.confirmUpdate + release.notes) ) {				
			var update = {};
			update.start = function(){						

				stream = new air.URLStream();						
				stream.addEventListener(air.Event.COMPLETE, update.finish);
				stream.load(new air.URLRequest(release.file));
			}
			update.finish = function(){

				var ba = new air.ByteArray();
				stream.readBytes(ba, 0, stream.bytesAvailable);
				updateFile = air.File.applicationStorageDirectory.resolvePath(current.file + '.air');
				fileStream = new air.FileStream();
				fileStream.addEventListener(air.Event.CLOSE, update.preinstall);
				fileStream.openAsync(updateFile, air.FileMode.WRITE);
				fileStream.writeBytes(ba, 0, ba.length);
				fileStream.close();
			}
			update.preinstall = function(){
				alert(messages.successUpdate)
				update.install();						
			}
			update.install = function(){

				var updater = new air.Updater();
				updater.update(updateFile, release.version.toString());
			}
			
			update.start();
		} else {
			plurker.AppUpdater.callback.call();
		}
	}
	
	return {
		callback: null,
		check: function( _callback ){
			this.callback = _callback;

			getUpdateVersion();
		},
		noaction: function(){			
			return 'noaction';
		},
		current: function(){
			return current;
		}
	};
	
}();