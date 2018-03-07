/**=========================================================
 * Module: LoadingbarRun
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .run(appRun);
    /* @ngInject */
    function appRun($rootScope, $timeout, cfpLoadingBar) {
        // Loading bar transition

        var latency;
        // $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        //     if( document.querySelector('.app-container > section') ) // check if bar container exists
        //         latency = $timeout(function() {
        //             cfpLoadingBar.start();
        //         }, 50); // sets a latency Threshold
        // });
        // $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        //     event.targetScope.$watch('$viewContentLoaded', function () {
        //         $timeout.cancel(latency);
        //         cfpLoadingBar.complete();
        //     });
        // });
        $rootScope.$on('requestStart', function(event) {
            latency = $timeout(function() {
                cfpLoadingBar.start();
            }, 50); // sets a latency Threshold
        });
        $rootScope.$on('requestEnd', function(event) {
            cfpLoadingBar.complete();
        });

    }
    appRun.$inject = ['$rootScope', '$timeout', 'cfpLoadingBar'];

})();
