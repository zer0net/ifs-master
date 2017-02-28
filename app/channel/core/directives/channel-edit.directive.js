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
							$scope.showPreviewImage(file);
						}
					}
				};
			};

			// show preview image
			$scope.showPreviewImage = function(file){
				// reader on load
				reader.onload = function(){
					var file_name = file.name.split(' ').join('_').normalize('NFKD').replace(/[\u0300-\u036F]/g, '').replace(/ß/g,"ss").split('.' + file.file_type)[0].replace(/[^\w\s]/gi, '') + '.' + file.type.split('/')[1];
					$scope.file = file;
					$scope.chJson.channel.logo_file = file_name;
					// apply to scope
					$scope.$apply(function() {
						$scope.imgSrc = reader.result;
					});
				};
				reader.readAsDataURL(file);
			};

			// upload logo image
			$scope.uploadLogoImage = function(chJson){
				var logo_path = 'merged-IFS/'+$scope.chJson.channel.cluster_id+'/data/users/'+$scope.page.site_info.auth_address+'/'+$scope.chJson.channel.logo_file;
				Page.cmd("fileWrite",[logo_path, $scope.imgSrc.split('base64,')[1] ], function(res) {
					$scope.updateChannelRecord(chJson.channel);
				});
			};

			// save channel details
			$scope.onUpdateChannel = function(chJson) {
				console.log(chJson);
				if ($scope.file){ 
					$scope.uploadLogoImage(chJson);
				} else { 
					$scope.updateChannelRecord(chJson.channel);
				}
			};

		};

		var template = '<md-content>' +
							'<div class="section-body" layout="row">' +
								'<figure flex="20">' +
									'<img  ng-if="channel.logo_file" style="width:100%;" ng-src="/{{page.site_info.address}}/{{channel.cluster_id}}/data/users/{{channel.user_id}}/{{chJson.channel.logo_file}}" id="current_image"/>' +
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