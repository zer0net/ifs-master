app.directive('videoPlayer', ['$sce','$timeout',
	function($sce,$timeout) {

		// video interface player
		var controller = function($scope,$element) {

		    // load video
		    $scope.loadVideo = function(item){
		    	console.log(item);
		    	if (item.file_type === 'ogv'){
		    		item.file_type = 'ogg';
		    	}

		    	$scope.playerErrors = 0;
		    	$scope.item = item;
		    	$scope.screenSize = 'normal';

		    	if (!$scope.player){
					$scope.player = {
						preload: "none",
						autoPlay:true,
						sources: [
							{
								src:'merged-'+$scope.page.site_info.content.merger_name+'/' + item.channel.cluster_id + '/data/users/' + item.channel.channel_address.split('_')[1] + '/' + item.file_name,
								type:item.content_type + '/' + item.file_type
							}
						],
						theme: "assets/lib/videos/videogular-themes-default/videogular.css"
					};
		    	}
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

		var template =	'<section ng-init="loadVideo(item)">' +
							'<videogular ng-if="player" class="md-whiteframe-1dp {{screenSize}}"' +
								'vg-auto-play="player.autoPlay" ' +
								'vg-player-ready="onPlayerReady($API)" ' +
								'vg-error="onPlayerError($event)"' +
								'vg-theme="player.theme" ' +
								'class="{{screenSize}}"' +
								'style="width:100%; height:400px;">' +
									'<vg-media vg-src="player.sources" vg-tracks="player.tracks"></vg-media>' +
									'<vg-controls>' +
										'<vg-play-pause-button></vg-play-pause-button>' +
										'<vg-time-display>{{ currentTime | date:"mm:ss" }}</vg-time-display>' +
										'<vg-scrub-bar>' +
											'<vg-scrub-bar-buffer ng-if="!player.Buffer"></vg-scrub-bar-buffer>' +
											'<div class="vg-scrub-bar-buffered" ng-if="player.Buffer" style="width:{{item.loadingPercent}}%;"></div>' +
											'<vg-scrub-bar-current-time></vg-scrub-bar-current-time>' +
										'</vg-scrub-bar>' +
										'<vg-time-display>{{ timeLeft | date:"mm:ss" }}</vg-time-display>' +
										'<vg-volume>' +
											'<vg-mute-button></vg-mute-button>' +
											'<vg-volume-bar></vg-volume-bar>' +
										'</vg-volume>' +
										'<vg-fullscreen-button ng-click="onFullScreenClick()"></vg-fullscreen-button>' +
									'</vg-controls>' +
									'<vg-poster vg-url="player.plugins.poster" ng-if="player.plugins"></vg-poster>' +
									'<vg-overlay-play ng-hide="player.error"></vg-overlay-play>' +
									'<vg-buffering></vg-buffering>' +
							'</videogular>' +
						'</section>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);