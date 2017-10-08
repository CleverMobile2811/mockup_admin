/**
 * Created by admin on 9/19/2017.
 */
App.controller('UserEventCtrl', ['$scope', '$http', '$state', '$localStorage', '$window', 'appConfig',
    function ($scope, $http, $state, $localStorage, $window, appConfig) {
        // Init full DataTable, for more examples you can check out https://www.datatables.net/
        var initDataTableFull = function() {
            var url = appConfig.apiUrl + "log/getAllLogs";
            console.log('--UserEventCtrl-url:', url);
            var t = jQuery('.js-dataTable-full').dataTable({
                "processing": true,
                "serverSide": true,
                "ajax": {
                    url: url,
                    type: 'GET'
                },
                destroy: true,
                searching: true,
                scrollX: true,
                pageLength: 20,
                lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]],
                columnDefs: [
                    { //Email
                        "targets": 0,
                        "orderable": false,
                        "data": 'email',
                        "sClass": 'text-center v-middle'
                    },
                    { //Logs
                        "targets": 1,
                        "orderable": false,
                        "data": 'userLog',
                        "sClass": 'text-center v-middle'
                    },
                    { //Created Date
                        "targets": 2,
                        "orderable": false,
                        "data": 'dateTime',
                        "sClass": 'text-center v-middle',
                        "render": function(data, type, row) {
                            var convertedate     = moment.utc(data).toDate();
                            data = moment(convertedate).format('DD/MM/YYYY');
                            return data;
                        }
                    }
                ]
            });
            t.on('click', '.updateActivity', function() {
                console.log('--updateActivity');
                var t = angular.element('#case_table').DataTable();
                t.draw();
                var dataArr = '';
                $scope.updateFlag=true;
                var row=$(this).closest('tr');
                var rowData = t.row(row).data();
                console.log('--updateActivity', rowData);
                var convertDate     = moment.utc(rowData.birth).toDate();
                var birth = moment(convertDate).format('DD/MM/YYYY');
                $window.sessionStorage["caseInfo"] = JSON.stringify(rowData);
                $window.sessionStorage["caseInfo"].birth = birth;
                $state.go('vob_entry');
            });

        };

        // DataTables Bootstrap integration
        var bsDataTables = function() {
            var DataTable = jQuery.fn.dataTable;

            // Set the defaults for DataTables init
            jQuery.extend( true, DataTable.defaults, {
                dom:
                "<'row'<'col-sm-6'l><'col-sm-6'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-6'i><'col-sm-6'p>>",
                renderer: 'bootstrap',
                oLanguage: {
                    sLengthMenu: "_MENU_",
                    sInfo: "Showing <strong>_START_</strong>-<strong>_END_</strong> of <strong>_TOTAL_</strong>",
                    oPaginate: {
                        sPrevious: '<i class="fa fa-angle-left"></i>',
                        sNext: '<i class="fa fa-angle-right"></i>'
                    }
                }
            });

            // Default class modification
            jQuery.extend(DataTable.ext.classes, {
                sWrapper: "dataTables_wrapper form-inline dt-bootstrap",
                sFilterInput: "form-control",
                sLengthSelect: "form-control"
            });

            // Bootstrap paging button renderer
            DataTable.ext.renderer.pageButton.bootstrap = function (settings, host, idx, buttons, page, pages) {
                var api     = new DataTable.Api(settings);
                var classes = settings.oClasses;
                var lang    = settings.oLanguage.oPaginate;
                var btnDisplay, btnClass;

                var attach = function (container, buttons) {
                    var i, ien, node, button;
                    var clickHandler = function (e) {
                        e.preventDefault();
                        if (!jQuery(e.currentTarget).hasClass('disabled')) {
                            api.page(e.data.action).draw(false);
                        }
                    };

                    for (i = 0, ien = buttons.length; i < ien; i++) {
                        button = buttons[i];

                        if (jQuery.isArray(button)) {
                            attach(container, button);
                        }
                        else {
                            btnDisplay = '';
                            btnClass = '';

                            switch (button) {
                                case 'ellipsis':
                                    btnDisplay = '&hellip;';
                                    btnClass = 'disabled';
                                    break;

                                case 'first':
                                    btnDisplay = lang.sFirst;
                                    btnClass = button + (page > 0 ? '' : ' disabled');
                                    break;

                                case 'previous':
                                    btnDisplay = lang.sPrevious;
                                    btnClass = button + (page > 0 ? '' : ' disabled');
                                    break;

                                case 'next':
                                    btnDisplay = lang.sNext;
                                    btnClass = button + (page < pages - 1 ? '' : ' disabled');
                                    break;

                                case 'last':
                                    btnDisplay = lang.sLast;
                                    btnClass = button + (page < pages - 1 ? '' : ' disabled');
                                    break;

                                default:
                                    btnDisplay = button + 1;
                                    btnClass = page === button ?
                                        'active' : '';
                                    break;
                            }

                            if (btnDisplay) {
                                node = jQuery('<li>', {
                                    'class': classes.sPageButton + ' ' + btnClass,
                                    'aria-controls': settings.sTableId,
                                    'tabindex': settings.iTabIndex,
                                    'id': idx === 0 && typeof button === 'string' ?
                                    settings.sTableId + '_' + button :
                                        null
                                })
                                    .append(jQuery('<a>', {
                                            'href': '#'
                                        })
                                        .html(btnDisplay)
                                    )
                                    .appendTo(container);

                                settings.oApi._fnBindAction(
                                    node, {action: button}, clickHandler
                                );
                            }
                        }
                    }
                };

                attach(
                    jQuery(host).empty().html('<ul class="pagination"/>').children('ul'),
                    buttons
                );
            };

            // TableTools Bootstrap compatibility - Required TableTools 2.1+
            if (DataTable.TableTools) {
                // Set the classes that TableTools uses to something suitable for Bootstrap
                jQuery.extend(true, DataTable.TableTools.classes, {
                    "container": "DTTT btn-group",
                    "buttons": {
                        "normal": "btn btn-default",
                        "disabled": "disabled"
                    },
                    "collection": {
                        "container": "DTTT_dropdown dropdown-menu",
                        "buttons": {
                            "normal": "",
                            "disabled": "disabled"
                        }
                    },
                    "print": {
                        "info": "DTTT_print_info"
                    },
                    "select": {
                        "row": "active"
                    }
                });

                // Have the collection use a bootstrap compatible drop down
                jQuery.extend(true, DataTable.TableTools.DEFAULTS.oTags, {
                    "collection": {
                        "container": "ul",
                        "button": "li",
                        "liner": "a"
                    }
                });
            }
        };
        // Init jQuery AutoComplete example, for more examples you can check out https://github.com/Pixabay/jQuery-autoComplete
        var initAutoComplete = function(){
            // Init autocomplete functionality
            $scope.newCaseFlag = 0;
            //$('#manage_users_table').DataTable(); // <-- errors
        };

        // Init jQuery AutoComplete example
        initAutoComplete();

        // Init Datatables
        bsDataTables();
        initDataTableFull();

    }
]);