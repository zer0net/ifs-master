app.factory('Item', [
	function() {
		
		var Item = {};

		// render channel item
		Item.renderChannelItem = function($scope,item,site_files,channel){
			// create item if in cache
			item.x_is_load = false;
			item.x_peer = 0;
			var path = item.path;
			for (var i = 0, len = site_files.length; i < len; i++) {
			  var inner_path = site_files[i].inner_path;
			  if(path==inner_path)
				{
					item.x_is_load=true;
					item.x_peer=site_files[i].peer;
					break;
				}
			}
			// assign channel obj
			item.channel = channel;
			// genereate unique item id
			item.uid = item.channel.address + item.date_added;
			// item path
			if (!item.path){
				var fileName;
				if (item.zip_name){
					fileName = item.zip_name
				} else {
					fileName = item.file_name;
				}
				game.path = 'uploads/'+item.media_type + 's/' + fileName;
			}
			// render item's img url
			if(item.imgPath) {
				item.img = '/'+$scope.site_address+'/merged-'+$scope.merger_name+'/'+item.channel.address+'/'+item.imgPath;
			} else {
				if (item.file_type === 'sna') {
					item.img = '/'+$scope.site_address+'/assets/img/logo_sna.jpg';
					item.imgSize = 'cover';
				} else if (item.file_type === 'zip'){
					item.img = '/'+$scope.site_address+'/assets/img/logo_dos.gif';
					item.imgSize = 'contain';
				} else if (item.file_type === 'bin'){
					item.img = '/'+$scope.site_address+'/assets/img/logo_atari.gif';
					item.imgSize = 'contain';
				} else if (item.file_type === 'nes'){
					item.img = '/'+$scope.site_address+'/assets/img/logo_nes.png';
					item.imgSize = 'contain';
				}
			}
			return item;
		};

		return Item;
	}
]);