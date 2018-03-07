/**=========================================================
 * Module: RouteProvider.js
 * Provides helper functions for routes definition
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .provider('Route', RouteProvider)
        ;
    
    RouteProvider.$inject = ['VENDOR_ASSETS'];
    function RouteProvider (VENDOR_ASSETS) {

      // Set here the base of the relative path
      // for all app views
      this.base = function (uri) {
        return 'app/views/' + uri;
      };

      // Generates a resolve object by passing script names
      // previously configured in constant.VENDOR_ASSETS
      this.require = function () {
        var _args = arguments;
        return ['$ocLazyLoad','$q', function ($ocLL, $q) {
            // Creates a promise chain for each argument
            var promise = $q.when(1); // empty promise
            for(var i=0, len=_args.length; i < len; i ++){
              promise = andThen(_args[i]);
            }
            return promise;

            // creates promise to chain dynamically
            function andThen(_arg) {
              // also support a function that returns a promise
              if(typeof _arg === 'function')
                  return promise.then(_arg);
              else
                  return promise.then(function() {
                    // if is a module, pass the name. If not, pass the array
                    var whatToLoad = getRequired(_arg);
                    // simple error check
                    if(!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                    // finally, return a promise
                    return $ocLL.load( whatToLoad );
                  });
            }
            // check and returns required data
            // analyze module items with the form [name: '', files: []]
            // and also simple array of script files (for non angular scripts)
            function getRequired(name) {
              if (VENDOR_ASSETS.modules)
                  for(var m in VENDOR_ASSETS.modules)
                      if(VENDOR_ASSETS.modules[m].name && VENDOR_ASSETS.modules[m].name === name)
                          return VENDOR_ASSETS.modules[m];
              return VENDOR_ASSETS.scripts && VENDOR_ASSETS.scripts[name];
            }

          }];
      }; // require

      // not necessary, only used in config block for routes
      this.$get = function(){};

    }

})();
