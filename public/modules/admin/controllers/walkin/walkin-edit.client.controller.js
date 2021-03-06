'use strict';

angular.module('admin').controller('WalkinviewController', ['$http', '$scope', '$stateParams', '$location', 'Authentication',
    function($http, $scope, $stateParams, $location, Authentication){

        var user = Authentication.user;
        if (!user)
            $location.path('/');
        else if(user.roles.indexOf('technician') < 0 && user.roles.indexOf('admin') < 0)
            $location.path('/');
        else if(user.roles.indexOf('admin') >= 0)
            $scope.isAdmin = true;

        $scope.walkin = {};
        $scope.status = {
            editDeviceType : false, editDeviceInfo: false, editDeviceOS: false, editDeviceOther: false,
            editProblem: false, editWorkNote: false, editResolution: false, editResolutionType: false,
            editOtherResolution: false, editName: false, editPhone: false, editLocation: false
        };

        $scope.initWalkin = function(){ $http.get('/walkins/'+$stateParams.walkinId).success(function(response){ $scope.walkin = response; }); };
        $scope.initDeviceType = function(){ $http.get('/walkins/util/loadDeviceType').success(function(response){ $scope.deviceTypeOptions = response; }); };
        $scope.initDeviceInfo = function(){ $http.get('/walkins/util/loadDeviceInfo').success(function(response){ $scope.deviceInfoOptions = response; }); };
        $scope.initDeviceOS = function(){ $http.get('/walkins/util/loadDeviceOS').success(function(response){ $scope.deviceOSOptions = response; }); };
        $scope.initResolutionType = function(){ $http.get('/walkins/util/loadResolutionOptions').success(function(response){ $scope.resolutionOptions = response; }); };
        $scope.initLocation = function(){ $http.get('/walkins/util/loadLocationOptions').success(function(response){ $scope.locationOptions = response; }); };

        $scope.initTransferWalkinInfo = function(){
            $http.get('/walkins/'+$stateParams.walkinId).success(function(response){
                $scope.walkin = response;
                $scope.$parent.walkinInfo = $scope.walkin;
            });
        };

        $scope.updateDevice = function(){
            switch($scope.walkin.deviceCategory){
                case 'Computer':
                case 'Phone/Tablet':
                    $scope.walkin.deviceType = 'N/A';
                    if($scope.walkin.os && $scope.walkin.os !== 'N/A' && $scope.walkin.os !== 'Other'){
                        $scope.walkin.otherDevice = undefined;
                    }
                    break;

                case 'Gaming System':
                case 'TV/Media Device':
                    $scope.walkin.os = 'N/A';
                    if($scope.walkin.deviceType && $scope.walkin.deviceType !== 'N/A' && $scope.walkin.deviceType !== 'Other'){
                        $scope.walkin.otherDevice = undefined;
                    }
                    break;

                default:
                    $scope.walkin.deviceType = 'N/A'; $scope.walkin.os = 'N/A';
            }
        };

        $scope.updateName = function(){
            $scope.walkin.user.displayName = $scope.walkin.user.firstName + ' ' + $scope.walkin.user.lastName;
        };

        $scope.updatePhone = function(){
            $scope.walkin.user.phone = $scope.walkin.user.phone.replace(/\D/g, '');
        };

        $scope.updateUser = function(){
            $http.put('/user/update/'+$scope.walkin.user.username, $scope.walkin.user).success(function(response){
                alert('User information updated');
            });
        };

        $scope.updateWalkin = function(){
            if($scope.walkin.resolutionType !== 'Other') $scope.walkin.otherResolution = '';
            $http.put('/walkins/'+$scope.walkin._id, $scope.walkin).success(function(){
                alert('Walk-in information updated');
            });
        };

        $scope.deleteWalkin = function(id){ if(confirm('Are you sure you want to delete this instance?')) $http.delete('/walkins/'+id).success(function(){ $location.path('/admin'); }); };

        $scope.duplicate = function(){
            if(confirm('Are you sure you want to recreate this instance?')){
                $http.post('/walkins/duplicate', $scope.walkin).success(function(){
                    alert('Instance recreated');
                }).error(function(){ alert('Process failed.'); });
            }
        };
    }
]);
