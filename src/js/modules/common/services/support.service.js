/**=========================================================
 * Module: SupportService.js
 * Checks for features supports on browser
 =========================================================*/
/*jshint -W069*/
(function() {
    'use strict';

    angular
        .module('naut')
        .service('support', service);
    
    service.$inject = ['$document', '$window'];
    function service($document, $window) {
      /*jshint validthis:true*/
      var support = this;
      var doc = $document[0];

      // Check for transition support
      // ----------------------------------- 
      support.transition = (function() {

        function transitionEnd() {
            var el = document.createElement('bootstrap');

            var transEndEventNames = {
              WebkitTransition : 'webkitTransitionEnd',
              MozTransition    : 'transitionend',
              OTransition      : 'oTransitionEnd otransitionend',
              transition       : 'transitionend'
            };

            for (var name in transEndEventNames) {
              if (el.style[name] !== undefined) {
                return { end: transEndEventNames[name] };
              }
            }
            return false;
          }

          return transitionEnd();
      })();

      // Check for animation support
      // ----------------------------------- 
      support.animation = (function() {

          var animationEnd = (function() {

              var element = doc.body || doc.documentElement,
                  animEndEventNames = {
                      WebkitAnimation: 'webkitAnimationEnd',
                      MozAnimation: 'animationend',
                      OAnimation: 'oAnimationEnd oanimationend',
                      animation: 'animationend'
                  }, name;

              for (name in animEndEventNames) {
                  if (element.style[name] !== undefined) return animEndEventNames[name];
              }
          }());

          return animationEnd && { end: animationEnd };
      })();

      // Check touch device
      // ----------------------------------- 
      support.touch                 = (
          ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
          ($window.DocumentTouch && document instanceof $window.DocumentTouch)  ||
          ($window.navigator['msPointerEnabled'] && $window.navigator['msMaxTouchPoints'] > 0) || //IE 10
          ($window.navigator['pointerEnabled'] && $window.navigator['maxTouchPoints'] > 0) || //IE >=11
          false
      );

      return support;

    }
})();
