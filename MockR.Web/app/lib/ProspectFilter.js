function ProspectFilter() { }

ProspectFilter.prototype = {
	field: '',
	getFilter: function() {
		return this[this.field];
	},
	set: function (field, val) {
		// if filter field is new, wipe out old one
		if (this.field !== field) {
			this[this.field] = '';
		}

		this.field = field;

		if (this[this.field] === val) {
			this[this.field] = '';
		} else {	
			this[this.field] = val;
		}
	},
	match: function (prospect) {
		if (this[this.field] === undefined || this[this.field] === null || this[this.field] === '')
			return true;
		return this[this.field] === getDescendantProp(prospect, this.field);
	}
};