/**=========================================================
 * Module: TranslatorService
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .service('translator', translator);
    /* @ngInject */
    function translator($rootScope, $translate) {
      /*jshint validthis:true*/
      var self = this;

      self.init = init;
      self.set  = set;
      self.data = {
        // Handles language dropdown
        listIsOpen: false,
        // list of available languages
        available: {
          'en':    'English',
          'es':    'Español',
          'pt':    'Português',
          'zh-cn': '中国简体',
        },
        selected: 'English'
      };

      /////////////////////

      // display always the current ui language
      function init() {
        var proposedLanguage = $translate.proposedLanguage() || $translate.use();
        var preferredLanguage = $translate.preferredLanguage(); // we know we have set a preferred one in App.config
        self.data.selected = self.data.available[ (proposedLanguage || preferredLanguage) ];
        
        // Init internationalization service
        $rootScope.language = self.data;
        $rootScope.language.set = angular.bind(self,self.set);

        return self.data;
      }

      function set(localeId, ev) {
        // Set the new idiom
        $translate.use(localeId);
        // save a reference for the current language
        self.data.selected = self.data.available[localeId];
        // finally toggle dropdown
        self.data.listIsOpen = ! self.data.listIsOpen;
      }

    }
    translator.$inject = ['$rootScope', '$translate'];

})();
