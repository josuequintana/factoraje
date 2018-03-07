/**=========================================================
 * Module: AnimateEnabledDirective.js
 * Enable or disables ngAnimate for element with directive
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .directive('animateEnabled', animateEnabled);

    animateEnabled.$inject = ['$animate'];
    function animateEnabled($animate) {

      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          scope.$watch(function () {
            return scope.$eval(attrs.animateEnabled, scope);
          }, function (newValue) {
            $animate.enabled(!!newValue, element);
          });
        }
      };
    }
})();

