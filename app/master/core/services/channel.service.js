app.factory('Channel', [
	function() {
		var Channel = {};
		// render channel of get channel 
		Channel.renderChannelOnGet = function(channel,data,media_type){
		    var iLen = 0;
			channel.items = data[media_type];
			if(data.games) {channel.games = data.games; iLen+=data.games.length;}
			if(data.videos){channel.videos = data.videos;iLen+=data.videos.length;}
			if(data.channel.img) {channel.logo = data.channel.img;}
			channel.filesLen = iLen;
			return channel;
		};
		return Channel;
	}
]);