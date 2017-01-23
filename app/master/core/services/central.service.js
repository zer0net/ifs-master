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
		Central.listItemsByFileType = function(scope) {
			// create file types array's container
			scope.file_types = [];
			scope.file_types_items = {};
			// loop through every item in scope.items
			scope.items.forEach(function(item,index) {
				if (scope.file_types.indexOf(item.file_type) === -1) scope.file_types.push(item.file_type);
				if (!scope.file_types_items[item.file_type]) scope.file_types_items[item.file_type] = [];
				scope.file_types_items[item.file_type].push(item);
			});
			return scope;
		};

		return Central;
	}
]);