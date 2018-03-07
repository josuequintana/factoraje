(function() {
    'use strict';

    angular
        .module('naut')
        .controller('CashOutController', CashOutController);

    CashOutController.$inject = ['$scope', '$q', '$http', '$rootScope', '$modal', '$filter', '$stateParams'];
    function CashOutController($scope, $q, $http, $rootScope, $modal, $filter, $stateParams) {
        var vm = this;

        vm.isLoadingResults = false;
        $scope.datacash = 100;
        $scope.claimLitsIofTransactions = [];
        $scope.currentPage = $stateParams.page - 1 || 0;
        $scope.isLastPage = false;

        $scope.$on('GlobalDateFromChange', function(e, dateObj) {
            if (!vm.isLoadingResults) {
                vm.getStats({created_from: $filter('date')(dateObj, 'dd-MM-yyyy'), page: 0});
            }
        });

        $scope.$on('GlobalDateToChange', function(e, dateObj) {
            if (!vm.isLoadingResults) {
                vm.getStats({created_to: $filter('date')(dateObj, 'dd-MM-yyyy'), page: 0});
            }
        });
        $scope.optcash =  {
            width: 190,
            fgColor: "#36fba8",
            skin: "tron",
            thickness: .13,
            displayPrevious: true,
            displayInput : false,
            readOnly: true,
            stopper: false
        };
        vm.currencySymbols = {
            USD: "$",
            GTQ: "Q"
        };
        vm.getStats = getStats;
        vm.getStats({});
        vm.cashOutMount = [{
          "total_transactions": "",
          "considered_transactions": "",
          "total_amount": "",
          "considered_transactions_amount": ""
        }];
        vm.settlements = {};
        vm.automatic = {};
        vm.cashOutPercentage = {};
        vm.getSettlements = getSettlements;
        function getStats(externalParams) {
            $rootScope.$emit('requestStart', {});
            vm.isLoadingResults = true;
            $q.all([
                $http({
                  async: true,
                  crossDomain: true,
                  url: $rootScope.getApiBaseUrl() + '/providers/' + $rootScope.globalQueryParams.loggedProvider.slug +'/cashout/automatic',
                  method: "GET",
                  headers: {
                      "Content-Type":"application/json",
                      "authorization": $rootScope.authorizationString
                  },
                  params: filterEmptyProperties(angular.extend({}, {
                      "created_from": $filter('date')($rootScope.globalQueryParams.date_from, 'dd-MM-yyyy'),
                      "created_to": $filter('date')($rootScope.globalQueryParams.date_to, 'dd-MM-yyyy')
                  }, externalParams))
                }),
                $http({
                    async: true,
                    crossDomain: true,
                    url: $rootScope.getApiBaseUrl() + '/providers/' + $rootScope.globalQueryParams.loggedProvider.slug +'/cashout/historical',
                    method: "GET",
                    headers: {
                        "Content-Type":"application/json",
                        "authorization": $rootScope.authorizationString
                    },
                    params: filterEmptyProperties(angular.extend({}, {
                        "date_from": $filter('date')($rootScope.globalQueryParams.date_from, 'dd-MM-yyyy'),
                        "date_to": $filter('date')($rootScope.globalQueryParams.date_to, 'dd-MM-yyyy'),
                        "page": 0,
                        "size": $rootScope.defaultBulkSize
                    }, externalParams))
                })
            ])
            .then(function(responses) {
                $rootScope.$emit('requestEnd', {});
                vm.isLoadingResults = false;
                var automatic = responses[0].data;
                var historical = responses[1].data;
                vm.settlements = historical.content;
                $scope.total_pages = historical.total_pages;
                vm.automatic = automatic;
            })
        }
        function getSettlements(externalParams) {
            $rootScope.$emit('requestStart', {});
            vm.isLoadingResults = true;
            $http({
                async: true,
                crossDomain: true,
                url: $rootScope.getApiBaseUrl() + '/providers/' + $rootScope.globalQueryParams.loggedProvider.slug +'/cashout/historical',
                method: "GET",
                headers: {
                    "Content-Type":"application/json",
                    "authorization": $rootScope.authorizationString
                },
                params: filterEmptyProperties(angular.extend({}, {
                    "date_from": $filter('date')($rootScope.globalQueryParams.date_from, 'dd-MM-yyyy'),
                    "date_to": $filter('date')($rootScope.globalQueryParams.date_to, 'dd-MM-yyyy'),
                    "page": 0,
                    "size": $rootScope.defaultBulkSize
                }, externalParams))
            }).then(function(data) {
                $rootScope.$emit('requestEnd', {});
                vm.isLoadingResults = false;
                vm.settlements = data.data.content;
                $scope.total_pages = data.data.total_pages;
            }, $rootScope.requestHandleError);
        }


        vm.cashOutModal = function (size) {
            var modalInstance = $modal.open({
                templateUrl: '/cash-out-manual/modal.html',
                controller: ModalInstanceCtrl,
                size: size
            });
        };
        vm.cashOutModalAlert = function (size) {
            var modalInstance = $modal.open({
                templateUrl: '/cash-out-manual/modal-alert.html',
                controller: ModalInstanceCtrl,
                size: size
            });
        };

        var ModalInstanceCtrl = function ($scope, $modalInstance) {

            $scope.cancel = function () {
                $modalInstance.close();
            };

            $scope.ok = function () {
                $modalInstance.close('closed');
            };
            // $scope.cancel = function () {
            //     $modalInstance.dismiss('cancel');
            // };
        };
        ModalInstanceCtrl.$inject = ['$scope', '$modalInstance'];
        }


})();
