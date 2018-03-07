(function () {
    'use strict';

    angular
        .module('naut')
        .controller('ClaimsSingleController', ClaimsSingleController);

    ClaimsSingleController.$inject = ['$scope', '$stateParams', '$http', '$rootScope', '$filter', 'DATE_FORMAT'];

    function ClaimsSingleController($scope, $stateParams, $http, $rootScope, $filter, DATE_FORMAT) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = 'ClaimsSingleController';
        vm.currencySymbols = {
            USD: "$",
            QTQ: "Q"
        };
        vm.statusTraslate = {
            null: "-",
            approved: "Aprobado",
            rejected: "Rechazado",
            pending_review: "Pendiente",
            voided: "Anulado",
            paid: "Pagado"
        };
        vm.getDetails = getDetails;
        vm.getDetails($stateParams.claim_id);

        $scope.claim =
            {
                "id": "",
                "date": "",
                "provider_type": "",
                "invoice": "",
                "status": "",
                "currency_code": "",
                "amount": "",
                "total_coinsurance": "",
                "copayment": "",
                "authorization_id": "",
                "authorization_code": "",
                "doctor": {
                    "medical_license": "",
                    "name": ""
                },
                "provider": {
                    "provider_type": "",
                    "name": "",
                    "provider_branch": {
                        "name": "",
                        "address": "",
                        "latitud": "",
                        "longitude": ""
                    }
                },
                "policy": {
                    "number": "",
                    "certificate": "",
                    "policy_holder": {
                        "name": "",
                        "date_of_birth": ""
                    }
                },
                "items": [],
                "_links": {
                    "self": {
                        "href": ""
                    }
                }
            };

        ////////////////

        function getDetails(claim_id) {
            var settings = {
                async: true,
                crossDomain: true,
                url: $rootScope.getApiBaseUrl() + '/providers/' + $rootScope.globalQueryParams.loggedProvider.slug + '/claims/' + $stateParams.claim_id,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": $rootScope.authorizationString
                },
                params: filterEmptyProperties(angular.extend({}, {
                    "insurer_company_id": $rootScope.globalQueryParams.insurer_company.id,
                    "provider_type_id": $rootScope.globalQueryParams.insurer.id,
                    "provider_id": $rootScope.globalQueryParams.insurer.id

                }))
            };

            $http(settings).then(function (data) {
                var tmp = new Date(data.data.date);
                $scope.claim = data.data;
                $scope.claim.time = $rootScope.dateToGMT(data.data.created_at, 'HH:mm:ss');
                $scope.claim.date = $rootScope.dateToGMT(data.data.created_at, 'MM/dd/yyyy');
            }, $rootScope.requestHandleError);
        }

    }
})();
