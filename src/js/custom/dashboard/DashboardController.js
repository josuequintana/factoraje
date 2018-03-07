(function() {
    'use strict';

    angular
        .module('naut')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$q', '$http', '$rootScope', '$filter', 'DATE_FORMAT', '$modal'];
    function DashboardController($scope, $q, $http, $rootScope, $filter, DATE_FORMAT, $modal) {
         var vm = this;

        vm.isLoadingResults = false;
        vm.cashouttest = true;
        vm.claimTypeClaim = "claim";
        vm.claimTypeExpress = "express";
        vm.getStats = getStats;
        vm.getStats({});
        vm.getBranchesList = getBranchesList;
        vm.calculateTotal = calculateTotal;
        vm.TotalClaims = 0;
        vm.TotalAverageTransactionAmount = 0;
        vm.TotalAmount = 0;
        vm.TotalPercentage = 0;

        $scope.total_cash_out = $scope.total_claims = $scope.total_revenue = $scope.avg_per_claim = "--";
        $scope.selectedTopProduct = $scope.selectedTopManufacturer = $scope.selectedTopBranch = "";
        $scope.totalItemsBranches = 0;
        $scope.DhbrdpaginationCurrentPage = 1;

        vm.lineSeriesPoints = [true, true, true];
        vm.lineSeriesLines  = [true, true, true];

        vm.dataSet = {
            claims: [{series:[]}]
        };
        vm.summaryData= {
            authorizations: { amount: 0, total: "N/A"},
            claims: { amount: 0, total: 0},
            invoices: { amount: 0, total: 0}
        };

        vm.claimsDetailByBranch = [];

        ////////////////

        $scope.$on('changePage', function(e, page) {
            if (!vm.isLoadingResults) {
                vm.getBranchesList({page: page, size: 75});
            }
        });

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

        vm.flotOptionsDefault = {
            grid: {
                hoverable: true,
                clickable: true,
                borderWidth: 0,
                color: '#8394a9'
            },
            tooltip: true,
            tooltipOpts: {
                content: function(label, xval, yval, flotItem){
                    var y = $filter('currency')(yval , 'Q', 2)
                    return '%x | ' + y
                }
            },
            xaxis: {
                tickColor: '#f1f2f3',
                mode: 'time',
                timeformat: "%d/%m/%Y",
                timezone: "UTC"
            },
            yaxis: {
                tickColor: '#f1f2f3',
                tickFormatter: function(val, axis) {
                    if (val > 1000000)
                        return (val / 1000000) + "M";
                    else if (val > 1000)
                        return (val / 1000) + "K";
                    else
                        return val;
                }
                // max: 60
            },
            legend: {
                show: true,
                backgroundColor: 'rgba(0,0,0,0)',
                container:$("#legend-auth"),
                labelFormatter: function(label, series) {
                    return '<strong>' + label + '</strong>';
                },
                labelBoxBorderColor: "#fff"
            },
            shadowSize: 0,
            series: {
                lines: {
                    show: true,
                    fill: 0.01
                },
                points: {
                    show: true,
                    radius: 4
                }
            }
        };

        vm.flotOptionsClaims = angular.extend({}, vm.flotOptionsDefault, {
            yaxis: {
                tickColor: '#f1f2f3',
                tickFormatter: function(val, axis) {
                    val = val.toFixed(2);
                    if (val > 1000000)
                        return "Q" + (val / 1000000) + "M";
                    else if (val > 1000)
                        return "Q" + (val / 1000) + "K";
                    else
                        return "Q" + val;
                },
                min: 0
            },
            legend: {
                show: true,
                backgroundColor: 'rgba(0,0,0,0)',
                container:$("#legend-of-claims"),
                labelFormatter: function(label, series) {
                    return '<strong>' + label + '</strong>';
                },
                labelBoxBorderColor: "#fff"
            }
        });

        vm.chartDonutFlotChartDefaults = {
            grid: {
                hoverable: true,
                clickable: true,
                borderWidth: 0,
                color: '#8394a9'
            },
            tooltip: true,

            xaxis: {
                tickColor: '#f1f2f3',
                mode: 'categories'
            },
            yaxis: {
                tickColor: '#f1f2f3'
            },
            legend: {
                show: true,
                backgroundColor: 'rgba(0,0,0,0)',
                noColumns: 2,
                labelFormatter: function(label, series) {
                    return '<p>' + label + '</p>';
                },
                labelBoxBorderColor: "#fff"
            },
            shadowSize: 0,
            series: {
                pie: {
                    show: true,
                    innerRadius: 0.4 // donut shape
                }
            }
        };

        vm.donutOptionsTopProducts = angular.extend({}, vm.chartDonutFlotChartDefaults, {
            tooltipOpts: {
                content:  function(label, xval, yval, flotItem) {
                    $scope.selectedTopProduct = label + ": " + yval.toFixed(2) + "%";
                    $scope.$digest();
                    return label + ": " + yval.toFixed(2) + "%";
                }
            },
            legend: {show: true,
                backgroundColor: 'rgba(0,0,0,0)',
                noColumns: 2,
                labelFormatter: function(label, series) {
                    return '<p>' + label + '</p>';
                },
                labelBoxBorderColor: "#fff",
                container: $("#top-products")
            }
        });

        vm.donutOptionsTopProductManufacturers = angular.extend({}, vm.chartDonutFlotChartDefaults, {
            tooltipOpts: {
                content:  function(label, xval, yval, flotItem) {
                    $scope.selectedTopManufacturer = label + ": " + yval.toFixed(2) + "%";
                    $scope.$digest();
                    return label + ": " + yval.toFixed(2) + "%";
                }
            },
            legend: {
                show: true,
                backgroundColor: 'rgba(0,0,0,0)',
                noColumns: 2,
                labelFormatter: function(label, series) {
                    return '<p>' + label + '</p>';
                },
                labelBoxBorderColor: "#fff",
                container: $("#top-product-manufacturer")
            }
        });

        vm.donutOptionsTopBranches = angular.extend({}, vm.chartDonutFlotChartDefaults, {
            tooltipOpts: {
                content:  function(label, xval, yval, flotItem) {
                    $scope.selectedTopBranch = label + ": " + yval.toFixed(2) + "%";
                    $scope.$digest();
                    return label + ": " + yval.toFixed(2) + "%";
                }
            },
            legend: {
                show: true,
                backgroundColor: 'rgba(0,0,0,0)',
                noColumns: 2,
                labelFormatter: function(label, series) {
                    return '<p>' + label + '</p>';
                },
                labelBoxBorderColor: "#fff",
                container: $("#top-branches")
            }
        });

        var ModalInstanceCtrl = function ($scope, $modalInstance) {
            $scope.cancel = function () {
                $modalInstance.close();
            };
            $scope.ok = function () {
                console.log('ok')
                $modalInstance.close('closed');
            };
        };

        ModalInstanceCtrl.$inject = ['$scope', '$modalInstance'];

        function calculateTotal(total, index){
            vm.TotalClaims += total.total_claims;
            vm.TotalAverageTransactionAmount +=  total.average_transaction_amount;
            vm.TotalAmount += total.total_amount;
            vm.TotalPercentage += total.percentage;
            return index
        }

        function getBranchesList(externalParams) {
            $rootScope.$emit('requestStart', {});
            vm.isLoadingResults = true;
        }

        function getStats(externalParams) {
            $rootScope.$emit('requestStart', {});
            vm.isLoadingResults = true;
            $q.all({
                    // upper boxes
                    dailyCountExpress: $http.get("/app/server/first.json"),
                    branchesMetrics: $http.get("/app/server/metrics.json")
                })
            .then(function(responses) {
                $scope.selectedTopBranch = "";
                $scope.selectedTopManufacturer = "";
                $scope.selectedTopProduct = "";
                vm.TotalClaims = 0;
                vm.TotalAverageTransactionAmount = 0;
                vm.TotalAmount = 0;
                vm.TotalPercentage = 0;
                $rootScope.$emit('requestEnd', {});
                vm.isLoadingResults = false;
                // var dailyClaimsResults = responses.dailyCountClaims.data;
                var dailyClaimsExpressResults = responses.dailyCountExpress.data;
                var claimsDetByProvBranch = responses.branchesMetrics.data;

                // Upper boxes
                $scope.total_claims = 14;
                $scope.total_revenue = 773622.57;
                $scope.avg_per_claim = 55258.75;


                // Claims line chart
                vm.dataSet.claims = [];

                var tmp = {};
                // tmp.label = "Express";
                tmp.color = $rootScope.getGraphColor("blue", true);
                tmp.data = [];
                dailyClaimsExpressResults.total_claims_per_day.map(function(elem, indx) {
                    tmp.data.push([(new Date(elem.day)).getTime(), elem.total_revenue]);
                });

                vm.dataSet.claims.push(tmp);


                // Table - Summary
                vm.claimsDetailByBranch = claimsDetByProvBranch.content;
                $scope.totalItemsBranches = claimsDetByProvBranch.total_elements;
                $scope.total_pages = claimsDetByProvBranch.total_pages === 0 ? claimsDetByProvBranch.total_pages + 1 : claimsDetByProvBranch.total_pages;

            })
            .catch($rootScope.requestHandleError);
        }
    }
}());
