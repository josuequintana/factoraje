/**=========================================================
 * Module: CoreConfig
 =========================================================*/
(function () {
  'use strict';

  angular
    .module('naut')
    .config(commonConfig)
    .config(lazyLoadConfig)
    .config(ngIdleConfig);

  // Common object accessibility
  commonConfig.$inject = ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide'];
  function commonConfig($controllerProvider, $compileProvider, $filterProvider, $provide) {

    var app = angular.module('naut');
    app.controller = $controllerProvider.register;
    app.directive  = $compileProvider.directive;
    app.filter     = $filterProvider.register;
    app.factory    = $provide.factory;
    app.service    = $provide.service;
    app.constant   = $provide.constant;
    app.value      = $provide.value;

  }

  // Lazy load configuration
  lazyLoadConfig.$inject = ['$ocLazyLoadProvider', 'VENDOR_ASSETS'];
  function lazyLoadConfig($ocLazyLoadProvider, VENDOR_ASSETS) {

    $ocLazyLoadProvider.config({
      debug: false,
      events: true,
      modules: VENDOR_ASSETS.modules
    });

  }

  ngIdleConfig.$inject = ['IdleProvider', 'KeepaliveProvider', 'TitleProvider', 'IDLE_TIMEOUT_TIME'];
  function ngIdleConfig(IdleProvider, KeepaliveProvider, TitleProvider, IDLE_TIMEOUT_TIME) {
    TitleProvider.enabled(false);
    IdleProvider.autoResume(true);
    IdleProvider.idle(IDLE_TIMEOUT_TIME.timeToIdle); //60 seconds to begin Idle
    IdleProvider.timeout(IDLE_TIMEOUT_TIME.timeToTimeOut); //TimeOut after 4 hours of Idle
    KeepaliveProvider.interval(10);
    IdleProvider.windowInterrupt('focus');

  }


})();
