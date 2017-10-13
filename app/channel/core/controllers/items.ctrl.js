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

		/** /INIT **/

		/** CRUD **/

			// upload poster image
			$scope.uploadPosterImage = function(item,mode){
				// set timeout for info message
				$scope.setInfoMsgTimeOut();							
				$scope.showLoadingMsg('uploading poster image');
				var poster_path = $scope.inner_path + item.poster_file;
				Page.cmd("fileWrite",[poster_path, item.poster.split('base64,')[1] ], function(res) {
					// hide info msg
					$scope.hideInfoMsg();
					delete item.poster;
					if (mode === 'create'){
						$scope.createItem(item);
					} else if (mode === 'edit') {
						$scope.updateItem(item);
					}
				});
			};

			// update item
			$scope.updateItem = function(item){
				// set timeout for info message
				$scope.setInfoMsgTimeOut();				
				$scope.showLoadingMsg('updating ' + item.content_type);
				Page.cmd("fileGet",{"inner_path": $scope.inner_path + 'data.json'},function(data){
					// hide info msg
					$scope.hideInfoMsg();
					data = JSON.parse(data);
					var itemIndex;
					data.item.forEach(function(itm,index){
						if (item.channel === itm.channel){
							itemIndex = index;
						}
					});
					// remove vote from vote.json
					data.item.splice(itemIndex,1);
					data.item.push(item);
					// write to file
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));					
					Page.cmd("fileWrite", [$scope.inner_path + 'data.json', btoa(json_raw)], function(res) {
						// sign & publish site
						Page.cmd("sitePublish",{"inner_path": $scope.inner_path + 'data.json'}, function(res) {
							Page.cmd("wrapperNotification", ["done", "Channel Updated!", 10000]);
							$scope.publishSite();
						});
					});
				});
			};

			// delete item
			$scope.onDeleteItem = function(item) {
				// loading				
				$scope.showLoadingMsg('deleting ' + item.content_type);
				$scope.deleteItem(item);
			};

			// delete item
			$scope.deleteItem = function(item) {
				// set timeout for info message
				$scope.setInfoMsgTimeOut();				
				Page.cmd("fileGet",{"inner_path":$scope.inner_path+'data.json'},function(data){
					// hide info msg
					$scope.hideInfoMsg();
					data = JSON.parse(data);
					// get item index
					var itemIndex;
					data.item.forEach(function(itm,index) {
						if (item.item_id === itm.item_id){
							itemIndex = index;
						}
					});
					// remove item from data.json
					data.item.splice(itemIndex,1);
					// delete item file
					console.log($scope.inner_path);
					Page.cmd("fileDelete", [$scope.inner_path+item.file_name], function(res) {	
						console.log(res);
						var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));
						// update data.json
						Page.cmd("fileWrite", [$scope.inner_path+'data.json', btoa(json_raw)], function(res) {
							// delete optional file
							Page.cmd("optionalFileDelete" ,{"inner_path":$scope.inner_path+'data.json'}, function(res){
								// sign & publish site
								Page.cmd("sitePublish",{"inner_path":$scope.inner_path+'data.json'}, function(res) {
									Page.cmd("wrapperNotification", ["done", "Item Deleted!",10000]);								
									$scope.publishSite();
								});
							});
						});
					});
				});
			};

		/** /CRUD **/

	}
]);
