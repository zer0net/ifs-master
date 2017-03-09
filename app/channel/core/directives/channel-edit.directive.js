app.directive('channelEdit', ['$sce','$location','$rootScope',
	function($sce,$location,$rootScope) {

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
				console.log($scope.chJson);
				if ($scope.channel.logo_file) {
					$scope.channel.logo_path = '/'+$scope.page.site_info.address+'/merged-'+$scope.page.site_info.content.merger_name + '/' + $scope.channel.cluster_id + '/data/users/' + $scope.channel.user_id + '/' + $scope.channel.logo_file;

				}
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

			// select image as logo
			$scope.selectImageAsLogo = function(image){
				$scope.chJson.channel.logo_file = image.file_name;
			};

			// on upload click
			$scope.onUploadClick = function(){
				var view = 'upload';
				$rootScope.$broadcast('onRouteUserView',view);
				$scope.hide();			
			};

			/*
			// show preview image
			$scope.showPreviewImage = function(file){
				// reader on load
				reader.onload = function(){
					var file_name = file.name.split(' ').join('_').normalize('NFKD').replace(/[\u0300-\u036F]/g, '').replace(/ß/g,"ss").split('.' + file.file_type)[0].replace(/[^\w\s]/gi, '') + '.' + file.type.split('/')[1];
					$scope.chJson.channel.logo_file = file_name;
					$scope.imgSrc = reader.result;
					// apply to scope
					$scope.$apply();
				};
				reader.readAsDataURL(file);
			};

			// upload logo image
			$scope.uploadLogoImage = function(chJson){
				var inner_path = 'merged-IFS/'+chJson.channel.cluster_id+'/data/users/'+$scope.page.site_info.auth_address+'/'+chJson.channel.logo_file;
				console.log(chJson.channel.logo_file);
				console.log(inner_path);
				Page.cmd("fileWrite",[inner_path, $scope.imgSrc.split('base64,')[1] ], function(res) {
					console.log(res);
					$scope.updateChannelRecord(chJson.channel);
				});
			};
			*/

			// save channel details
			$scope.onUpdateChannel = function(chJson) {
				$scope.updateChannelRecord(chJson.channel);
			};

		};

		var template = 	'<div class="section-body edit-channel-form form well" layout="column">' +
					        '<div class="form-row" layout="row">' +
					          	'<label flex="20">Channel Name</label>' +
								'<input flex="80" type="text" class="form-control" ng-model="chJson.channel.channel_name" />' +
					        '</div>' +
					        '<div class="form-row" layout="row">' +
					          	'<label flex="20">Channel Description</label>' +
								'<input flex="80" type="text" class="form-control" ng-model="chJson.channel.channel_description">' +
					        '</div>' +
					        '<hr/>' +
					        '<div class="form-row" layout="row">' +
					          	'<label flex="20">Channel Logo</label>' +						        	
								'<div class="logo-image-selection row" flex="80">' +
									'<figure ng-repeat="image in chJson.items.images" class="col-xs-2">' +
										'<img style="width:100%;" ng-click="selectImageAsLogo(image)" ng-class="{selected: image.file_name === chJson.channel.logo_file}" ng-src="/{{page.site_info.address}}/merged-{{page.site_info.content.merger_name}}/{{channel.cluster_id}}/data/users/{{channel.user_id}}/{{image.file_name}}"/>' +
									'</figure>' +
									'<a class="col-xs-12"  ng-if="!chJson.items.images" ng-click="onUploadClick()">you havent uploaded any images yet, upload an image to select a logo!</a>' +
								'</div>' +
							'</div>' +
							'<md-button class="md-primary md-raised edgePadding pull-right" ng-click="onUpdateChannel(chJson)">' +
					        	'<label>Update Channel</label>' +
					        '</md-button> ' +
							'</div>' +
						'</div>';

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template: template
		}

	}
]);