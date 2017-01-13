(function(){
'use strict';

angular
	.module('directive.players', [])
	.directive('players', function(){
		return {
			restrict: 'E',
			scope: {
				bballnightdetail: '=data'
			},
			templateUrl:'views/directives/players.dir.html',
			controller: 'PlayersController'
		};
	})
	.directive('rosterCount', function(){
		return {
			restrict: 'E',
			scope: {
				ballnight: '=data'
			},
			templateUrl: 'views/directives/rostercount.dir.html',
			controller: 'RosterCountController'
		};
	})
	.directive('playerStatus', function(){
		return {
			restrict: 'E',
			scope: {
				ballnight: '=data'
			},
			templateUrl: 'views/directives/playerstatus.dir.html',
			controller: 'PlayerStatusController'
		};
	})
	.directive('waitlist', function(){
		return {
			restrict: 'E',
			scope: {
				ballnight: '=data'
			},
			templateUrl: 'views/directives/waitlist.dir.html',
			controller: 'WaitlistController'
		};
	})
	.directive('waitlistCount', function(){
		return {
			restrict: 'E',
			scope: {
				ballnight: '=data'
			},
			templateUrl: 'views/directives/waitlistcount.dir.html',
			controller: 'WaitlistController'
		};
	})
	.directive('ballnightActions', function(){
		return {
			restrict: 'E',
			scope: {
				ballnight: '=data'
			},
			templateUrl: 'views/directives/ballnightactions.dir.html',
			controller: 'BallnightActionsController'
		};
	});

})();