
(function() {
    'use strict';

    angular
        .module('naut')
        .run(sessionCheck)
        .run(appRun);

    appRun.$inject = ['$rootScope', '$state', '$stateParams', '$localStorage', 'translator', 'settings', 'browser', '$locale', 'Idle', '$location'];
    function appRun($rootScope, $state, $stateParams, $localStorage, translator, settings, browser, $locale, Idle, $location) {
        $locale.DATETIME_FORMATS.AMPMS = ['a.m.', 'p.m.'];
        // Set reference to access them from any scope
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$storage = $localStorage;

        translator.init();
        settings.init();

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

            var path = $location.path();
            var qs = '';
            var referrer = '';

            if (path.indexOf('?') !== -1) {
                qs = path.substring(path.indexOf('?'), path.length);
            }

            if (fromState.name) {
                referrer = $location.protocol() + '://' + $location.host() + '/#' +fromState.url;
            }

            analytics.page({
                path: path,
                referrer: referrer,
                search: qs,
                url: $location.absUrl()
            });
        });

      // add a classname to target different platforms form css
      var root = document.querySelector('html');
      root.className += ' ' + browser.platform;

        String.prototype.toCapitalize = function(str) {
            return this.toLowerCase().replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        }
      Idle.watch();
    }
   sessionCheck.$inject = ['$rootScope', '$localStorage', '$window', 'tokenExpirationTime'];
    function sessionCheck($rootScope, $localStorage, $window, tokenExpirationTime) {

        if (!$rootScope.$storage) {
          $rootScope.$storage = $localStorage;
        }
        try {
            if (isSessionExpired()) {
              throw 'Session Expired';
            }
            if (!$rootScope.$storage['session_token']) {
              throw 'Missing token';
            }
            $rootScope.authorizedEntityType = $rootScope.$storage['session_token'].entity_type;
            $rootScope.authorizationString = $rootScope.$storage['session_token'].token;
            $rootScope.globalQueryParams = {
              loggedProvider: {}
            };
            $rootScope.globalQueryParams.loggedProvider = $rootScope.$storage.userInfo;
            tokenExpirationTime = $rootScope.$storage['session_token'].expires;
        } catch(e) {
            $rootScope.authorizationString = '';
            $localStorage.$reset();
            $rootScope.logged = false;
            $window.location.href = '/#/page/login';
        }

        function isSessionExpired() {
            try {
                if (!$rootScope.$storage.sessionStarted) {
                    throw 'No session timestamp found';
                }
                var sessionStartedMs = new Date($rootScope.$storage.sessionStarted).getTime();
                var actualMs = new Date().getTime();
                return (actualMs - sessionStartedMs) / 1000 > tokenExpirationTime;
            } catch (e) {
                return true;
            }
        }

    }
})();
