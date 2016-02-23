'use strict';

/**
* Module dependencies.
*/
var mongoose = require('mongoose'),
	// Postm = mongoose.model('Post'),
	Doctorm = mongoose.model('Doctor'),
	Patientm = mongoose.model('Patient'),
	Doctor_patientm = mongoose.model('Doctor_patient'),
	async = require('async'),
	request = require('request'),
	config = require('meanio').loadConfig(),
	_ = require('lodash');

	var session = require('express-session');
	var client_id = '6jmNpGa4k2vJ9vyqX0dE2W1n2qhk1DbmSGdEi5mv';
	var client_secret = 'SzHkA6VpMiRpuaXyvsxfcboYFxIMqBLBxvfksLgK7mJ10k8ugA5gonWHphT3Q6khN5UyBzoRqbm5R9IJUXKsYfl2f9iOXiX7oxZvF6uDzrou0P04oC7vXcKDwU6HYxBX';
	var authorization_key = 'Ka6V4FDDwwaAPCf4r23ymTvy3wa6Le';
	var redirect_uri = 'http://54.165.114.126/callback1';

module.exports = function(Drchrono) {
	return {
		get_all_doctors: function(req, res) {
			/*var patients = [
				{'doctor_id':'94025', 'patient_id': '58524917'},
				{'doctor_id':'94025', 'patient_id': '58524918'},
				{'doctor_id':'94025', 'patient_id': '58524919'},
				{'doctor_id':'94764', 'patient_id': '58524917'}
			];
			for(var i in patients){
				var doctor = new Doctor_patientm({
					doctor_id : patients[i].doctor_id,
					patient_id : patients[i].patient_id
				});

	            doctor.save(function(err) {
	                if (err) {
	                    return res.status(500).json({
	                        error: 'Cannot save the post'
	                    });
	                }
	                res.json(doctor);
	            });
			}
            return false;*/
            console.log(req);
			request({
		        method: 'GET',
		        url: 'https://drchrono.com/api/doctors',
		        headers: {
	        		"Authorization" : "Bearer " + req.cookies.token,
	        		"Content-Type" : "application/json"
	        	},
	        	json: true,
		    }, function(err, response, body) {
		        if(err) {
		            res.json(err);
		        } else {
		            res.json(body);
		        }
		    });
		},
		get_all_dbdoctors: function(req, res) {
			Doctorm.find().exec(function(err, doctors) {
	            if (err) {
	                return res.status(500).json({
	                    error: 'Cannot list the doctors'
	                });
	            }
	            res.json(doctors);
	        });
		},
		get_all_patients: function(req, res) {
			var doctorId = req.params.doctorId;
			request({
		        method: 'GET',
		        url: 'https://drchrono.com/api/patients',
		        // url: 'https://drchrono.com/api/patients?doctor=' + doctorId,
		        headers: {
	        		"Authorization" : "Bearer " + authorization_key,
	        		"Content-Type" : "application/json"
	        	},
	        	json: true,
		    }, function(err, response, body) {
		        if(err) {
		            res.json(err);
		        } else {
		            res.json(body);
		        }
		    });
		},
		get_all_dbpatients: function(req, res) {
			var doctorId = req.params.doctorId;
			Doctor_patientm.find({'doctor_id': doctorId}).exec(function(err, patients) {
	            if (err) {
	                return res.status(500).json({
	                    error: 'Cannot list the doctors'
	                });
	            }
	            res.json(patients);
	        });
		},
		patient_detail: function(req, res) {
			var doctorId = req.params.doctorId;
			var patientId = req.params.patientId;
			request({
		        method: 'GET',
		        url: 'https://drchrono.com/api/patients?doctor=' + doctorId,
		        headers: {
	        		"Authorization" : "Bearer " + authorization_key,
	        		"Content-Type" : "application/json"
	        	},
	        	json: true,
		    }, function(err, response, body) {
		        if(err) {
		            res.json(err);
		        } else {
		        	var results = body.results;
		        	var return_json = [];
		        	for(var i in results){
		        		if( results[i].id == patientId ){
		        			console.log(patientId);
		        			return_json = results[i];
		        		}
		        	}
		        	console.log(return_json);
        			res.json(return_json);
		        }
		    });
		},
		get_access_token: function(req, res) {
			var code = req.params.code;
			request({
		        method: 'POST',
		        url: 'https://drchrono.com/o/token/',
	        	json: true,
	        	formData : {
	        		'grant_type' : 'authorization_code',
	        		'client_id' : client_id,
	        		'client_secret' : client_secret,
	        		'redirect_uri' : redirect_uri,
	        		'code' : code
	        	}
		    }, function(err, response, body) {
		        if(err) {
		            res.json(err);
		        } else {
		        	//req.session.token = body.access_token;
        			res.json(body);
		        }
		    });
		},
	};
}