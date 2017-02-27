 app.controller('ItemsCtrl', ['$scope','$rootScope','$location',
	function($scope,$rootScope,$location) {

		/** INIT **/

			// get item
			$scope.getItem = function(){
				$scope.showLoadingMsg('Loading');
				var itemId = parseInt($location.$$absUrl.split('item=')[1].split('type=')[0]);
				var itemType = parseInt($location.$$absUrl.split('item=')[1].split('type=')[1]);
				$scope.media_types.forEach(function(media_type,index){
					$scope.chJson[media_type].forEach(function(item,index){
						if (item.game_id === itemId ||
							item.video_id === itemId){
							$scope.item = item;
							$scope.itemIndex = index;
							$scope.finishLoading();
						}
					});
				});
			};

			// generate item properties
			$scope.generateItemProperties = function(){
				$scope.itemProperties = [];
				for (var i in $scope.item){
					// create property obj
					var property = {
						key:i.split('_').join(' '),
						value:$scope.item[i]
					};
					// set property type
					if (property.key.indexOf('size') > -1) {property.type = 'size'}
					else if (property.key.indexOf('date') > -1) {property.type = 'date'}
					else if (property.key.indexOf('time') > -1) {property.type = 'time'}
					else {property.type = 'normal'}
					// ommit redundant properties
					if (property.key !== 'channel' && 
						property.key !== 'img' && 
						property.key !== 'file' && 
						property.key !== 'video' &&
						property.key !== 'published' &&
						property.key !== 'path' &&
						property.key !== 'imgPath'){ 
						// push to item properties array
						$scope.itemProperties.push(property); 
					}
				}
				console.log($scope.item);
			};

			// init list
			$scope.initList = function(){
				// if channel json has items
				if ($scope.chJson[$scope.media_type]){
					// loop through items in channel.json
					$scope.chJson[$scope.media_type].forEach(function(item,index){
						// if at least one item is unpublished, show unpublished items section
						if (item.published === false){
							var item_id_name;
							var item_type;
							if (item.file_type === 'zip' || item.file_type === 'nes'){
								item_id_name = 'game_id';
								item.item_type = 'game';
							} else {
								item_id_name = 'video_id';
								item.item_type = 'video';
							}
							item.edit_url = 'edit.html?item='+item[item_id_name]+'type='+item.item_type;
							console.log(item);
							$scope.unpublished_items = true;
						}
					});
				}
			};

		/** /INIT **/

		/** UPLOAD **/

			// prepare item
			$scope.prepareItem = function(item){
				if (item.media_type === 'game'){
					$scope.media_type = 'games';
					$scope.item_id_name = 'game_id';
					item.path = 'uploads/games/' + item.zip_name;
					if (item.file_type === 'nes') item.path = 'uploads/games/' + item.file_name;
					if (item.img) item.imgPath = 'uploads/posters/' + item.zip_name.split('.zip')[0] + '.png';
				} else if (item.media_type === 'video'){
					$scope.media_type = 'videos';
					$scope.item_id_name = 'video_id';
					item.path = 'uploads/videos/' + item.file_name;
					if (item.img) item.imgPath = 'uploads/posters/' + item.file_name.split('.' + item.file_type)[0] + '.png';
				}
				return item;
			};

			// upload item
			$scope.uploadItem = function() {
				// loading
				$scope.showLoadingMsg('uploading ' + $scope.item.media_type );
				// prepare item				
				$scope.item = $scope.prepareItem($scope.item);
				// file path
				Page.cmd("fileWrite",[$scope.item.path, $scope.item.file.split('base64,')[1] ], function(res) {
					console.log(res);
					if ($scope.item.img){
						$scope.uploadPosterImage();
					} else {
						$scope.createItem();
					}
				});
			};

			// upload poster image
			$scope.uploadPosterImage = function(){
				$scope.showLoadingMsg('uploading poster image');
				Page.cmd("fileWrite",[$scope.item.imgPath, $scope.item.img.split('base64,')[1] ], function(res) {
					if ($scope.mode === 'create'){
						$scope.createItem();
					} else if ($scope.mode === 'edit') {
						$scope.updateItem();
					}
				});
			};

		/** /UPLOAD **/

		/** CRUD **/

			// create item
			$scope.createItem = function(){
				// loading message
				$scope.showLoadingMsg('creating ' + $scope.item.media_type + ' record');
				if (!$scope.chJson[$scope.media_type]){
					$scope.chJson[$scope.media_type] = [];
					if (!$scope.chJson.next_item_id) $scope.chJson.next_item_id = 1;
				}
				// delete redundant attributes
				delete $scope.item.file;
				delete $scope.item.img;
				// item id
				$scope.item[$scope.item_id_name] = $scope.chJson.next_item_id;				
				// item channel
				$scope.item.channel = $scope.site_address;
				// item date added
				$scope.item.date_added = +(new Date);
				// item published
				$scope.item.published = true;
				// item id update
				$scope.chJson.next_item_id += 1;
				// push item to channel json items
				$scope.chJson[$scope.media_type].push($scope.item);
				// update channel json
				$scope.updateChannelJson();
			};

			// create items - bulk
			$rootScope.$on('onCreateItems',function(event,mass){
				mass.forEach(function(itm,index){
					console.log(itm);
			    	// new item
					var splitByLastDot = function(text) {
					    var index = text.lastIndexOf('.');
					    return [text.slice(0, index), text.slice(index + 1)]
					}
					var file_type = splitByLastDot(itm.file_name)[1];
					item = {
						"file_type":file_type,
						"channel":$scope.site_address,
						"title": itm.title,
						"description":itm.description,
						"date_added": +(new Date),
						"published":false
					};
					var item_id_name;
					var item_file_name;
					if (file_type === 'zip') {
						item_id_name = 'game_id';
						item_file_name = 'zip_name';						
						item.zip_size = itm.file.size;
						item.media_type = 'game';
						item.path = 'uploads/games/'+itm.file_name;
					} else if (file_type === 'nes') {
						item_id_name = 'game_id';
						item_file_name = 'file_name';						
						item.file_size = itm.file.size;
						item.media_type = 'game';
						item.path = 'uploads/games/'+itm.file_name;
					} else {
						item_id_name = 'video_id';
						item_file_name = 'file_name';						
						item.media_type = 'video';
						item.file_size = itm.file.size;
						item.path = 'uploads/videos/'+itm.file_name;						
					}
					// item file name
					item[item_file_name] = itm.file_name;					
					// item id
					item[item_id_name] = $scope.chJson.next_item_id;
					// item id update
					$scope.chJson.next_item_id += 1;
					// push item to channel json items
					$scope.chJson[$scope.media_type].push(item);
				});
				// update channel json
				$scope.updateChannelJson();
			});

			// update item
			$scope.updateItem = function(){
				$scope.showLoadingMsg('updating ' + $scope.item.media_type + ' record');
				if ($scope.item.file_name) {
					$scope.item.published = true;
				}
				// prepare item				
				$scope.item = $scope.prepareItem($scope.item);
				$scope.chJson[$scope.media_type].splice($scope.itemIndex,1);
				$scope.chJson[$scope.media_type].push($scope.item);
				$scope.updateChannelJson();
			};

			// delete item
			$scope.deleteItem = function(item) {
				// loading				
				$scope.showLoadingMsg('deleting ' + item.content_type);
				// get item index
				var itemIndex;
				$scope.chJson.items[item.content_type + 's'].forEach(function(itm,index) {
					if (item.item_id === itm.item_id){
						itemIndex = index;
					}
				});
				// remove item from channel.json
				$scope.chJson.items[item.content_type + 's'].splice(itemIndex,1);
				// delete item file
				var inner_path = 'merged-IFS/'+$scope.channel.cluster_id+'/data/users/'+$scope.page.site_info.auth_address+'/'+item.file_name;
				Page.cmd("fileDelete", [inner_path], function(res) {	
					console.log(res);
					$scope.updateChannelJson();
				});
			};

		/** /CRUD **/

		/** UI **/

			// loading & msg
			$scope.showLoadingMsg = function(msg){
				$scope.msg = msg;
				$scope.loading = true;
			};

			// finish loading
			$scope.finishLoading = function(){
				$scope.loading = false;
			};

		/** /UI **/

	}
]);
