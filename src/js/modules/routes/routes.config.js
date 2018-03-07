/**=========================================================
 * Module: RoutesConfig.js
 =========================================================*/

(function () {
    'use strict';
    angular
        .module('naut')
        .config(routesConfig);
    routesConfig.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider', 'RouteProvider'];
    function routesConfig($locationProvider, $stateProvider, $urlRouterProvider, Route) {

        $urlRouterProvider.otherwise('/page/login');
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: Route.base('/core/app.html'),
                resolve: {
                    _assets: Route.require('icons', 'screenfull', 'sparklines', 'slimscroll', 'animate', 'moment')
                }
            })
            .state('app.dashboard', {
                url: '/dashboard',
                templateUrl: Route.base('/core/dashboard.html'),
                resolve: {
                    assets: Route.require('flot-chart', 'flot-chart-plugins', 'easypiechart')
                }
            })
            .state('app.authorizations', {
                url: '/authorizations',
                template: '<div id="claims-wrapper" ui-view ng-class="app.views.animation"></div>',
                abstract: true,
                resolve: {
                    assets: Route.require('flot-chart', 'flot-chart-plugins')
                }
            })
            .state('app.authorizations.list', {
                url: '/list',
                templateUrl: Route.base('authorizations/list.html'),
                resolve: {}
            })
            .state('app.authorizations.single', {
                url: '/:authorizations_id',
                templateUrl: Route.base('authorizations/single.html'),
                resolve: {
                }
            })
            .state('app.claims', {
                url: '/claims',
                template: '<div id="claims-wrapper" ui-view ng-class="app.views.animation"></div>',
                abstract: true,
                resolve: {
                    assets: Route.require('flot-chart', 'flot-chart-plugins')
                }
            })
            .state('app.claims.list', {
                url: '/list/{page:[0-9]+}',
                params: {page: 1},
                templateUrl: Route.base('claims/list.html'),
                resolve: {}
            })
            .state('app.claims.claimDetailExpress', {
                url: '/express/:claim_id',
                templateUrl: Route.base('claims/claimDetailExpress.html'),
                resolve: {
                }
            })
            .state('app.claims.claimDetailPreAuth', {
                url: '/pre-authorization/:claim_id',
                templateUrl: Route.base('claims/claimDetailPreAuth.html'),
                resolve: {
                }
            })
            .state('app.settlements', {
                url: '/settlements',
                template: '<div id="settlements-wrapper" ui-view ng-class="app.views.animation"></div>',
                abstract: true,
                resolve: {
                    assets: Route.require('flot-chart', 'flot-chart-plugins')
                }
            })
            .state('app.settlements.list', {
                url: '/list',
                templateUrl: Route.base('settlements/list.html'),
                resolve: {}
            })
            .state('app.settlements.single', {
                url: '/:settlement_id',
                templateUrl: Route.base('settlements/single.html'),
                resolve: {
                }
            })
            .state('app.invoices', {
                url: '/invoices/{page:[0-9]+}',
                params: {page: 1},
                templateUrl: Route.base('invoices/list.html'),
                resolve: {}
            })
            .state('page', {
                url: '/page',
                templateUrl: Route.base('login/page.html'),
                resolve: {}
            })
            .state('page.login', {
                url: '/login',
                templateUrl: Route.base('login/page.login.html'),
                resolve: {
                    _assets: Route.require('icons', 'animate', 'screenfull')
                }
            })
            .state('page.recover', {
                url: '/recover',
                templateUrl: Route.base('login/page.recover.html'),
                resolve: {
                    _assets: Route.require('icons', 'animate', 'screenfull')
                }
            })
            .state('app.cash-out-manual',{
                url: '/cash-out-manual',
                templateUrl: Route.base('cash-out/cash-out-manual.html'),
                resolve:{
                    _assets: Route.require('ui.knob')
                }
            })
            .state('app.cash-out-history', {
                url: '/cash-out-history',
                templateUrl: Route.base('cash-out/cash-out-history.html'),
                resolve: {
      
                }
            });
    }
})();
