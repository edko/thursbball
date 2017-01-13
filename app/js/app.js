'use strict'

var app = angular.module('bballapp',['firebase', 'ui.router', 'ngMaterial', 'directive.players', 'mcwebb.twilio', 'angularAddToHomeScreen']);

var config = {
	// apiKey: "AIzaSyAMCzHhniQmZjSp0E2xI2Gp9MxXy0ANZXk",
	// authDomain: "thursbball.firebaseapp.com",
	// databaseURL: "https://thursbball.firebaseio.com",
	// storageBucket: "thursbball.appspot.com",
	// messagingSenderId: "379104990436"

    apiKey: "AIzaSyAJJKttiMY0vKV0H97Cod2bUcgerkkeSfg",
    authDomain: "thursbballdev.firebaseapp.com",
    databaseURL: "https://thursbballdev.firebaseio.com",
    storageBucket: "thursbballdev.appspot.com",
    messagingSenderId: "321805593752"

}

firebase.initializeApp(config);

app.run(['$rootScope', '$state', '$mdToast',function($rootScope, $state, $mdToast) {

	// $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
	// 	if (toState.authenticate && !$rootScope.currentUser){
	// 		// User isn’t authenticated
	// 		console.log('not logged in')
	// 		$state.transitionTo("login");
	// 		event.preventDefault(); 
	// 	}
	// });

	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
		if (error=='AUTH_REQUIRED') {
			// $rootScope.message = 'Sorry, you must log in to access that page';
			$mdToast.show(
				$mdToast.simple()
				.textContent('Sorry, you must login to access this page!')
				.position('top center')
				.hideDelay(2000)
				.toastClass('my-error')
			)
			$state.go('login');
		}
	});
}])

angular.module("templates", []);

app.config(function($mdThemingProvider) {
	$mdThemingProvider
		.theme('default')
		.primaryPalette('blue-grey')
		.accentPalette('orange')
		// .backgroundPalette('blue-grey');
})

.config(function(TwilioProvider) {
	TwilioProvider.setCredentials({
		// test credentials
		// accountSid: 'ACbaa00689dcf44a4cadf354365f46cc38',
		// authToken: '209bbd65706f14856bf709508455c9bb'
		// live credentials
		accountSid: 'ACafbb499229ea9c97adb62818ad96f125',
		authToken: '49446639ec20a2a35fe0b85dd81baec6'
	})
})

.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider){
	
	$urlRouterProvider.otherwise('/dashboard')

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
		})
	}
])