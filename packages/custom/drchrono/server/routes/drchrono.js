'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Drchrono, app, auth, database) {
  var drchrono = require('../controllers/drchrono')(Drchrono);

  app.route('/api/drchrono/get_all_doctors')
    .get(drchrono.get_all_doctors);
  app.route('/api/drchrono/get_all_dbdoctors')
    .get(drchrono.get_all_dbdoctors);
  app.route('/api/drchrono/get_access_url')
    .get(drchrono.get_access_url);

  app.route('/api/drchrono/get_all_patients/:doctorId')
    .get(drchrono.get_all_patients);
  app.route('/api/drchrono/get_all_dbpatients/:doctorId')
    .get(drchrono.get_all_dbpatients);

  app.route('/api/drchrono/patient_detail/:doctorId/:patientId')
    .get(drchrono.patient_detail);

  app.route('/api/drchrono/get_access_token/:code')
    .get(drchrono.get_access_token);

  app.get('/api/drchrono/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/api/drchrono/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/api/drchrono/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/api/drchrono/example/render', function(req, res, next) {
    Drchrono.render('index', {
      package: 'drchrono'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
