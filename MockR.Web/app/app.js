var MockR = angular.module('mockr', ['ui.bootstrap', 'ngRoute', 'mockrControllers', 'luegg.directives']);

MockR.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'app/templates/index.html',
			controller: 'homeCtrl'
		}).
		when('/sim', {
			templateUrl: 'app/templates/sim.html',
			controller: 'simCtrl'
		}).
		otherwise({
			redirectTo: '/sim'
	});
}]);