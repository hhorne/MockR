var MockR = angular.module('mockr', ['ngRoute', 'mockrControllers']);

MockR.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.when('/', {
				templateUrl: 'app/templates/index.html',
				controller: 'homeCtrl'
			}).
			otherwise({
				redirectTo: '/'
		});
	}]);