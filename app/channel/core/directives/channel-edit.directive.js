app.directive('channelEdit', ['$sce','$location',
	function($sce,$location) {

		// channel edit controller
		var controller = function($scope,$element) {

			// file reader instance
			var reader = new FileReader();

			// init
			$scope.initChannelEdit = function (chJson,page,merger_name,channel) {
				
				// bind vars to scope
				$scope.chJson = chJson;
				$scope.page = page;
				$scope.merger_name = merger_name;
				$scope.channel = channel;

				// dropzone config
				$scope.dropzoneConfig = {	
				    'options': { // passed into the Dropzone constructor
				      'url': 'upload.php'
				    },
					'eventHandlers': {
						'sending': function (file, xhr, formData) {
							$scope.file = file;
							$scope.chJson.channel.img = file.name;
							$scope.showPreviewImage(file);
						}
					}
				};
			};

			// show preview image
			$scope.showPreviewImage = function(file){
				// reader on load
				reader.onload = function(){
					// apply to scope
					$scope.$apply(function() {
						// file url
						var dataURL = reader.result;
						var src = $sce.trustAsResourceUrl(dataURL);
						// temp scope var
						$scope.imgSrc = dataURL;
					});
				};
				reader.readAsDataURL(file);
			};

			// upload preview image
			$scope.uploadPreviewImage = function(){
			    var path = 'merged-' + $scope.merger_name + '/' + $scope.site.address + '/uploads/images/' + $scope.chJson.channel.img;
			    var previewImgUrl = $scope.imgSrc.split(',')[1];
				Page.cmd("fileWrite",{"inner_path":path,"content_base64": previewImgUrl, "ignore_bad_files": true}, function(res) {
					console.log(res);
					if (res === 'ok') $scope.updateChannelJson();
				});
			};

			// save channel details
			$scope.onUpdateChannel = function(chJson) {
				console.log(chJson);
				if ($scope.file){ 
					$scope.uploadPreviewImage();
				} else { 
					$scope.updateChannelRecord(chJson.channel);
				}
			};

		};

		var template = '<md-content>' +
							'<div class="section-body" layout="row">' +
								'<figure flex="20">' +
									'<img  ng-if="chJson.channel.img" style="width:100%;" ng-src="/{{page.site_info.address}}/{{channel.cluster_id}}/data/users/{{channel.user_id}}/{{chJson.channel.img}}" id="current_image"/>' +
									'<button dropzone="dropzoneConfig" ng-hide="imgSrc"> Drag and drop files here or click to upload</button>' +
									'<img style="width:100%;" ng-src="{{imgSrc}}" ng-show="imgSrc" id="image"/>' +
								'</figure>' +
								'<div class="channel-info" flex="80" layout-padding>' +
						        '<md-input-container class="md-block" flex-gt-sm>' +
						          	'<label>Channel Name</label>' +
									'<input type="text" ng-model="chJson.channel.channel_name">' +
						        '</md-input-container>' +
						        '<md-input-container class="md-block" flex-gt-sm>' +
						          	'<label>Channel Description</label>' +
									'<textarea ng-model="chJson.channel.channel_description"></textarea>' +
						        '</md-input-container>' +
								'<md-button class="md-primary md-raised edgePadding pull-right" ng-click="onUpdateChannel(chJson)">' +
						        	'<label>Update Channel</label>' +
						        '</md-button> ' +
								'</div>' +
							'</div>' +
						'</md-content>';

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template: template
		}

	}
]);