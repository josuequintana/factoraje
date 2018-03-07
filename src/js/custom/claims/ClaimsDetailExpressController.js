(function () {
    'use strict';

    angular
        .module('naut')
        .controller('ClaimsDetailExpressController', ClaimsDetailExpressController);

    ClaimsDetailExpressController.$inject = ['$scope', '$stateParams', '$http', '$rootScope', '$filter', 'DATE_FORMAT'];

    function ClaimsDetailExpressController($scope, $stateParams, $http, $rootScope, $filter, DATE_FORMAT) {
        /* jshint validthis: true */
        var vm = this;
        $rootScope.title = 'ClaimsExpress';

        vm.getProductStatusClassObj = getProductStatusClassObj;

        vm.title = 'ClaimsDetailExpressController';
        vm.currencySymbols = {
            USD: '$',
            QTQ: 'Q'
        };


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
        };

        vm.getDetails = getDetails;
        vm.getDetails($stateParams.claim_id);

        function getProductStatusClassObj(status) {
            return {
                'status-gray': status.toLowerCase() === '0' ||
                status.toLowerCase() === 'voided' ||
                status.toLowerCase() === 'voided_paid' ||
                status.toLowerCase() === 'voided_reviewed',
                'status-green': status.toLowerCase() === 'approved' ||
                status.toLowerCase() === 'paid' ||
                status.toLowerCase() === 'reviewed',
                'status-yellow': status.toLowerCase() == 'pending_review' ||
                status.toLowerCase() === 'refunded',
                'status-red': status.toLowerCase() == 'rejected' ||
                status.toLowerCase() === 'rejected_voided' ||
                status.toLowerCase() === 'rejected_refunded' ||
                status.toLowerCase() === 'rejected_processed' ||
                status.toLowerCase() === 'rejected_approved' ||
                status.toLowerCase() === 'rejected_reviewed' ||
                status.toLowerCase() === 'rejected_paid' ||
                status.toLowerCase() === 'non_refundable'
            }
        }

        $scope.express = {
            'id': '',
            'insurer': '',
            'provider_branch_id': '',
            'provider_branch_name': '',
            'policy_holder': {
                'id': '',
                'date_of_birth': ''
            },
            'status': 'p',
            'items': [{
                'product_id': '',
                'name': '',
                'quantity': '',
                'price': '',
                'coinsurance_percentage': ''
            }],
            'invoice': {
                'document_number': '',
                'document_date': '',
                'currency': '',
                'amount': ''
            },
            'copayment': '',
            'total_coinsurance': '',
            'created_at': '',
            'updated_at': '',
            '_links': {
                'self': {
                    'href': ''
                }
            }
        };

        ////////////////

        function getDetails(claim_id) {
            var settings = {
                async: true,
                crossDomain: true,
                url: $rootScope.getApiBaseUrl() + '/providers/' + $rootScope.globalQueryParams.loggedProvider.slug + '/authorizations/express/' + claim_id || $stateParams.claim_id,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': $rootScope.authorizationString
                }
            };
            $http(settings).then(function (data) {
                $scope.express = data.data;
            }, $rootScope.requestHandleError);
        }

    }
})();
