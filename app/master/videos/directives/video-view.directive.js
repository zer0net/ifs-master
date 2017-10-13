app.directive('videoView', ['$location','Item',
	function($location,Item) {

		var controller = function($scope,$element){
			$scope.initView = function(item){
				$scope.item = Item.getItemSiteFile($scope.item,$scope.clusters);
				if (!$scope.item.file || !$scope.item.file.is_downloaded){
					$scope.error_msg = 'file not found! downloading ...';
					var inner_path = "/"+$scope.page.site_info.address+"/merged-"+$scope.page.site_info.content.merger_name+"/"+$scope.item.cluster_id+"/data/users/"+$scope.item.channel_address.split('_')[1]+"/"+$scope.item.file_name;
					$scope.forceFileDownload(inner_path,item);
				} else {
					$scope.file_exists = true;
				}
			};

			// force file download
			$scope.forceFileDownload = function(inner_path,item){
				// xhttp get dos file
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState === 4){
						console.log("file ready");
						delete $scope.error_msg;						
						$scope.getSiteFileInfo(item);
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
				Page.cmd("optionalFileList", { address: item.cluster_id, limit:2000 }, function(site_files){
						$scope.$apply(function(){
						// for each site file
						site_files.forEach(function(site_file){
							if (site_file.inner_path.split('/')[3] === item.file_name){
								item.file = site_file;
								$scope.file_exists = true;
							}
						});
					});
				});
			};

		};

		var template =  '<div class="item-view" layout="column">' +
							'<!-- video main -->' +
							'<md-content flex="100" class="item-view video-view" ng-if="item" ng-init="initView(item)">' +
								'<div>' +
									'<!-- player -->' +
									'<video-player ng-if="!error_msg && file_exists"></video-player>' +
									'<!-- /player -->' +
									'<!-- loading -->' +
									'<div id="item-loading" layout="column" flex="100" ng-if="error_msg" ng-hide="item.file && item.file.is_downloaded">' +
									    '<div layout="column" flex="100" style="text-align:center;">' +
									        '<span><b>file not in cache...<br/> downloading {{item.file_size|filesize}} now</b></span>' +
									    '</div>' +
									    '<div layout="row" flex="100" layout-align="space-around">' +
									        '<md-progress-circular md-mode="indeterminate"></md-progress-circular>' +
									    '</div>' +
									'</div>' +
									'<div id="item-loading" layout="column" flex="100" ng-if="!file_exists && !error_msg">' +
									    '<div layout="column" flex="100" style="text-align:center;">' +
									        '<span><b>Video could not be found or loaded correctly<br/> please re-try again now or later.</b></span>' +
									    '</div>' +
									'</div>' +
									'<!-- /loading -->' +
								'</div>' +
							'</md-content>' +
							'<!-- /video main -->' +
						'</div>';

		return {
			restrict: 'AE',
			replace:false,
			controller:controller,
			template:template
		}

	}
]);