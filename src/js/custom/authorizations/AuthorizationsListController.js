(function () {
    'use strict';

    angular
        .module('naut')
        .controller('AuthorizationsListController', AuthorizationsListController);

    AuthorizationsListController.$inject = ['$scope', '$rootScope', '$http', '$filter', '$q', 'DATE_FORMAT'];
    function AuthorizationsListController($scope, $rootScope, $http, $filter, $q, DATE_FORMAT) {
        var vm = this;

        vm.title = 'AuthorizationsListController';

        $scope.insureName = "-";
        $scope.diagnosesName = "-";
        $scope.doctorsName = "-";
        $scope.authorizationTotalItems = 0;
        $scope.paginationCurrentPage = 0;

        vm.currencySymbols = {
            USD: "$",
            GTQ: "Q"
        };

        vm.getAuthorizationsStats = getAuthorizationsStats;
        vm.getAuthorizationsStats({});

        vm.getAuthorizationsList = getAuthorizationsList;
        vm.getAuthorizationsList({});
        
        vm.lineSeriesPoints = [true, true, true];
        vm.lineSeriesLines  = [true, true, true];

        vm.dataSet = {
            authorizations: [{series:[]}]
        };

        vm.chartDonutDataset = {
            insurers: [{series:[]}],
            diagnoses: [{series:[]}],
            doctors: [{series:[]}]
        };

        vm.authorizationsDetails = [];

        $rootScope.$watch('$root.datepickerFromModel', datepickerFromModelWatcher);
        $rootScope.$watch('$root.datepickerToModel', datepickerToModelWatcher);
        $scope.$watch('paginationCurrentPage', paginationCurrentPageWatcher);

        ////////////////

        function datepickerFromModelWatcher(current, past) {
            if (current !== past){
                var currentDateObj = new Date(current);
                if (currentDateObj.toString() !== "Invalid Date") {
                    $scope.paginationCurrentPage = 0;
                    $rootScope.globalQueryParams.date_from = $filter('date')(currentDateObj);
                    vm.getAuthorizationsStats({});
                }
            }
        }

        function datepickerToModelWatcher(current, past) {
            if (current !== past){
                var currentDateObj = new Date(current);
                if (currentDateObj.toString() !== "Invalid Date") {
                    $scope.paginationCurrentPage = 0;
                    $rootScope.globalQueryParams.date_to = $filter('date')(currentDateObj);
                    vm.getAuthorizationsStats({});
                }
            }
        }

        function paginationCurrentPageWatcher(current, past) {
            if (current !== past) {
                vm.getAuthorizationsList({page: $scope.paginationCurrentPage - 1});
            }
        }

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
                    return '<strong>' + label + '</strong>';
                },
                labelBoxBorderColor: "#fff"
            },
            shadowSize: 0,
            series: {
                pie: {
                    show: true,
                    innerRadius: 0.5 // donut shape
                }
            }
        };
        
        vm.donutOptionsTopInsurers = angular.extend({}, vm.chartDonutFlotChartDefaults, {
            tooltipOpts: {
                content:  function(label, xval, yval, flotItem) {
                    $scope.insureName = label + " - " + yval.toFixed(2) + "%";
                    $scope.$digest();
                    return label + " - " + yval.toFixed(2) + "%";
                }
            },
            legend: {show: true,
                backgroundColor: 'rgba(0,0,0,0)',
                noColumns: 2,
                labelFormatter: function(label, series) {
                    return '<strong>' + label + '</strong>';
                },
                labelBoxBorderColor: "#fff",
                container: $("#legend-top-insurers")
            }
        });

        vm.donutOptionsTopDiagnoses = angular.extend({}, vm.chartDonutFlotChartDefaults, {
            tooltipOpts: {
                content:  function(label, xval, yval, flotItem) {
                    $scope.diagnosesName = label + " - " + yval.toFixed(2) + "%";
                    $scope.$digest();
                    return label + " - " + yval.toFixed(2) + "%";
                }
            },
            legend: {show: true,
                backgroundColor: 'rgba(0,0,0,0)',
                noColumns: 2,
                labelFormatter: function(label, series) {
                    return '<strong>' + label + '</strong>';
                },
                labelBoxBorderColor: "#fff",
                container: $("#legend-top-diagnoses")
            }
        });

        vm.donutOptionsTopDoctors = angular.extend({}, vm.chartDonutFlotChartDefaults, {
            tooltipOpts: {
                content:  function(label, xval, yval, flotItem) {
                    $scope.doctorsName = label + " - " + yval.toFixed(2) + "%";
                    $scope.$digest();
                    return label + " - " + yval.toFixed(2) + "%";
                }
            },
            legend: {show: true,
                backgroundColor: 'rgba(0,0,0,0)',
                noColumns: 2,
                labelFormatter: function(label, series) {
                    return '<strong>' + label + '</strong>';
                },
                labelBoxBorderColor: "#fff",
                container: $("#legend-top-doctors")
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
                content: '%x : %y'
            },
            xaxis: {
                tickColor: '#f1f2f3',
                mode: 'time',
                timeformat: "%b/%d/%Y",
                timezone: "browser"
            },
            yaxis: {
                tickColor: '#f1f2f3',
                tickFormatter: function(val, axis) {
                    if (val > 1000000)
                        return (val / 1000000) + " M";
                    else if (val > 1000)
                        return (val / 1000) + " K";
                    else
                        return val;
                }
                // max: 60
            },
            legend: {
                show: true,
                backgroundColor: 'rgba(0,0,0,0)',
                noColumns: 2,
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

        function getAuthorizationsList(externalParams) {
            $rootScope.$emit('requestStart', {});
            $http({
                async: true,
                crossDomain: true,
                url: $rootScope.getApiBaseUrl() + '/transactions/authorizations',
                method: "GET",
                headers: {
                    "Content-Type":"application/json",
                    "authorization": $rootScope.authorizationString
                },
                params: filterEmptyProperties(angular.extend({}, {
                    "insurer_id": $rootScope.globalQueryParams.insurer_id,
                    "insurer_company_id": $rootScope.globalQueryParams.insurer_id,
                    "type": "",
                    "created_from": $filter('date')(new Date($rootScope.globalQueryParams.date_from), 'dd-MM-yyyy'),
                    "created_to": $filter('date')(new Date($rootScope.globalQueryParams.date_to), 'dd-MM-yyyy'),
                    "page": $scope.paginationCurrentPage,
                    "size": $rootScope.defaultBulkSize
                }, externalParams))
            }).then(function(response) {
                $rootScope.$emit('requestEnd', {});
                vm.authorizationsDetails = response.data.content;
                $scope.authorizationTotalItems = response.data.total_elements;
            }).catch($rootScope.requestHandleError);

        }

        function getAuthorizationsStats(externalParams) {
            $rootScope.$emit('requestStart', {});
            $q.all([
                $http({
                    async: true,
                    crossDomain: true,
                    url: $rootScope.getApiBaseUrl() + '/stats/authorizations/daily_count',
                    method: "GET",
                    headers: {
                        "Content-Type":"application/json",
                        "authorization": $rootScope.authorizationString
                    },
                    params: filterEmptyProperties(angular.extend({}, {
                        "created_from": $filter('date')(new Date($rootScope.globalQueryParams.date_from), 'dd-MM-yyyy'),
                        "created_to": $filter('date')(new Date($rootScope.globalQueryParams.date_to), 'dd-MM-yyyy'),
                        "insurer_id": $rootScope.globalQueryParams.insurer_id,
                        "insurer_company_id": $rootScope.globalQueryParams.insurer_id
                    }, externalParams))
                }),
                $http({
                    async: true,
                    crossDomain: true,
                    url: $rootScope.getApiBaseUrl() + '/stats/authorizations/insurers',
                    method: "GET",
                    headers: {
                        "Content-Type":"application/json",
                        "authorization": $rootScope.authorizationString
                    },
                    params: filterEmptyProperties(angular.extend({}, {
                        "created_from": $filter('date')(new Date($rootScope.globalQueryParams.date_from), 'dd-MM-yyyy'),
                        "created_to": $filter('date')(new Date($rootScope.globalQueryParams.date_to), 'dd-MM-yyyy'),
                        "top": $rootScope.defaultChartsTop
                    }, externalParams))
                }),
                $http({
                    async: true,
                    crossDomain: true,
                    url: $rootScope.getApiBaseUrl() + '/stats/authorizations/diagnoses',
                    method: "GET",
                    headers: {
                        "Content-Type":"application/json",
                        "authorization": $rootScope.authorizationString
                    },
                    params: filterEmptyProperties(angular.extend({}, {
                        "insurer_id": $rootScope.globalQueryParams.insurer_id,
                        "insurer_company_id": $rootScope.globalQueryParams.insurer_id,
                        "top": $rootScope.defaultChartsTop,
                        "created_from": $filter('date')(new Date($rootScope.globalQueryParams.date_from), 'dd-MM-yyyy'),
                        "created_to": $filter('date')(new Date($rootScope.globalQueryParams.date_to), 'dd-MM-yyyy')
                    }, externalParams))
                }),
                $http({
                    async: true,
                    crossDomain: true,
                    url: $rootScope.getApiBaseUrl() + '/stats/authorizations/doctors',
                    method: "GET",
                    headers: {
                        "Content-Type":"application/json",
                        "authorization": $rootScope.authorizationString
                    },
                    params: filterEmptyProperties(angular.extend({}, {
                        "insurer_id": $rootScope.globalQueryParams.insurer_id,
                        "insurer_company_id": $rootScope.globalQueryParams.insurer_id,
                        "top": $rootScope.defaultChartsTop,
                        "created_from": $filter('date')(new Date($rootScope.globalQueryParams.date_from), 'dd-MM-yyyy'),
                        "created_to": $filter('date')(new Date($rootScope.globalQueryParams.date_to), 'dd-MM-yyyy')
                    }, externalParams))
                }),
                $http({
                    async: true,
                    crossDomain: true,
                    url: $rootScope.getApiBaseUrl() + '/transactions/authorizations',
                    method: "GET",
                    headers: {
                        "Content-Type":"application/json",
                        "authorization": $rootScope.authorizationString
                    },
                    params: filterEmptyProperties(angular.extend({}, {
                        "insurer_id": $rootScope.globalQueryParams.insurer_id,
                        "insurer_company_id": $rootScope.globalQueryParams.insurer_id,
                        "type": "",
                        "created_from": $filter('date')(new Date($rootScope.globalQueryParams.date_from), 'dd-MM-yyyy'),
                        "created_to": $filter('date')(new Date($rootScope.globalQueryParams.date_to), 'dd-MM-yyyy'),
                        "page": $scope.paginationCurrentPage,
                        "size": $rootScope.defaultBulkSize
                    }, externalParams))
                })
            ])
            .then(function(responses) {
                // console.log(responses);
                var dailyAuthResults = responses[0].data;
                var topInsurersAuth = responses[1].data;
                var topDiagnosesAuth = responses[2].data;
                var topDoctorsAuth = responses[3].data;
                var detailsAuth = responses[4].data;

                var tmpAuthSerie = {
                    label: "Authorizations",
                    color: $rootScope.getGraphColor("mixed", true),
                    data: []
                };

                vm.dataSet.authorizations = [];
                vm.chartDonutDataset.insurers = [];
                vm.chartDonutDataset.diagnoses = [];
                vm.chartDonutDataset.doctors = [];

                // Auth line chart
                
                dailyAuthResults.insurer_authorizations.map(function(e,i) {
                    var tmp = {};
                    tmp.label = e.insurer_name;
                    tmp.color = $rootScope.getGraphColor("green", (i === 0? true : false));
                    tmp.data = [];
                    e.authorizations_per_day.map(function(elem, indx) {
                        tmp.data.push([(new Date(elem.day)).getTime(), elem.total_authorizations]);
                    });
                    vm.dataSet.authorizations.push(tmp);

                });

                // Donut - Top Insurers
                
                topInsurersAuth.insurers.map(function(e,i) {
                    vm.chartDonutDataset.insurers.push({
                        color: $rootScope.getGraphColor('green', (i === 0? true : false)),
                        label: e.name,
                        data: e.percentage * 100
                    });
                });

                // Donut - Top Diagnoses
                
                topDiagnosesAuth.diagnoses.map(function(e,i) {
                    vm.chartDonutDataset.diagnoses.push({
                        color: $rootScope.getGraphColor('blue', (i === 0? true : false)),
                        label: e.name,
                        data: e.percentage * 100
                    });
                });

                // Donut - Top Doctors
                
                topDoctorsAuth.doctors.map(function(e,i) {
                    vm.chartDonutDataset.doctors.push({
                        color: $rootScope.getGraphColor('gray', (i === 0? true : false)),
                        label: e.name,
                        data: e.percentage * 100
                    });
                });

                // Table Authorizations Details

                vm.authorizationsDetails = detailsAuth.content;
                $scope.authorizationTotalItems = detailsAuth.total_elements;

                $rootScope.$emit('requestEnd', {});

            })
            .catch($rootScope.requestHandleError);
        }
    }
})();
