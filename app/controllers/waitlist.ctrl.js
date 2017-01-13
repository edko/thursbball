(function(){
'use strict';

angular.module('bballapp').controller('WaitlistController', [ '$scope', '$firebaseArray', 
	function($scope, $firebaseArray){

		var waitlistRef = firebase.database().ref().child('waitlist').child($scope.ballnight.bball_date).orderByChild('date');

		$scope.waitlistplayers = $firebaseArray(waitlistRef);

		$scope.waitlistplayers.$watch(function() {
			$scope.waitlistcount = $scope.waitlistplayers.length;
		});

	}]);

})();