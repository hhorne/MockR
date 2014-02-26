function homeCtrl($scope) {
}

function simCtrl($scope, $http, $interval) {
	$http.get('/mockr/app/data/2014.json').success(function (data) {
		$scope.drafted = [];

		$scope.draft = data;
		$scope.picks = data.picks;
		$scope.teams = data.teams;
		$scope.positions = data.positions;
		$scope.prospects = data.prospects;

		$scope.prospects.orderBy = new OrderBy('ranking');
		$scope.prospects.filter = new Filter('');
	});
}

function OrderBy(field) {
	if (field === undefined) {
		field = '';
	}

	var orderField = field;
	var reverse = false;

	this.set = function (field) {
		if (orderField === field) {
			reverse = !reverse;
			return;
		}

		orderField = field;
		reverse = false;
	};

	this.getField = function() {
		return orderField;
	};

	this.isReversed = function() {
		return reverse;
	};
}

function Filter(initialField) {
	var filterField;
	if (initialField === undefined) {
		initialField = '';
	}

	filterField = initialField;

	this.match = function (player) {
		if (filterField === '') {
			return true;
		}

		var position = player.position.shortName;
		return position === filterField;
	};

	this.set = function(field) {
		if (filterField === field) {
			filterField = '';
			return;
		}

		filterField = field;
	};

	this.style = function(field) {
		if (filterField === field) {
			return 'selected';
		}

		return undefined;
	};
}

var MockRControllers = angular.module('mockrControllers', ['ngAnimate']);
MockRControllers.controller('homeCtrl', ['$scope', homeCtrl]);
MockRControllers.controller('simCtrl', ['$scope', '$http', '$interval', simCtrl]);