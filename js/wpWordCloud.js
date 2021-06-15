(function ($) {

	'use strict';

	// init
	// go through all word cloud containers
	// to receive word cloud settings 
	$(".word-cloud-container").each(function () {

		var wpWordCloudSettings = getWordCloudSettings(this);

		window.wordcloudID = wpWordCloudSettings.id;
		console.log("WordCloud ID: " + window.wordcloudID);

		wpwc(wpWordCloudSettings, "Read settings");
		
		if (wpWordCloudSettings.data == null && wpWordCloudSettings.list == null) {

			wpwc(wpWordCloudSettings, "Error: No text found.");

			wpWordCloudSettings.data = 'Kein Text übermittelt. Bitte prüfe die Einstellungen im Backend.';

			wpWordCloudSettings.countWords = 0;

		}

		$(this).append('<div class="word-cloud-controller"></div>');
		// add container to add every cloud setting option into it
		$(this).find('.word-cloud-controller').append('<div><button id="cloud-settings-btn"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="cog" class="svg-inline--fa fa-cog fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path></svg> Einstellungen <span>anzeigen</span></button></div><div id="cloud-settings"></div>');
		// add black list container
		// contains words clicked by user
		if (wpWordCloudSettings.enableCustomBlackList == 1) {

			wpwc(wpWordCloudSettings, "Added black list container");

			$(this).append('<p id="word-cloud-black-list-'+wpWordCloudSettings.id+'"></p>');
			//$(this).append('<label for="word-cloud-activate-black-list-'+wpWordCloudSettings.id+'">Ignore-Liste anwenden</label>');
			
		}

		
		// add container where user can edit settings from frontend
		if (wpWordCloudSettings.frontendSettings == true) {
			$(this).find('#cloud-settings').append('<p>Welche Größe sollen die Wörter haben, die in der Wortwolke erscheinen?</p><div class="cloud-slidecontainer"><input type="range" id="cloud-slider" value="1" class="cloud-slider" name="cloud-slider" min="1" max="6" step="1"></div>');

            //Adding colorpicker html
            var colorPickerContent = '' +
                '<div class="colorpicker-wrapper">' +
                '   <input type="color" id="color1" name="color1" value="' + wpWordCloudSettings.fontColor1 + '"/>'+
                '       <label class="colorpicker" for="color1">Farbe 1</label>' +
                '</div>' +
                '<div class="colorpicker-wrapper">' +
                '   <input type="color" id="color2" name="color2" value="' + wpWordCloudSettings.fontColor2 + '"/>' +
                '       <label class="colorpicker" for="color2">Farbe 2</label>' +
                '</div>' +
                '<div class="colorpicker-wrapper">' +
                '   <input type="color" id="color3" name="color3" value="' + wpWordCloudSettings.fontColor3 + '"/>' +
                '       <label class="colorpicker" for="color3">Farbe 3</label>' +
                '</div>' +
                '<div class="colorpicker-wrapper">' +
                '   <input type="color" id="color4" name="color4" value="' + wpWordCloudSettings.fontColor4 + '"/>' +
                '       <label class="colorpicker" for="color4">Farbe 4</label>' +
                '</div>';
            
            $(this).find('#cloud-settings').append(colorPickerContent);
            
            //Add checkboxes for out of bound and shrink to fit
            var shrinkDraw = '' +
                '<div><div>' +
                '   <input type="checkbox" id="shrink-to-fit" name="shrink-to-fit" ' + (wpWordCloudSettings.shrinkToFit == 1 ? "checked" : "") + ' />'+
                '       <label for="shrink-to-fit">Wortwolke auf Bilschirmgröße verkleinern</label>' +
                '</div>' +
                '<div>' +
                '   <input type="checkbox" id="draw-out-of-bound" name="draw-out-of-bound" ' + (wpWordCloudSettings.drawOutOfBound == 1 ? "checked" : "") + ' />' +
                '       <label for="draw-out-of-bound">Über den Bildschirmrand zeichnen</label>' +
                '</div></div>';

			var wordOccurenceContent = '' +
			'<p>Wie häufig muss ein Wort vorkommen, um in der Wortwolke angezeigt zu werden?</p>' +
			'<div class="cloud-input-group">' +
			  '<input type="button" value="-" class="word-occurence-minus" data-field="word-cloud-setting-min-word-occurence-'+wpWordCloudSettings.id+'">' +
			  '<input type="number" step="1" max="" value="' + wpWordCloudSettings.minWordOccurence + '" id="word-cloud-setting-min-word-occurence-'+wpWordCloudSettings.id+'" name="word-cloud-setting-min-word-occurence-'+wpWordCloudSettings.id+'" class="word-cloud-setting-min-word-occurence">' +
			  '<input type="button" value="+" class="word-occurence-plus" data-field="word-cloud-setting-min-word-occurence-'+wpWordCloudSettings.id+'">' +
			'</div>';
            
            $(this).find('#cloud-settings').append(wordOccurenceContent);

        	$(this).find('#cloud-settings').append('<input type="text" value="' + wpWordCloudSettings.sizeFactor + '" class="word-cloud-setting-size-factor" id="word-cloud-setting-size-factor-'+wpWordCloudSettings.id+'" name="word-cloud-setting-size-factor-'+wpWordCloudSettings.id+'" hiddenwp>');
            
		    $(this).find('#cloud-settings').append(shrinkDraw);
            
            //Change settings after checking/unchecking shrink-to-fit
            $('#shrink-to-fit').change(function() {
                wpWordCloudSettings.shrinkToFit = $('#shrink-to-fit').prop('checked');
                if (wpWordCloudSettings.shrinkToFit == false) {
                    
                  $('<div class="word-cloud-tooltip" id="word-cloud-tooltip-'+wpWordCloudSettings.id+'"></div>').insertBefore('#btn-download-canvas');

                } else {
                    
                  $('.word-cloud-tooltip').remove();  
                    
                }
            });
            
            //Change settings after checking/unchecking draw-out-of-bound
            $('#draw-out-of-bound').change(function() {
                wpWordCloudSettings.drawOutOfBound = $('#draw-out-of-bound').prop('checked');
            });
		}	
        

		if (wpWordCloudSettings.enableCustomBlackList == 1 || wpWordCloudSettings.enableBlackList == 1) {

			$(this).find('#cloud-settings').append('<label class="kits-label" for="word-cloud-activate-black-list-'+wpWordCloudSettings.id+'"><input checked type="checkbox" class="activate-black-list" id="word-cloud-activate-black-list-'+wpWordCloudSettings.id+'" name="word-cloud-activate-black-list-'+wpWordCloudSettings.id+'">Nur Nomen, Adjektive und Verben</label>');

		}
		
		// add preview image (example)
		$(this).append('<div class="word-cloud-example"></div>');
		// add canvas
		$(this).append('<canvas class="word-cloud" style="width: 100%" height="'+wpWordCloudSettings.canvasHeight+'" width="'+wpWordCloudSettings.canvasWidth+'" id="word-cloud-'+wpWordCloudSettings.id+'"></canvas>');
		
		wpwc(wpWordCloudSettings, "Added canvas");

		// add hover container
		// hiden on init
		if (wpWordCloudSettings.shrinkToFit == false) {
		
		  $(this).append('<div class="word-cloud-tooltip" id="word-cloud-tooltip-'+wpWordCloudSettings.id+'"></div>');

		}
		
		// force tooltop to disappear when mouse cursor leaves canvas
		$('#word-cloud-' + wpWordCloudSettings.id).mouseleave(function(){
			
			$('#word-cloud-tooltip-' + wpWordCloudSettings.id).hide();

		})
		
		if (wpWordCloudSettings.countWords == 1) {

			wpWordCloudSettings.list = countWords(wpWordCloudSettings);

			wpwc(wpWordCloudSettings, "Counted words");

		}

		if (wpWordCloudSettings.debug == 1) {

			console.log({"WP WordCloud Words" : wpWordCloudSettings.list});

		}

		if (wpWordCloudSettings.enableFrontendEdit == 1 || wpWordCloudSettings.enableOcr == 1) {

			// Auswahl Text / Datei hochladen
			$(this).find('.word-cloud-controller').prepend('<div class="kits_orientierung_wrapper"><div class="kits_orientierung"><svg version="1.1" focusable="false" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="504.01px" height="441.508px" viewBox="-2.012 29.218 504.01 441.508" enable-background="new -2.012 29.218 504.01 441.508" xml:space="preserve"><path fill="#00456F" d="M451.465,61.133C397.949,15.527,318.359,23.73,269.238,74.414L250,94.238l-19.238-19.824C181.738,23.73,102.051,15.527,48.535,61.133c-61.328,52.344-64.551,146.289-9.668,203.027l188.965,195.117c12.207,12.598,32.031,12.598,44.238,0L461.035,264.16C516.016,207.422,512.793,113.477,451.465,61.133L451.465,61.133z"/></svg> <span>Texterkennung mit <a href="https://tesseract.projectnaptha.com/" target="_blank">tesseract.js</a></span></div></div>');
			$(this).find('.word-cloud-controller').prepend('<form style="margin: 20px 0;"><input type="radio" id="cloud_input_text" name="cloud_input" value="text" checked=""><label for="cloud_input_text" class="change-to-text">Text</label><input type="radio" id="cloud_input_file" name="cloud_input" value="file"><label for="cloud_input_file" class="change-to-image">Foto</label></form>');	
			$(this).find('.word-cloud-controller').append('<button class="render-word-cloud" id="render-word-cloud-'+wpWordCloudSettings.id+'">Erstellen</button>');

			$(this).prepend('<textarea class="word-cloud-text" id="word-cloud-text-'+wpWordCloudSettings.id+'" placeholder="Gib hier einen Text ein..." rows="5"></textarea>');

			$('#word-cloud-text-'+wpWordCloudSettings.id).val(wpWordCloudSettings.data);

			wpwc(wpWordCloudSettings, "Added edit field");
		
		} 


		wpWordCloudSettings.maxWeight = getMaxWeight(wpWordCloudSettings);

		wpWordCloudSettings = setWcCallbacks(wpWordCloudSettings);

		WordCloud($('#word-cloud-' + wpWordCloudSettings.id)[0], wpWordCloudSettings);

	});

	// add download button
	$(".word-cloud-container").append('<a href="#" class="canvas-download-button" id="btn-download-canvas" download="kits-wortwolke.png">Download</a>');
	// add github source
	$(".word-cloud-container").append('<div class="github_link"> <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="github" class="svg-inline--fa fa-github fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" id="kits_github_link"><path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg> <a href="https://github.com/nickyreinert/wordCloud-for-Wordpress" target="_blank">WP Word Cloud</a> </div>');
    
    $("#content-wrap").append('<div id="dpi"></div>');

	// change between text and file upload
	$('[name="cloud_input"]').change(function() {
		var theVal = $(this).val();
		 if (theVal == "file") {
		 	$('input[type="file"]').show();
			$('.kits_orientierung_wrapper').show();
		 	$(".word-cloud-text-from-image-progress-bar-container").show();
		 	$(".word-cloud-text").hide();
		 } else if (theVal == "text") {
		 	$('input[type="file"]').hide();
		 	$('.kits_orientierung_wrapper').hide();
		 	$(".word-cloud-text-from-image-progress-bar-container").hide();
		 	$(".word-cloud-text").show();
		 }
	});

	// slider change function
	$('#cloud-slider').change(function() {
		// 180, 150, 120, 90, 60, 30
		var theVal = $(this).val() - 1;
		var values = [180, 160, 120, 90, 60, 30];
		$(".word-cloud-setting-size-factor").val(values[theVal]); 
	});

	// plus and minus button
	function incrementValue(e) {
	  e.preventDefault();
	  var fieldName = $(e.target).data('field');
	  var parent = $(e.target).closest('div');
	  var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

	  if (!isNaN(currentVal)) {
	    parent.find('input[name=' + fieldName + ']').val(currentVal + 1);
	  } else {
	    parent.find('input[name=' + fieldName + ']').val(0);
	  }
	}

	function decrementValue(e) {
	  e.preventDefault();
	  var fieldName = $(e.target).data('field');
	  var parent = $(e.target).closest('div');
	  var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

	  if (!isNaN(currentVal) && currentVal > 1) {
	    parent.find('input[name=' + fieldName + ']').val(currentVal - 1);
	  } else {
	    parent.find('input[name=' + fieldName + ']').val(1);
	  }
	}

	$('.cloud-input-group').on('click', '.word-occurence-plus', function(e) {
	  incrementValue(e);
	});

	$('.cloud-input-group').on('click', '.word-occurence-minus', function(e) {
	  decrementValue(e);
	});
	
	// show settings
	$(document).on('click', '#cloud-settings-btn', function () {

		var settingsContainer = $("#cloud-settings");
		var buttonSpan = $("#cloud-settings-btn span");
		if ($(this).hasClass("cloud-settings-active")) {
			settingsContainer.slideUp(500);
			$(this).removeClass("cloud-settings-active");
			buttonSpan.text("anzeigen");
		} else {
			settingsContainer.slideDown(500);
			$(this).addClass("cloud-settings-active");
			buttonSpan.text("ausblenden");
		}
        $(this).append('<div id="dpi"></div>');
		

	});
	// trigger click event after removing black list item
	$(document).on('click', '.black-list-item', function () {
		console.log("render again");
		setTimeout(
		  function() 
		  {
		     $("button.render-word-cloud").click();
		  }, 300);
	});

	// Download canvas as png image
	$(document).ready(function () {

		var downloadButton = document.getElementById('btn-download-canvas');
		downloadButton.addEventListener('click', function (e) {
			var id = $("canvas.word-cloud").attr('id');
			var canvas = document.getElementById(id);
		    var dataURL = canvas.toDataURL('image/png');
		    downloadButton.href = dataURL;
		});

	});
	
	// clears input field when changing input method (text/image)
	$(".change-to-text, .change-to-image").click(function() {

		document.getElementById("word-cloud-text-" + window.wordcloudID).value = "";
		document.getElementById("word-cloud-text-from-image-mobile-" + window.wordcloudID).value = "";

	});

	$('.activate-black-list').click(function() {

		var wpWordCloudSettings = getWordCloudSettings($(this).parent()[0]);

		if (wpWordCloudSettings.persistentCustomBlackList == 0) {
			
			$('#word-cloud-black-list-' + wpWordCloudSettings.id).children().remove();

		} 

		wpWordCloudSettings.customBlackList = getCustomBlackList(wpWordCloudSettings);

		if (processedSettings.enableFrontendEdit == 1) {

			wpWordCloudSettings.data = $('#word-cloud-text-'+wpWordCloudSettings.id).val();

		}

		wpWordCloudSettings.list = countWords(wpWordCloudSettings);
		
		wpWordCloudSettings.maxWeight = getMaxWeight(wpWordCloudSettings);
		
		wpWordCloudSettings = setWcCallbacks(wpWordCloudSettings);

		console.log(wpWordCloudSettings.list);

		WordCloud($('#word-cloud-' + wpWordCloudSettings.id)[0], wpWordCloudSettings);

	})



	$('.render-word-cloud').click(function() {

		$("canvas.word-cloud").css("height", "auto");
		$(".word-cloud-example").hide();
		$(".canvas-download-button").css("display", "inline-block");

		var wpWordCloudSettings = getWordCloudSettings($(this).parent().parent()[0]);

		if (wpWordCloudSettings.persistentCustomBlackList == 0) {
			
			$('#word-cloud-black-list-' + wpWordCloudSettings.id).children().remove();

		} 

		wpWordCloudSettings.customBlackList = getCustomBlackList(wpWordCloudSettings);

		wpWordCloudSettings.data = $('#word-cloud-text-'+wpWordCloudSettings.id).val().replace(/\n/g, " ");

		wpWordCloudSettings.list = countWords(wpWordCloudSettings);
		
		wpWordCloudSettings.maxWeight = getMaxWeight(wpWordCloudSettings);
		
		wpWordCloudSettings = setWcCallbacks(wpWordCloudSettings);

		console.log(wpWordCloudSettings);

		WordCloud($('#word-cloud-' + wpWordCloudSettings.id)[0], wpWordCloudSettings);
        
        document.getElementById("word-cloud-container-cloud").scrollIntoView({ behavior: "smooth" });

	});

	function addWordToBlackList(item, settings) {

		wpwc(settings, "User added word to ingore list.");

		// add word to black list below the word cloud
		$('#word-cloud-black-list-'+settings.id).append('<span count='+item[1]+' class="black-list-item"><span class="black-list-word">' + item[0] + '</span></span>');

		settings.customBlackList = getCustomBlackList(settings);
		
		settings.list = countWords(settings);

		settings.maxWeight = getMaxWeight(settings);
		
		settings = setWcCallbacks(settings);

		WordCloud($('#word-cloud-' + settings.id)[0], settings);

	}

	// add trigger so user can remove words from black list
	$(document).on("click", "span.black-list-item" , function() {

		// if user clicks on word below word cloud canvas
		// it will be removed from black list

		var settings = getWordCloudSettings($(this).parent().parent()[0]);

		$(this).remove();

		settings.customBlackList = getCustomBlackList(settings);
		
		settings.list = countWords(settings);

		settings.maxWeight = getMaxWeight(settings);
		
		settings = setWcCallbacks(settings);

		WordCloud($('#word-cloud-' + settings.id)[0], settings);

	});

	function getCustomBlackList(settings) {

		var blackList = {};

		if ($("#word-cloud-activate-black-list-"+settings.id).is(":checked")) {

			$('#word-cloud-black-list-' + settings.id).children().each(function(){

				var count = $(this).attr('count');
				var word = $(this).find('.black-list-word').html();
	
				blackList[word] = count;
	
			})
	
		} 

		return blackList;

	}

	function countWords(settings) {

		var cleanText = settings.data.replace(new RegExp(settings.ignoreChars, 'gim'), '');

		var textArray = cleanText.split(' ');

		settings.list = {};

		// first count the words
		$.each(textArray, function(index, word){

			// var word = word.replace(new RegExp('['+settings.ignoreChars+']'), '');
			
			if (settings.textTransform == 'uppercase') {

				word = word.toUpperCase();

			} else if (settings.textTransform == 'lowercase') {

				word = word.toLowerCase();

			}

			if ((
				typeof(settings.customBlackList[word]) === 'undefined' && 
				!settings.blackList.includes(word)
				) ||
				!$("#word-cloud-activate-black-list-"+settings.id).is(":checked") 
 				
			) {

				if (word.length >= settings.minWordLength) {

					if (word in settings.list) {
						
						settings.list[word] = settings.list[word] + 1;

					} else {

						settings.list[word] = 1;
	
					}

				}

			}

		});

		return prepareWordList(settings);

	}

	function getMaxWeight(settings) {

		var maxWeight = 0;

		$.each(settings.list, function(index, wordCount){
		
			if (wordCount[1] > maxWeight) {
			
				maxWeight = wordCount[1];

			} 
		});

		return maxWeight;
		
	}

	function setWcCallbacks(settings) {

		// pass function to color option, based on the weight of the word 
		settings.color = function (word, weight, fontSize, radius, theta) {
		
            
			var alpha = weight / settings.maxWeight
			if (alpha < settings.minAlpha) {
				alpha = settings.minAlpha;
			}
            
            //Using a random color for a new word. 
            var randNumber =  Math.floor(Math.random() * 4) + 1;
            
            var c1 = $("#color" + randNumber).val();
			
			return "rgba(" + hexToRgb(c1).r + ", " + hexToRgb(c1).g + ", " + hexToRgb(c1).b + ", " + alpha + ")";

		};

		settings.weightFactor = function (size) {

            return size * $('#word-cloud-'+settings.id).width() / (settings.sizeFactor * (settings.maxWeight / (15*window.devicePixelRatio)));
		
		};

		// if user clicks a word, it will be removed from the list and added to 
		// an ignore list
		settings.click = function (item, dimension, event) {

			if ($("#word-cloud-activate-black-list-"+settings.id).is(":checked")) {

				addWordToBlackList(item, settings);

			}

		};

		settings.hover = function (item, dimension, event) {

			if (item != undefined) {

				$('#word-cloud-tooltip-' + settings.id).text(item[1]);

				$('#word-cloud-tooltip-' + settings.id).show();

				$('#word-cloud-tooltip-' + settings.id).css({left: event.pageX, top: event.pageY});
			}

		};
		return settings

	}
    
    function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }


	function prepareWordList(settings) {

		var preparedWordList = [];

		$.each(settings.list, function(word, count){

			if (count >= settings.minWordOccurence) {

				preparedWordList.push([word, count]);

			}

		});

		// in order to start with the most important word in the center, sort the array
		// thanks to https://stackoverflow.com/a/5200010
		preparedWordList.sort(function(a, b) {
    			a = a[1];
    			b = b[1];

    			return a > b ? -1 : (a < b ? 1 : 0);
		});


		return preparedWordList;

	}

	// log function
	function wpwc(wpWordCloudSettings, message){

		if (wpWordCloudSettings.debug == 1) {

			console.log("[WP WordCloud] " + message);

		}

	}

})(jQuery);



