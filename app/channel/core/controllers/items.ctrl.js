 app.controller('ItemsCtrl', ['$scope','$rootScope','$location',
	function($scope,$rootScope,$location) {

		/** INIT **/

			// get item
			$scope.getItem = function(){
				$scope.showLoadingMsg('Loading');
				var itemId = $location.$$absUrl.split('+id=')[1].split('&')[0];
				var itemType = $location.$$absUrl.split('+type=')[1].split('+id=')[0];
				$scope.chJson.items[itemType + 's'].forEach(function(item,index){
					if (item.item_id === itemId){
						$scope.item = item;
						$scope.item.channel = $scope.chJson.channel;
						$scope.itemIndex = index;
						$scope.loading = false;
					}
				});
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
			$scope.uploadPosterImage = function(item,mode){
				$scope.showLoadingMsg('uploading poster image');
				var poster_path = 'merged-IFS/'+$scope.channel.cluster_id+'/data/users/'+$scope.page.site_info.auth_address+'/'+item.poster_file;
				Page.cmd("fileWrite",[poster_path, item.poster.split('base64,')[1] ], function(res) {
					delete item.poster;
					if (mode === 'create'){
						$scope.createItem(item);
					} else if (mode === 'edit') {
						$scope.updateItem(item);
					}
				});
			};

		/** /UPLOAD **/

		/** CRUD **/

			// update item
			$scope.updateItem = function(item){
				$scope.showLoadingMsg('updating ' + item.content_type + ' record');
				// prepare item				
				$scope.chJson.items[item.content_type + 's'].splice($scope.itemIndex,1);
				$scope.chJson.items[item.content_type + 's'].push(item);
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

	}
]);
