(function(){
'use strict';

angular.module('bballapp').controller('BallnightsController', [ '$scope', '$firebaseArray', '$firebaseObject', 
	function($scope, $firebaseArray, $firebaseObject){
		var ballnightsRef = firebase.database().ref().child('bballnights');
		
		$scope.ballnights = $firebaseArray(ballnightsRef);

		$scope.addBballNight = function(){ 
			console.log('add ballnight');
			var balldate = $scope.bballdate.getTime();
			ballnightsRef.child(balldate).set({
				bball_date: balldate,
				timestamp: firebase.database.ServerValue.TIMESTAMP
			}).then(function(){
				$scope.bballdate = '';
			});
		};

		$scope.deleteBballNight = function(date){
			// $scope.ballnights.$remove(key);
			console.log(date);
			ballnightsRef.child(date).update({
				visible: false
			});
		};
		$scope.undeleteBballNight = function(date){
			// $scope.ballnights.$remove(key);
			console.log(date);
			ballnightsRef.child(date).update({
				visible: true
			});
		};
}]);

})();