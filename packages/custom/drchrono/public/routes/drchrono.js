'use strict';

angular.module('mean.drchrono').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('drchrono example page', {
      url: '/drchrono/example',
      templateUrl: 'drchrono/views/index.html'
    });
    $stateProvider.state('drchrono callback', {
      url: '/callback?:code',
      templateUrl: 'drchrono/views/callback.html',
    });
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'drchrono/views/index.html'
    });
    $stateProvider.state('patient_list', {
      url: '/patient_list/:doctorId',
      templateUrl: 'drchrono/views/patient_list.html'
    });
    $stateProvider.state('patient_detail', {
      url: '/patient/:doctorId/:patientId',
      templateUrl: 'drchrono/views/patient_detail.html'
    });
    $stateProvider.state('get_code', {
      url: '/get_code',
      templateUrl: 'drchrono/views/get_code.html'
    });
  }
]);
