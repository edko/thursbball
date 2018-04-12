(function(){
'use strict';

angular.module('bballapp').controller('MyProfileController', [ '$scope', '$rootScope', '$firebaseObject', '$firebaseArray', '$mdToast',
	function($scope, $rootScope, $firebaseArray, $firebaseObject, $mdToast){
		// $scope.title = "My Profile"

		var user = firebase.auth().currentUser;
		var userRef = firebase.database().ref().child('users').child($rootScope.currentUser.$id);
		var mybballnightsRef = userRef.child('mybballnights');
		var mywaitlistsRef = userRef.child('mywaitlists');
		$scope.myballnights = $firebaseArray(mybballnightsRef);
		$scope.mywaitlists = $firebaseArray(mywaitlistsRef);
		console.log($rootScope.currentUser.$id)

		$scope.saveProfile = function(){
			console.log($scope.currentUser.$id);
			var userData = {
				email: $scope.currentUser.email,
				mobile: $scope.currentUser.mobile,
				SMS: $scope.currentUser.SMS,
				emailnotification: $scope.currentUser.emailnotification,
				date: firebase.database.ServerValue.TIMESTAMP
			};
			user.updateEmail($scope.currentUser.email).then(function(){
				console.log('user email saved');
			}).catch(function(error){
				console.log(error);
				$mdToast.show(
					$mdToast.simple()
					.textContent(error.message)
					.position('bottom center')
					.hideDelay(2000)
					.toastClass('error')
				);
			});
			userRef.update(userData).then(function(){
				$mdToast.show(
					$mdToast.simple()
					.textContent('Profile saved!')
					.position('top left')
					.hideDelay(2000)
				);
			});

		};

		$scope.sendEmailVerification = function(){
			var user = $scope.currentUser;
			user.sendEmailVerification().then(function(){
				console.log('email sent');
			}).catch(function(){
				console.log('something happened');
			});
		};

}]);

})();
