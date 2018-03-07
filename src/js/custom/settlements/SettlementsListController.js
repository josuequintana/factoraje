(function () {
    'use strict';

    angular
        .module('naut')
        .controller('SettlementsListController', SettlementsListController);

    SettlementsListController.$inject = ['$scope', '$rootScope', '$http', '$filter'];
    function SettlementsListController($scope, $rootScope, $http, $filter) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = 'SettlementsListController';
        vm.isLoadingResults = false;
        vm.currencySymbols = {
            USD: "$",
            QTQ: "Q"
        };

        vm.settlementStatusText = {
            PRINTED : "Para imprimir",
            CREATED : "Creado",
            SENT : "Enviado"
        };
        vm.settlements = {};
        vm.getSettlements = getSettlements;
        vm.getSettlements({});

        $scope.currentPage = 0;

        ////////////////

        $scope.$on('changePage', function(e, page) {
            if (!vm.isLoadingResults) {
                vm.getSettlements({page: page});
            }
        });

        $scope.$on('GlobalDateFromChange', function(e, dateObj) {
            if (!vm.isLoadingResults) {
                vm.getSettlements({created_from: $filter('date')(dateObj, 'dd-MM-yyyy'), page: 0});
            }
        });

        $scope.$on('GlobalDateToChange', function(e, dateObj) {
            if (!vm.isLoadingResults) {
                vm.getSettlements({created_to: $filter('date')(dateObj, 'dd-MM-yyyy'), page: 0});
            }
        });

        function getSettlements(externalParams) {
            $scope.$emit('requestStart', {});
            vm.isLoadingResults = true;
            var params = {
                "created_from": $filter('date')(($rootScope.globalQueryParams.date_from), 'dd-MM-yyyy'),
                "created_to": $filter('date')(($rootScope.globalQueryParams.date_to), 'dd-MM-yyyy'),
                "size": $rootScope.defaultBulkSize,
                "page": $scope.currentPage
            };
            var settings = {
                async: true,
                crossDomain: true,
                url: $rootScope.getApiBaseUrl() + '/providers/' + $rootScope.globalQueryParams.loggedProvider.slug + '/settlements/valid-transactions',
                method: "GET",
                headers: {
                    "Content-Type":"application/json",
                    "authorization": $rootScope.authorizationString
                },
                params: params
            };
            filterEmptyProperties(angular.extend(settings.params, externalParams));
            $http(settings).then(function(data) {
                vm.settlements = data.data.content;
                $scope.total_pages = data.data.total_pages === 0 ? data.data.total_pages + 1 : data.data.total_pages;;
                $scope.$emit('requestEnd', {});
                vm.isLoadingResults = false;
            }, $rootScope.requestHandleError);
        }

    }
})();
