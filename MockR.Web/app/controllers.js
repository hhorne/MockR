var positions = null; // global, not specific to any one draft; seems to fit logically

function homeCtrl($scope) { }

function simCtrl($scope, $http, $interval) {
	$http.get('/mockr/app/data/2014.json').success(function (data) {
		positions = data.positions;
		$scope.draft = {
			teams: data.teams,
			picks: data.picks,
			prospects: data.prospects,
			drafted: []
		};

		$scope.sim = new Simulation($scope, $interval);
	});

	$scope.selectTeamText = 'Click Here To Select Team';
	$scope.selectTeam = function (team) {
		$scope.sim.selectTeam(team);
		$scope.selectTeamText = '';
	};

	$scope.toggleDraft = function () {
		$scope.sim.toggle();
	};

	$scope.roundIndicator = function (round) {
		if ($scope.sim.round === round) {
			return 'active reached';
		}

		if ($scope.sim.round > round) {
			return 'reached';
		}

		return undefined;
	};

	$scope.filterByRound = function(round) {
		$scope.draft.drafted.filter.set(round);
	};
}

function Simulation($scope, $interval) {
	$scope.draft.prospects.orderBy = new OrderBy('ranking');
	$scope.draft.prospects.filter = new Filter('');
	$scope.sim = this;
	$scope.sim.round = 1;
	$scope.sim.position = 1;
	$scope.sim.overall = 1;
	$scope.sim.started = false;
	$scope.sim.inProgress = false;
	$scope.draft.drafted = [];
	$scope.draft.drafted.filter = new Filter('round');

	this.selectTeam = function(team) {
		$scope.sim.userTeam = _.find($scope.draft.teams, function (t) {
			return t.shortName === team;
		});
	};

	this.draftPlayer = function(player) {
		var playerIndex = $scope.draft.prospects.indexOf(player);
		$scope.draft.drafted.push(player);
		$scope.draft.prospects.splice(playerIndex, 1);
		$scope.draft.picks.splice(0, 1);

		$scope.sim.overall++;
		$scope.sim.position++;
		if ($scope.sim.position > 32) {
			$scope.sim.position = 1;
			$scope.sim.round++;
		}
	};

	this.draftLoop = function () {
		var team = _.findWhere($scope.draft.teams, { shortName: $scope.draft.picks[0].team.shortName });
		var draftingTeam = new DraftingTeam(team);
		var selectedPlayer = draftingTeam.selectPlayer($scope.draft.prospects);

		var needIndex = -1;

		for (var i in team.needs) {
			if (team.needs[i].shortName === selectedPlayer.position.shortName) {
				needIndex = i;
				break;
			}
		}

		team.needs.splice(needIndex, 1);

		selectedPlayer.team = $scope.draft.picks[0].team;
		selectedPlayer.overall = $scope.sim.overall;
		selectedPlayer.round = $scope.sim.round;
		selectedPlayer.pick = $scope.sim.position;

		$scope.sim.draftPlayer(selectedPlayer);
	};

	var loopPromise = null;
	this.toggle = function () {
		if (this.inProgress) {
			this.inProgress = false;
			$interval.cancel(loopPromise);
		} else {
			if (this.started === false) {
				this.started = true;
			}

			this.inProgress = true;
			loopPromise = $interval(this.draftLoop, 1000);
		}
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