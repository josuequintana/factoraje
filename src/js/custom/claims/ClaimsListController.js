(function () {
    'use strict';

    function ClaimsController($scope, $rootScope, $http, $filter, $q, $stateParams, $state) {
        var vm = this;
        vm.title = 'ClaimsController';
        vm.isLoadingResults = false;

        $scope.topBranch = '-';
        $scope.topcategoryByVolume = '-';
        $scope.topProviders = '-';
        $scope.currentPage = $stateParams.page - 1 || 0;
        $scope.isLastPage = false;

        $scope.claimTransactions = [];

        vm.currencySymbols = {
            USD: '$',
            GTQ: 'Q'
        };

        vm.claimsTypeTranslate = {
            'claims': 'Pre Autorización',
            'express': 'Express'
        };


        vm.claimStatusTraslate = {
            'voided': 'Anulado',
            'voided_paid': 'Anulado',
            'voided_refunded': 'Anulado',
            'voided_reviewed': 'Anulado',
            'paid': 'Pagado',
            'approved': 'Procesado',
            'reviewed': 'Procesado',
            'rejected_approved': 'Rechazado',
            'reject_paid': 'Rechazado',
            'rejected_reviewed': 'Rechazado',
            'null': '-'
        }

        vm.expressStatusTraslate = {
            'voided': 'Anulado',
            'voided_paid': 'Anulado',
            'voided_refunded': 'Anulado',
            'voided_reviewed': 'Anulado',
            'paid': 'Pagado',
            'pending_review': 'Pendiente de Aprobación',
            'approved': 'Procesado',
            'reviewed': 'Procesado',
            'rejected': 'Rechazado',
            'rejected_paid': 'Rechazado',
            'rejected_approved': 'Rechazado',
            'rejected_reviewed': 'Rechazado',
            'null': '-'
        }

        vm.monthTraslate = {
            '1': 'Enero',
            '2': 'Febrero',
            '3': 'Marzo',
            '4': 'Abril',
            '5': 'Mayo',
            '6': 'Junio',
            '7': 'Julio',
            '8': 'Agosto',
            '9': 'Septiembre',
            '10': 'Octubre',
            '11': 'Noviembre',
            '12': 'Diciembre'
        };


        vm.getStats = getStats;
        vm.getStats({});


        vm.getProductStatusClassObj = getProductStatusClassObj;

        vm.lineSeriesPoints = [true, true, true];
        vm.lineSeriesLines = [true, true, true];

        vm.dataSet = {
            claims: [{
                series: []
            }]
        };

        vm.chartDonutDataset = {
            provider_branch: [{
                series: []
            }]
        };


        vm.monthlySummaryTable = [];
        vm.claimsProviderDetails = [];

        $scope.totalClaimsItems = 0;
        $scope.ClaimsPaginationCurrentPage = 0;

        function getProductStatusClassObj(status) {
            var lowerCaseStatus = status.toLowerCase();
            return {
                'status-gray': lowerCaseStatus === '0' ||
                lowerCaseStatus === 'voided' ||
                lowerCaseStatus === 'voided_paid' ||
                lowerCaseStatus === 'voided_reviewed',
                'status-green': lowerCaseStatus === 'approved' ||
                lowerCaseStatus === 'paid' || lowerCaseStatus === 'reviewed',
                'status-yellow': lowerCaseStatus === 'pending_review' ||
                lowerCaseStatus === 'refunded',
                'status-red': lowerCaseStatus === 'rejected' ||
                lowerCaseStatus === 'rejected_voided' ||
                lowerCaseStatus === 'rejected_refunded' ||
                lowerCaseStatus === 'rejected_processed' ||
                lowerCaseStatus === 'rejected_approved' ||
                lowerCaseStatus === 'rejected_reviewed' ||
                lowerCaseStatus === 'rejected_paid' ||
                lowerCaseStatus === 'non_refundable'
            }
        }

        $scope.$on('GlobalDateFromChange', function (e, dateObj) {
            if (!vm.isLoadingResults) {
                vm.getStats({
                    'created_from': $filter('date')(dateObj, 'dd-MM-yyyy'),
                    page: 0
                });
            }
        });

        $scope.$on('GlobalDateToChange', function (e, dateObj) {
            if (!vm.isLoadingResults) {
                vm.getStats({
                    'created_to': $filter('date')(dateObj, 'dd-MM-yyyy'),
                    page: 0
                });
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
                labelFormatter: function (label, series) {
                    return '<strong>' + label + '</strong>';
                },
                labelBoxBorderColor: '#fff'
            },
            shadowSize: 0,
            series: {
                pie: {
                    show: true,
                    innerRadius: 0.5
                }
            }
        };

        vm.donutOptionsTopBranch = angular.extend({}, vm.chartDonutFlotChartDefaults, {
            tooltipOpts: {
                content: function (label, xval, yval, flotItem) {
                    $scope.topBranch = label + ' - ' + yval.toFixed(2) + '%';
                    $scope.$digest();
                    return label + ' - ' + yval.toFixed(2) + '%';
                }
            },
            legend: {
                show: true,
                backgroundColor: 'rgba(0,0,0,0)',
                noColumns: 2,
                labelFormatter: function (label, series) {
                    return '<strong>' + label + '</strong>';
                },
                labelBoxBorderColor: '#fff',
                container: $('#top-branch')
            }
        });

        vm.donutOptionspCatByVolume = angular.extend({}, vm.chartDonutFlotChartDefaults, {
            tooltipOpts: {
                content: function (label, xval, yval, flotItem) {
                    $scope.topcategoryByVolume = label + ' - ' + yval.toFixed(2) + '%';
                    $scope.$digest();
                    return label + ' - ' + yval.toFixed(2) + '%';
                }
            },
            legend: {
                show: true,
                backgroundColor: 'rgba(0,0,0,0)',
                noColumns: 2,
                labelFormatter: function (label, series) {
                    return '<strong>' + label + '</strong>';
                },
                labelBoxBorderColor: '#fff',
                container: $('#top-provider-category-by-volume')
            }
        });

        vm.donutOptionsTopProviders = angular.extend({}, vm.chartDonutFlotChartDefaults, {
            tooltipOpts: {
                content: function (label, xval, yval, flotItem) {
                    $scope.topProviders = label + ' - ' + yval.toFixed(2) + '%';
                    $scope.$digest();
                    return label + ' - ' + yval.toFixed(2) + '%';
                }
            },
            legend: {
                show: true,
                backgroundColor: 'rgba(0,0,0,0)',
                noColumns: 2,
                labelFormatter: function (label, series) {
                    return '<strong>' + label + '</strong>';
                },
                labelBoxBorderColor: '#fff',
                container: $('#top-provider')
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
                content: function (label, xval, yval, flotItem) {
                    var y = $filter('currency')(yval, 'Q', 2);
                    return '%x | ' + y;
                }
            },
            xaxis: {
                tickColor: '#f1f2f3',
                mode: 'time',
                timeformat: '%d/%m/%Y',
                timezone: 'UTC'
            },
            yaxis: {
                tickColor: '#f1f2f3',
                tickFormatter: function (val, axis) {
                    val = val.toFixed(2);
                    if (val > 1000000)
                        return 'Q' + (val / 1000000) + 'M';
                    else if (val > 1000)
                        return 'Q' + (val / 1000) + 'K';
                    else
                        return 'Q' + val;
                },
                min: 0
            },
            legend: {
                show: true,
                backgroundColor: 'rgba(0,0,0,0)',
                noColumns: 2,
                container: $('#legend-claims'),
                labelFormatter: function (label, series) {
                    return '<strong>' + label + '</strong>';
                },
                labelBoxBorderColor: '#fff'
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

        function getClaimList(externalParams) {
            $rootScope.$emit('requestStart', {});
            vm.isLoadingResults = true;
            $http({
                async: true,
                crossDomain: true,
                url: $rootScope.getApiBaseUrl() + '/providers/' + $rootScope.globalQueryParams.loggedProvider.slug + '/transaction-history',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': $rootScope.authorizationString
                },
                params: filterEmptyProperties(angular.extend({}, {
                    'provider_slug': $rootScope.globalQueryParams.loggedProvider.slug,
                    'created_from': $filter('date')(($rootScope.globalQueryParams.date_from), 'dd-MM-yyyy'),
                    'created_to': $filter('date')(($rootScope.globalQueryParams.date_to), 'dd-MM-yyyy'),
                    'provider_branch_id': '',
                    'insurer_id': $rootScope.globalQueryParams.insurer_id,
                    'type': '',
                    'settlement_type': '',
                    'status': '',
                    'page': $scope.currentPage,
                    'size': $rootScope.defaultBulkSize,
                    'sort': 'desc'

                }, externalParams))
            }).then(function (response) {
                $rootScope.$emit('requestEnd', {});
                vm.isLoadingResults = false;
                $scope.claimTransactions = response.data.content;
                $scope.totalClaimsItems = response.data.total_elements;

            }, $rootScope.requestHandleError);
        }

        function goToSingle(object) {
            if (object.type === 'express') {
                $state.go('app.claims.claimDetailExpress', {
                    'claim_id': object.authorization_code
                });
            } else {
                $state.go('app.claims.claimDetailPreAuth', {
                    'claim_id': object.id
                });
            }
        }

        vm.getClaimList = getClaimList;
        vm.goToSingle = goToSingle;

        function getStats(externalParams) {
            $rootScope.$emit('requestStart', {});
            vm.isLoadingResults = true;
            $q.all([
                $http({
                    async: true,
                    crossDomain: true,
                    url: $rootScope.getApiBaseUrl() + '/providers/' + $rootScope.globalQueryParams.loggedProvider.slug + '/claims/metrics/daily_count',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': $rootScope.authorizationString
                    },
                    params: filterEmptyProperties(angular.extend({}, {
                        'created_from': $filter('date')(($rootScope.globalQueryParams.date_from), 'dd-MM-yyyy'),
                        'created_to': $filter('date')(($rootScope.globalQueryParams.date_to), 'dd-MM-yyyy'),
                        'provider_branch': $rootScope.globalQueryParams.branch.id,
                        'provider_company': $rootScope.globalQueryParams.provider_company.id,
                        'type': 'claim'

                    }, externalParams))
                }),
                $http({
                    async: true,
                    crossDomain: true,
                    url: $rootScope.getApiBaseUrl() + '/providers/' + $rootScope.globalQueryParams.loggedProvider.slug + '/claims/metrics/daily_count',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': $rootScope.authorizationString
                    },
                    params: filterEmptyProperties(angular.extend({}, {
                        'created_from': $filter('date')(($rootScope.globalQueryParams.date_from), 'dd-MM-yyyy'),
                        'created_to': $filter('date')(($rootScope.globalQueryParams.date_to), 'dd-MM-yyyy'),
                        'provider_branch': $rootScope.globalQueryParams.branch.id,
                        'provider_company': $rootScope.globalQueryParams.provider_company.id,
                        'type': 'express'

                    }, externalParams))
                }),
                $http({
                    async: true,
                    crossDomain: true,
                    url: $rootScope.getApiBaseUrl() + '/providers/' + $rootScope.globalQueryParams.loggedProvider.slug + '/claims/metrics/branches',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': $rootScope.authorizationString
                    },
                    params: filterEmptyProperties(angular.extend({}, {
                        'top': $rootScope.defaultChartsTop,
                        'created_from': $filter('date')(($rootScope.globalQueryParams.date_from), 'dd-MM-yyyy'),
                        'created_to': $filter('date')(($rootScope.globalQueryParams.date_to), 'dd-MM-yyyy'),
                        'provider_company': $rootScope.globalQueryParams.provider_company.id,
                        'provider_branch': $rootScope.globalQueryParams.branch.id

                    }, externalParams))
                }),
                $http({
                    async: true,
                    crossDomain: true,
                    url: $rootScope.getApiBaseUrl() + '/providers/' + $rootScope.globalQueryParams.loggedProvider.slug + '/claims/metrics/monthly_summary',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': $rootScope.authorizationString
                    },
                    params: filterEmptyProperties(angular.extend({}, {
                        'provider_slug': $rootScope.globalQueryParams.loggedProvider.slug,
                        'type': '',
                        'months': $rootScope.monthLimit,
                        'created_to': $filter('date')(($rootScope.globalQueryParams.date_to), 'dd-MM-yyyy')
                    }, externalParams))
                }),
                $http({
                    async: true,
                    crossDomain: true,
                    url: $rootScope.getApiBaseUrl() + '/providers/' + $rootScope.globalQueryParams.loggedProvider.slug + '/transaction-history',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': $rootScope.authorizationString
                    },
                    params: filterEmptyProperties(angular.extend({}, {
                        'provider_slug': $rootScope.globalQueryParams.loggedProvider.slug,
                        'created_from': $filter('date')(($rootScope.globalQueryParams.date_from), 'dd-MM-yyyy'),
                        'created_to': $filter('date')(($rootScope.globalQueryParams.date_to), 'dd-MM-yyyy'),
                        'provider_branch_id': '',
                        'insurer_id': $rootScope.globalQueryParams.insurer_id,
                        'type': '',
                        'settlement_type': '',
                        'status': '',
                        'page': $scope.currentPage,
                        'size': $rootScope.defaultBulkSize,
                        'sort': 'desc'
                    }, externalParams))
                })
            ])
                .then(function (responses) {
                    $rootScope.$emit('requestEnd', {});
                    vm.isLoadingResults = false;
                    var claimsCount = responses[0].data;
                    var expressCount = responses[1].data;
                    var topBranchResults = responses[2].data;
                    var monthlySummary = responses[3].data;
                    var providerClaimDetails = responses[4].data;

                    // Claims vs Express, page: 0
                    vm.dataSet.claims = [];
                    var temp = {
                        color: $rootScope.getGraphColor('green', true),
                        label: 'Pre Autorizaci&#243;n ',
                        data: []
                    };

                    claimsCount.total_claims_per_day.map(function (e, i) {
                        temp.data.push(
                            [(new Date(e.day)).getTime(),
                                e.total_revenue
                            ]
                        );
                    });

                    vm.dataSet.claims.push(temp);
                    // Express

                    temp = {
                        color: $rootScope.getGraphColor('blue', true),
                        label: 'Express',
                        data: []
                    };

                    expressCount.total_claims_per_day.map(function (e, i) {
                        temp.data.push(
                            [(new Date(e.day)).getTime(),
                                e.total_revenue
                            ]
                        );
                    });

                    vm.dataSet.claims.push(temp);

                    // Top branch
                    vm.chartDonutDataset['provider_branch'] = [];
                    topBranchResults.branches.map(function (e, i) {
                        vm.chartDonutDataset.provider_branch.push({
                            color: $rootScope.getGraphColor('green', (i === 0 ? true : false)),
                            label: e.name,
                            data: e.percentage * 100
                        });
                    });

                    vm.monthlySummaryTable = monthlySummary.total_claims_per_month;
                    $scope.claimTransactions = providerClaimDetails.content;
                    $scope.totalClaimsItems = providerClaimDetails.total_elements;

                    var totalPages = providerClaimDetails['total_pages'];

                    $scope['total_pages'] = totalPages === 0 ? totalPages + 1 : totalPages;


                })
                .catch($rootScope.requestHandleError);
        }
    }

    angular
        .module('naut')
        .controller('ClaimsController', ClaimsController);

    ClaimsController.$inject = ['$scope', '$rootScope', '$http', '$filter', '$q', '$stateParams', '$state'];

})();
