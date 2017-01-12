'use strict'

app.factory('PlayersList', ['$rootScope', '$firebaseArray', '$firebaseObject',
	function($rootScope, $firebaseArray, $firebaseObject){

		var service = {};
		service.data = false;
		service.sendData = function(data){
			// console.log(data)
			this.data = data;
			$rootScope.$broadcast('data_shared');
		};
		service.getData = function(){
			return this.data;
		};
		return service;

}])