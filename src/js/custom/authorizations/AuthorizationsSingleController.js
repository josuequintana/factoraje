(function () {
    'use strict';

    angular
        .module('naut')
        .controller('AuthorizationsSingleController', AuthorizationsSingleController);

    AuthorizationsSingleController.$inject = ['$scope', '$stateParams', '$http', '$rootScope', '$filter', 'DATE_FORMAT'];
    function AuthorizationsSingleController($scope, $stateParams, $http, $rootScope, $filter, DATE_FORMAT) {
        /* jshint validthis: true */
        var vm = this;

        vm.title = 'authorizationsSingleController';
        vm.currencySymbols = {
            USD: "$",
            QTQ: "Q"
        };

        vm.getDetails = getDetails;
        vm.getDetails($stateParams.authorizations_id);

        vm.authorization = {
            "id": "",
            "authorization_code": "",
            "type": "",
            "total_products": "",
            "created_at": "",
            "time_created_at": "",
            "doctor": {
                "name": "",
                "medical_license": ""
            },
            "diagnoses": [],
            "insurer": {
                "id": "",
                "name": ""
            },
            "policy": {
                "number": "",
                "certificate": "",
                "policy_holder": {
                    "foreign_id": "",
                    "name": "",
                    "date_of_birth": ""
                }
            },
            "items": []
        };

        ////////////////

        function getDetails(authorizations_id) {
            var settings = {
                async: true,
                crossDomain: true,
                url: $rootScope.getApiBaseUrl() + '/transactions/authorizations/' + authorizations_id,
                method: "GET",
                headers: {
                    "Content-Type":"application/json",
                    "authorization": $rootScope.authorizationString
                }
            };

            $rootScope.$emit('requestStart', {});
            $http(settings).then(function(data) {
                $rootScope.$emit('requestEnd', {});
                vm.authorization = data.data;
                vm.authorization.time_created_at = new Date(data.data.created_at);
                vm.authorization.created_at = $rootScope.dateToGMT(data.data.created_at, DATE_FORMAT.formatString);
                vm.authorization.time_created_at = $rootScope.dateToGMT(vm.authorization.time_created_at, 'HH:mm:ss');
            }, $rootScope.requestHandleError);
        }

    }
})();