app.factory('Moderation', [
	function() {
		
		var Moderation = {};

		// render moderations
		Moderation.renderModerations = function(moderations){
			if (moderations.length > 0){
				moderations.forEach(function(moderation,index){
					moderations.forEach(function(mod,mIndex){
						if (moderation.item_id === mod.item_id && moderation.date_added > mod.date_added){
							moderations.splice(mIndex,1);
						}
					});
				});
			}
			return moderations;
		};

		// generate hidden channels id array
		Moderation.generateHiddenChannelsArray = function(moderations){
			var a = [];
			if (moderations.length > 0) {
				moderations.forEach(function(mod,index){
					if (mod.hide === 1 && mod.moderation_type === 'channel'){
						a.push(mod.item_id);
					}
				});
			}
			return a;
		};

		// generate hidden user channels array
		Moderation.generateHiddenUserChannelsArray = function(moderations){
			var a = [];
			if (moderations.length > 0){
			moderations.forEach(function(mod,index){
				if (mod.hide === 1 && mod.moderation_type === 'user_channels'){
					a.push(mod.item_id);
				}
			});
			}
			return a;
		};
		

		return Moderation;
	}
]);