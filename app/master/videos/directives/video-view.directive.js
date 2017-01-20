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

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
		}

	}
]);