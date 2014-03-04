function ProspectSort (field) {
	if (field === undefined) {
		field = '';
	}

	this.field = field;
}

ProspectSort.prototype = {
	field: '',
	reverse: false,

	set: function (field) {
		if (this.field === field) {
			this.reverse = !this.reverse;
			return;
		}

		this.field = field;
		this.reverse = false;
	}
};