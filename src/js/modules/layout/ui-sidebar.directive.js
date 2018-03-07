/**=========================================================
 * Module: SidebarDirective
 * Wraps the sidebar. Handles collapsed state and slide
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .directive('uiSidebar', uiSidebar);

    uiSidebar.$inject = ['$rootScope', '$window', '$timeout', 'MEDIA_QUERY'];
    function uiSidebar ($rootScope, $window, $timeout, MEDIA_QUERY) {

      return {
        restrict : 'A',
        link : link
      };

      function link(scope, element) {
        element.find('a').on('click', function (event) {
          var ele = angular.element(this),
              par = ele.parent()[0];

          // remove active class (ul > li > a)
          var lis = ele.parent().parent().children();
          angular.forEach(lis, function(li){
            if(li !== par)
              angular.element(li).removeClass('active');
          });

          var next = ele.next();
          if ( next.length && next[0].tagName === 'UL' ) {
            ele.parent().toggleClass('active');
            event.preventDefault();
          }
        });

        // on mobiles, sidebar starts off-screen
        if ( onMobile() ) $timeout(function(){
          $rootScope.app.sidebar.isOffscreen = true;
        });
        // hide sidebar on route change
        $rootScope.$on('$stateChangeStart', function() {
            if ( onMobile() )
              $rootScope.app.sidebar.isOffscreen = true;
        });

        $window.addEventListener('resize', function(){
            if ( onMobile() ) {
              $timeout(function(){
                $rootScope.app.sidebar.isOffscreen = true;
              });
            }
        });

        function onMobile() {
          return $window.innerWidth < MEDIA_QUERY.tablet;
        }

      }
    }
})();
