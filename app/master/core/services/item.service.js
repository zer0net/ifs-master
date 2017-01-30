app.factory('Item', [
	function() {
		
		var Item = {};

		// render file item on read
		Item.renderFileOnRead = function(file,reader){
			// file data uri
			file.data = reader.result;
	    	// get items file type
			var splitByLastDot = function(text) {
			    var index = text.lastIndexOf('.');
			    return [text.slice(0, index), text.slice(index + 1)]
			}
			file.file_type = splitByLastDot(file.name)[1];
			// name
			file.f_name = file.name.split('.'+file.file_type)[0];

			return file;
		};

		// assign default category
		Item.assignDefaultCategory = function(file,categories){
			// get category name by file type
			var catName;
			var subCatName;
			// games
			if (file.file_type === 'zip' ||  file.file_type === 'nes' ||  file.file_type === 'sna' ||  file.file_type === 'dsk' || file.file_type === 'bin') {
				catName = 'games';
				file.media_type = 'game';
				if (file.file_type === 'zip'){ subCatName = 'dos';}
				else if (file.file_type === 'nes'){ subCatName = 'nes';}
				else if (file.file_type === 'sna'){ subCatName = 'amstrad';}
				else if (file.file_type === 'bin'){ subCatName = 'atari';}
			} else if (file.file_type === 'mp4' || file.file_type === 'ogg' || file.file_type === 'webm' || file.file_type === 'ogv') {
				catName = 'videos';
				file.media_type = 'video';
			} else if (file.file_type === 'mp3'){
				catName = 'audios';
				file.media_type = 'audio';
			} else if (file.file_type === 'epub'){
				catName = 'books';
				file.media_type = 'book';
			} else if (file.file_type === 'jpg' || file.file_type === 'png' || file.file_type === 'gif'){
				catName = 'images';
				file.media_type = 'image';
			}
			// find category
			categories.forEach(function(cat,index){
				if (cat.category_name === catName){
					file.category = cat;
					if (subCatName !== ''){
						file.category.subcategories.forEach(function(sub,index){
							if (sub.category_name === subCatName){
								file.subcategory = sub;
							}
						});
					}
				}
			});
			return file;
		};

		// assign default sub category
		Item.assignDefaultSubcategory = function(file){
			var subcatName;
			// games
			if (file.category.category_name === 'games'){
				if (file.file_type === 'zip'){ subcatName = 'dos';}
				else if (file.file_type === 'nes') {subcatName = 'nes';}
				else if (file.file_type === 'sna') {subcatName = 'amstrad';}
				else if (file.file_type === 'bin') {subcatName = 'atari';}
			}
			// find subcategory
			var subCat;
			file.category.subcategories.forEach(function(cat,index){
				if (cat.category_name === subcatName){
					subCat = cat;
				}
			});
			file.subcategory = subCat;
			return file;
		};

		// create new item
		Item.createNewItem = function(file,chJson,site){

			// render file name
			var file_name = file.name.split(' ').join('_').normalize('NFKD').replace(/[\u0300-\u036F]/g, '').replace(/ß/g,"ss").split('.' + file.file_type)[0].replace(/[^\w\s]/gi, '_') + '.' + file.file_type;
			// item obj
			var item = {
				"category":file.category.category_id,
				"subcategory":file.subcategory.category_id,
				"file_type":file.file_type,
				"media_type":file.media_type,
				"channel": site.address,
				"title": file.name.split('.'+file.file_type)[0],
				"date_added": +(new Date),
				"published":false
			};

			// render item
			var item_id_name;
			var item_file_name;
			
			// game
			if (file.media_type === 'game') {
				item_id_name = 'game_id';
				item.file_size = file.size;
				item.path = 'uploads/games/'+file_name;
				if (file.file_type === 'zip'){
					item.file_name = file.inner_file;
					item.zip_size = file.size;
					item_file_name = 'zip_name';							
				} else {
					item_file_name = 'file_name';
				}
			} 
			// video
			else if (file.media_type === 'video') {
				item_id_name = 'video_id';
				item.file_size = file.size;
				item.path = 'uploads/videos/'+file_name;
				item_file_name = 'file_name';
			} 
			// audio
			else if (file.media_type === 'audio'){
				item_id_name = 'audio_id';
				item.file_size = file.size;
				item.path = 'uploads/audios/'+file_name;						
				item_file_name = 'file_name';
			}
			// book
			else if (file.media_type === 'book'){
				item_id_name = 'book_id';
				item.file_size = file.size;
				item.path = 'uploads/books/' + file_name;
				item_file_name = 'file_name';
			} 
			// image
			else if (file.media_type === 'image'){
				item_id_name = 'image_id';
				item.file_size = file.size;
				item.path = 'uploads/images/' + file_name;
				item_file_name = 'file_name';
			}		

			// item file name
			item[item_file_name] = file_name;
			// item id
			var next_item_id;
			if (!chJson){
				next_item_id = 1;
			} else {
				next_item_id = chJson.next_item_id;
			}
			item[item_id_name] = next_item_id;

			return item;
		};

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
					item.img = '/'+$scope.site_address+'/assets/master/img/logo_sna.jpg';
					item.imgSize = 'cover';
				} else if (item.file_type === 'zip'){
					item.img = '/'+$scope.site_address+'/assets/master/img/logo_dos.gif';
					item.imgSize = 'contain';
				} else if (item.file_type === 'bin'){
					item.img = '/'+$scope.site_address+'/assets/master/img/logo_atari.jpg';
					item.imgSize = 'contain';
				} else if (item.file_type === 'nes'){
					item.img = '/'+$scope.site_address+'/assets/master/img/logo_nes.png';
					item.imgSize = 'contain';
				}
			}
			return item;
		};

		return Item;
	}
]);