		
jQuery(document).ready(function($){
	var loadingHtml = '<div class="loader"></div>'
    //TouchEmulator();
	var isTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
	var isNavigating = false;
	//Activation des fonctions gestures uniquement sur les devices mobiles
	if(isTouch){
		var container = $(gestures.container);
		var prevLink;
		var nextLink;
		function hasPreviousLinkFn(){
			//Recherche d'un lien avec rel=prev
			prevLink = jQuery('a[rel=prev]');
            var hasNav = prevLink && prevLink.length > 0 ? true : false;
			if(!hasNav && gestures.category_navigation){
				//Si pas de lien trouvé, on regarde si le menu contient un lien actif
				var $currentMenuLi = $(".current-menu-item");
				if($currentMenuLi && $currentMenuLi.length > 0){
					var $prevMenuLi = $currentMenuLi.prev();
					if($prevMenuLi && $prevMenuLi.length > 0){
						prevLink = $prevMenuLi.find("a");
						hasNav = true; 
					}
				}
			}
			return hasNav;
		}
		function hasNextLinkFn(){
			//Recherche d'un lien avec rel=next
			nextLink = jQuery('a[rel=next]');
            var hasNav = nextLink && nextLink.length > 0 ? true : false;
			if(!hasNav && gestures.category_navigation){
				//Si pas de lien trouvé, on regarde si le menu contient un lien actif
				var $currentMenuLi = $(".current-menu-item");
				if($currentMenuLi && $currentMenuLi.length > 0){
					var $nextMenuLi = $currentMenuLi.next();
					if($nextMenuLi && $nextMenuLi.length > 0){
						nextLink = $nextMenuLi.find("a");
						hasNav = true; 
					}
				}
			}
			return hasNav;
		}
		
		var hasPreviousLink = hasPreviousLinkFn();
		var hasNextLink = hasNextLinkFn();
		
		function moveAllPage(event){
			if(!isNavigating){
				//Fix vertical pan
				if(event.angle > -10 && event.angle < 10 || event.angle > 170 && event.angle < 190 ){
					var delta = event.deltaX;
					var deltaParallax = -delta*0.5;
					//container translation
					container.css("transform","translate(" + event.deltaX + "px, 0px)");
					$(".swipe-loading").css("transform","translate(" + event.deltaX + "px, 0px)");
					$(".swipe-loading span").css("transform", "translate("+deltaParallax+"px, 0px)");
				}
			}
		}
		
		function dragRight(event) {
			// deltaX tracks the distance dragged along the x-axis since the initial touch.
			if(hasPreviousLink){
				moveAllPage(event);
			}
		};
		function dragLeft(event) {
			if(hasNextLink){
				// deltaX tracks the distance dragged along the x-axis since the initial touch.
				moveAllPage(event);
			}
		};

		function navigatePrevious(event) {
			if(!isNavigating){
				isNavigating = true;
				if ( hasPreviousLink ) {
					container.html("");
					jQuery(".sl-left").css("transition", "transform 0.1s");
					jQuery(".sl-left span").css("transition", "transform 0.1s");
					setTimeout(function(){
						var width = jQuery(".sl-left").width();
						var parallax = Math.floor(-width*0.5);
						jQuery(".sl-left").css("transform", "translate(" + width + "px, 0)");
						jQuery(".sl-left span").css("transform", "translate(" + parallax + "px, 0)");
					},20);
					jQuery(".sl-left span").html(loadingHtml);
					setTimeout(function(){
						jQuery(location).attr('href', prevLink.attr('href'));
					},20);
				}
				else{
					resetElement(event);
				}
			}
		};
		function navigateNext(event){
			if(!isNavigating){
				if ( hasNextLink ) {
					container.html("");
					jQuery(".sl-right").css("transition", "transform 0.1s");
					jQuery(".sl-right span").css("transition", "transform 0.1s");
					setTimeout(function(){
						var width = jQuery(".sl-right").width();
						var parallax = Math.floor(width*0.5);
						jQuery(".sl-right").css("transform", "translate(-" + width + "px, 0)");
						jQuery(".sl-right span").css("transform", "translate(" + parallax + "px, 0)");
					},20);
					jQuery(".sl-right span").html(loadingHtml);
	
					setTimeout(function(){
						jQuery(location).attr('href', nextLink.attr('href'));
					},20);
	
				}
				else{
					resetElement(event);
				}
			}
            isNavigating = true;
		};

		function resetElement(event) {
			if(!isNavigating){
                container.css("transition", "transform 0.2s");
                container.css("transform", "none");
                $(".swipe-loading").css("transform", "none");
                setTimeout(function(){
                    container.css("transition", "");
                }, 200);
			}
		};
		var touchControl = new Hammer(container[0],
			{
				dragLockToAxis: true,
				dragBlockHorizontal: true
			});
		touchControl.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });
		touchControl.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
		touchControl.on("panright", dragRight)
				.on("panleft", dragLeft)
				.on("swiperight", navigatePrevious)
				.on("swipeleft", navigateNext)
				.on("panend", resetElement);

        jQuery("<div class='swipe-loading sl-left'><span></span></div>").insertBefore(container);
        jQuery("<div class='swipe-loading sl-right'><span></span></div>").insertAfter(container);
	}

});



