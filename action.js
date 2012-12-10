function Action(drawing, result) {
	console.log("action loaded");
	this.drawing = drawing;
	this.result = result;
	this.equals = function(other_action) {
		return this.drawing === other_action.drawing &&
		       this.result === other_action.result;
	};
}
