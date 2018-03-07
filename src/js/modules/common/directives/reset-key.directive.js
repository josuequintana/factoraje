/**=========================================================
 * Module: ResetKeyDirective.js
 * Removes a key from the browser storage via element click
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('naut')
        .directive('resetKey', resetKey);
    
    resetKey.$inject = ['$state', '$rootScope'];
    function resetKey($state, $rootScope) {

      return {
        restrict: 'EA',
        link: link
      };
      
      function link(scope, element, attrs) {
        
        var resetKey = attrs.resetKey;

        element.on('click', function (e) {
            e.preventDefault();

            if(resetKey) {
              delete $rootScope.$storage[resetKey];
              $state.go($state.current, {}, {reload: true});
            }
            else {
              $.error('No storage key specified for reset.');
            }
        });
      }
    }

})();
