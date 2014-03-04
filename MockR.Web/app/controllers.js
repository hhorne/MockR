var positions = null; // global, not specific to any one draft; seems to fit logically

function HomeController($scope) { }

function SimController($scope, $http, $interval) {	
	$http.get('app/data/2014.json').success(function (data) {
		positions = data.positions;
		$scope.draft = new Draft(data.teams, data.picks, data.prospects);
	});

	$scope.draftLoop = function () {
		if ($scope.draft.isUserOnTheClock() && $scope.draft.inProgress) {
			$scope.toggleDraft();
			return;
		}

		var draftingTeam = new DraftingTeam($scope.draft.picks[0].team);
		var selectedPlayer = draftingTeam.selectPlayer($scope.draft.prospects);

		$scope.draft.selectProspect(selectedPlayer);
	};

	$scope.isUserActive = function () {
		if ($scope.draft != null) {
			if ($scope.draft.userTeam != null && $scope.draft.isUserOnTheClock()) {
				return 'userPicking';
			}
		}
		return undefined;
	};
	
	$scope.UI = {
		drafted: {
			filter: function (prospect) {
				if ($scope.draft != null) {
					return $scope.draft.drafted.filter.match(prospect);
				}
				return false;
			},
			sort: {
				click: function (field) {
					if ($scope.draft != null) {
						$scope.draft.drafted.sort.set(field);
					}
				},
				style: function (field) {
					if ($scope.draft != null) {
						if ($scope.draft.drafted.sort.field === field) {
							if ($scope.draft.drafted.sort.reverse) {
								return 'sort dsc';
							}

							return 'sort asc';
						}
					}
					return undefined;
				}
			},
		},
		undrafted: {
			filter: function(prospect) {
				if ($scope.draft != null) {
					return $scope.draft.prospects.filter.match(prospect);
				}
				return false;
			},
			sort: {
				click: function (field) {
					if ($scope.draft != null) {
						$scope.draft.prospects.sort.set(field);
					}
				},
				style: function (field) {
					if ($scope.draft != null) {
						if ($scope.draft.prospects.sort.field === field) {
							if ($scope.draft.prospects.sort.reversed) {
								return 'sort dsc';
							}
							return 'sort asc';
						}
					}
					return undefined;
				},
			},
			prospects: {
				click: function (prospect) {
					if ($scope.draft.isUserOnTheClock()) {
						$scope.draft.selectProspect(prospect);
						$scope.toggleDraft();
					}
				},
				isUserActive: function () {
					return $scope.isUserActive();
				},
			}
		},
		positions: {
			filter: function (position) {
				$scope.draft.prospects.filter.set('position.shortName', position);
			},
			style: function (position) {
				if ($scope.draft !== undefined) {
					if ($scope.draft.prospects.filter.getFilter() === position) {
						return 'selected';
					}
				}
				return undefined;
			}
		},
		status: {
			isUserActive: function() {
				return $scope.isUserActive();
			},
			filterByRound: function (round) {
				if ($scope.draft.picks[0].round < round || $scope.draft.drafted.filter.getFilter() === round) {
					return;
				}

				$scope.draft.drafted.filter.set('selection.round', round);
			},
			roundIndicator: function (round) {
				if ($scope.draft === null || $scope.draft === undefined) {
					return undefined;
				}

				var styles = [];
				var currentPick = $scope.draft.picks[0];

				if (currentPick.round === round) {
					styles.push('current');
				} if (currentPick.round >= round) {
					styles.push('reached');
				} if ($scope.draft.drafted.filter['selection.round'] === round) {
					styles.push('active');
				} if (styles.length) {
					return styles.join(' ');
				}
				return undefined;
			},
		},
		teamSelect: {
			click: function(team) {
				$scope.draft.selectTeam(team);
				$scope.UI.teamSelect.text = '';
			},
			disabled: function() {
				return ($scope.draft === undefined || $scope.draft.started);
			},
			style: function() {
				if ($scope.draft !== undefined) {
					if ($scope.draft.userTeam !== null) {
						return $scope.draft.userTeam.shortName;
					}
				}
				return undefined;
			},
			text: 'Click Here To Select Team',
		},
		toggle: {
			click: function () {
				if ($scope.draft.inProgress) {
					$interval.cancel($scope.loopPromise);
				} else {
					$scope.loopPromise = $interval($scope.draftLoop, 1000);
				}

				$scope.draft.toggle();
			},
			disable: function () {
				if ($scope.draft === undefined) {
					return true;
				}

				if ($scope.draft.isUserOnTheClock() ||
					$scope.draft.userTeam === null ||
					($scope.draft.picks[0].round === 7 && $scope.draft.picks[0].position === 32))
					return true;
				return false;
			},
			text: function () {
				if ($scope.draft != null || $scope.draft != undefined) {
					if ($scope.draft.started) {
						if ($scope.draft.inProgress) {
							return 'Pause Draft';
						}
						return 'Resume Draft';
					}
				}
				return 'Start Draft';
			},
		},
	};
}

var MockRControllers = angular.module('mockrControllers', ['ngAnimate']);
MockRControllers.controller('HomeController', ['$scope', HomeController]);
MockRControllers.controller('SimController', ['$scope', '$http', '$interval', SimController]);