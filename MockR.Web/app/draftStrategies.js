function DraftStrategy() { }

DraftStrategy.prototype.selectPlayer = function (team, players) {
	return null;
};

BestPlayerAvailable.prototype = new DraftStrategy();

function BestPlayerAvailable() {
	DraftStrategy.apply(this, arguments);
};

BestPlayerAvailable.prototype.selectPlayer = function (team, players) {
	var topPlayer = _.min(players, function (player) {
		return player.ranking;
	});

	return topPlayer;
};

PositionOfNeed.prototype = new DraftStrategy();

function PositionOfNeed() {
	DraftStrategy.apply(this, arguments);
}

PositionOfNeed.prototype.selectPlayer = function (team, players) {
	var topNeed = _.max(team.needs, function(need) {
		return need.importance;
	});

	var playersAtPosition = _.filter(players, function (player) {
		if (player.position === undefined) {
			throw 'position undefined ' + player.firstName + ' ' + player.lastName;
		}

		if (player.position.shortName === undefined) {
			throw 'position.shortName undefined ' + player.firstName + ' ' + player.lastName;
		}

		return player.position.shortName === topNeed.shortName;
	});

	var highestRated = _.min(playersAtPosition, function(player) {
		return player.ranking;
	});

	return highestRated;
};

function DraftingTeam(team) {
	for (var prop in team) {
		this[prop] = team[prop];
	}

	this.strategy = loadTeamStrategy(team);
}

DraftingTeam.prototype.selectPlayer = function (players) {
	if (this.strategy) {
		return this.strategy.selectPlayer(this, players);
	} else {
		return null;
	}
};

function loadTeamStrategy(team) {
	return new window[team.strategy]();
}