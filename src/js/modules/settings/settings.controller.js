/**=========================================================
 * Module: SettingsController.js
 * Handles app setting
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .controller('SettingsController', SettingsController);
    /* @ngInject */
    function SettingsController(settings) {
      var vm = this;
      // Restore/Save layout settings
      settings.loadAndWatch();

      // Set scope for panel settings
      vm.themes = settings.availableThemes();
      vm.setTheme = settings.setTheme;

    }
    SettingsController.$inject = ['settings'];
})();
