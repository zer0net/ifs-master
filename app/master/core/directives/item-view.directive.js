app.directive('itemView', [
	function() {

		// item view controller
		var controller = function($scope,$element) {

			// init item view
			$scope.initItemView = function(){
				// item type & id name
				$scope.item_type = window.location.href.split('&')[0].split('type=')[1].split('-')[0];
				$scope.item_id_name = $scope.item_type + '_id';
			};

			// get item
			$scope.getItem = function(){
				// item type & id name
				$scope.item_type = window.location.href.split('&')[0].split('type=')[1].split('-')[0];
				$scope.item_id_name = $scope.item_type + '_id';
				// get channels & item id from url
				var urlLetterVar = $scope.getUrlLetterVariable($scope.item_type);
				var channelId = window.location.href.split('&')[0].split('c=')[1].split(urlLetterVar + '=')[0];
				var itemId = parseInt(window.location.href.split('&')[0].split(urlLetterVar + '=')[1].split('z')[0]);
				// item media type
				var item_media_type = $scope.item_type + 's';
				console.log(item_media_type);
				console.log($scope.games);
				// loop through games array
				console.log($scope[item_media_type]);
				$scope[item_media_type].forEach(function(item,index){
					console.log(item);
					// if item id & channel exist in array
					if (item[$scope.item_id_name] === itemId && item.channel.address === channelId){
						console.log(item);
						// get site file info
						$scope.getSiteFileInfo(item);
					}
				});

			};

			// get url letter variable
			$scope.getUrlLetterVariable = function(item_type) {
				var urlLetterVar;
				if (item_type === 'game'){
					urlLetterVar = 'g';
				} else if (item_type === 'video'){
					urlLetterVar = 'v';
				} else if (item_type === 'audio'){
					urlLetterVar = 'a';
				} else if (item_type === 'book'){
					urlLetterVar = 'b';
				}
				return urlLetterVar;
			};

			// get site file info
			$scope.getSiteFileInfo = function(item){
				// get optional files info
				Page.cmd("optionalFileList", { address: item.channel.address, limit:2000 }, function(site_files){
					// for each site file
					site_files.forEach(function(site_file){
						if (site_file.inner_path === item.path){
							console.log('file found');
							// apply site file info to game obj
							item.site_file = site_file;
							// apply game to scope
							$scope[$scope.item_type] = item;
							console.log($scope[$scope.item_type]);
							// apply scope
							$scope.$apply();
						}
					});
					// if file is not in site_files
					if (!item.site_file){
						$scope.$apply(function(){
							$scope.error_msg = 'File not found. downloading ...';
							$scope.forceFileDownload(item);
						});
					}
				});
			};

			// force file download
			$scope.forceFileDownload = function(item){
				// xhttp get dos file
				var inner_path = "merged-"+$scope.merger_name+"/"+item.channel.address+"/"+item.path;
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState === 4){
						console.log('file ready');
						$scope.getSiteFileInfo(item);
					} else {
						console.log("file not found!");
					}
				};
				xhttp.open("GET", inner_path, true);
				xhttp.send();
			};

		};

		var template =  '<section ng-init="initItemView()" flex layout="row" layout-padding class="container" style="padding-top: 50px;">' +
						    '<main flex layout="column" class="section games-section">' +
							    '<div ng-if="item_type === \'game\'">' +
							    	'<!-- game -->' +
									'<game-view ng-if="games"></game-view>' +
									'<!-- /game -->' +
								'</div>' +
								'<div ng-if="item_type === \'video\'">' +
									'<!-- video  -->' +
									'<video-view ng-if="videos"></video-view>' +
									'<!-- /video -->' +
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