function homeCtrl($scope) {
}

function simCtrl($scope, $http, $interval) {
	$http.get('/mockr/app/data/2014.json').success(function (data) {
		$scope.sim = new Simulation({
			picks: data.picks,
			teams: data.teams,
			prospects: data.prospects
		}, $interval);
	});

	$scope.selectTeamText = 'Click Here To Select Team';
	$scope.selectTeam = function (team) {
		$scope.sim.selectTeam(team);
		$scope.selectTeamText = ''; 
	};
}

function Simulation(draft, $interval) {
	this.drafted = [];
	this.picks = draft.picks;
	this.teams = draft.teams;
	this.prospects = draft.prospects;
	this.prospects.orderBy = new OrderBy('ranking');
	this.prospects.filter = new Filter('');
	this.userTeam = null;

	this.selectTeam = function(team) {
		this.userTeam = _.find(this.teams, function(t) {
			return t.shortName === team;
		});
	};


};

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

	this.getField = function () {
		return orderField;
	};

	this.isReversed = function () {
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

	this.set = function (field) {
		if (filterField === field) {
			filterField = '';
			return;
		}

		filterField = field;
	};

	this.style = function (field) {
		if (filterField === field) {
			return 'selected';
		}

		return undefined;
	};
}

var MockRControllers = angular.module('mockrControllers', ['ngAnimate']);
MockRControllers.controller('homeCtrl', ['$scope', homeCtrl]);
MockRControllers.controller('simCtrl', ['$scope', '$http', '$interval', simCtrl]);