var BourneLoader = function(){

	//initialize initial loader
	function showInitLoader(){

		
		var loaderHTML = '<div class="spinContainer111"><div class="spinner111"></div></div>';

	
		$('html').append(loaderHTML);
		var o = $(window);
		$(".mask-loading").css("height", o.height());
		$(".spinner111").css("top", (o.height() / 2) - 25);

		setTimeout(function(){
			$('.spinner111').hide();
		}, 1500)
	}


	function hideInitLoader(){

		$('.spinContainer111').fadeOut();
	}
	


	//if words exist, after 1 second, load words


	//after words are shown, if page is ready, hide div, otherwise, show loading graphic again until page is ready


	//show the post load message if they exist and append to the document: //TODOs add more options to how this can appear


}