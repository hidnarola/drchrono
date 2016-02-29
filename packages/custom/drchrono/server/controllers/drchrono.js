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
	var client_id = process.env.client_id;
	var client_secret = process.env.client_secret;
	var redirect_uri = process.env.redirect_uri;
	var refresh_token = process.env.refresh_token;

module.exports = function(Drchrono) {
	return {
		get_all_doctors: function(req, res) {
			Doctor_patientm.update({ patient_id: '58524919' },{doctor_id: '94764'}).exec(function(err, posts) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the articles'
                    });
                }
                res.json(posts);
            });
            return false;
			/*var doctors = [
				{'doctor_id':'94025'},
				{'doctor_id':'94764'}
			];
			for(var i in doctors){
				var doctor = new Doctorm({
					doctor_id : doctors[i].doctor_id,
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
			var patients = [
				{'patient_id': '58524917'},
				{'patient_id': '58524918'},
				{'patient_id': '58524919'}
			];
			for(var i in patients){
				var patient = new Patientm({
					patient_id : patients[i].patient_id
				});

				patient.save(function(err) {
					if (err) {
						return res.status(500).json({
							error: 'Cannot save the post'
						});
					}
					res.json(patient);
				});
			}
			var doctor_patients = [
				{'doctor_id':'94025', 'patient_id': '58524917'},
				{'doctor_id':'94025', 'patient_id': '58524918'},
				{'doctor_id':'94025', 'patient_id': '58524919'},
				{'doctor_id':'94764', 'patient_id': '58524917'}
			];
			for(var i in doctor_patients){
				var doctor = new Doctor_patientm({
					doctor_id : doctor_patients[i].doctor_id,
					patient_id : doctor_patients[i].patient_id
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
	        		"Authorization" : "Bearer " + req.cookies.token,
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
		        			return_json = results[i];
		        		}
		        	}
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
		get_access_token_refresh: function(req, res) {
			console.log('here');
			request({
		        method: 'POST',
		        url: 'https://drchrono.com/o/token/',
	        	json: true,
	        	formData : {
	        		'grant_type' : 'refresh_token',
	        		'client_id' : client_id,
	        		'client_secret' : client_secret,
	        		'refresh_token' : refresh_token,
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
		get_access_url: function(req, res) {
			var url = 'https://drchrono.com/o/authorize/?redirect_uri=' + redirect_uri + '&response_type=code&client_id=' + client_id;
			res.json(url);
		},
	};
}