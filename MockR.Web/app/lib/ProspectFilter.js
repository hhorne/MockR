function ProspectFilter() { }

ProspectFilter.prototype = {
	field: '', 
	set: function (field, val) {
		if (this[field] === undefined) {
			this[field] = '';
		}

		if (this.field !== field) {
			this[field] = '';
		}

		this.field = field;

		if (this.field === field && this[field] === val) {
			this[field] = '';
			return;
		}

		this[field] = val;
	},
	match: function (prospect) {
		return this[this.field] === prospect[this.field];
	}
};