(function(){
'use strict';

angular.module('bballapp').factory('Authentication', ['$rootScope', '$firebaseAuth', '$firebaseObject', '$state', '$mdToast',
	function($rootScope, $firebaseAuth, $firebaseObject, $state, $mdToast){
		var auth = $firebaseAuth();
		var ref = firebase.database().ref();

		auth.$onAuthStateChanged(function(authUser){
			if(authUser){
				var userRef = firebase.database().ref('users/' + authUser.uid);
				var userObj = $firebaseObject(userRef);
				$rootScope.currentUser = userObj;
			} else {
				$rootScope.currentUser = '';
				showToast('Please verify your email before you sign in.', 'error');
				$state.go('login');
			}
		});

		var showToast = function(message, classname){
			$mdToast.show(
				$mdToast.simple()
				.textContent(message)
				.position('bottom center')
				.hideDelay(2000)
				// .toastClass('my-error')
				.toastClass(classname)
			);
		};

		var addUser = function(regUser, user){
			var regRef = firebase.database().ref('users').child(regUser.uid).set({
				regUser: regUser.uid,
				first_name: user.firstname,
				last_name: user.lastname,
				email: user.email,
				date: firebase.database.ServerValue.TIMESTAMP
			});			
		};

		var myObject =  {
			login: function(user){
				auth.$signInWithEmailAndPassword(user.email, user.password)
				.then(function(regUser){
					$state.go('root.dash');
				})
				.catch(function(error){
					//$rootScope.message = error.message;
					showToast(error.message, 'error');
				});
			},
			logout: function(){
				auth.$signOut().then(function(){
					$state.go('login');
				});
			},
			requireAuth: function() {
				return auth.$requireSignIn();
			}, //require Authentication
			register: function(user){
				auth.$createUserWithEmailAndPassword(user.email, user.password)
				.then(function(regUser){
					addUser(regUser, user);
					var user = firebase.auth().currentUser;
					user.sendEmailVerification().then(function() {
						showToast('Check your inbox to verify your email address', 'default');
						$state.go('login');
					});
				})
				.catch(function(error){
					// $rootScope.message = error.message;
					showToast(error.message, 'error');
				});
			},
			resetPassword: function(user){
				auth.$sendPasswordResetEmail(user.email)
					.then(function() {
			  			// console.log("Password reset email sent successfully!");
			  			$state.go('login');
					}).catch(function(error) {
			  			// console.error("Error: ", error);
			  			showToast(error.message, 'error');
					});

			}
		};

		return myObject;

	}]);

})();