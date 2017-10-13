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
		Channel.findChannelByAddress = function(channels,channel_address,cluster_id){
			var channel;
			channels.forEach(function(ch,index){
				if (ch.channel_address === channel_address && ch.cluster_id === cluster_id){
					channel = ch;
				}
			});
			return channel;
		}

		// find cluster in merger sites list
		Channel.findClusterInMergerSiteList = function(cluster,sites){
			for (var site in sites) {
			    if (sites[site].address === cluster.cluster_id){
			    	for (var attr in sites[site]){
			    		cluster[attr] = sites[site][attr]
			    	}
			    }
			}
			return cluster;
		};

		// find user cluster
		Channel.findUserCluster = function(auth_address,clusters){
			var ca = false;
			clusters.forEach(function(cluster,index){
				cluster.files.forEach(function(file,index){
					if (file.inner_path.split('/')[2] === auth_address){
						ca = cluster.cluster_id;
					}
				});
			});
			return ca;
		};

		// get user next channel id
		Channel.getUserNextChannelId = function(u_channels){
			var next_channel_id = 0;
			if (u_channels){
				u_channels.forEach(function(u_ch,index){
					var u_ch_id = parseInt(u_ch.channel_address.split('_')[0]);
					if (u_ch_id > next_channel_id){
						next_channel_id = u_ch_id;
					}
				});
			}
			next_channel_id += 1;
			return next_channel_id;
		}

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
		Channel.renderChannelFiles = function(ch_optional_files,ch_items,channel){

			ch_items.forEach(function(ch_item,index){
				for (var attr in channel){
					if (attr !== 'date_added'){
						ch_item[attr] = channel[attr];
					}
				}
			});
			// channel files object
			var ch_files = {
				files:ch_items,
				total:ch_items.length,
				total_downloaded:0,
				total_size:0,
				total_downloaded_size:0
			};

			// loop channel files
			ch_files.files.forEach(function(file,index){
				file.is_loaded = false;
				file.peers = 0;	
				for (var i in ch_optional_files) {
				    if (ch_optional_files[i].inner_path === 'data/users/'+file.channel.split('_')[1]+'/'+file.file_name) {
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

		// generate channel address array
		Channel.generateChannelAddressArray = function(channels_old){
			var c = [];
			channels_old.forEach(function(ch,index){
				c.push(ch.channel_address);
			});
			return c;
		};

		// generate channels query
		Channel.genearteChannelsQuery = function(content_type,moderations,hidden_channels,hidden_users) {
			var q = "SELECT *";
			q+= ", (SELECT count(*) FROM item WHERE item.channel=channel.channel_address";
			if (content_type){
				q+= " AND item.content_type='"+content_type.split('s')[0]+"'";
			} else {
				q+= " AND item.content_type NOT IN ('image')";
			}
			q+= ") as items_total";
			q+= ", (SELECT count(*) FROM item WHERE item.channel=channel.channel_address AND item.content_type='audio') as audio_count";
			q+= ", (SELECT count(*) FROM item WHERE item.channel=channel.channel_address AND item.content_type='book') as book_count";
			q+= ", (SELECT count(*) FROM item WHERE item.channel=channel.channel_address AND item.content_type='image') as image_count";
			q+= ", (SELECT count(*) FROM item WHERE item.channel=channel.channel_address AND item.content_type='game') as game_count";
			q+= ", (SELECT count(*) FROM item WHERE item.channel=channel.channel_address AND item.content_type='video') as video_count";
			q+= " FROM channel WHERE channel_address NOT NULL";
			if (hidden_channels && moderations !== false) {
				q += " AND channel_address NOT IN ("; 
				hidden_channels.forEach(function(hc,index){
					if (index > 0) q+=",";
					q+= "'"+hc+"'";
				});
				q += ")";	
			}
			if (hidden_users && moderations !== false) {
				hidden_users.forEach(function(hu,index){
					q+= " AND channel_address NOT LIKE '%"+hu+"'";
				});
			}
			query = [q];
			return query;
		}

		// get channel logo site file
		Channel.getChannelLogoSiteFile = function(channel,clusters){
			var a = false;
			clusters.forEach(function(cluster,index){
				if (cluster.cluster_id === channel.cluster_id){
					cluster.files.forEach(function(file,index){
						var path = 'data/users/'+channel.channel_address.split('_')[1]+'/'+channel.logo_file;
						if (file.inner_path === path){
							a = true;
						}
					});
				}
			});
			return a;
		};

		return Channel;
	}
]);