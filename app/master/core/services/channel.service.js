app.factory('Channel', [
	function() {
		
		var Channel = {};

		// render channels
		Channel.renderChannels = function(channels){
			channels.forEach(function(channel,index){
				// channel option label - for user area channel select labels
				channel.option_label = channel.channel_name;
			});
			return channels;
		};

		// find channel by address (in given channels list)
		Channel.findChannelByAddress = function(channels,channel_address){
			var channel;
			channels.forEach(function(ch,index){
				if (ch.channel_address === channel_address){
					channel = ch;
				}
			});
			return channel;
		}

		// find cluster in merger sites list
		Channel.findClusterInMergerSiteList = function(sites,cluster_id){
			var cluster;
			for (var site in sites) {
			    if (site === cluster_id){
					cluster = sites[site];
			    }
			}
			return cluster;
		};

		// match items with corresponding site files
		Channel.matchItemsWithSiteFiles = function(chJson,site_files){
			chJson.items_total = 0;
			// for every array under chJson.items
			for (var i in chJson.items){
				if (chJson.items[i].length > 0){
					chJson.items_total += chJson.items[i].length;
					// for each item in array
					chJson.items[i].forEach(function(item,index){
						// for each site_file in site_files list
						site_files.forEach(function(site_file,index){
							if (site_file.inner_path === 'data/users/'+chJson.channel.user_id+'/'+item.file_name){
								for (var attr in site_file){
									// assign corresponding site_file attributes to item
									item[attr] = site_file[attr]
								}
							}
						});
					});
				}
			}
			return chJson;
		};

		// render channel files
		Channel.renderChannelFiles = function(ch_optional_files,ch_items){
			// channel files object
			var ch_files = {
				files:[],
				total:0,
				total_downloaded:0,
				total_size:0,
				total_downloaded_size:0
			};
			// populate files total list from chJson.items					
			for (var i in ch_items){
				// add number of current array to files_total count
				ch_files.total += ch_items[i].length;	
				// merge current array to files
				ch_files.files = ch_files.files.concat(ch_items[i]);
			}
			// loop channel files
			ch_files.files.forEach(function(file,index){
				file.is_loaded = false;
				file.peers = 0;	
				for (var i in ch_optional_files) {
				    if (ch_optional_files[i].inner_path === 'data/users/'+file.item_id.split('_')[1]+'/'+file.file_name) {
						file.is_loaded = true;
						file.peers = ch_optional_files[i].peer;
						ch_files.total_size += ch_optional_files[i].size;
						if (ch_optional_files[i].is_downloaded = 1) {
							ch_files.total_downloaded += 1;
							ch_files.total_downloaded_size += ch_optional_files[i].size;
						}		
						break;
					}
				}
			});
			return ch_files;
		};

		// render chJson items before chJson update
		Channel.renderChannelItemsBeforeUpdate = function(chJson){
			// allowed fields array
			var allowedFields = [
				'category',
				'subcategory',
				'file_type',
				'file_name',
				'file_size',
				'inner_file',
				'poster_file',
				'content_type',
				'channel',
				'title',
				'date_added',
				'item_id'
			];

			for (var i in chJson.items){
				chJson.items[i].forEach(function(item,index){
					item.channel = chJson.channel.channel_address;
					for (var i in item){
						if (allowedFields.indexOf(i) === -1){
							delete item[i];
						}
					}
				});
			}

			return chJson;
		};

		return Channel;
	}
]);