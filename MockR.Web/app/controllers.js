var positions = null; // global, not specific to any one draft; seems to fit logically

function HomeController($scope) { }

function SimController($scope, $http, $interval) {
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
			if ($scope.draft.prospects.sort.field === field) {
				if ($scope.draft.prospects.sort.reversed) {
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
			if ($scope.draft.drafted.sort.field === field) {
				if ($scope.draft.drafted.sort.reverse) {
					return 'sort dsc';
				}

				return 'sort asc';
			}
		}

		return undefined;
	};

	$scope.prospectFilter = function(prospect) {
		if ($scope.draft != null) {
			return $scope.draft.prospects.filter.match(prospect);
		}

		return false;
	};
}

var MockRControllers = angular.module('mockrControllers', ['ngAnimate']);
MockRControllers.controller('HomeController', ['$scope', HomeController]);
MockRControllers.controller('SimController', ['$scope', '$http', '$interval', SimController]);