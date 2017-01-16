app.directive('videoList', ['$mdDialog','$mdMedia',
	function($mdDialog,$mdMedia) {

		// game interface controller
		var controller = function($scope,$element) {

		    // video preview dialog
			$scope.videoPreviewDialog = function(ev,item) {

				$scope.status = '';
				$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
			    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
				// video player
				var player = {
					autoPlay:true,
					sources: [
						{
							src:'/'+$scope.site_address+'/uploads/videos/'+item.file_name,
							type:'video/'+item.file_type
						}
					],
					theme: "/" + $scope.site_address + "/assets/lib/videos/videogular-themes-default/videogular.css"
				};

			    var dialogTemplate = '<md-dialog aria-label="{{items.item.title}}">' +
									    '<md-toolbar>' +
									    	'<div class="md-toolbar-tools">' +
										        '<h2>{{items.item.title}}</h2>' +
									    	'</div>' +
									    '</md-toolbar>' +
									    '<md-dialog-content layout-padding>' +
											'<md-content id="video-dialog-container" style="width:700px;">' +
												'<video-player ng-init="initVideoPlayer(items.player)"></video-player>' +
											'</md-content>' +
									    '</md-dialog-content>' +
									  '</md-dialog>';

			    $mdDialog.show({
					controller: DialogController,
					template: dialogTemplate,
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose:true,
					fullscreen: useFullScreen,
					locals: {
						items: {
							item:item,
							player:player
						}
					}
			    });

			};
		};

		// dialog controller
		var DialogController = function($scope, $mdDialog,$rootScope,items) {

			// items
			$scope.items = items;

			$scope.hide = function() {
				$mdDialog.hide();
			};
			
			$scope.cancel = function() {
				$mdDialog.cancel();
			};
			
			$scope.answer = function(answer) {
				$mdDialog.hide(answer);
			};

		};

		var template =  '<ul class="item-list">' +
							'<li ng-if="item.published !== false"' +
								'ng-repeat="item in chJson.videos | orderBy:\'-date_added\' track by $index">' +
								'<!-- item info -->' +
								'<div class="item-info">' +
							    	'<span ng-click="videoPreviewDialog($event,item)" class="title">{{item.title}} • </span>' +
									'<span ng-if="item.total_time">{{item.total_time|date:"mm:ss"}} • </span>' +
									'<span ng-if="item.file_size">{{item.file_size|filesize}} • </span>' +
									'<span><i am-time-ago="item.date_added"></i></span>' +
								'</div>' +
								'<!-- /item info -->' +
								'<!-- item options menu -->' +
								'<div class="item-options" ng-if="owner">' +
									'<span ng-click="deleteItem(item)" class="glyphicon glyphicon-trash"></span>' +
									'<a href="/{{site_address}}/edit.html?item={{item.video_id}}type=video">' +
									'<span class="glyphicon glyphicon-pencil"></span></a>' +
									'<span ng-click="videoPreviewDialog($event,item)" class="glyphicon glyphicon-eye-open"></span>' +
								'</div>' +
								'<!-- /item options menu -->' +
							'</li>' +
						'</ul>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);