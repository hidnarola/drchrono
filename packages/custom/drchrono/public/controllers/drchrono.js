'use strict';

/* jshint -W098 */
angular.module('mean.drchrono').controller('DrchronoController', ['$scope', '$stateParams','Global', 'Drchrono', '$http', '$location','$cookies',
	function($scope, $stateParams, Global, Drchrono, $http, $location, $cookies) {
	    $scope.global = Global;
	    $scope.package = {
	      name: 'drchrono'
	    };

		$scope.get_code = function(){
			var client_id = '6jmNpGa4k2vJ9vyqX0dE2W1n2qhk1DbmSGdEi5mv';
			var redirect_uri = 'http://54.165.114.126/callback1';
			var url = 'https://drchrono.com/o/authorize/?redirect_uri=' + redirect_uri + '&response_type=code&client_id=' + client_id;
			$scope.url = url;
	    };

	    $scope.get_access_token = function(){
	    	var code = $location.search().code;
	    	$http.get('/api/drchrono/get_access_token/' + code).success(function(response) {
	    		if( response.hasOwnProperty('access_token') ){
					var access_token = response.access_token;
					$cookies.put('token', access_token);
	    			$scope.wait_line = 'You will redirect to main site soon. Please wait for a while.';
					$location.url('/');
	    		} else {
	    			$scope.wait_line = 'Sorry!! Your code is expired. Please try again.';
	    		}
			}).error(function(data) {
				// console.log(data);
			});
	    };

	    $scope.get_all_doctors = function(){
	    	if( typeof($cookies.get('token')) != 'undefined' ){
			 	var api_request = new XMLHttpRequest();
			 	var db_request = new XMLHttpRequest();
				api_request.open("GET", '/api/drchrono/get_all_doctors', false);
				api_request.send();
			 	var doctors = '';
				if( api_request.status == 200 ){
					doctors = JSON.parse(api_request.response);
					doctors = doctors.results;
				}
				db_request.open("GET", '/api/drchrono/get_all_dbdoctors', false);
				db_request.send();
			 	var db_doctors = '';
				if( db_request.status == 200 ){
					db_doctors = JSON.parse(db_request.response);
				}
				var doctor_list = [];
				for (var i in db_doctors) {
					for (var j in doctors) {
						if( doctors[j].id == db_doctors[i].doctor_id ){
							doctor_list.push(doctors[j]);
						}
					}
				}
				$scope.doctors = doctor_list;
	    	} else {
				$location.path('get_code');
	    	}
	    };

	    $scope.get_patient_list = function(doctor){
			if(doctor){
				var id = doctor.id;
				$location.path('patient_list/' + id);
			}
	    };

	    $scope.get_all_patients = function(){
	    	var id = $stateParams.doctorId;
	    	var api_request = new XMLHttpRequest();
		 	var db_request = new XMLHttpRequest();

		 	api_request.open("GET", '/api/drchrono/get_all_patients/' + id, false);
			api_request.send();
		 	var patients = '';
			if( api_request.status == 200 ){
				patients = JSON.parse(api_request.response);
				patients = patients.results;
			}

			db_request.open("GET", '/api/drchrono/get_all_dbpatients/' + id, false);
			db_request.send();
		 	var db_patients = '';
			if( db_request.status == 200 ){
				db_patients = JSON.parse(db_request.response);
			}
			var patient_list = [];
			for (var i in db_patients) {
				for (var j in patients) {
					if( patients[j].id == db_patients[i].patient_id ){
						patient_list.push(patients[j]);
					}
				}
			}
			$scope.patients = patient_list;
	    };

	    $scope.get_patient_detail = function(patient){
			if(patient){
				var ids = patient.ids;
				var ids = ids.split('|');
				var doctorId = ids[0];
				var patientId = ids[1];
				$location.path('patient/' + doctorId + '/' + patientId);
			}
	    };

	    $scope.patient_detail = function(){
	    	var doctorId = $stateParams.doctorId;
	    	var patientId = $stateParams.patientId;
	    	$scope.doctorId = doctorId;
	    	$http.get('/api/drchrono/patient_detail/' + doctorId + '/' + patientId).success(function(response) {
				$scope.patient = response;
			}).error(function(data) {
				// console.log(data);
			});
	    };

	    $scope.return_patient_list = function(doctorId){
	    	$location.path('patient_list/' + doctorId);
	    };

	    $scope.return_doctor = function(doctorId){
	    	$location.path('/');
	    };
	}
]);
