app.directive('videoView', ['$location',
	function($location) {

		// video view controller
		var controller = function($scope,$element) {

			// init video view
			$scope.initVideoView = function(video) {
				$scope.video = video;
			};

		    // load video
		    $scope.loadVideo = function(video){
		    	
		    	if (video.file_type === 'ogv'){
		    		video.file_type = 'ogg';
		    	}

		    	$scope.playerErrors = 0;
		    	$scope.video = video;
		    	$scope.screenSize = 'normal';

				$scope.player = {
					preload: "none",
					autoPlay:true,
					sources: [
						{
							src:'merged-'+$scope.merger_name+'/' + video.channel.address + '/uploads/videos/' + video.file_name,
							type:'video/'+video.file_type
						}
					],
					theme: "assets/lib/videos/videogular-themes-default/videogular.css"
				};
				$scope.finishedLoading();
		    };

		    // on player ready
		    $scope.onPlayerReady = function(API){
				$scope.API = API;
				$scope.API.finishedLoading = true;
		    };

		    // on player error
		    $scope.onPlayerError = function(state){
	    		$scope.player.error = true;
	    		$scope.player.message = 'File not found'
		    };

		    // on hide spinner
		    $scope.onHideSpinner = function() {
		    	$scope.player.done = true;
		    };

		    // on full screen click
			$scope.onFullScreenClick = function() {
				console.log($scope.screenSize);
				if ($scope.screenSize === 'full-screen'){
					$scope.screenSize = 'normal';
				} else {
					$scope.screenSize = 'full-screen';						
				}
			};

		};

		var template =  '<div class="item-view" layout="row" layout-padding ng-init="getItem(item)">' +
							'<!-- video main -->' +
							'<md-content class="item-view video-view" flex="65">' +
								'<div ng-if="video" ng-init="loadVideo(video)">' +
									'<!-- player -->' +
									'<section>' +
										'<video-player></video-player>' +
									'</section>' +
									'<!-- /player -->' +
									'<hr class="divider"/>' +
									'<!-- info -->' +
									'<item-view-details ng-init="initItemViewDetails(video)"></item-view-details>' +
									'<!-- /info -->' +
									'<hr class="divider"/>' +
									'<!-- comments -->' +
									'<item-view-comments ng-init="initItemViewComments(video)"></item-view-comments>' +
									'<!-- /comments -->' +
								'</div>' +
							'</md-content>' +
							'<!-- /video main -->' +
							'<!-- video list -->' +
							'<md-content class="video-list" flex="35"  ng-if="videos" style="background-color: transparent;">' +
								'<video-list-sidebar></video-list-sidebar>' +
							'</md-content>' +
							'<!-- /video list -->' +
						'</div>';

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);