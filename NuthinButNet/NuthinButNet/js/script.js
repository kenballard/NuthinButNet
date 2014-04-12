/*!
 * H.E.L.P v.1.0.0
 * Copyright 2013 extracoding
 * 
 */

jQuery(document).ready(function ($) {
	"use strict";
	
			/*** Alert script ***/
		$('.alert a.close').click( function(e){
			$(this).parents('.alert').fadeOut();
			e.preventDefault();
		});

		/*** tooltip ***/
		$(function() {
			$('.tooltip').tooltip({
				track: false,
				position: {
					my: "center bottom",
					at: "center top",
				}
			});
		});
		
		
	//countdown timer //////////////////////////// 
	if ($('.count-down').length !== 0){
		$('.count-down').countdown({
			timestamp : (new Date()).getTime() + 19*24*60*60*1000
		});
	}

		/*** tweets script
		////////////////////// ***/
		function tweet(){
			var $li = $('#tweet li:first');
			$li.fadeOut( function () { $li.appendTo($('#tweet')).fadeIn(); });
			$li.addClass('current');
		}
		setInterval(function(){ tweet (); }, 5000);
	

	/*** Menu in Mobile version 
	////////////////////////////////////// ***/
  $(".tablet-menu").on("click", function(){

		if ($(".menu-bar ul:first").css('left') === '-200px') {

				$(this).animate({'left':'220px'}, 250);
				$(".wrap")
					.css({'position':'fixed'})
					.animate({'paddingLeft':'200px', 'marginRight':'-200px'}, 250);
				$(".menu-bar ul:first")
					.animate({'left':'0px'}, 250);
		}
		else {

			$(".menu-bar ul:first").animate({'left':'-200px', 'marginRight':'0px'}, 250);
			$(this).animate({'left':'20px'}, 250);
			$(".wrap")
				.animate({'paddingLeft':'0px', 'marginRight':'0px'}, 250)
				.delay(100)
				.css({'position':'fixed'})
				.removeAttr('style');

		}

  });

	function menuTablet() {
		var $screen = $(window).width();
		if ($screen > 979) {
			$(".tablet-menu")
				.animate({'left':'20px'},
				{
					duration: 250,
					complete: function() { $(".tablet-menu").removeAttr('style');}
				});
			$(".menu-bar ul:first")
				.animate({'left':'0px'}, 
				{
					duration: 250,
					complete: function() { $(".menu-bar ul:first").removeAttr('style');}
				});
				
			$(".wrap")
				.animate({'paddingLeft':'0px', 'marginRight':'0px'}, 
				{
					duration: 250,
					complete: function() { $(".wrap").removeAttr('style');}
				})
				.css({'position':'static'});
		}
	}
	menuTablet();
	
	
	if( $('.camera_wrap').length !== 0){
		$('.camera_wrap').camera({
			pagination: false
		});
	}

	if( $('.testimoni').length !== 0){
		$('.testimoni').bxSlider({
			minSlides: 1,
			maxSlides: 1,
			slideWidth: 800
		});
	}
	
	if( $('.tweets-list').length !== 0){
		$('.tweets-list').bxSlider({
			mode: 'vertical',
			minSlides: 2,
			maxSlides: 2,
			ticker: true,
			speed: 25000
		});
	}
	
	
	
	/*** gallery images hover text ***/
	$('.gallery .image').hover(function(){
				var $this = $(this);
				var ht = $('.image-info p', $this).height() / 2;
				$('.image-info p', $this).css({'marginTop':-ht});
				
				var imgUrl = $('img',this).attr('src');
				var $imgSpan = $("<span />", {
					"class":'imageMirror'
				});
				$imgSpan.appendTo($this);

				var img = $("<img />").attr({'src': imgUrl});
				img.appendTo($(".imageMirror"));
				
	}, function(){
				$(".imageMirror").remove();
	});


	$('.gallery .image').mousemove(function(e){
		var zoomImage = $('img', this);
		var zoomOffset = zoomImage.offset();
		var zoomLeft = zoomOffset.left;
		var zoomTop = zoomOffset.top;	
		
		var image = $(".imageMirror img", this);
		$(image, this).css({'left': (zoomLeft - e.pageX)/2, 'top': (zoomTop - e.pageY)/2});
	});// gallery image mousemove ends


		if($("a[data-rel^='prettyPhoto']").length !== 0){
			$("a[data-rel^='prettyPhoto']").prettyPhoto({
				animation_speed:'normal',
				slideshow:3000,
				autoplay_slideshow: false
			});
		}
		


	/*** Dialog Script ***/
	$("#dialog-login, #dialog-search").dialog({
		autoOpen: false,
		draggable: false,
		show: {effect:'drop', direction:'left'},
		hide: {effect:'drop', direction:'right'}
	});

	/*** Trigger Dialog ***/
	$('.user-login').on('click', this, function(e){
		$('.dialog-overlay').fadeIn();
		$( "#dialog-login" ).dialog('open');
		e.preventDefault();
	});
	$('.user-search').on('click', this, function(e){
		$('.dialog-overlay').fadeIn();
		$( "#dialog-search" ).dialog('open');
		e.preventDefault();
	});
	$('.ui-dialog .ui-dialog-titlebar-close').click( function(){
		$('.dialog-overlay').fadeOut();
	});
	/*** hide elements on ESCAPE ***/
	$(document).bind('keydown', function(e) {
		if (e.keyCode === 27) {
			$(".dialog-overlay").fadeOut();
		}
	});

	function dialogLogin_size (){
		var resolution = $(window).width();
		if(resolution <= 480){
			var winW = $(window).width();
			$("#dialog-login, #dialog-search").dialog( "option", "width", winW );
		}
		if(resolution > 480){
			$("#dialog-login, #dialog-search").dialog( "option", "width", 400 );
		}
	} // dialogLogin_size function ends		




	/*** convert pagination into select **/
	$("<select />", {
		"class":"pagination-select"
	}).appendTo(".events-area");
	
	$("<option />", {
		"selected":"selected",
		"value":"",
		"text":"Pagination"
		}).appendTo(".events-area select");
	
	$(".pagination ul > li > a, .pagination ul > li > span").each(function() {
		var el = $(this);
		$("<option />", {
			"value":el.attr("href"),
			"text":el.text()
			}).appendTo(".events-area select");
	});
	
	$(".events-area select").change(function() {
		window.location = $(this).find("option:selected").val();
	});
		


	$(window).resize( function() {
		menuTablet();
		dialogLogin_size();
	});
		

}); // document ready function ends //