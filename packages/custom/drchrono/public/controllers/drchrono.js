'use strict';

/* jshint -W098 */
angular.module('mean.drchrono').controller('DrchronoController', ['$scope', '$stateParams','Global', 'Drchrono', '$http', '$location','$cookies',
	function($scope, $stateParams, Global, Drchrono, $http, $location, $cookies) {
	    $scope.global = Global;
	    $scope.package = {
	      name: 'drchrono'
	    };

	    $scope.is_token_exist = function(){
	    	if( typeof($cookies.get('token')) != 'undefined' ){
	    		return 1;
	    	} else {
	    		$.ajax({
	    			type: 'GET',
	    			url: '/api/drchrono/get_access_token_refresh',
	    			async: false,
	    			dataType: 'JSON',
	    			success: function(response){
		    			$cookies.put('token', response.access_token);
						return 1;
	    			}
	    		});
	    	}
	    };

	    $scope.get_all_doctors = function(){
		 	var is_token_exist = $scope.is_token_exist();
	    	if( is_token_exist ){
	    		$("#loader").toggle();
	    		var doctors = '';
	    		var db_doctors = '';
	    		$.ajax({
	    			type: 'GET',
	    			url: '/api/drchrono/get_all_doctors',
	    			async: false,
	    			dataType: 'JSON',
	    			success: function(response){
		    			doctors = response.results;
	    			}
	    		});
	    		$.ajax({
	    			type: 'GET',
	    			url: '/api/drchrono/get_all_dbdoctors',
	    			async: false,
	    			dataType: 'JSON',
	    			success: function(response){
	    				db_doctors = response;
	    			}
	    		});
				var doctor_list = [];
				for (var i in db_doctors) {
					for (var j in doctors) {
						if( doctors[j].id == db_doctors[i].doctor_id ){
							doctor_list.push(doctors[j]);
						}
					}
				}
				$("#loader").toggle();
				$scope.doctors = doctor_list;
	    	}
	    };

	    $scope.get_patient_list = function(doctor){
	    	var is_token_exist = $scope.is_token_exist();
	    	if( is_token_exist ){
				if(doctor){
					var id = doctor.id;
					$location.path('patient_list/' + id);
				}
			}
	    };

	    $scope.get_all_patients = function(){
	    	var is_token_exist = $scope.is_token_exist();
	    	if( is_token_exist ){
	    		$("#loader").toggle();
		    	var id = $stateParams.doctorId;
		    	var patients = '';
		    	var db_patients = '';
			 	$.ajax({
	    			type: 'GET',
	    			url: '/api/drchrono/get_all_patients/' + id,
	    			async: false,
	    			dataType: 'JSON',
	    			success: function(response){
		    			patients = response.results;
	    			}
	    		});
	    		$.ajax({
	    			type: 'GET',
	    			url: '/api/drchrono/get_all_dbpatients/' + id,
	    			async: false,
	    			dataType: 'JSON',
	    			success: function(response){
		    			db_patients = response;
	    			}
	    		});
				var patient_list = [];
				for (var i in db_patients) {
					for (var j in patients) {
						if( patients[j].id == db_patients[i].patient_id ){
							patient_list.push(patients[j]);
						}
					}
				}
				$("#loader").toggle();
				$scope.patients = patient_list;
			}
	    };

	    $scope.get_patient_detail = function(patient){
	    	var is_token_exist = $scope.is_token_exist();
	    	if( is_token_exist ){
				if(patient){
					var ids = patient.ids;
					var ids = ids.split('|');
					var doctorId = ids[0];
					var patientId = ids[1];
					$location.path('patient/' + doctorId + '/' + patientId);
				}
    		}
	    };

	    $scope.patient_detail = function(){
	    	var is_token_exist = $scope.is_token_exist();
	    	if( is_token_exist ){
	    		$("#loader").toggle();
		    	var doctorId = $stateParams.doctorId;
		    	var patientId = $stateParams.patientId;
		    	$scope.doctorId = doctorId;
		    	$http.get('/api/drchrono/patient_detail/' + doctorId + '/' + patientId).success(function(response) {
					$("#loader").toggle();
					$scope.patient = response;
				}).error(function(data) {
					$location.path('/');
				});
			}
	    };

	    $scope.return_patient_list = function(doctorId){
	    	var is_token_exist = $scope.is_token_exist();
	    	if( is_token_exist ){
	    		$location.path('patient_list/' + doctorId);
    		}
	    };

	    $scope.return_doctor = function(doctorId){
	    	var is_token_exist = $scope.is_token_exist();
	    	if( is_token_exist ){
	    		$location.path('/');
    		}
	    };
	}
]);
