(function(){
'use strict';

angular.module('bballapp').controller('RegistrationController', ['$scope', 'Authentication', '$firebaseObject', '$mdToast',
	function($scope, Authentication, $firebaseObject, $mdToast){
		$scope.register = function(){
			Authentication.register($scope.user);
		};
		$scope.login = function(){
			Authentication.login($scope.user);
		};
		$scope.logout = function(){
			Authentication.logout();
			target.blur();
		};
		$scope.passwordReset = function(){
			Authentication.resetPassword($scope.user);
		};

	}]);

})();