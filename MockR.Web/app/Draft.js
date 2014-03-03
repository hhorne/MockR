function Draft(teams, picks, prospects) {
	this.teams = teams;
	this.picks = picks;
	this.prospects = prospects;
	this.prospects.sort = new ProspectSort('ranking');
	this.prospects.filter = new ProspectFilter('overall');
	this.drafted = [];
	this.drafted.sort = new ProspectSort('overall');
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
	selectProspect: function(prospect) {
		var currentPick = this.picks[0];
		prospect.selection = currentPick;

		var prospectIndex = prospects.indexOf(prospect);
		prospects.splice(prospectIndex, 1);
		drafted.push(prospect);
		picks.splice(0, 1);
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
};