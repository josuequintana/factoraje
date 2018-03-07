(function () {
    'use strict';

    angular
        .module('naut')
        .controller('SettlementsSingleController', SettlementsSingleController);

    SettlementsSingleController.$inject = ['$scope', '$stateParams', '$q', '$http', '$rootScope', '$filter', '$window'];
    function SettlementsSingleController($scope, $stateParams, $q, $http, $rootScope, $filter, $window) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = 'SettlementsSingleController';
        vm.currencySymbols = {
            USD: "$",
            QTQ: "Q"
        };

        vm.settlementStatusText = {
            PRINTED : "Para imprimir",
            CREATED : "Creado",
            SENT : "Enviado"
        }

        vm.settlementStatusType = {
            CASHOUT : "Pago Inmediato",
            NORMAL: "Normal"
        }

        vm.printSettlementDoc = printSettlementDoc;

        $q.all([$http({
            async: true,
            crossDomain: true,
            url: $rootScope.getApiBaseUrl() + '/settlements/' + $stateParams.settlement_id,
            method: "GET",
            headers: {
                "Content-Type":"application/json",
                "authorization": $rootScope.authorizationString
            }
        }), $http({
            async: true,
            crossDomain: true,
            url: $rootScope.getApiBaseUrl() + '/providers/' + $rootScope.loggedProvider.slug + '/companies',
            method: "GET",
            headers: {
                "Content-Type":"application/json",
                "authorization": $rootScope.authorizationString
            }
        }), $http({
            async: true,
            crossDomain: true,
            url: $rootScope.getApiBaseUrl() + '/insurers',
            method: "GET",
            headers: {
                "Content-Type":"application/json",
                "authorization": $rootScope.authorizationString
            }
        }), $http({
            async: true,
            crossDomain: true,
            url: $rootScope.getApiBaseUrl() + '/providers/' + $rootScope.loggedProvider.slug + '/branches',
            method: "GET",
            headers: {
                "Content-Type":"application/json",
                "authorization": $rootScope.authorizationString
            }            

        })]).then(function(responses){
            //console.log(responses[0].data);
            $scope.settlementsDetails = responses[0].data;
            
            $scope.settlementsDetails.date_to = $filter('date')($scope.settlementsDetails.date_to, 'dd/MM/yyyy');
            $scope.settlementsDetails.created_at = $filter('date')($scope.settlementsDetails.created_at, 'dd/MM/yyyy');
            $scope.settlementsDetails.status;

            //console.log(responses[1].data.content);
            var resultRes1 = responses[1].data.content.filter(function(elem) { return elem.id === $scope.settlementsDetails.provider_company_id}).pop();
            $scope.companiesName = resultRes1.name;

            //console.log(responses[2].data.content);
            var resultRes2 = responses[2].data.content.filter(function(elem) { return elem.id === $scope.settlementsDetails.provider_company_id}).pop();
            $scope.insurersName = resultRes2.name;

            //console.log(responses[3].data.content);
            var resultRes3 = responses[3].data.content.filter(function(elem) { return elem.id === $scope.settlementsDetails.provider_company_id}).pop();
            $scope.branchName = resultRes3.name;

        }).catch($rootScope.requestHandleError);

        function printSettlementDoc(format) {
            var settings = {
                async: true,
                crossDomain: true,
                url: $rootScope.getApiBaseUrl() + '/settlements/' + $stateParams.settlement_id + '/print',
                method: "PUT",
                params: {
                    format: format   
                },
                headers: {
                    "Content-Type":"application/json",
                    "authorization": $rootScope.authorizationString
            }
        };
            $http(settings).then(function(data) {
                $scope.SettlementDocument = data.data.path;
                $window.open('http://s3.amazonaws.com/settlements-providers-uploads/'+$scope.SettlementDocument, '_blank');


            }, $rootScope.requestHandleError);
        }
    }
})();