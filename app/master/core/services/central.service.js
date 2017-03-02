app.factory('Central', [
	function() {
		var Central = {};

		// render items by media type - games, videos, books etc'
		Central.listItemsByMediaType = function(scope,filters) {
			// remove existing file types & file types items arrays
			delete scope.media_types;
			delete scope.media_types_items;
			delete scope.channel_items;
			// create file types array's container
			scope.media_types = [];
			scope.media_types_items = {};
			// loop through every item in scope.items
			// TO DO - add channel filter!
			scope.items.forEach(function(item,index) {
				if (filters){
					if (filters.channel_address){
						// add item to channel_items
						if (item.channel.channel_address === ppFilter.channel_address){
							if (!scope.channel_items) scope.channel_items = [];
							scope.channel_items.push(item);
							if (scope.media_types.indexOf(item.media_type + 's') === -1) scope.media_types.push(item.media_type + 's');
							if (!scope.media_types_items[item.media_type + 's']) scope.media_types_items[item.media_type + 's'] = [];
							scope.media_types_items[item.media_type + 's'].push(item);
						}						
					} else {

					}
				} else {
					if (scope.media_types.indexOf(item.media_type + 's') === -1) scope.media_types.push(item.media_type + 's');
				}
			});
			return scope;
		};

		// render items by file type
		Central.listItemsByFileType = function(scope,ppFilter) {
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

		// merge channel items to scope items
		Central.mergeChannelItems = function(items,items_total,media_types,chJson){
			for (var i in chJson.items){
				if (i !== 'images' && i !== 'total'){
					if (!items[i]) items[i] = [];
					items.total += chJson.items[i].length;
					items[i] = items[i].concat(chJson.items[i]);
					chJson.items[i].forEach(function(item,index){
						item.channel = chJson.channel;
					});
					if (media_types.indexOf(i) === -1) media_types.push(i);
				}
			}
			return items;
		};

		// filter items by channel
		Central.filterItemsByChannel = function(channel,items,filters){
			channel.items = {};
			channel.content_types = [];
			for (var i in items){
				if (i !== 'total'){
					items[i].forEach(function(item,index){
						if (item.channel.channel_address === channel.channel_address){
							if (channel.content_types.indexOf(item.content_type + 's') === -1) channel.content_types.push(item.content_type + 's');
							if (!channel.items[i]) channel.items[i] = [];
							channel.items[i].push(item);
						}
					});
				}
			}
			return channel;
		};

		// join channel moderation
		Central.joinChannelModeration = function(channels,moderations){
			channels.forEach(function(channel,index){
				moderations.forEach(function(mod,mIndex){
					if (mod.item_id === channel.channel_address){
						for (var i in mod){
							channel[i] = mod[i];
						}
					}
				});
			});
			return channels;
		}

		return Central;
	}
]);