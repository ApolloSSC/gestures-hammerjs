		
jQuery(document).ready(function($){
	var isTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
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
			//container translation
			container.css("transform","translate(" + event.deltaX + "px, 0px)");
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
			if ( hasPreviousLink ) {
				jQuery(location).attr('href', prevLink.attr('href'));
				container.html("");
			}
			else{
				resetElement(event);
			}
		};
		function navigateNext(event){
			if ( hasNextLink ) {
				jQuery(location).attr('href', nextLink.attr('href'));
				container.html("");
			}
			else{
				resetElement(event);
			}
		};
		
		function paginationPrevious(event) {
		};
		function paginationNext(event){
		}

		function resetElement(event) {
            container.css("transform", "none");
		};
		var touchControl = new Hammer(container[0], { dragLockToAxis: true, dragBlockHorizontal: true });
		touchControl.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });
		touchControl.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
		touchControl.on("panright", dragRight)
				.on("panleft", dragLeft)
				.on("swiperight", navigatePrevious)
				.on("swipeleft", navigateNext)
				.on("panend", resetElement);
		
		// var $pagination = $("nav[role=navigation]");
		// if($pagination && $pagination.length > 0){
			// touchControl.on("swipeup", paginationNext)
				// .on("swipedown", paginationPrevious);
		// }
	}

});



