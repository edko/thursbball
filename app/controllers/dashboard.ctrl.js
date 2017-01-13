(function () {
"use strict";

angular.module('bballapp').controller('DashboardController', ['$rootScope','$filter' ,'$scope','Authentication', '$firebaseArray', '$firebaseObject', '$state', '$mdToast', '$mdDialog', 'Twilio',
	function($rootScope,$filter, $scope, Authentication, $firebaseArray, $firebaseObject, $state, $mdToast, $mdDialog, Twilio){

		$scope.title = "Calendar List";

		var newDate = Date.now() - (24*60*60*1000);  // current day minus 1 day
		
		var ref = firebase.database().ref();
		var ballnightsRef = firebase.database().ref().child('bballnights');//.orderByChild('bball_date')//.startAt(newDate)
		var rosterRef = firebase.database().ref().child('roster');
		var waitlistRef = firebase.database().ref().child('waitlist');
		var userRef = firebase.database().ref().child('users');

		
		$scope.showroster = true;
		
		$scope.go = function(date){
			$state.go('root.dash.ballnight', { date: date});
		};

		$scope.ballnights = $firebaseArray(ballnightsRef);

		function formatMobile(mobile){
			mobile = "+1" + mobile.replace(/-/g, "");
			return mobile;
		}

		var sendText = function(user, date){
			if (user.SMS === true) {
				var mobile = formatMobile(user.mobile);
				var bdate = $filter('date')(date, "M/dd/yyyy");
				console.log('sending text to ' + mobile);
				Twilio.create('Messages', {
	            	// From: '+15005550006',
	            	// To: '+15005550004',
					From: '+16264276815',
					To: mobile,
					Body: "Hey " + user.first_name + ", you are in for " + bdate + ". from ThursBball"
	        	})
	        	.success(function (data, status, headers, config) {
	            	// Success - do something
	        	})
	        	.error(function (data, status, headers, config) {
	            	// Failure - do something
	        	});
			} 
		};

		$scope.checkin = function(ballnight){
			var date = ballnight.bball_date;
			isBallerInRoster(date).then(function(){
				showToast("You are on the roster already.");
			}).catch(function(){
				addBaller(date);
			});
		};

		$scope.checkout = function(date, event){
			// let date = ballnight.bball_date
			isBallerInRoster(date).then(function(){
				checkoutDialog(date, event);
			}).catch(function(error){
				console.log(error);
			});	
		};

		var checkoutDialog = function(date, event) {

			var removeDate = $filter('date')(date, "M/dd/yyyy");
			var confirm = $mdDialog.confirm()
				.title('Are you sure?')
				.textContent('You will be removed from the roster for ' + removeDate)
				.ariaLabel('TutorialsPoint.com')
				.targetEvent(event)
				.ok('Yes')
				.cancel('No');
			$mdDialog.show(confirm).then(function() {
				console.log('remove player');
				removeBaller(date);
			}, function() {
				$scope.status = 'You decided to keep your record.';
				console.log('did not remove player');
			});
		};

		$scope.waitlist = function(ballnight){
			var date = ballnight.bball_date;
			isBallerInRoster(date).then(function(){
				console.log('here');
				showToast("You can't waitlist because you are on the roster.");
			}).catch(function(){
				isBallerInWaitlist(date).then(function(){
					showToast("You are on the waitlist already.");
				}).catch(function(){
					addBallerToWaitlist(ballnight.bball_date);
				});
			});
		};

		$scope.removewaitlist = function(ballnight){
			var date = ballnight.bball_date;
			isBallerInWaitlist(date).then(function(){
				removeBallerFromWaitlist($rootScope.currentUser.$id, date);
			}).catch(function(error){
				console.log(error);
			});
		};

		var showToast = function(message) {
			$mdToast.show(
				$mdToast.simple()
					.textContent(message)
					.position('bottom center')
					.hideDelay(2000)
				);
		};

		var addBaller =  function(date) {
			// function should add baller to either roster or waitlist and to user myroster and mywaitlist
			// ref.child('roster').child(date).child($rootScope.currentUser.$id).set({
			// 	first_name: $rootScope.currentUser.first_name,
			// 	last_name: $rootScope.currentUser.last_name,
			// 	email: $rootScope.currentUser.email,
			// 	date: firebase.database.ServerValue.TIMESTAMP
			// });

			var userData = {
				first_name: $rootScope.currentUser.first_name,
				last_name: $rootScope.currentUser.last_name,
				email: $rootScope.currentUser.email,
				date: firebase.database.ServerValue.TIMESTAMP
			};
			
			ballnightsRef.child(date).child('counter').transaction(function(counter) {
				if(counter === 0 || counter < 16) {
					counter = counter + 1;
				}
				return counter;
			}).then(function(){
				rosterRef.child(date).child($rootScope.currentUser.$id).set(userData);
			}).then(function(){
				addToMyBballNights(date,$rootScope.currentUser.$id);
			}).then(function(){
				showToast('You have been added for this night!');
			}).then(function(){
				//sendText($rootScope.currentUser, date);
			});
		};

		var addToMyBballNights = function(date, key){
			userRef.child(key).child('mybballnights').child(date).set({
				date: date,
				value: true
			});
		};

		var removeBaller =  function(date) {
			console.log(date);
			var refDel = rosterRef.child(date).child($rootScope.currentUser.$id);
			var userDelRef = userRef.child($rootScope.currentUser.$id).child('mybballnights').child(date);
			$firebaseObject(refDel).$remove().then(function(){
				$firebaseObject(userDelRef).$remove();

				ballnightsRef.child(date).child('counter').transaction(function(counter) {
					if(counter > 0 && counter <= 16) {
						counter = counter - 1;
					}
					return counter;
				});
			}).then(function(){
				console.log('addwaitlisttoroster');
				addWaitlistToRoster(date);
			}).then(function(){
				showToast('You have been removed for this night!');
			}).catch(function(error){
				console.log(error);
			});
		};

		var addBallerToWaitlist = function(date) {
			var userData = {
				first_name: $rootScope.currentUser.first_name,
				last_name: $rootScope.currentUser.last_name,
				email: $rootScope.currentUser.email,
				date: firebase.database.ServerValue.TIMESTAMP
			};
			console.log('tring to add to roster');
			return new Promise(function(resolve,reject) {
				waitlistRef.child(date).child($rootScope.currentUser.$id).set(userData).then(function(){
					userRef.child($rootScope.currentUser.$id).child('mywaitlists').child(date).set({
						date: date,
						value: true
					});
					ballnightsRef.child(date).child('waitlistcounter').transaction(function(counter) {
						if(counter === 0 || counter < 16) {
							counter = counter + 1;
						}
						return counter;
					});
				}).then(function(){
					showToast('You are on the waitlist!');
				});
			});
		};

		var removeBallerFromWaitlist = function(id, date) {
			var waitDelRef = waitlistRef.child(date).child(id);
			var userDelRef = userRef.child(id).child('mywaitlists').child(date);
			return new Promise(function(resolve,reject){
				$firebaseObject(waitDelRef).$remove().then(function(){
					$firebaseObject(userDelRef).$remove();
					ballnightsRef.child(date).child('waitlistcounter').transaction(function(counter) {
						if(counter === 0 || counter < 16) {
							counter = counter - 1;
						}
						return counter;
					});
				}).then(function(){
					showToast('You have been removed from the waitlist!');
				});
			});
		};

		var isBallerInRoster = function(date) {
			return new Promise(function(resolve, reject) {
				//check if baller is in the roster or not
				rosterRef.child(date).child($rootScope.currentUser.$id).once('value').then(function(snapshot){
					var exists = (snapshot.val() !== null);
					console.log(exists);
					if(exists) {
						resolve('user is in the roster');
					} else {
						reject('user is not in the roster');
					}
					// if(exists){
					// 	resolve('user exists')
					// } else {
					// 	reject('user does not exist')
					// }
				});
			});
		};

		var isBallerInWaitlist = function(date) {
			return new Promise(function(resolve, reject) {
				waitlistRef.child(date).child($rootScope.currentUser.$id).once('value').then(function(snapshot){
					var exists = (snapshot.val() !== null);
					console.log(exists);
					if(exists) {
						resolve('user is in the waitlist');
					} else {
						reject('user is not in the waitlist');
					}
				});
			});
		};

		var addWaitlistToRoster = function(date) {
			// checkRosterCount(date).then(function(){
			// 	console.log('check waitlist count first')
			// 	checkWaitlistCount(date)
			// }).then(function(){
			// 	console.log('there is waitlist')
			// 	addWaitlistBallertoRoster(date)
			// }).catch(function(){
			// 	console.log('waitlist is empty')
			// })

			checkRosterCount(date).then(function(){
				console.log('check waitlist count first');
				checkWaitlistCount(date).then(function(){
					addWaitlistBallertoRoster(date);
				}).then(function(){
					console.log('send TEXT message here');
				}).catch(function(){
					console.log('waitlist is empty');
				});
			}).catch(function(error){
				console.log(error);
			});
		};

		var addWaitlistBallertoRoster = function(date){
			// to do : need to add ballnight to user.mybballnights
			console.log('will add waitlist to roster');
			var key;
			waitlistRef.child(date).orderByChild('date').limitToFirst(1).on('child_added', function(snapshot){
				key = snapshot.getKey();
				// console.log(key)
			});
			// copies waitlist to roster, then deletes waitlist node
			console.log(key);
			var waitlistPlayerRef = userRef.child(key);
			var waitlistPlayer = $firebaseObject(waitlistPlayerRef);

			waitlistRef.child(date).child(key).once('value', function(snap){
				rosterRef.child(date).child(key).set(snap.val(), function(error){
					if(!error){
						waitlistPlayerRef.update({
							date: firebase.database.ServerValue.TIMESTAMP
						}).then(function(){
							sendText(waitlistPlayer, date);
						}).then(function(){
							ballnightsRef.child(date).child('counter').transaction(function(counter) {
								if(counter === 0 || counter < 16) {
									counter = counter + 1;
								}
								return counter;	
							});
						}).then(function(){
							addToMyBballNights(date,key);
						}).then(function(){
							removeBallerFromWaitlist(key, date);
						}).catch(function(error){
							console.log(error);
						});
					} else if(typeof(console) !== 'undefined' && console.error){
						console.error(error); 
					}
				});
			});

		};

		var checkRosterCount = function(date) {
			return new Promise(function(resolve,reject) {
				ballnightsRef.child(date).once('value', function(snapshot){
					var value = snapshot.val();
					if (value.counter == 15) {
						resolve('roster is 15, can add to it');
					} else {
						reject('roster not at 15 - reject');
					}
				});
			});
		};

		var checkWaitlistCount = function(date) {
			return new Promise(function(resolve,reject) {
				ballnightsRef.child(date).once('value', function(snapshot){
					var value = snapshot.val();
					// console.log(snapshot.val())
					if (value.waitlistcounter > 0) {
						resolve('can add waitlist to roster');
					} else {
						reject('cannot add waitlist to roster');
					}
				});
			});
		};

		var showConfirm = function(event) {
			var confirm = $mdDialog.confirm()
				.title('Are you sure to delete the record?')
				.textContent('Record will be deleted permanently.')
				.ariaLabel('TutorialsPoint.com')
				.targetEvent(event)
				.ok('Yes')
				.cancel('No');
			$mdDialog.show(confirm).then(function() {
				$scope.status = 'Record deleted successfully!';
			}, function() {
				$scope.status = 'You decided to keep your record.';
			});
		};

}]);

})();
