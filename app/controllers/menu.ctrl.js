(function(){
'use strict';

angular.module('bballapp').controller('MenuController', ['$scope', '$mdSidenav', '$timeout', 'Authentication',
	function($scope, $mdSidenav, $timeout, Authentication){

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