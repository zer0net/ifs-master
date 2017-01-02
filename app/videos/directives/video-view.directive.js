app.directive('videoView', ['$location',
	function($location) {

		var controller = function($scope,$element) {

			// init video view
			$scope.initVideoView = function(){
				if ($location.$$absUrl.indexOf('view.html') > -1){
					$scope.viewType = 'video';
					var channelId = $location.$$absUrl.split('&')[0].split('c=')[1].split('v=')[0];
					var videoId = parseInt($location.$$absUrl.split('&')[0].split('c=')[1].split('v=')[1]);
					$scope.getRefVideo(channelId,videoId);
				};
			};

			// get ref video
			$scope.getRefVideo = function(channelId,videoId){
				console.log(channelId,videoId);
				$scope.showLoadingMessage('Loading Video');
				var inner_path = 'merged-'+$scope.merger_name+'/'+channelId+'/data/channel.json';
				Page.cmd("fileGet",{"inner_path":inner_path},function(data){
					data = JSON.parse(data);
					data.videos.forEach(function(video,index){
						if (video.video_id === videoId){
							console.log(video);
							$scope.sites.forEach(function(site,index){
								if (site.address === video.channel){
									video.channel = site;
								}
							});
							$scope.$apply(function(){
								$scope.loadVideo(video);
							});
						}
					});
				});
			};

		    // load video
		    $scope.loadVideo = function(video){
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