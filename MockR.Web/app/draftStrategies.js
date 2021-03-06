﻿function DraftStrategy() { }

DraftStrategy.prototype.selectPlayer = function (team, players) {
	return null;
};

BestPlayerAvailable.prototype = new DraftStrategy();

function BestPlayerAvailable() {
	DraftStrategy.apply(this, arguments);
};

BestPlayerAvailable.prototype.selectPlayer = function (team, players) {
	var needs = _.pluck(team.needs, 'shortName');
	var positionPlayers = _.filter(players, function(player) {
		return _.contains(needs, player.position.shortName);
	});
	var position = {};

	var topPlayer = _.min(positionPlayers, function (player) {
		position = _.find(positions, function(p) {
			return p.shortName === player.position.shortName;
		});

		var positionAdjustedValue = Math.max(0, player.ranking - position.importance);
		
		if (positionAdjustedValue === 0) {
			positionAdjustedValue += (5 - position.importance);
		}

		return positionAdjustedValue;
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