(function(){
'use strict';

angular.module('bballapp').controller('BallnightActionsController', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
	
	var rosterRef = firebase.database().ref().child('roster').child($scope.ballnight.bball_date);
	
	$scope.roster = $firebaseArray(rosterRef);

	$scope.roster.$watch(function() {
    	$scope.rostercount = $scope.roster.length;
    });

	$scope.checkin = function(){
		console.log($scope.ballnight.bball_date);
		// BallnightActions.checkin($scope.ballnight.bball_date)
	};
	
}]);

})();