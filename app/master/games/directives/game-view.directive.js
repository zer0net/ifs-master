app.directive('gameView', ['$location','$rootScope','Item',
	function($location,$rootScope,Item) {

		var controller = function($scope,$element){
			$scope.initView = function(item){
				$scope.item = Item.getItemSiteFile($scope.item,$scope.clusters);
				if (!$scope.item.file || !$scope.item.file.is_downloaded){
					$scope.error_msg = 'file not found! downloading ...';
					var inner_path = "/"+$scope.page.site_info.address+"/merged-"+$scope.page.site_info.content.merger_name+"/"+$scope.item.cluster_id+"/data/users/"+$scope.item.channel_address.split('_')[1]+"/"+$scope.item.file_name;
					$scope.forceFileDownload(inner_path,item);
				}
			};

			// force file download
			$scope.forceFileDownload = function(inner_path,item){
				// xhttp get dos file
				console.log(inner_path);
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
					console.log(site_files);
					$scope.$apply(function(){
						// for each site file
						site_files.forEach(function(site_file){
							if (site_file.inner_path.split('/')[3] === item.file_name){
								item.file = site_file;
							}
						});
					});
				});
			};

		};

		var template = '<div class="item-view" ng-init="initView(item)">' +
							'<div id="pause-overlay" ng-show="is_paused" ng-click="resumeGame()">' +
								'<div>' +
									'<b>Paused</b>' +
									'<span>double click here to resume</span>' +
								'</div>' +
							'</div>' +
							'<!-- game -->' +
							'<md-content class="game-ui-container" ng-if="item">' +
								'<!-- dosbox -->' +
								'<dosbox ng-if="item.file_type === \'zip\' && !error_msg" ng-init="initDosBox(item)"></dosbox>' +
								'<!-- /dosbox -->' +
								'<!-- nes -->' +
								'<nes-emulator ng-if="item.file_type === \'nes\' && !error_msg" ng-init="initNesEmulator(item)"></nes-emulator>' +
								'<!-- /nes -->' +
								'<!-- cpc -->' +
								'<cpc-emulator ng-if="item.file_type === \'sna\' && !error_msg"  ng-init="initCpcEmulator(item)"></cpc-emulator>' +
								'<!-- /cpc -->' +
								'<!-- atari -->' +
								'<atari-emulator ng-if="item.file_type === \'bin\' && !error_msg" ng-init="initAtariEmulator(item)"></atari-emulator>' +
								'<!-- atari -->' +
								'<!-- loading -->' +
								'<div id="item-loading" layout="column" flex="100" ng-if="error_msg" ng-hide="item.file && item.file.is_downloaded">' +
								    '<div layout="column" flex="100" style="text-align:center;">' +
								        '<span><b>file not in cache...<br/> downloading {{item.file_size|filesize}} now</b></span>' +
								    '</div>' +
								    '<div layout="row" flex="100" layout-align="space-around">' +
								        '<md-progress-circular md-mode="indeterminate"></md-progress-circular>' +
								    '</div>' +
								'</div>' +
								'<!-- /loading -->' +
							'</md-content>' +
							'<!-- /game -->' +
						'</div>';


		return {
			restrict: 'AE',
			controller:controller,
			template:template,
			replace:true
		}

	}
]);