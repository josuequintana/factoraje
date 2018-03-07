(function () {
    'use strict';

    angular
        .module('naut')
        .controller('loginController', loginController);

    loginController.$inject = ['$http', '$scope', '$rootScope', '$window', '$timeout', 'Idle', 'tokenExpirationTime'];

    /* @ngInject */
    function loginController($http, $scope, $rootScope, $window, $timeout, Idle, tokenExpirationTime)
    {
        /* jshint validthis: true */
        var vm = this;
        $scope.form = {};
        $scope.form.username = '';
        $scope.form.password = '';
        $scope.block = false;

        function initiate() {
            if (Boolean($rootScope.authorizationString)) {
                return $window.location.href = '/#/app/dashboard';
            }

        }
        initiate();

        $rootScope.showMsgLogin = false;
        $rootScope.showLoading = false;

        $rootScope.showMsgLoginConn = false;

        $scope.submit = function(){
            $scope.block = true;
            $rootScope.globalQueryParams.date_from = Date.parse((function() {var d = new Date(); return new Date(d.getFullYear(), parseInt(d.getMonth()) - 1, d.getDate(), 0,0,0,0)}()));
            $rootScope.globalQueryParams.date_to = Date.parse(new Date());
            $rootScope.logged=true;
            $rootScope.authorizationString = 123;
            $rootScope.$storage.sessionStarted = new Date().getTime();
            $rootScope.$storage['session_token'] = {
                entity_type: "test",
                token: "test",
                slug: "test",
                expires: 500000
            };
            return $window.location.href = '/#/app/dashboard'   

        }
    }
})();
