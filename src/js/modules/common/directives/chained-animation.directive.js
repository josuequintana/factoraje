/**=========================================================
 * chained-animation.directive.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .directive('chainedAnimation', chainedAnimation);
    
    function chainedAnimation() {

      return {
        restrict: 'A',
        link: link
      };

      function link(scope, element, attrs) {
          
        if ( element.parents('[chained-animation]').length ) return;

        // inspired by Kupletsky Sergey http://codepen.io/zavoloklom/pen/wtApI
        var speed = 2000;
        var childs = element.find('[chained-animation]').add(element);

        childs.each(function() {
            var child = angular.element(this);
            var elementOffset = child.offset();
            var offset = elementOffset.left*0.8 + elementOffset.top;
            var delay = parseFloat(offset/speed).toFixed(2);

            child
              .css('-webkit-animation-delay', delay+'s')
              .css('-o-animation-delay', delay+'s')
              .css('animation-delay', delay+'s')
              .addClass('animated')
              .addClass(attrs.chainedAnimation);

          });

      }
    }

})();
