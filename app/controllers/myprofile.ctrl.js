'use strict'

app.controller('MyProfileController', [ '$scope', '$rootScope', '$firebaseObject', '$firebaseArray', '$mdToast',
	function($scope, $rootScope, $firebaseArray, $firebaseObject, $mdToast){
		// $scope.title = "My Profile"
		
		var userRef = firebase.database().ref().child('users').child($rootScope.currentUser.$id)
		var mybballnightsRef = userRef.child('mybballnights')
		var mywaitlistsRef = userRef.child('mywaitlists')
		$scope.myballnights = $firebaseArray(mybballnightsRef)
		$scope.mywaitlists = $firebaseArray(mywaitlistsRef)

		$scope.saveProfile = function(){
			console.log($scope.currentUser.$id)
			var userData = {
				mobile: $scope.currentUser.mobile,
				SMS: $scope.currentUser.SMS,
				date: firebase.database.ServerValue.TIMESTAMP
			}
			userRef.update(userData).then(function(){
				$mdToast.show(
					$mdToast.simple()
					.textContent('Profile saved!')
					.position('top left')
					.hideDelay(2000)
				);
			})
		}
}])