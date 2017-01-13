(function(){
'use strict';

angular.module('bballapp').controller('PlayerStatusController', ['$rootScope','$scope', '$firebaseObject', 
	function($rootScope, $scope, $firebaseObject){

		var userRef = firebase.database().ref().child('users').child($rootScope.currentUser.$id).child('mybballnights').child($scope.ballnight.bball_date);
		var waitlistRef = firebase.database().ref().child('users').child($rootScope.currentUser.$id).child('mywaitlists').child($scope.ballnight.bball_date);
		
		$scope.playerInRoster = $firebaseObject(userRef);
		$scope.playerInWaitlist = $firebaseObject(waitlistRef);

}]);

})();
