function Draft(teams, picks, prospects) {
	this.teams = teams;
	this.picks = picks;
	this.prospects = prospects;
	this.prospects.sort = new ProspectSort('ranking');
	this.prospects.filter = new ProspectFilter();
	this.drafted = [];
	this.drafted.sort = new ProspectSort('selection.overall');
	this.drafted.filter = new ProspectFilter();
	this.drafted.filter.set('selection.round', 1);
	this.started = false;
	this.inProgress = false;
	this.userTeam = null;
}

Draft.prototype = {
	getTeamNeeds: function(teamShortName) {
		return _.find(this.teams, function(team) {
			return team.shortName === teamShortName;
		});
	},
	isUserOnTheClock: function() {
		if (this.started) {
			if (this.userTeam === null) {
				return false;
			}

			return this.picks[0].team.shortName === this.userTeam.shortName;
		}

		return false;
	},
	selectTeam: function(team) {
		this.userTeam = team;
	},
	selectProspect: function(prospect) {
		var currentPick = this.picks[0];
		prospect.selection = currentPick;

		var prospectIndex = this.prospects.indexOf(prospect);
		this.prospects.splice(prospectIndex, 1);
		this.drafted.push(prospect);
		this.picks.splice(0, 1);
		if (this.picks[0].round != currentPick.round) {
			this.drafted.filter.set('selection.round', this.picks[0].round);
		}
	},
	start: function() {
		if (this.started === false) {
			this.started = true;
		}

		this.inProgress = true;
	},
	stop: function() {
		this.inProgress = false;
	},
	toggle: function() {
		if (this.inProgress) {
			this.stop();
		} else {
			this.start();
		}
	}
};