function Simulation($scope, $interval) {
	$scope.draft.prospects.sort = new ProspectSort('ranking');
	$scope.draft.prospects.filter = new ProspectFilter();
	$scope.draft.drafted = [];
	$scope.draft.drafted.filter = { round: 1 };
	$scope.draft.drafted.sort = new ProspectSort('overall');
	$scope.sim = this;
	$scope.sim.round = 1;
	$scope.sim.position = 1;
	$scope.sim.overall = 1;
	$scope.sim.started = false;
	$scope.sim.inProgress = false;

	this.selectTeam = function (team) {
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