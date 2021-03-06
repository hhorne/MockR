﻿var MockR = angular.module('mockr', ['ui.bootstrap', 'ngRoute', 'mockrControllers', 'luegg.directives']);

MockR.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'app/templates/sim.html',
			controller: 'SimController'
		}).
		otherwise({
			redirectTo: '/'
	});
}]);

function getDescendantProp(obj, desc) {
	var arr = desc.split(".");
	while (arr.length && (obj = obj[arr.shift()]));
	return obj;
}