(function () {
'use strict';

var app = angular.module('bballapp',['angularSpinners','bballapp.config','firebase', 'ui.router', 'ngMaterial', 'directive.players', 'mcwebb.twilio']);

app.config(['ENV', function(ENV) {
	firebase.initializeApp({
		apiKey: ENV.firebase.apiKey,
		authDomain: ENV.firebase.authDomain,
		databaseURL: ENV.firebase.databaseURL,
		storageBucket: ENV.firebase.storageBucket,
		messagingSenderId: ENV.firebase.messagingSenderId
	});
}]);

app.run(['$rootScope', '$state', '$mdToast',function($rootScope, $state, $mdToast) {
	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
		if (error=='AUTH_REQUIRED') {
			// $rootScope.message = 'Sorry, you must log in to access that page';
			$mdToast.show(
				$mdToast.simple()
				.textContent('Sorry, you must login to access this page!')
				.position('top center')
				.hideDelay(2000)
				.toastClass('my-error')
			);
			$state.go('login');
		}
	});
}])

// angular.module("templates", []);

.config(function($mdThemingProvider) {
	$mdThemingProvider
		.theme('default')
		.primaryPalette('blue-grey')
		.accentPalette('orange');
		// .backgroundPalette('blue-grey');
})

.config(['TwilioProvider', 'ENV', function(TwilioProvider, ENV) {
	TwilioProvider.setCredentials({
		accountSid: ENV.twilio.accountSid,
		authToken: ENV.twilio.authToken
	});
}])

.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider){
	
	$urlRouterProvider.otherwise('/dashboard');

	$stateProvider
		.state('root', {
			url: '',
			abstract: true,
			views: {
				'header': {
					templateUrl: 'views/header.html',
					controller: 'MenuController'
				},
				'footer': {
					templateUrl: 'views/footer.html'
				},
				'sidenav': {
					templateUrl: 'views/sidenav.html',
					controller: 'MenuController'
				}

			}
		})

		.state('login', {
			url: '/login',
			templateUrl: 'views/login.html',
			controller: 'RegistrationController',
			authenticate: false
		})
		
		.state('register', {
			url: '/register',
			templateUrl: 'views/register.html',
			controller: 'RegistrationController',
			authenticate: false
		})
		
		.state('resetpassword', {
			url: '/resetpassword',
			templateUrl: 'views/resetpassword.html',
			controller: 'RegistrationController',
			authenticate: false
		})

		.state('root.dash', {
			url: '/dashboard',
			views: {
				'@':{
					templateUrl: 'views/dashboard.html',
					controller: 'DashboardController'
				}
			},
			authenticate: true
			// resolve: {
			// 	currentAuth: function(Authentication) {
			// 		return Authentication.requireAuth();
			// 	} //current Auth
			// } //resolve
		})

		.state('root.dash.ballnight', {
			url: '/:date',
			views: {
				'detail': {
					templateUrl: 'views/ballnightdetail.html',
					controller: 'BallnightDetailController'
				}
			},
			authenticate: true
		})
		
		.state('root.about', {
			url: '/about',
			views: {
				'@':{
					templateUrl: 'views/about.html'
				}	
			},
			authenticate: true
		})
		
		.state('root.contact', {
			url: '/contact',
			views: {
				'@':{
					templateUrl: 'views/contact.html'
				}	
			},
			authenticate: true

		})

		.state('root.faq', {
			url: '/faq',
			views: {
				'@':{
					templateUrl: 'views/faq.html'
				}	
			},
			authenticate: true
		})

		.state('root.ballnights', {
			url: '/ballnights',
			views: {
				'@':{
					templateUrl: 'views/ballnights.html',
					controller: 'BallnightsController'
				}
			},
			authenticate: true
			// resolve: {
			// 	currentAuth: function(Authentication) {
			// 		return Authentication.requireAuth();
			// 	} //current Auth
			// } //resolve
		})
		
		.state('root.myprofile', {
			url: '/myprofile',
			views: {
				'@':{
					templateUrl: 'views/myprofile.html',
					controller: 'MyProfileController'
				}	
			},
			resolve: {
				currentAuth: function(Authentication) {
					return Authentication.requireAuth();
				} //current Auth
			} //resolve
		});
	}
]);

})();