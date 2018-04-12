(function(){
'use strict';

angular.module('bballapp').controller('UsersController', [ '$scope', '$rootScope', '$firebaseArray', '$firebaseObject', '$state',

	function($scope, $rootScope, $firebaseArray, $firebaseObject, $state){

		var user = $rootScope.currentUser
		if(user.role !== 'admin'){
			$state.go('root.dash');
			return;
		}

		console.log('users controller')
		var usersRef = firebase.database().ref().child('users');

		$scope.users = $firebaseArray(usersRef);

		$scope.toggle = function(user, visible){
			var isChecked = visible ? !visible : true
			usersRef.child(user).update({
				disabled: isChecked
			});
		};
	}
])
})();

