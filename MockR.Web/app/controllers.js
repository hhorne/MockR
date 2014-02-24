function homeCtrl($scope) {
}

function simCtrl($scope, $http, $interval) {
	$scope.message = 'fupa';
	$http.get('/app/data/2014.json').success(function (data) {
		$scope.draft = data;
		$scope.picks = data.picks;
		$scope.teams = data.teams;
		$scope.positions = data.positions;
		$scope.prospects = data.prospects;
	});
}

var MockRControllers = angular.module('mockrControllers', ['ngAnimate']);
MockRControllers.controller('homeCtrl', ['$scope', homeCtrl]);
MockRControllers.controller('simCtrl', ['$scope', '$http', '$interval', simCtrl]);

function Foo() {
	var bar = function() {
		var i = 0;
	};
}