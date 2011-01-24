$(window).load(function(){
	if(plurker.Window){
		plurker.window = new plurker.Window();
	} else {
		plurker.window = new plurker.Chrome();
	}
});