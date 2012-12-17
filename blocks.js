var blocks = function (ROWS, COLUMNS, PALETTE) {
	////////////////////
	// View
	////////////////////
	var COLOR_STATE;

	function match_color(text) {
		var BG_COLOR_HEX_REGEXP = /^background-color: (\#[0-9A-F]{6})/i;
		var BG_COLOR_TEXT_REGEXP = /^background-color: ([a-zA-Z]+)/i;
		console.log(text);
		var color_obj = BG_COLOR_HEX_REGEXP.exec(text);
		if (color_obj) {
			return color_obj[1];
		}
		console.log(color_obj);
		var color_obj = BG_COLOR_TEXT_REGEXP.exec(text);
		if (color_obj) {
			return color_obj[1];
		}
		console.log(color_obj);
		return null;
	}

	function coords(i, j) {
		this.getText = function () {
			return i + "_" + j;
		}
		this.getDomElm = function() {
			var elm = document.getElementById(this.getText(i,j));
			return elm;
		}
		this.setColor = function (hexcode) {
			elm = this.getDomElm();
			elm.setAttribute("style", "background-color: " + hexcode);
		}
		this.toggleColor = function (hexcode) {
			elm = this.getDomElm();
			if ( elm.hasAttribute("style")) {
				var attr = elm.getAttribute("style");
				var color = match_color(attr);
				if (color) {
					if (color === hexcode) {
						elm.setAttribute("style", "");
						return;
					}
				}
			}
			this.setColor(hexcode);
		}

	}

	function setGlobalColorState(hexcode) {
		COLOR_STATE = hexcode;
	}

	function getGlobalColorState(hexcode) {
		return COLOR_STATE;
	}

	var table = document.createElement("table");
	table.setAttribute("id", "canvas");
	for (var i = 0; i < ROWS; i++) {
	var tr = document.createElement("tr");
	for ( var j = 0; j < COLUMNS; j++) {
		var td = document.createElement("td");
		td.setAttribute("id", (new coords(i,j)).getText());
		td.addEventListener("click", (function (i,j) {
			return function() {
				(new coords(i, j)).toggleColor(getGlobalColorState());
			}
		}(i,j))
		);
		tr.appendChild(td);
	}
	table.appendChild(tr);
	}
	document.body.appendChild(table);

	var palette = document.createElement("table");
	palette.setAttribute("id", "palette");
	var tr = document.createElement("tr");
	for (var i = 0; i < PALETTE.length; i++) {
		var td = document.createElement("td");
		td.setAttribute("style", "background-color: " + PALETTE[i]);
		td.addEventListener("click", (function (i) {
			return function() {
				setGlobalColorState(PALETTE[i]);
			}
		}(i)));
		tr.appendChild(td);
	}
	palette.appendChild(tr);
	document.body.appendChild(palette);

        ////////////////////
	// Model
        ////////////////////

	// Map a drawing to something happening.
	var actions = new function() {
		this.action_list = new Array();
		// there's some sort of restriction on what an attribute of an object is
		// drawing can't be an attribute...
		this.appendAction = function (drawing, result) {
			action = new Action(drawing, result);
			// TODO: duplicates
			this.action_list.push(action);
		};

		this.delAction = function (drawing, result) {
			var action = new Action(drawing, result);
			var new_list = new Array();
			for (var i = 0; i < this.action_list.length; i++) {
				var i_action = this.action_list[i];
				if (!action.equals(i_action)) {
					new_list.push(i_action);
				}
			}
			this.action_list = new_list;
		};

		// TODO: the following four functions are shit
		// Possible Solution: figure out inheritance in javascript
		this.getTableState = function() {
			var table = new Drawing();
			for (var i = 0; i < ROWS; i++) {
				for ( var j = 0; j < COLUMNS; j++) {
					var td = document.getElementById((new coords(i,j)).getText());
					// TODO: hacky, learn js and fix
					if (td.getAttribute("style") != null && 
					    td.getAttribute("style") != "") {
						table.add([i,j]);
					}
				}
			}
			return table;
		}

		this.getTableStateWithColor = function() {
			var table = new Drawing();
			for (var i = 0; i < ROWS; i++) {
				for ( var j = 0; j < COLUMNS; j++) {
					var td = document.getElementById((new coords(i,j)).getText());
					var attr = td.getAttribute("style");
					// TODO: hacky, learn js and fix
					if (attr != null && 
					    attr != "") {
						var color = match_color(attr);
						table.add([i,j, color]);
					}
				}
			}
			return table;
		}

		// returns an anonymous function that you can execute to get the desired result.
		this.kickOff = function () {
			var table_state = this.getTableState();
			var that = this;
			return function() {
				for (var i = 0; i < that.action_list.length; i++) {
					var drawing = that.action_list[i].drawing;
					var result = that.action_list[i].result;
					if (drawing.matches(table_state)) {
						result();
					}
				}
			};
		}

		this.kickOffWithColor = function () {
			var table_state = this.getTableStateWithColor();
			var that = this;
			return function() {
				for (var i = 0; i < that.action_list.length; i++) {
					var drawing = that.action_list[i].drawing;
					var result = that.action_list[i].result;
					console.log(drawing);
					console.log(table_state);
					if (drawing.matches(table_state)) {
						result();
					}
				}
			};
		}
	};

	return {
		actions: actions
	};
};
