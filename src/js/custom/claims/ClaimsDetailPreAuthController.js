(function () {
    'use strict';

    angular
        .module('naut')
        .controller('ClaimsDetailPresAuthController', ClaimsDetailPresAuthController);

    ClaimsDetailPresAuthController.$inject = ['$scope', '$stateParams', '$http', '$rootScope', '$filter', 'DATE_FORMAT'];

    function ClaimsDetailPresAuthController($scope, $stateParams, $http, $rootScope, $filter, DATE_FORMAT) {
        /* jshint validthis: true */
        var vm = this;
        vm.title = 'ClaimsPreAuth';

        vm.getProductStatusClassObj = getProductStatusClassObj;

        vm.title = 'ClaimsDetailPresAuthController';
        vm.currencySymbols = {
            USD: '$',
            QTQ: 'Q'
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
                'status-yellow': status.toLowerCase() === 'pending_review' ||
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

        $scope.preAuth = {
            'id': '',
            'copayment': '',
            'total_coinsurance': '',
            'status': '',
            'verification_code': '',
            'provider_branch_id': '',
            'provider_branch_name': '',
            'created_at': '',
            'updated_at': '',
            'invoice': {
                'document_number': '',
                'document_date': '',
                'currency': '',
                'amount': '',
                'digital_signature': ''
            },
            'items': [],
            'authorization_code': '',
            'authorization_date': '',
            'settlement_type': ''
        };

        ////////////////

        function getDetails(claim_id) {
            var settings = {
                async: true,
                crossDomain: true,
                url: $rootScope.getApiBaseUrl() + '/providers/' + $rootScope.globalQueryParams.loggedProvider.slug + '/claims/' + claim_id || $stateParams.claim_id,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': $rootScope.authorizationString
                },
                params: filterEmptyProperties(angular.extend({}, {
                    'insurer_company_id': $rootScope.globalQueryParams.insurer_company.id,
                    'provider_type_id': $rootScope.globalQueryParams.insurer.id,
                    'provider_id': $rootScope.globalQueryParams.insurer.id
                }))
            };

            $http(settings).then(function (data) {
                $scope.preAuth = data.data;
                $scope.preAuth.document_time = $filter('date')(data.data.invoice.document_date, 'HH:mm');
                $scope.preAuth.document_date = $filter('date')(data.data.invoice.document_date, 'dd/MM/yyyy');
                $scope.preAuth.authorization_time = $filter('date')(data.data.authorization_date, 'HH:mm');
                $scope.preAuth.authorization_date = $filter('date')(data.data.authorization_date, 'dd/MM/yyyy');
            }, $rootScope.requestHandleError);
        }

    }
})();
