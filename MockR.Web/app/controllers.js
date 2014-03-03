var positions = null; // global, not specific to any one draft; seems to fit logically

function homeCtrl($scope) { }

function simCtrl($scope, $http, $interval) {
	$http.get('app/data/2014.json').success(function (data) {
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

	$scope.disableToggle = function () {
		if ($scope.sim != null) {
			if ($scope.sim.userOnTheClock() ||
				$scope.sim.userTeam === null ||
				($scope.sim.round === 7 && $scope.sim.position === 32))
				return true;
		}
		return false;
	};

	$scope.toggleText = function () {
		if ($scope.sim != null || $scope.sim != undefined) {
			if (!$scope.sim.inProgress || !$scope.sim.started) {
				return 'Start Draft';
			}
		}

		return 'Pause Draft';
	};

	$scope.roundIndicator = function (round) {
		if ($scope.sim === null || $scope.sim === undefined) {
			return undefined;
		}

		var styles = [];

		if ($scope.sim.round === round) {
			styles.push('current');
		}

		if ($scope.sim.round >= round) {
			styles.push('reached');
		}

		if ($scope.draft.drafted.filter.round === round) {
			styles.push('active');
		}

		if (styles.length) {
			return styles.join(' ');
		}

		return undefined;
	};

	$scope.filterByRound = function (round) {
		if ($scope.sim.round < round) {
			return;
		}

		$scope.draft.drafted.filter.round = round;
	};

	$scope.userPick = function (player) {
		if ($scope.sim.userOnTheClock()) {
			$scope.sim.draftPlayer(player);
			$scope.sim.start();
		}
	};

	$scope.getUndraftedSortStyle = function (field) {
		if ($scope.draft != null) {
			if ($scope.draft.prospects.orderBy.getField() === field) {
				if ($scope.draft.prospects.orderBy.isReversed()) {
					return 'sort dsc';
				}

				return 'sort asc';
			}
		}
		return undefined;
	};

	$scope.getUndraftedRowStyle = function() {
		if ($scope.sim != null) {
			if ($scope.sim.userTeam != null && $scope.sim.userOnTheClock()) {
				return 'userPicking';
			}
		}
		return undefined;
	};

	$scope.getDraftedSortStyle = function (field) {
		if ($scope.draft != null) {
			if ($scope.draft.drafted.orderBy.getField() === field) {
				if ($scope.draft.drafted.orderBy.isReversed()) {
					return 'sort dsc';
				}

				return 'sort asc';
			}
		}

		return undefined;
	};
}

function Simulation($scope, $interval) {
	$scope.draft.prospects.orderBy = new OrderBy('ranking');
	$scope.draft.prospects.filter = new Filter('');
	$scope.draft.drafted = [];
	$scope.draft.drafted.filter = { round: 1 };
	$scope.draft.drafted.orderBy = new OrderBy('overall');
	$scope.sim = this;
	$scope.sim.round = 1;
	$scope.sim.position = 1;
	$scope.sim.overall = 1;
	$scope.sim.started = false;
	$scope.sim.inProgress = false;

	this.selectTeam = function(team) {
		$scope.sim.userTeam = _.find($scope.draft.teams, function (t) {
			return t.shortName === team;
		});
	};

	this.draftPlayer = function (player) {
		player.team = $scope.draft.picks[0].team;
		player.overall = this.overall;
		player.round = this.round;
		player.pick = this.position;

		var playerIndex = $scope.draft.prospects.indexOf(player);
		$scope.draft.drafted.push(player);
		$scope.draft.prospects.splice(playerIndex, 1);
		$scope.draft.picks.splice(0, 1);

		var needIndex = -1;
		var team = _.findWhere($scope.draft.teams, { shortName: $scope.draft.picks[0].team.shortName });
		for (var i in team.needs) {
			if (team.needs[i].shortName === player.position.shortName) {
				needIndex = i;
				break;
			}
		}

		team.needs.splice(needIndex, 1);

		this.overall++;
		this.position++;
		if (this.position > 32) {
			if (this.round === 7) {
				this.stop();
				this.position = 32;
			} else {
				this.round++;
				this.position = 1;
				$scope.draft.drafted.filter.round = this.round;
				
			}
		}
	};

	this.userOnTheClock = function () {
		if (this.started) {
			if (this.userTeam === null) {
				return false;
			}

			return $scope.draft.picks[0].team.shortName === this.userTeam.shortName;
		}

		return false;
	};

	this.draftLoop = function () {
		if ($scope.sim.userOnTheClock()) {
			$scope.sim.stop();
			return;
		}

		var draftingTeam = new DraftingTeam($scope.draft.picks[0].team);
		var selectedPlayer = draftingTeam.selectPlayer($scope.draft.prospects);

		$scope.sim.draftPlayer(selectedPlayer);
	};

	this.start = function () {
		if (this.started === false) {
			this.started = true;
		}

		this.inProgress = true;
		loopPromise = $interval(this.draftLoop, 1000);
	};

	this.stop = function () {
		this.inProgress = false;
		$interval.cancel(loopPromise);
	};

	var loopPromise = null;
	this.toggle = function () {
		if (this.inProgress) {
			this.stop();
		} else {
			this.start();
		}
	};
};

Simulation.prototype.userTeam = {};

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