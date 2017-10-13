app.factory('Item', ['Central',
	function(Central) {
		
		var Item = {};

		// assign default category
		Item.assignDefaultCategory = function(file,categories){			
			// get category name by file type
			var catName;
			var subCatName;
			if (file.file_type === 'zip' ||  
				file.file_type === 'nes' ||  
				file.file_type === 'sna' ||  
				file.file_type === 'dsk' || 
				file.file_type === 'bin') {
				catName = 'games';
				file.content_type = 'game';
				if (file.file_type === 'zip'){ subCatName = 'dos';}
				else if (file.file_type === 'nes'){ subCatName = 'nes';}
				else if (file.file_type === 'sna'){ subCatName = 'amstrad';}
				else if (file.file_type === 'bin'){ subCatName = 'atari';}
			} else if  (file.file_type === 'mp4' || 
						file.file_type === 'ogg' || 
						file.file_type === 'webm' || 
						file.file_type === 'ogv' || 
						file.file_type === 'flv') {
				catName = 'videos';
				file.content_type = 'video';
			} else if (file.file_type === 'mp3'){
				catName = 'audio';
				subCatName = 'music';
				file.content_type = 'audio';
			} else if (file.file_type === 'epub'){
				catName = 'books';
				file.content_type = 'book';
			} else if  (file.file_type === 'jpg' || 
						file.file_type === 'jpeg' ||
						file.file_type === 'png' || 
						file.file_type === 'gif'){
				catName = 'images';
				file.content_type = 'image';
			}
			// find category
			categories.forEach(function(cat,index){
				if (cat.category_name === catName){
					file.category = cat;
					if (subCatName){
						file.category.subcategories.forEach(function(sub,index){
							if (sub.category_name === subCatName){
								file.subcategory = sub;
							}
						});
					} else {
						file.subcategory = file.category.subcategories[0];
					}
				}
			});
			return file;
		};

		// create new item
		Item.createNewItem = function(file,next_item_id,channel){
			
			// item obj
			var item = {
				"category":file.category.category_id,
				"subcategory":file.subcategory.category_id,
				"file_type":file.file_type,
				"file_name":file.file_name,
				"file_size":file.size,
				"content_type":file.content_type,
				"channel": channel.channel_address,
				"title": file.title,
				"date_added": +(new Date)
			};
			// if zip, assign selected inner file
			if (item.file_type === 'zip'){
				item.inner_file = file.inner_file;
			}
			// item id
			item.item_id = channel.channel_address + '_' + next_item_id;
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

		// remove current moderation
		Item.removeCurrentModeration = function(moderations,moderation){
			if (moderations.length > 0){
				moderations.forEach(function(mod,index){
					if (mod.item_type === moderation.item_type && mod.item_id === moderation.item_id && mod.current === 1){
						mod.current = 0;
					}
				});
			}
			return moderations;
		};

		/** LIST **/

		// generate item list sort options
		Item.generateItemListSortOptions = function(){

			var sort_options = [{
				label:'newest',
				val:'i.date_added DESC',
				val2:'-date_added'
			},{
				label:'oldest',
				val:'i.date_added ASC',
				val2:'date_added'
			},{
				label:'title z - a',
				val:'i.title DESC',
				val2:'-title'
			},{
				label:'title a - z',
				val:'i.title ASC',
				val2:'title'
			},{
				label:'top voted',
				val:'v.diff desc, i.item_id'
			},{
				label:'top commented',
				val:'comment_count desc, i.item_id',
				dir:'DESC'
			}/*,{
				label:'peers',
				val:'-peer'
			}*/];

			return sort_options;
		};

		// generate categories menu
		Item.generateCategoryMenu = function(config,content_type,channel,moderations,hidden_channels,hidden_users){
			var a = [{
				category_name:'All',
				query:Item.generateCategoryCountQuery(content_type,channel,moderations,hidden_channels,hidden_users)			
			}];
			config.categories.forEach(function(cat,index){
					cat.query = Item.generateCategoryCountQuery(content_type,channel,moderations,hidden_channels,hidden_users,cat);
					a.push(cat);
			});
			return a;
		};

		// generate subcategories menu
		Item.generateSubCategoryMenu = function(category,content_type,channel,moderations,hidden_channels,hidden_users) {
			var a = [{
				category_name:'All',
				query:Item.generateCategoryCountQuery(content_type,channel,moderations,hidden_channels,hidden_users,category)
			}];
			category.subcategories.forEach(function(sub,index) {
				sub.query = Item.generateCategoryCountQuery(content_type,channel,moderations,hidden_channels,hidden_users,category,sub);
				a.push(sub);
			});
			console.log(a);
			return a;
		};

		// generate count query
		Item.generateCategoryCountQuery = function(content_type,channel,moderations,hidden_channels,hidden_users,category,subcategory) {
			var q = "SELECT count(*) FROM item";
			if (content_type) {
				q+= " WHERE content_type='"+content_type.split('s')[0]+"'";
			}
			if (category) {
				q+= " AND category='"+category.category_id+"'";
				if (subcategory) q+= " AND subcategory='"+subcategory.category_id+"'";	
			}
			if (channel) q+= " AND channel='"+channel.channel_address+"'";
			if (hidden_channels && moderations !== false) {
				q += " AND channel NOT IN ("; 
				hidden_channels.forEach(function(hc,index){
					if (index > 0) q+=",";
					q+= "'"+hc+"'";
				});
				q += ")";	
			}
			if (hidden_users && moderations !== false) {
				hidden_users.forEach(function(hu,index){
					q+= " AND channel NOT LIKE '%"+hu+"'";
				});
			}
			query = [q];
			return query;
		};

		// generate content types menu
		Item.generateContentTypesMenu = function(config,content_type,channel,moderations,hidden_channels,hidden_users){
			var content_types = config.content_types;
			content_types.forEach(function(c_type, index){
				c_type.label = c_type.type;
				if (c_type.label !== 'audio') c_type.label = c_type.label + 's';
				c_type.query = Item.generateContentTypeCountQuery(content_type,channel,moderations,hidden_channels,hidden_users,c_type);
			});
			var a = {
				type:'all',
				label:'all',
				query:Item.generateContentTypeCountQuery(content_type,channel,moderations,hidden_channels,hidden_users)
			};
			content_types.unshift(a);
			return content_types;
		};

		// generate file types menu
		Item.generateFileTypeMenu = function(c_type,content_type,channel,moderations,hidden_channels,hidden_users) {
			var a = [{
				type:'All',
				query:Item.generateContentTypeCountQuery(content_type,channel,moderations,hidden_channels,hidden_users,c_type)
			}];
			c_type.file_types.forEach(function(f_type,index) {
				f_type.query = Item.generateContentTypeCountQuery(content_type,channel,moderations,hidden_channels,hidden_users,c_type,f_type);
				a.push(f_type);
			});
			return a;
		};

		// generate count query
		Item.generateContentTypeCountQuery = function(content_type,channel,moderations,hidden_channels,hidden_users,c_type,f_type) {
			var q = "SELECT count(*) FROM item";
			if (content_type) {
				q+= " WHERE content_type='"+content_type.split('s')[0]+"'";
			} else {
				q+= " WHERE item_id IS NOT NULL";
			}
			if (c_type) {
				q+= " AND content_type='"+c_type.type+"'";
				if (f_type) q+= " AND file_type='"+f_type.type+"'";	
			}
			if (channel) q+= " AND channel='"+channel.channel_address+"'";
			if (hidden_channels && moderations !== false) {
				q += " AND channel NOT IN ("; 
				hidden_channels.forEach(function(hc,index){
					if (index > 0) q+=",";
					q+= "'"+hc+"'";
				});
				q += ")";	
			}
			if (hidden_users && moderations !== false) {
				hidden_users.forEach(function(hu,index){
					q+= " AND channel NOT LIKE '%"+hu+"'";
				});
			}
			query = [q];
			return query;
		};

		// generate pagination
		Item.generateItemsPagination = function(config,categories,category,subcategory,content_types,c_type,f_type) {
			var pagination = {}
			pagination.items_per_page = config.listing.items_per_page
			if (config.listing.type === 'by category'){
				if (subcategory){
					pagination.totalItems = subcategory.total;
				} else if (category){
					pagination.totalItems = category.total;
				} else {
					pagination.totalItems = categories[0].total;
				}
			} else if (config.listing.type === 'by content type'){
				if (f_type){
					pagination.totalItems = f_type.total;
				} else if (c_type){
					pagination.totalItems = c_type.total;
				} else {
					pagination.totalItems = content_types[0].total;
				}
			}
			if (config.listing.current){
				pagination.currentPage = filter.current;
			} else {
				pagination.currentPage = 1;
			}

			pagination.numPages = pagination.totalItems / pagination.items_per_page;
			return pagination;
		};

		// generate items query
		Item.generateItemsQuery = function(config,pagination,category,subcategory,channel,title,content_type,moderations,hidden_channels,hidden_users,c_type,f_type,sort_by,limit){
			var q = "SELECT i.*, c.*, count(cm.item_id) as comment_count";
			// q+= ", (SELECT count(*) FROM comment WHERE comment.item_id=i.item_id) as comment_count";
			q+= ", (SELECT count(*) FROM vote WHERE vote.item_id=i.item_id AND vote.vote=1) as up_votes";
			q+= ", (SELECT count(*) FROM vote WHERE vote.item_id=i.item_id AND vote.vote=0) as down_votes";
			q+= " FROM item AS i";
			q+= " JOIN channel AS c ON i.channel=c.channel_address";
			q+= " LEFT JOIN comment AS cm ON i.item_id=cm.item_id";
			q+= " LEFT JOIN ( SELECT item_id, sum(case when vote = 1 then 1 else 0 end) - sum(case when vote = 0 then 1 else 0 end) diff FROM vote GROUP BY item_id ) AS v ON i.item_id = v.item_id";
			q+= " LEFT JOIN ( SELECT count(*) FROM comment) AS cm ON i.item_id = cm.item_id";
			q+= " WHERE i.item_id IS NOT NULL";
			if (content_type) q+=" AND i.content_type='"+content_type.split('s')[0]+"'";
			if (config.listing.type === 'by category'){
				if (category) q+= " AND i.category='"+category.category_id+"'";
				if (subcategory) q+= " AND i.subcategory='"+subcategory.category_id+"'";
			} else if (config.listing.type === 'by content type') {
				if (c_type) q+= " AND i.content_type='"+c_type.type+"'";
				if (f_type) q+= " AND i.file_type='"+f_type.type+"'";				
			}
			if (channel) q+= " AND i.channel='"+channel.channel_address+"'";
			if (title) q+=" AND i.title LIKE '%"+title+"%'";
			if (hidden_channels && moderations !== false) {
				q+= " AND i.channel NOT IN ("; 
				hidden_channels.forEach(function(hc,index){
					if (index > 0) q+=",";
					q+= "'"+hc+"'";
				});
				q+= ")";	
			}
			if (hidden_users && moderations !== false) {
				hidden_users.forEach(function(hu,index){
					q+= " AND i.channel NOT LIKE '%"+hu+"'";
				});
			}
			q+= " GROUP BY i.item_id"
			if (sort_by) q+= " ORDER BY "+sort_by.val+"";
			if (pagination){
				q+= " LIMIT " + parseInt(pagination.items_per_page);
				if (pagination.currentPage > 1) q+= " OFFSET "+((pagination.currentPage - 1) * pagination.items_per_page);
			}
			query = [q];
			return q;
		}

		// get item site file
		Item.getItemSiteFile = function(item,clusters){
			clusters.forEach(function(cluster,index){
				if (cluster.cluster_id === item.cluster_id){
					cluster.files.forEach(function(file,index){
						var path = 'data/users/'+item.channel_address.split('_')[1]+'/'+item.file_name;
						if (file.inner_path === path){
							item.file = file;
							item.peer = item.file.peer;
						} else {
							item.peer = 0;
						}
					});
				}
			});
			return item;
		}

		/** /LIST **/

		return Item;
	}
]);