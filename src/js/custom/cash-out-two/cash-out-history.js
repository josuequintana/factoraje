
(function() {
    'use strict';

    angular
        .module('naut')
        .controller('HistoryCashOutController', HistoryCashOutController);

        HistoryCashOutController.$inject = ['$scope', '$rootScope', '$http', '$filter'];
        function HistoryCashOutController($scope, $rootScope, $http, $filter){

            var vm = this;
            vm.history = [];
            vm.title = 'HistoryCashOutController';
            vm.currencySymbols = {
                USD: "$",
                GTQ: "Q"
            };
            vm.getHistory = getHistory;

            $scope.total_pages = 0;
            $scope.total_elements = 0;
            $scope.isLoadingResults = false;

            $scope.$on('changePage', function(e, page) {
                vm.getHistory({page: page});
            });

            $scope.$on('GlobalDateFromChange', function(e, dateObj) {
                vm.getHistory({date_from: $filter('date')(dateObj, 'dd-MM-yyyy'), page: 0});
            });

            $scope.$on('GlobalDateToChange', function(e, dateObj) {
                vm.getHistory({date_to: $filter('date')(dateObj, 'dd-MM-yyyy'), page: 0});
            });

            // initialize();

            function initialize() {
                vm.getHistory({page: 0});
            }

            function getHistory(params) {
                this._getHistory = _getHistory;

                $rootScope.$emit('requestStart', {});
                $scope.isLoadingResults = true;
                this
                    ._getHistory(params)
                    .then(function(data) {
                        vm.history = data.data.content;
                        $scope.total_pages = data.data.total_pages;
                        $rootScope.$emit('requestEnd', {});
                        $scope.isLoadingResults = false;
                    });

                function _getHistory(externalParams) {
                    return 
                    $http({
                        async: true,
                        crossDomain: true,
                        url: $rootScope.getApiBaseUrl() + '/providers/'+ $rootScope.globalQueryParams.loggedProvider.slug +'/cashout/historical',
                        method: "GET",
                        headers: {
                            "Content-Type":"application/json",
                            "authorization": $rootScope.authorizationString
                        },
                        params: filterEmptyProperties(angular.extend({}, {
                            "date_from": $filter('date')(($rootScope.globalQueryParams.date_from), 'dd-MM-yyyy'),
                            "date_to": $filter('date')(($rootScope.globalQueryParams.date_to), 'dd-MM-yyyy'),
                            "page": $scope.paginationCurrentPage,
                            "size": $rootScope.defaultBulkSize,
                            "sort": $rootScope.globalQueryParams.sort.desc
                        }, externalParams))
                    }).catch($rootScope.requestHandleError);
                }
            }

        }
})();
