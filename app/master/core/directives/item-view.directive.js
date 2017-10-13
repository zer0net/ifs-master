app.directive('itemView', ['Item','$rootScope','$location',
	function(Item,$rootScope,$location) {

		// item view controller
		var controller = function($scope,$element) {

			// init item view
			$scope.initItemView = function(){
				// item type & id 
				$scope.item_id = $location.$$absUrl.split('&')[0].split('id:')[1].split('+')[0];
				$scope.item_type = $location.$$absUrl.split('&')[0].split('type:')[1];
				var query = ["SELECT * FROM item JOIN channel ON item.channel=channel.channel_address WHERE item_id='"+$scope.item_id+"'"];
				Page.cmd("dbQuery",query,function(item){
					$scope.$apply(function(){
						if (item.length === 0){
							console.log('no items!');
							$scope.showErrorPage();
						} else {
							$scope.item = item[0];
						}
					});
				});			
			};


			// force file download
			$scope.forceFileDownload = function(inner_path,item){
				// xhttp get dos file
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState === 4){
						console.log("file ready");
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
								$scope.item.file = site_file;
							}
						});
						console.log($scope.item.file);
						delete $scope.error_msg;
					});
				});
			};

			// pause game
			$scope.pauseGame = function(){
				$scope.is_paused = true;
			};

			// resume game
			$scope.resumeGame = function(){
				$scope.is_paused = false;
			};

		};

		var template =  '<section ng-init="initItemView()" layout="column">' +
						    '<main flex class="view-section" ng-if="item">' +
							    '<div ng-if="item.content_type === \'game\'">' +
							    	'<!-- game -->' +
									'<game-view></game-view>' +
									'<!-- /game -->' +
								'</div>' +
								'<div ng-if="item.content_type === \'video\' || item.content_type === \'audio\'">' +
									'<!-- video  -->' +
									'<video-view></video-view>' +
									'<!-- /video -->' +
								'</div>' +
								'<div ng-if="item.content_type === \'book\'">' +
									'<!-- book  -->' +
									'<book-view></book-view>' +
									'<!-- /book -->' +
								'</div>' +
								'<div ng-if="item.content_type === \'image\'">' +
									'<!-- book  -->' +
									'<image-view></image-view>' +
									'<!-- /book -->' +
								'</div>' +
								'<div ng-if="item.file_type === \'pdf\'">' +
									'<!-- pdf  -->' +
									'<pdf-viewer></pdf-viewer>' +
									'<!-- /pdf -->' +
								'</div>' +
						    '</main>' +
						    '<section layout="row" ng-if="item">' +
							    '<section class="item-details-section" flex="65">' +
									'<!-- info -->' +
									'<item-view-details ng-init="initItemViewDetails(item)"></item-view-details>' +
									'<!-- /info -->' +
									'<hr class="divider"/>' +
									'<!-- embed -->' +
									'<item-view-embed ng-init="initItemEmbedCode(item)"></item-view-embed>' +
									'<!-- /embed -->' +
									'<hr class="divider"/>' +
									'<!-- comments -->' +
									'<item-view-comments ng-init="initItemViewComments(item)"></item-view-comments>' +
									'<!-- /comments -->' +
							    '</section>' +
							    '<section class="items-list-sections" flex="35">' +
							    	'<related-item-list></related-item-list>' +
							    '</section>' +
						    '</section>' +
						'</section>';

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);