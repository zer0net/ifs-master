app.directive('itemView', [
	function() {

		// item view controller
		var controller = function($scope,$element) {

			// init item view
			$scope.initItemView = function(){
				// item type & id 
				$scope.item_type = window.location.href.split('&')[0].split('type=')[1].split('+id=')[0];
				$scope.item_id = window.location.href.split('&')[0].split('type=')[1].split('+id=')[1];
			};

			// get item
			$scope.getItem = function(){
				// loop through games array
				$scope.items[$scope.item_type + 's'].forEach(function(item,index){
					// if item id & channel exist in array
					if (item.item_id === $scope.item_id){
						if (!item.is_downloaded){
							$scope.error_msg = 'file not found! downloading ...';
							$scope.forceFileDownload(item);
						} else {
							$scope.item = item;
						}
					}
				});
			};

			// force file download
			$scope.forceFileDownload = function(item){
				// xhttp get dos file
				var inner_path = "merged-"+$scope.page.site_info.content.merger_name+"/"+item.channel.cluster_id+"/data/users/"+item.channel.user_id+"/"+item.file_name;
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					console.log(this);
					if (this.readyState === 4){
						console.log('file ready');
						$scope.getSiteFileInfo(item);
						$scope.item = item;
						$scope.$apply();
					} else {
						console.log("file not found!");
					}
				};
				xhttp.open("GET", inner_path, true);
				xhttp.send();
			};

			// get site file info
			$scope.getSiteFileInfo = function(item){
				// get optional files info
				Page.cmd("optionalFileList", { address: item.channel.cluster_id, limit:2000 }, function(site_files){
					// for each site file
					site_files.forEach(function(site_file){
						if (site_file.inner_path === 'data/users/'+item.channel.user_id+'/'+item.file_name){
							for (var attr in site_file){
								// assign corresponding site_file attributes to item
								item[attr] = site_file[attr]
							}
							$scope.item = item;
							// apply scope
							$scope.$apply();
						}
					});
				});
			};

		};

		var template =  '<section ng-init="initItemView()" flex layout="row" layout-padding class="container" style="padding-top: 50px;">' +
						    '<main flex layout="column" class="section games-section">' +
							    '<div ng-if="item_type === \'game\'">' +
							    	'<!-- game -->' +
									'<game-view ng-if="items"></game-view>' +
									'<!-- /game -->' +
								'</div>' +
								'<div ng-if="item_type === \'video\' || item_type === \'audio\'">' +
									'<!-- video  -->' +
									'<video-view ng-if="items"></video-view>' +
									'<!-- /video -->' +
								'</div>' +
								'<div ng-if="item_type === \'book\'">' +
									'<!-- book  -->' +
									'<book-view ng-if="items"></book-view>' +
									'<!-- /book -->' +
								'</div>' +
						    '</main>' +
						'</section>';

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);