app.factory('Central', [
	function() {
		var Central = {};

		// render items by media type - games, videos, books etc'
		Central.listItemsByMediaType = function(scope) {
			// loop through every item in scope.items
			scope.items.forEach(function(item,index) {
				var media_type = item.media_type + 's';
				if (!scope[media_type]) scope[media_type] = [];
				scope[media_type].push(item);
			});
			return scope;
		};

		// render items by file type
		Central.listItemsByFileType = function(scope,ppFilter) {
			console.log('central listItemsByFileType');
			console.log(scope.items);
			// remove existing file types & file types items arrays
			delete scope.file_types;
			delete scope.file_types_items;
			delete scope.channel_items;
			// create file types array's container
			scope.file_types = [];
			scope.file_types_items = {};
			// loop through every item in scope.items
			scope.items.forEach(function(item,index) {
				// if ppFilter object is passed
				if (ppFilter){
					if (ppFilter.channel.address){
						// add item to channel_items
						if (item.channel.address === ppFilter.channel.address){
							if (!scope.channel_items) scope.channel_items = [];
							scope.channel_items.push(item);
						}
						// if no media type on filter
						if (!ppFilter.media_type){
							if (item.channel.address === ppFilter.channel.address){
								if (scope.file_types.indexOf(item.file_type) === -1) scope.file_types.push(item.file_type);
								if (!scope.file_types_items[item.file_type]) scope.file_types_items[item.file_type] = [];
								scope.file_types_items[item.file_type].push(item);
							}
						} 
						// if media type on filter
						else {
							if (item.channel.address === ppFilter.channel.address && item.media_type === ppFilter.media_type){
								if (scope.file_types.indexOf(item.file_type) === -1) scope.file_types.push(item.file_type);
								if (!scope.file_types_items[item.file_type]) scope.file_types_items[item.file_type] = [];
								scope.file_types_items[item.file_type].push(item);
							}
						}
					} else if (ppFilter.media_type){
						if (item.media_type === ppFilter.media_type){
							if (scope.file_types.indexOf(item.file_type) === -1) scope.file_types.push(item.file_type);
							if (!scope.file_types_items[item.file_type]) scope.file_types_items[item.file_type] = [];
							scope.file_types_items[item.file_type].push(item);							
						}
					}
				} 
				// if no config object is passed
				else {
					if (scope.file_types.indexOf(item.file_type) === -1) scope.file_types.push(item.file_type);
					if (!scope.file_types_items[item.file_type]) scope.file_types_items[item.file_type] = [];
					scope.file_types_items[item.file_type].push(item);
				}
			});
			return scope;
		};

		return Central;
	}
]);