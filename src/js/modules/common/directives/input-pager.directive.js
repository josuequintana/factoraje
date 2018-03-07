(function () {
    'use strict';

    angular
        .module('naut')
        .directive('inputPager', inputPager);

    inputPager.$inject = ['$state', '$stateParams'];

    /* @ngInject */
    function inputPager($state, $stateParams) {
        var directive = {
            templateUrl: 'app/views/core/inputPager.directive.html',
            link: link,
            restrict: 'E',
            scope: {
                maxPage: '@max',
                disable: '@disabled'
            }
        };
        return directive;

        function link(scope, element, attrs) {
            scope.currentPage = attrs.current || $stateParams.page|| 1;
            scope.maxPage = attrs.max || 1;
            scope.isReset = false;
            // scope.currentPageModel = scope.currentPage;
            scope.validPagerExp = new RegExp('^[0-9]{1,'+scope.maxPage.toString().length+'}$');

            scope.nextPage = nextPage;
            scope.prevPage = prevPage;
            scope.firstPage = firstPage;
            scope.lastPage = lastPage;
            // scope.changePage = changePage;

            scope.$on('ResetPager', function(e, attr){
                scope.currentPage = 1;
                goToPage(1);
            });

            element.bind("keydown keypress", function (event) {
                if((event.which === 13 || event.which === 9) && !Boolean(attrs.disabled !== "false") && parseInt(scope.currentPage) <= parseInt(scope.maxPage) && scope.currentPage >= 1) {
                    goToPage(scope.currentPage);
                }
            });

            // scope.$watch('maxPage', maxPageWatcher);
            // scope.$watch('currentPage', currentPageWatcher);
            // scope.$watch('currentPageModel', currentPageModelWatcher);

            function prevPage() {
                if (!Boolean(attrs.disabled !== "false")) {
                    scope.currentPage = parseInt(scope.currentPage) - 1;
                    goToPage(scope.currentPage);
                }
            }
            function nextPage() {
                if (!Boolean(attrs.disabled !== "false")) {
                    scope.currentPage = parseInt(scope.currentPage) + 1;
                    goToPage(scope.currentPage);
                }
            }
            function firstPage() {
                if (!Boolean(attrs.disabled !== "false")) {
                    scope.currentPage = 1;
                    goToPage(scope.currentPage);
                }
            }
            function lastPage() {
                if (!Boolean(attrs.disabled !== "false")) {
                    scope.currentPage = parseInt(scope.maxPage);
                    goToPage(scope.currentPage);
                }
            }

            function goToPage(page) {
                return $state
                    .go($state.current.name, {page: page || 0})
                    .then(function(state) {
                        scope.$emit('changePage', page || 0);
                    });
            }
        }
    }

})();
