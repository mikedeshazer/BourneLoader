var BourneLoader = function(){

	//initialize initial loader
	

	this.thePreloadMsgs=[];

	function init(){
		_this.showInitLoader();
	}

	this.showInitLoader = function(){

		
		var loaderHTML = '<div class="spinContainer111"><div class="loadText111"></div><div class="spinner111"></div></div>';

	
		$('html').append(loaderHTML);
		var o = $(window);
		$(".mask-loading").css("height", o.height());
		$(".spinner111").css("top", (o.height() / 2) - 25);

		setTimeout(function(){
			if(_this.thePreloadMsgs !=[]){
				$('.spinner111').hide();
				$('.loadText111').type(_this.thePreloadMsgs, 1)
			}
			else{
				_this.hideInitLoader();
			}
			
		}, 1500)
	}





	this.hideInitLoader = function (){

		$('.spinContainer111').fadeOut();
	}



	//if words exist, after 1 second, load words

	this.preloadMsgs = function(typedPhrases){
		if(typeof typedPhrases!="object"){
			this.thePreloadMsgs= [];
		}

		this.thePreloadMsgs= typedPhrases;
	}

	//after words are shown, if page is ready, hide div, otherwise, show loading graphic again until page is ready


	//show the post load message if they exist and append to the document: //TODOs add more options to how this can appear

	var _this = this;
	init();



}


$.fn.type = function(words, speed, delayMultiple){
	if(typeof speed != "number"){
		speed = 1;
	}
	if(speed > 500){
		speed = speed/1000;
	}

	speed = speed *1000;

	if(typeof delayMultiple != "number"){
		delayMultiple = 2.5;
	}
	if(delayMultiple >500){
		//user is probably using milliseconds.... lets fix that for them
		delayMultiple= delayMultiple/1000;
	}
	
	if(typeof words == "undefined"){
		words = "Example words. You did not set them...";
	}

	if(typeof words == "string" || typeof words == "number"){

		$(this).html('');
		var thisElement = $(this);
		whichInt = 0;
		var thisSpeed = 0;
		for(i=0; i<words.length; i++ ){
			
			setTimeout(function(){
				
				thisElement.append(words.charAt(whichInt))
				whichInt= whichInt +1;
				
			}, thisSpeed);
			thisSpeed = thisSpeed + (speed/words.length);
			
		}
	}
	else{
		console.log(words);
		var currentSpeed = 0;
		var whichElem = 0;
		var words1 = words;
		var thisElement = $(this);
		for(j=0; j<words.length; j++){

		setTimeout(function(){
			var theWords = words1[whichElem];

			thisElement.html('');
			
			whichInt = 0;
			var thisSpeed = 0;

			for(i=0; i<theWords.length; i++ ){
				
				setTimeout(function(){
					
					thisElement.append(theWords.charAt(whichInt))
					whichInt= whichInt +1;
					
				}, thisSpeed);
				thisSpeed = thisSpeed + (speed/theWords.length);
				
			}
			
				whichElem= whichElem+1;
		}, currentSpeed);
		currentSpeed  = currentSpeed+(speed*delayMultiple);
		}


	}



}


