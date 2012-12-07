var blocks = function (ROWS, COLUMNS, PALETTE) {
	////////////////////
	// View
	////////////////////
	var COLOR_STATE;
	var BG_COLOR_REGEXP = /^background-color: (\#[0-9A-F]{6})/g;

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
				var color_obj = BG_COLOR_REGEXP.exec(attr);
				if (color_obj) {
					var color = color_obj[1];
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
		this.map = {}
		// there's some sort of restriction on what an attribute of an object is
		// drawing can't be an attribute...
		this.appendAction = function (drawing, result) {
			if (!(drawing in this.map)) {
			   this.map[drawing] = {};
			}
			this.map[drawing][result] = 1;
		};

		this.delAction = function (drawing, result) {
			for (res in this.map[drawing]) {
				if (res == result) {
					delete this.map[drawing][result];
				}
			}
		};

		this.getTableState = function() {
			table = new Drawing();
			for (var i = 0; i < ROWS; i++) {
				for ( var j = 0; j < COLUMNS; j++) {
					var td = document.getElementById((new coords(i,j)).getText());
					if (td.hasAttribute("style")) {
						table.add([i,j]);
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
				for (drawing in that.map) {
					console.log(table_state);
					if (drawing.matches(table_state)) {
						that.map[drawing].forEach(function(x) {
							(x);
						});
					}
				}
			};
		}
	};
	return {
		actions: actions
	};
};
