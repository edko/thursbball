(function(){
'use strict';

angular.module('bballapp').controller('MenuController', ['$scope', '$rootScope', '$mdSidenav', '$timeout', 'Authentication',
	function($scope, $rootScope, $mdSidenav, $timeout, Authentication){

		$scope.user = $rootScope.currentUser

		$scope.openSidebar = function(){
			$mdSidenav('right').toggle();
		};
		$scope.closeSidebar = function(){
			$mdSidenav('right').close();
		};
		$scope.logout = function(){
			Authentication.logout();
			$scope.closeSidebar();
		};

		$scope.close = function(){
			alert('closed');
		};

	}]);

})();
