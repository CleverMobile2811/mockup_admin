'use strict';

App.factory('caseService', ['$http', '$q', '$rootScope', '$window', 'appConfig',
    function ($http, $q, $rootScope, $window, appConfig) {
        var _case = '';
        var _caseService = {};

        _caseService.createCase = function (caseInfo, success, error) {
            console.log('--createCase', caseInfo);
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: appConfig.apiUrl + 'case/createCase',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    'firstName': caseInfo.firstName,
                    'lastName': caseInfo.lastName,
                    'birth': caseInfo.birth,
                    'facility': caseInfo.facility
                }
            })
                .then(function(result) {
                    if (result.status === 200) {
                        success(result.data);
                    } else {
                        error("Fail to create new case");
                    }
                });

        };
        return _caseService;
    }]);