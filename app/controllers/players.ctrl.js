(function(){
'use strict';

angular.module('bballapp').controller('PlayersController', ['$scope', '$firebaseArray', 'PlayersList', function($scope, $firebaseArray, PlayersList) {
	
	// var date = $scope.bballnightdetail
	// console.log('from directive' + date)
	// let date = PlayersList.data
	// console.log(date)
	// var rosterRef = firebase.database().ref().child('roster').child(date).orderByChild('date')
	// $scope.players = $firebaseArray(rosterRef)

	var date = '';
	$scope.text = '';
	$scope.$on('data_shared',function(){
		var balldateObj =  PlayersList.getData();    
		date = balldateObj.bball_date;
		console.log('controller date is ' + date);
		return getPlayers(date);
		
	});

	var getPlayers = function(date) {
		return new Promise(function(resolve,reject) {
			var rosterRef = firebase.database().ref().child('roster').child(date).orderByChild('date');
			var players = $firebaseArray(rosterRef);
			players.$loaded().then(function(){
				console.log('players loaded');
				resolve('loaded');
				$scope.players = players;
			}).catch(function(){
				reject('error');
			});
		});
	};

}]);

})();