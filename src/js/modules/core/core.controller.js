(function () {
    'use strict';
    angular
        .module('naut')
        .controller('CoreController', CoreController);
    CoreController.$inject = ['$rootScope', 'toaster', '$window', '$filter', '$location', 'DATE_FORMAT', '$http', 'Title', '$q', '$interval', '$localStorage'];
    function CoreController($rootScope, toaster, $window, $filter, $location, DATE_FORMAT, $http, Title, $q, $interval, $localStorage) {
        $rootScope.hasCashOutAuto = hasCashOutAuto;
        $rootScope.hasCashOut = hasCashOut;
        $rootScope.authorizationString = '';
        $rootScope.authorizedEntityType = '';
        $rootScope.monthLimit = 6;
        $rootScope.showLoading = false;
        $rootScope.logged = false;
        $rootScope.requestLimitTime = (function () {
            return $rootScope.monthLimit * 30;
        }());
        $rootScope.getProviderBySlug = getProviderBySlug;
        $rootScope.requestHandleError = requestHandleError;
        $rootScope.getApiBaseUrl = getApiBaseUrl;
        $rootScope.getProxyBaseUrl = getProxyBaseUrl;
        $rootScope.registerUser = registerUser;
        $rootScope.trackEvent = trackEvent;
        $rootScope.enableDatePickers = enableDatePickers;
        $rootScope.disableDatePickers = disableDatePickers;
        $rootScope.$on('$stateChangeStart', StateChangeStartWatcher)
        $rootScope.$on('IdleStart', IdleStartWatcher);
        $rootScope.$on('IdleTimeout', IdleTimeoutWatcher);
        $rootScope.$on('IdleEnd', function () {
            Title.restore();
        });
        var countToasterConn = 0;
        $rootScope.showConnAlert = false;
        $rootScope.connTester = function () {
            if (navigator.onLine) {
                if (countToasterConn > 0) {
                    $rootScope.showConnAlert = false;
                    countToasterConn = 0;
                    location.reload();
                } else {
                    $rootScope.showConnAlert = false;
                    countToasterConn = 0;
                }
            }
        };
        $rootScope.connAlert = function () {
            $interval($rootScope.connTester, 2000);
        };
        $rootScope.online = navigator.onLine;
        $window.addEventListener('offline', function () {
            $rootScope.$apply(function () {
                $rootScope.online = false;
            });
        }, false);
        $window.addEventListener('online', function () {
            $rootScope.$apply(function () {
                $rootScope.online = true;
            });
        }, false);
        function registerUser(user) {
            var q = $q.defer();
            try {
                analytics.identify(user.id, {
                    name: user.name,
                    slug: user.slug,
                    email: user.email,
                    country: user.country_code
                }, {}, function () {
                    q.resolve('complete');
                });
            } catch (err) {
                q.reject(err);
            }
            return q.promise;
        }

        function trackEvent(eventName, eventValue) {
            analytics.track(eventName, eventValue);
        }
        $rootScope.$on('requestEnd', function () {
            $rootScope.enableDatePickers();
        });
        $rootScope.$on('requestStart', function () {
            $rootScope.disableDatePickers();
        });
        var connectionSettings = {
            env : 'staging.',
            proxyPort : ':3001',
            protocol: 'https://',
            host: 'paycodenetwork.com',
            version: '/v1'
        };
        $rootScope.$watch('$root.globalQueryParams.date_from', globalQueryParamDateFromWatcher);
        $rootScope.$watch('$root.globalQueryParams.date_to', globalQueryParamDateToWatcher);
        $rootScope.globalQueryParams = {
            branch: {
                id: ''
            },
            insurer: {
                id: ''
            },
            insurer_company: {
                id: ''
            },
            provider_company: {
                id: ''
            },
            provider_type: '',
            provider: {
                id: ''
            },
            loggedProvider: {
                slug: '',
                networks: [{
                    insurer_network_fast_payment_automatic: false,
                    insurer_network_fast_payment_available: false
                }]
            },
            sort: {
                desc: 'desc'
            },
            provider_branch: {
                id: ''
            },
            date_from: '',
            date_to: ''
        };
        initialize();
        function initialize() {
            if ($rootScope.$storage['session_token']) {
                try {
                    var tmp = $rootScope.$storage['session_token'];
                    $rootScope.authorizedEntityType = tmp.entity_type;
                    $rootScope.authorizationString = tmp.token;
                    $rootScope.globalQueryParams.loggedProvider.slug = tmp.slug;
                    $rootScope.getProviderBySlug(tmp.slug)
                        .then(function (provider) {
                            $rootScope.globalQueryParams.loggedProvider = provider.data;
                            $rootScope.registerUser(provider.data);
                            $rootScope.$storage.userInfo = provider.data;
                        });
                } catch (e) {
                    $rootScope.authorizationString = '';
                }
            }
        }

        // Get title for each page
        $rootScope.pageTitle = function () {
            return $rootScope.app.name + ' - ' + $rootScope.app.description;
        };
        $rootScope.cancel = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
        };
        $rootScope.defaultBulkSize = 75;
        $rootScope.defaultChartsTop = 5;
        $rootScope.globalQueryParams.date_to = (function () {
            return Date.parse((function () {
                var d = new Date();
                return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
            })());
        }());
        $rootScope.globalQueryParams.date_from = (function () {
            return Date.parse((function () {
                var d = new Date($rootScope.globalQueryParams.date_to);
                return new Date(d.getFullYear(), parseInt(d.getMonth()) - 1, d.getDate(), 0, 0, 0, 0)
            })())
        })();
        $rootScope.datepickerFrom = {
            enabled: true,
            isOpen: false,
            options: {
                formatYear: 'yyyy',
                startingDay: 1,
                showWeeks: false,
                class: 'custom-calendar',
                initDate: $rootScope.globalQueryParams.date_from
            },
            maxDate: new Date(),
            format: DATE_FORMAT.formatString,
            open: function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $rootScope.datepickerTo.isOpen = false;
                $rootScope.datepickerFrom.isOpen = !$rootScope.datepickerFrom.isOpen;
            }
        };
        $rootScope.datepickerTo = {
            enabled: true,
            isOpen: false,
            options: {
                formatYear: 'yyyy',
                startingDay: 1,
                showWeeks: false,
                class: 'custom-calendar'
            },
            maxDate: new Date(),
            format: DATE_FORMAT.formatString,
            open: function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $rootScope.datepickerFrom.isOpen = false;
                $rootScope.datepickerTo.isOpen = !$rootScope.datepickerTo.isOpen;
            }
        };
        $rootScope.isDateInRange = function (dateStringFrom, dateStringTo) {
            dateStringFrom = new Date(dateStringFrom).getTime() / (1000 * 60 * 60 * 24);
            dateStringTo = new Date(dateStringTo).getTime() / (1000 * 60 * 60 * 24);
            return (dateStringTo - dateStringFrom) < $rootScope.requestLimitTime && (dateStringTo - dateStringFrom) >= 0;
        };
        function enableDatePickers() {
            $rootScope.datepickerFrom.enabled = true;
            $rootScope.datepickerTo.enabled = true;
        }

        function disableDatePickers() {
            $rootScope.datepickerFrom.enabled = false;
            $rootScope.datepickerTo.enabled = false;
        }

        function globalQueryParamDateFromWatcher(current, past) {
            var currentDate = new Date(current);
            var pastDate = new Date(past);
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0, 0);
            pastDate = new Date(pastDate.getFullYear(), pastDate.getMonth(), pastDate.getDate(), 0, 0, 0, 0);
            if (currentDate.getTime() !== pastDate.getTime()) {
                if ($rootScope.isDateInRange(current, $rootScope.globalQueryParams.date_to)) {
                    var currentDateObj = new Date(current);
                    if (currentDateObj.toString() !== 'Invalid Date') {
                        $rootScope.$broadcast('GlobalDateFromChange', currentDateObj);
                        $rootScope.trackEvent('changedDateFilter', {
                            to: $filter('date')($rootScope.globalQueryParams.date_to, 'd MMM y h:mm:ss a'),
                            from: $filter('date')($rootScope.globalQueryParams.date_from, 'd MMM y h:mm:ss a')
                        });
                        if (past !== '') {
                            $rootScope.$broadcast('ResetPager', {});
                        }
                    }
                } else {
                    if ($rootScope.globalQueryParams.date_to < $rootScope.globalQueryParams.date_from) {
                        $rootScope.showToaster('error', 'Error', 'El rango de las fechas seleccionadas es inválido.');
                        $rootScope.trackEvent('triedToChangedDateFilter', {
                            reason: 'low date range',
                            to: $filter('date')($rootScope.globalQueryParams.date_to, 'd MMM y h:mm:ss a'),
                            from: $filter('date')($rootScope.globalQueryParams.date_from, 'd MMM y h:mm:ss a')
                        });
                        $rootScope.globalQueryParams.date_from = past;
                    } else {
                        $rootScope.showToaster('error', 'Error', 'El rango de las fechas seleccionadas no puede superar los ' + $rootScope.monthLimit + ' meses.');
                        $rootScope.trackEvent('triedToChangedDateFilter', {
                            reason: 'high date range',
                            to: $filter('date')($rootScope.globalQueryParams.date_to, 'd MMM y h:mm:ss a'),
                            from: $filter('date')($rootScope.globalQueryParams.date_from, 'd MMM y h:mm:ss a')
                        });
                        $rootScope.globalQueryParams.date_from = past;
                    }
                }
            }
        }

        function globalQueryParamDateToWatcher(current, past) {
            var currentDate = new Date(current);
            var pastDate = new Date(past);
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0, 0);
            pastDate = new Date(pastDate.getFullYear(), pastDate.getMonth(), pastDate.getDate(), 0, 0, 0, 0);
            if (currentDate.getTime() !== pastDate.getTime()) {
                if ($rootScope.isDateInRange($rootScope.globalQueryParams.date_from, current)) {
                    var currentDateObj = new Date(current);
                    if (currentDateObj.toString() !== 'Invalid Date') {
                        $rootScope.$broadcast('GlobalDateToChange', currentDateObj);
                        $rootScope.trackEvent('changedDateFilter', {
                            to: $filter('date')($rootScope.globalQueryParams.date_to, 'd MMM y h:mm:ss a'),
                            from: $filter('date')($rootScope.globalQueryParams.date_from, 'd MMM y h:mm:ss a')
                        });
                        if (past !== '') {
                            $rootScope.$broadcast('ResetPager', {});
                        }
                    }
                } else {
                    if ($rootScope.globalQueryParams.date_to < $rootScope.globalQueryParams.date_from) {
                        $rootScope.showToaster('error', 'Error', 'El rango de las fechas seleccionadas es inválido.');
                        $rootScope.trackEvent('triedToChangedDateFilter', {
                            reason: 'low date range',
                            to: $filter('date')($rootScope.globalQueryParams.date_to, 'd MMM y h:mm:ss a'),
                            from: $filter('date')($rootScope.globalQueryParams.date_from, 'd MMM y h:mm:ss a')
                        });
                        $rootScope.globalQueryParams.date_to = past;
                    } else {
                        $rootScope.showToaster('error', 'Error', 'El rango de las fechas seleccionadas no puede superar los ' + $rootScope.monthLimit + ' mesess.');
                        $rootScope.trackEvent('triedToChangedDateFilter', {
                            reason: 'high date range',
                            to: $filter('date')($rootScope.globalQueryParams.date_to, 'd MMM y h:mm:ss a'),
                            from: $filter('date')($rootScope.globalQueryParams.date_from, 'd MMM y h:mm:ss a')
                        });
                        $rootScope.globalQueryParams.date_to = past;
                    }
                }
            }
        }

        function hasCashOutAuto() {
            return $rootScope.globalQueryParams.loggedProvider.networks[0].insurer_network_fast_payment_automatic === true;
        }

        function hasCashOut() {
            return $rootScope.globalQueryParams.loggedProvider.networks[0].insurer_network_fast_payment_available === true;
        }

        $rootScope.dateToGMT = function (date, format) {
            var dateObj = new Date(date);
            return $filter('date')(dateObj, format || (DATE_FORMAT.formatString + ' HH:mm:ss'), '-0600');
        };
        function requestHandleError(response) {
            $rootScope.$emit('requestEnd', {});
            if (response.data === null || response.data.message === 'No message available') {
                if (navigator.onLine) {
                    $rootScope.showToaster('error', 'Error', 'There has been an error, try again later.');
                } else {
                    location.reload();
                }
            } else {
                if ((response.status == 422 || response.status == 400) && response.data.errors.length > 0) {
                    for (var err in response.data.errors) {
                        $rootScope.showToaster('error', 'Error ' + (response.data.status || ''), err.message);
                    }
                } else if (response.status === 403) {
                    return $rootScope.logout();
                } else {
                    $rootScope.showToaster('error', 'Error ' + (response.data.status || ''), response.data.message);
                }
            }
        }

        $rootScope.showToaster = function (type, title, body, timeout) {
            /*if (timeout === undefined) {
                toaster.pop({
                    type: type,
                    title: title,
                    body: body,
                    showCloseButton: true
                });
            } else {
                toaster.pop({
                    type: type,
                    title: title,
                    body: body,
                    showCloseButton: false,
                    timeout: timeout
                });
            }*/
        };
        function getApiBaseUrl() {
            return connectionSettings.protocol + connectionSettings.env + connectionSettings.host + connectionSettings.version
        }

        function getProxyBaseUrl() {
            return $location.$$protocol + '://' + $location.$$host + connectionSettings.proxyPort
        }

        $rootScope.graphColorIndex = 0;
        $rootScope.graphColorSeries = {
            green: ['#1fffa9', '#16ba7a', '#367f63', '#1b4031'],
            blue: ['#1d9eff', '#04327d', '#85cbff', '#0a53cb'],
            gray: ['#7b7b7b', '#484848', '#e5e5e5', '#b6b6b6'],
            mixed: ['#1fffa9', '#1d9eff', '#7b7b7b', '#1b4031']
        };
        $rootScope.getGraphColor = function (serie, first) {
            // Validate if a serie is specified or send the first
            if (!Boolean(serie)) serie = 'green';
            // Validate if requested the first color or if it's out of index
            if (Boolean(first) || $rootScope.graphColorIndex >= $rootScope.graphColorSeries[serie].length) $rootScope.graphColorIndex = 0;
            return $rootScope.graphColorSeries[serie][$rootScope.graphColorIndex++];
        };
        $rootScope.logout = function () {
            var p = $q.defer();
            $rootScope.authorizationString = '';
            $rootScope.$storage['session_token'] = '';
            $rootScope.cancelLogedOutSubscription = $rootScope.$on('$locationChangeSuccess', function () {
                p.resolve(true);
            });
            $rootScope.logged = false;
            $window.location.href = '/#/page/login';
            return p.promise;
        };
        function getProviderBySlug(slug) {
            return $http({
                async: true,
                crossDomain: true,
                url: $rootScope.getApiBaseUrl() + '/providers/' + slug,
                method: 'GET',
                headers: {
                    'authorization': $rootScope.authorizationString
                }
            });
        }

        function IdleStartWatcher() {
            if ($rootScope.authorizationString != '') {
                Title.idleMessage('{{minutes}}:{{seconds}} para que su sesion expire.');
                Title.timedOutMessage('Su sesion ha expirado.');
            }
        }

        function IdleTimeoutWatcher() {
            if ($rootScope.authorizationString != '') {
                $rootScope
                    .logout()
                    .then(function (e) {
                        if ($rootScope.cancelLogedOutSubscription) $rootScope.cancelLogedOutSubscription();
                        $rootScope.showToaster('error', 'Inactividad', 'Session has expired.');
                        Title.restore();
                    });
            }
        }

        function StateChangeStartWatcher(event, toState, toParams, fromState, fromParams) {
          if (toState.name !== 'page.login') {
            try {
              if (!$rootScope.$storage['session_token'] || isSessionExpired()) {
                throw 'Missing token';
              }
            } catch(e) {
              event.preventDefault()
              $rootScope.authorizationString = '';
              $localStorage.$reset();
              $window.location.href = '/#/page/login';
            }
          }
        }

        function isSessionExpired() {
            try {
                if (!$rootScope.$storage.sessionStarted) {
                    throw 'No session timestamp found';
                }
                var sessionStartedMs = new Date($rootScope.$storage.sessionStarted).getTime();
                var actualMs = new Date().getTime();
                return (actualMs - sessionStartedMs) / 1000 > $rootScope.$storage['session_token'].expires;
            } catch (e) {
                return true;
            }
        }
    }
})();
