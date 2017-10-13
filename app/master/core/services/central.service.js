app.factory('Central', [
	function() {
		var Central = {};

		// find cluster by address
		Central.findClusterByAddress = function(cluster_id,clusters){
			var cl = {};
			clusters.forEach(function(cluster,index){
				if (cluster.address === cluster_id){
					cl = cluster;
				}
			});
			return cl;
		}

		// join channel moderation
		Central.joinChannelModeration = function(channels,moderations){
			channels.forEach(function(channel,index){
				moderations.forEach(function(mod,mIndex){
					if (mod.item_id === channel.channel_address && mod.moderation_type === 'channel' && mod.hide === 1) {
						for (var i in mod){
							channel.hide = 1;
						}
					} else if (mod.item_id === channel.user_id && mod.moderation_type === 'user_channels' && mod.hide === 1) {
						channel.user_hide = 1;
					}
				});
			});
			return channels;
		}

		// generate
		Central.generateContentJsonOptionalList = function(file_types){
			var a = ".*(";
			file_types.forEach(function(f_type,index){
				a += "." + f_type;
				if (file_types.length > (index + 1)) a += "|";
			});
			a += ")";
			return a;
		};

		// generate cert user name
		Central.generateRandomString = function(numLength){
			function randomString(length, chars) {
			    var result = '';
			    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
			    return result;
			}
			var rString = randomString(numLength, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
			return rString;
		};

		// GRK
		Central.grk = function(config){
			var randomKey = config.versions.a + config.versions.b + config.versions.c + config.versions.d + config.versions.f;
			return randomKey;
		};

		return Central;
	}
]);