'use strict';

angular.module('walkins').controller('WalkinReviewController', ['$scope', '$state', '$http', '$location', '$modal',
    function($scope, $state, $http, $location, $modal){
        if(!$scope.formStatus.problem)     $state.go('createWalkin.problem');
        if(!$scope.formStatus.device)     $state.go('createWalkin.device');
        if(!$scope.formStatus.info)     $state.go('createWalkin.info');
        if(!$scope.formStatus.netid)    $state.go('createWalkin.netid');

        $scope.submitWalkin = function(){
            var viewLibaility = $modal.open({
                animation: true,
                templateUrl: 'modules/walkins/views/create-walkin-liability-modal.client.view.html',
                controller: 'LiabilityModalCtrl',
                size: 'lg',
                resolve: { walkinInfo : function() { return null; } }
            });

            viewLibaility.result.then(
                function(response){
                    if(response){
                        // Create instance
                        $scope.formData.liabilityAgreement = response;
                        $http.post('/walkins', $scope.formData)
                            .success(function(response){
                                $location.path('/success');
                            })
                            .error(function(err){ $scope.error = err.message; });
                    }
                }
            );
        };
    }
]);
