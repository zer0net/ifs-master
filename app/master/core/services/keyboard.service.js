app.factory('Keyboard', [
	function() {
		
		var Keyboard = {};
		
		Keyboard.emulateKeyPress = function(e,target,comment,map){
   			var c;
   			var string = '';
		   	map[e.keyCode] = e.type == 'keydown';   
   			if (map[e.keyCode] === true){
   				// if backspace
				if (e.keyCode === 8){
					if (target.selectionStart < target.selectionEnd){
						c = this.replaceRange(comment, target.selectionStart, target.selectionEnd, string);
					} else {
						c = comment.slice(0,-1); 						
					}
				}
				// if not backspace
				else {
					// with shift
					if (map[16] === true){
						if (e.keyCode === 16) {
							// console.log('shift');
						} else {
 							string = e.key.toUpperCase();
						}
					} else {
				    	string = String.fromCharCode(e.keyCode).toLowerCase();
					}

					// if text has selection
					if (target.selectionStart < target.selectionEnd){
						c = this.replaceRange(comment, target.selectionStart, target.selectionEnd, string);
					} else {
				    	c = comment + string;
					}
				}
   			} else {
   				c = comment;
   			}
	    	return c;
		};

		Keyboard.replaceRange = function(s, start, end, substitute){
			return s.substring(0, start) + substitute + s.substring(end);
		};

		return Keyboard;
	}
]);