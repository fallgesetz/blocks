function Set(elmement_list) {
	this.map = {};
	element_list.forEach(function(elm) {
		this.map[elm] = 1;
	});

	this.contains = function (x) {
		return x in this.map;
	};

	this.add = function(x) {
		this.map[x] = 1;
	};

	this.del = function (x) {
		if (x in this.map) {
			delete this.map[x];
		}
	};
}
