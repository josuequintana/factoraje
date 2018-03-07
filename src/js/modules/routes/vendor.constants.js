/**=========================================================
 * Module: VendorAssetsConstant.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('naut')
        .constant('VENDOR_ASSETS', {
            // jQuery based and standalone scripts
            scripts: {
                'animate':              ['vendor/animate.css/animate.min.css'],
                'icons':                ['vendor/font-awesome/css/font-awesome.min.css'],
                'sparklines':           ['app/plugins/sparklines/jquery.sparkline.min.js'],
                'slimscroll':           ['vendor/slimscroll/jquery.slimscroll.min.js'],
                'screenfull':           ['vendor/screenfull/dist/screenfull.js'],
                'vectormap':            ['vendor/ika.jvectormap/jquery-jvectormap-1.2.2.min.js',
                                        'vendor/ika.jvectormap/jquery-jvectormap-1.2.2.css'],
                'vectormap-maps':       ['vendor/ika.jvectormap/jquery-jvectormap-world-mill-en.js',
                                        'vendor/ika.jvectormap/jquery-jvectormap-us-mill-en.js'],
                'loadGoogleMapsJS':     ['app/plugins/gmap/load-google-maps.js'],
                'flot-chart':           ['vendor/flot/jquery.flot.js'],
                'flot-chart-plugins':   ['vendor/flot.tooltip/js/jquery.flot.tooltip.min.js',
                                        'vendor/flot/jquery.flot.resize.js',
                                        'vendor/flot/jquery.flot.pie.js',
                                        'vendor/flot/jquery.flot.time.js',
                                        'vendor/flot/jquery.flot.categories.js',
                                        'vendor/flot-spline/js/jquery.flot.spline.min.js'],
                'jquery-ui':            ['vendor/jquery-ui/jquery-ui.min.js',
                                        'vendor/jqueryui-touch-punch/jquery.ui.touch-punch.min.js'],
                'moment' :              ['vendor/moment/min/moment-with-locales.min.js'],
                'gcal':                 ['vendor/fullcalendar/dist/gcal.js'],
                'blueimp-gallery':      ['vendor/blueimp-gallery/js/jquery.blueimp-gallery.min.js',
                                        'vendor/blueimp-gallery/css/blueimp-gallery.min.css'],
                'filestyle':            ['vendor/bootstrap-filestyle/src/bootstrap-filestyle.js'],
                'nestable':             ['vendor/nestable/jquery.nestable.js']
            },
            // Angular modules scripts (name is module name to be injected)
            modules: [
                {name: 'toaster',                   files: ['vendor/angularjs-toaster/toaster.js',
                                                            'vendor/angularjs-toaster/toaster.css']},
                {name: 'ui.knob',                   files: ['vendor/angular-knob/src/angular-knob.js',
                                                            'vendor/jquery-knob/dist/jquery.knob.min.js']},
                {name: 'easypiechart',              files: ['vendor/jquery.easy-pie-chart/dist/angular.easypiechart.min.js']},
                {name: 'angularFileUpload',         files: ['vendor/angular-file-upload/angular-file-upload.min.js']},
                {name: 'ngTable',                   files: ['vendor/ng-table/dist/ng-table.min.js',
                                                            'vendor/ng-table/dist/ng-table.min.css']},
                {name: 'ngTableExport',             files: ['vendor/ng-table-export/ng-table-export.js']},
                {name: 'ui.map',                    files: ['vendor/angular-ui-map/ui-map.min.js']},
                {name: 'ui.calendar',               files: ['vendor/fullcalendar/dist/fullcalendar.min.js',
                                                            'vendor/fullcalendar/dist/fullcalendar.css',
                                                            'vendor/angular-ui-calendar/src/calendar.js']},
                {name: 'angularBootstrapNavTree',   files: ['vendor/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                                                            'vendor/angular-bootstrap-nav-tree/dist/abn_tree.css']},
                {name: 'htmlSortable',              files: ['vendor/html.sortable/dist/html.sortable.js',
                                                            'vendor/html.sortable/dist/html.sortable.angular.js']},
                {name: 'xeditable',                 files: ['vendor/angular-xeditable/dist/js/xeditable.js',
                                                            'vendor/angular-xeditable/dist/css/xeditable.css']},
                {name: 'angularFileUpload',         files: ['vendor/angular-file-upload/angular-file-upload.js']},
                {name: 'ngImgCrop',                 files: ['vendor/ng-img-crop/compile/unminified/ng-img-crop.js',
                                                            'vendor/ng-img-crop/compile/unminified/ng-img-crop.css']},
                {name: 'ui.select',                 files: ['vendor/angular-ui-select/dist/select.js',
                                                            'vendor/angular-ui-select/dist/select.css']},
                {name: 'textAngular',               files: ['vendor/textAngular/dist/textAngular.css',
                                                            'vendor/textAngular/dist/textAngular-rangy.min.js',
                                                            'vendor/textAngular/dist/textAngular-sanitize.js',
                                                            'vendor/textAngular/src/globals.js',
                                                            'vendor/textAngular/src/factories.js',
                                                            'vendor/textAngular/src/DOM.js',
                                                            'vendor/textAngular/src/validators.js',
                                                            'vendor/textAngular/src/taBind.js',
                                                            'vendor/textAngular/src/main.js',
                                                            'vendor/textAngular/dist/textAngularSetup.js'
                                                            ], serie: true},
                {name: 'vr.directives.slider',      files: ['vendor/venturocket-angular-slider/build/angular-slider.min.js']},
                {name: 'datatables',                files: ['vendor/datatables/media/css/jquery.dataTables.min.css',
                                                            'vendor/datatables/media/js/jquery.dataTables.min.js',
                                                            'vendor/angular-datatables/dist/angular-datatables.min.js']},
                {name: 'oitozero.ngSweetAlert',     files: ['vendor/sweetalert/dist/sweetalert.css',
                                                            'vendor/sweetalert/dist/sweetalert.min.js',
                                                            'vendor/angular-sweetalert/SweetAlert.js']},
                {name: 'checklist-model',           files: ['vendor/checklist-model/checklist-model.js']}
            ]

        });

})();

