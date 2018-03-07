(function() {
    'use strict';

    angular
        .module('naut')
        .controller('CashOutVariableController', CashOutVariableController);

    CashOutVariableController.$inject = ['$scope', '$q', '$http', '$rootScope', '$modal', '$filter'];
    function CashOutVariableController($scope, $q, $http, $rootScope, $modal, $filter) {
        var vm = this;

        vm.isLoadingResults = false;
        vm.cashOutPercentage = "";
        vm.cashOutTransactions = 0;
        vm.currencySymbols = {
            USD: "$",
            GTQ: "Q"
        };
        vm.cashOutAmount = 0;
        vm.cashOutCommission = 0;
        vm.reverse = false;
        vm.getStats = getStats;
        vm.getStats({to: $filter('date')(new Date($rootScope.globalQueryParams.date_to), 'dd-MM-yyyy'), from: $filter('date')(new Date($rootScope.globalQueryParams.date_from), 'dd-MM-yyyy')});
        vm.cashOutMount = [{
          "total_transactions": "",
          "considered_transactions": "",
          "total_amount": "",
          "considered_transactions_amount": ""
        }];
        $scope.datacash = 0;
        $scope.claimsListOfTransactions = [];
        $scope.chooseClaim = chooseClaim;
        $scope.isClaimSelected = isClaimSelected;
        $scope.selectedClaims = {
            list: [],
            total: 0,
            fee: 0,
            subTotal: 0
        };

        var cashOutDataHistory = [];
        $rootScope.cashOutData = [];

        $scope.$on('changePage', function(e, page) {
            if (!vm.isLoadingResults) {
                vm.getStats({to: $filter('date')(new Date($rootScope.globalQueryParams.date_to), 'dd-MM-yyyy'), from: $filter('date')(new Date($rootScope.globalQueryParams.date_from), 'dd-MM-yyyy'),page: page});
            }
        });
        $scope.$on('GlobalDateFromChange', function(e, dateObj) {
            if (!vm.isLoadingResults) {
                $scope.selectedClaims = {
                    list: [],
                    total: 0,
                    fee: 0,
                    subTotal: 0
                };
                $scope.datacash = 0;
                vm.getStats({from: $filter('date')(dateObj, 'dd-MM-yyyy'), to: $filter('date')(new Date($rootScope.globalQueryParams.date_to), 'dd-MM-yyyy'), page: 0});
            }
        });

        $scope.$on('GlobalDateToChange', function(e, dateObj) {
            if (!vm.isLoadingResults) {
                $scope.selectedClaims = {
                    list: [],
                    total: 0,
                    fee: 0,
                    subTotal: 0
                };
                $scope.datacash = 0;
                vm.getStats({to: $filter('date')(dateObj, 'dd-MM-yyyy'), from: $filter('date')(new Date($rootScope.globalQueryParams.date_from), 'dd-MM-yyyy'), page: 0});
            }
        });
        $scope.optcash =  {
            width: 190,
            fgColor: "#0d436f",
            skin: "tron",
            thickness: .13,
            displayPrevious: true,
            displayInput : false,
            readOnly: true,
            stopper: false,
            max: 100
        };

        function getStats(externalParams) {
            $rootScope.$emit('requestStart', {});
            vm.isLoadingResults = true;
            $q.all([
                // $http({
                //     async: true,
                //     crossDomain: true,
                //     url: $rootScope.getApiBaseUrl() + '/providers/' + $rootScope.globalQueryParams.loggedProvider.slug +'/transaction-history',
                //     method: "GET",
                //     headers: {
                //         "Content-Type":"application/json",
                //         "authorization": $rootScope.authorizationString
                //     },
                //     params: filterEmptyProperties(angular.extend({},{
                //         "created_from": $filter('date')(new Date($rootScope.globalQueryParams.date_from), 'dd-MM-yyyy'),
                //         "created_to": $filter('date')(new Date($rootScope.globalQueryParams.date_to), 'dd-MM-yyyy'),
                //         "size": $rootScope.defaultBulkSize,
                //         "page": 0,
                //         "status": "approved,reviewed"
                //     }, {created_from: externalParams.from, created_to: externalParams.to, page: externalParams.page}))
                // }),
                $http.get("/app/server/cash-response.json"),

                // $http({
                //     async: true,
                //     crossDomain: true,
                //     url: $rootScope.getApiBaseUrl() + '/providers/'+ $rootScope.globalQueryParams.loggedProvider.slug + '/cashout/manual',
                //     method: "GET",
                //     headers: {
                //         "Content-Type":"application/json",
                //         "authorization": $rootScope.authorizationString
                //     },
                //     params: filterEmptyProperties(angular.extend({}, {
                //         "date_from": $filter('date')(new Date($rootScope.globalQueryParams.date_from), 'dd-MM-yyyy'),
                //         "date_to": $filter('date')(new Date($rootScope.globalQueryParams.date_to), 'dd-MM-yyyy'),
                //         "page": $scope.paginationCurrentPage,
                //         "size": $rootScope.defaultBulkSize
                //     }, {date_from: externalParams.from, date_to: externalParams.to, page: externalParams.page || 0}))
                // }),
            ])
            .then(function(responses) {
                $rootScope.$emit('requestEnd', {});
                vm.isLoadingResults = false;
                var claims = responses[0].data;
                // var cashoutManual = responses[1].data;
                // vm.cashOutAmount = cashoutManual.total_amount;
                // vm.cashOutTransactions = $scope.optcash.max = cashoutManual.total_transactions;
                vm.cashOutTransactions = $scope.optcash.max = claims.total_elements;
                vm.cashOutPercentage = vm.cashOutAmount * ($rootScope.globalQueryParams.loggedProvider.networks[0].insurer_network_discount_percentage / 100);
                $scope.claimsListOfTransactions = claims.content;
                $scope.total_pages = claims.total_pages;
            })
        }

        function resetValues() {
            if (vm.cashOutAmount !== 0) {
                vm.reverse = !vm.reverse;
            }
            vm.cashOutAmount = 0;
            vm.cashOutCommission = 0;
            $scope.datacash = 0;
            $scope.selectedClaims.subTotal = 0;
            $scope.selectedClaims.list = [];
            // vm.cashOutTransactions = 0;
        }




        vm.cashOutModal = function (size) {
            var modalInstance = $modal.open({
                templateUrl: '/cash-out-manual/modal.html',
                controller: ModalInstanceCtrl,
                size: size,
                controllerAs: '$ctrl',
                resolve: {
                    amount: function () { return vm.cashOutAmount },
                    commission: function () { return vm.cashOutCommission }
                }
            });

        };
        vm.cashOutModalAlert = function (size) {
            var modalInstance = $modal.open({
                templateUrl: '/cash-out-manual/modal-alert.html',
                controller: ModalInstanceCtrl,
                size: size
            });
        };

        var ModalInstanceCtrl = function ($scope, $modalInstance, commission, amount, $state) {
            $scope.commission = commission;
            $scope.amount = amount;

            $scope.cancel = function () {
                $modalInstance.close();
            };

            $scope.ok = function () {
                $modalInstance.close('closed');
                resetValues();
            };


            // $scope.cancel = function () {
            //     $modalInstance.dismiss('cancel');
            // };

        };

        ModalInstanceCtrl.$inject = ['$scope', '$modalInstance', 'commission', 'amount', '$state'];

        function chooseClaim(claim) {
            if (!$scope.isClaimSelected(claim.id)) {
                var claimFee = claim.amount * $rootScope.globalQueryParams.loggedProvider.networks[0].insurer_network_discount_percentage / 100;
                cashOutDataHistory.push(claim)
                $scope.selectedClaims.list.push(claim.id);
                $scope.selectedClaims.subTotal = $scope.selectedClaims.subTotal + claim.amount;
                $scope.selectedClaims.fee = $scope.selectedClaims.subTotal * 0.015;
                $scope.selectedClaims.total = $scope.selectedClaims.subTotal - claimFee;

                $scope.datacash++;

                sumCashOutAmount(claim.amount)

            } else {
                var claimFee = claim.amount * $rootScope.globalQueryParams.loggedProvider.networks[0].insurer_network_discount_percentage / 100;
                $scope.selectedClaims.list = $scope.selectedClaims.list.filter(function(e,i) {return claim.id !== e;});
                cashOutDataHistory = cashOutDataHistory.filter(function(e,i) {
                    return claim.id !== e.id
                });
                $scope.selectedClaims.subTotal = $scope.selectedClaims.subTotal - claim.amount;
                $scope.selectedClaims.fee = $scope.selectedClaims.subTotal * 0.015;
                $scope.selectedClaims.total = $scope.selectedClaims.subTotal - claimFee;
                $scope.datacash--;
                discountTempCashOutAmount();
            }

            $rootScope.cashOutData = cashOutDataHistory;
        }

        function sumCashOutAmount(params) {
            vm.cashOutAmount = vm.cashOutAmount + params
            setTempCashOutAmount(params)
            setComission(params)
        }

        function setTempCashOutAmount(value) {
            vm.tempAmount = value;
        }

        function discountTempCashOutAmount() {
            vm.cashOutAmount = vm.cashOutAmount - vm.tempAmount;
        }

        function setComission(params) {
            vm.cashOutCommission = params * 0.015;
        }

        function isClaimSelected(claimId) {
            return ($scope.selectedClaims.list.filter(function(e,i) {return claimId === e;}).length > 0);
        }
    }


})();
