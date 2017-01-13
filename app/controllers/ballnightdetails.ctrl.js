(function(){
'use strict';

angular.module('bballapp').controller('BallnightDetailController', ['$scope', '$rootScope', '$stateParams', '$firebaseArray',
	function($scope, $rootScope, $stateParams, $firebaseArray) {

	var date = $stateParams.date;

	$scope.date = date;

	var rosterRef = firebase.database().ref().child('roster').child(date).orderByChild('date');
	var waitlistRef = firebase.database().ref().child('waitlist').child(date).orderByChild('date');
	$scope.players = $firebaseArray(rosterRef);
	$scope.waitlist = $firebaseArray(waitlistRef);

}]);

}());