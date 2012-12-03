var blocks = function (ROWS, COLUMNS, PALETTE) {
	////////////////////
	// View
	////////////////////
	var COLOR_STATE;
	function coords(i, j) {
		this.getText = function () {
			return i + "_" + j;
		}
		this.setColor = function (hexcode) {
			var elm = document.getElementById(this.getText(i,j));
			elm.setAttribute("style", "background-color: " + hexcode);
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
				console.log(getGlobalColorState());
				(new coords(i, j)).setColor(getGlobalColorState());
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
		td.setAttribute("color", PALETTE[i]);
		td.setAttribute("style", "background-color: " + PALETTE[i]);
		td.setAttribute("id", "color_" + i);
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
		this.appendAction = function (drawing, result) {
			if (drawing in this.map) {
				this.map[drawing][result] = 1;
			}
		};

		this.delAction = function (drawing, result) {
			for (res in this.map[drawing]) {
				if (res == result) {
					delete this.map[drawing][result];
				}
			}
		};

		// returns an anonymous function that you can execute to get the desired result.
		this.kickOff = function (table_state) {
			return function() {
				for (drawing in this.map) {
					if (drawing.matches(table_state)) {
						this.map[drawing].forEach(function(x) {
							(x);
						});
					}
				}
			}
		}
	};
};
