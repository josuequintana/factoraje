(function () {
  'use strict';

  angular
  .module('naut')
  .controller('InvoicesListController', InvoicesListController);

  InvoicesListController.$inject = ['$scope', '$rootScope', '$http', '$filter', '$stateParams'];
  function InvoicesListController($scope, $rootScope, $http, $filter, $stateParams) {
    var vm = this;
    vm.invoices = [];

    vm.title = 'InvoicesListController';
    vm.currencySymbols = {
      USD: "$",
      GTQ: "Q "
    };

    vm.getInvoiceList = getInvoiceList;
    vm.getInvoiceList({});

    $scope.authorizationTotalItems = 0;
    $scope.currentPage = $stateParams.page - 1 || 0;
    $scope.isLastPage = false;

    $scope.$on('GlobalDateFromChange', function(e, dateObj) {
      vm.getInvoiceList({created_from: $filter('date')(dateObj, 'dd-MM-yyyy')});
    });

    $scope.$on('GlobalDateToChange', function(e, dateObj) {
      vm.getInvoiceList({created_to: $filter('date')(dateObj, 'dd-MM-yyyy')});
    });

    function getInvoiceList(externalParams) {
      $rootScope.$emit('requestStart', {});
      var params = {
        "created_from": $filter('date')(($rootScope.globalQueryParams.date_from), 'dd-MM-yyyy'),
        "created_to": $filter('date')(($rootScope.globalQueryParams.date_to), 'dd-MM-yyyy'),
        "provider_branch_id": $rootScope.globalQueryParams.branch.id,
        "size": $rootScope.defaultBulkSize,
        "page": $scope.currentPage
      };
      var settings = {
        async: true,
        crossDomain: true,
        url: $rootScope.getApiBaseUrl() + '/providers/'+ $rootScope.globalQueryParams.loggedProvider.slug + '/invoices',
        method: "GET",
        headers: {
          "Content-Type":"application/json",
          "authorization": $rootScope.authorizationString
        },
        params: filterEmptyProperties(angular.extend({}, params, externalParams))
      };
      angular.extend(settings.params, externalParams);
      $http(settings).then(function(data) {
        $rootScope.$emit('requestEnd', {});
        vm.invoices = data.data.content;
        $scope.total_pages = data.data.total_pages === 0 ? data.data.total_pages + 1 : data.data.total_pages;
      }, $rootScope.requestHandleError);
    }

    function currentPageWatcher(current, past) {
      if (current !== past) {
        getInvoiceList({page: current - 1});
      }
    }

  }
})();
