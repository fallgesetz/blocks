function Drawing(element_list) {
	// define
	this.map = {};
	this.fromList = function(element_list) {
		if ( element_list ) {
			for (var i = 0; i < element_list.length; i++) {
				this.map[element_list[i]] = 1;
			}
		}
	};

	this.toList = function() {
		var ll = []
		for (key in this.map) {
			ll.push(key);
		}
		return ll;
	};

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
	this.matches = function(table_state) {
		for (key in this.map) {
			if(!(key in table_state.map)) {
				return false;
			}
		}
		return true;
	}

	// execute
	this.fromList(element_list);
}
