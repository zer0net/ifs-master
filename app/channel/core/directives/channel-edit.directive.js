app.directive('channelEdit', ['$sce','$location','$rootScope',
	function($sce,$location,$rootScope) {

		// channel edit controller
		var controller = function($scope,$element) {

			// init
			$scope.initChannelEdit = function (scope) {

				// bind vars to scope
				$scope.page = scope.page;
				$scope.channel = scope.channel;
				$scope.inner_path = scope.inner_path;
				$scope.cluster = scope.cluster;

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

				// query channel images
				var query = ["SELECT * FROM item WHERE channel='"+$scope.channel.channel_address+"' AND content_type='image'"];
				Page.cmd("dbQuery",query,function(images){
					$scope.$apply(function(){
						$scope.images = images;
					});
				});
			};

			// render image page
			$scope.renderImagePath = function(image){
				image.src = '/'+$scope.page.site_info.address+'/merged-'+$scope.page.site_info.content.merger_name+'/'+$scope.cluster.cluster_id+'/data/users/'+$scope.page.site_info.auth_address+'/'+image.file_name;
			};

			// select image as logo
			$scope.selectImageAsLogo = function(image){
				$scope.channel.logo_file = image.file_name;
			};

			// on upload click
			$scope.onUploadClick = function(){
				var view = 'upload';
				$rootScope.$broadcast('onRouteUserView',view);
				$scope.hide();			
			};

			// save channel details
			$scope.onUpdateChannel = function(channel) {
				console.log('on update channel');
				$scope.channel_update = true;
				$scope.data_json_path = $scope.inner_path + 'data.json';
				Page.cmd("fileGet",{"inner_path":$scope.data_json_path},function(data){
					
					// data file
					if (data) { 
						data = JSON.parse(data); 
						if (!data.channel){
							data.channel = [];
							data.next_channel_id = 1;
						}
					} else {
						data = {"next_channel_id":1,"channel":[]}; 
					}

					var channelIndex;
					data.channel.forEach(function(ch,index){
						if (ch.channel_address === $scope.channel.channel_address){
							channelIndex = index;
						}
					});

					// remove vote from vote.json
					data.channel.splice(channelIndex,1);
					data.channel.push(channel);

					// write to file
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));					
					Page.cmd("fileWrite", [$scope.data_json_path, btoa(json_raw)], function(res) {
						// sign & publish site
						Page.cmd("sitePublish",{"inner_path":$scope.data_json_path}, function(res) {
							Page.cmd("wrapperNotification", ["done", "Channel Updated!", 10000]);
							$scope.hide();
							var mass = {
								inner_path:$scope.inner_path,
								channel:channel
							};
							$rootScope.$broadcast('onPublishSite',mass);
						});
					});
				});
			};

		};

		var template = 	'<div class="section-body edit-channel-form form well" layout="column">' +
					        '<div class="form-row" layout="row">' +
					          	'<label flex="20">Channel Name</label>' +
								'<input flex="80" type="text" class="form-control" ng-model="channel.channel_name" />' +
					        '</div>' +
					        '<div class="form-row" layout="row">' +
					          	'<label flex="20">Channel Description</label>' +
								'<input flex="80" type="text" class="form-control" ng-model="channel.channel_description">' +
					        '</div>' +
					        '<hr/>' +
					        '<div class="form-row" layout="row">' +
					          	'<label flex="20">Channel Logo</label>' +						        	
								'<div class="logo-image-selection row" flex="80">' +
									'<figure ng-repeat="image in images" class="col-xs-2" ng-init="renderImagePath(image)" ng-class="{selected: image.file_name === channel.logo_file}">' +
										'<img style="width:100%;" ng-click="selectImageAsLogo(image)" ng-src="{{image.src}}"/>' +
										'<i class="fa fa-check-square" aria-hidden="true"></i>' +
									'</figure>' +
									'<a class="col-xs-12"  ng-if="!images || images.length === 0" ng-click="onUploadClick()">you havent uploaded any images yet, upload an image to select a logo!</a>' +
								'</div>' +
							'</div>' +
					        '<hr/>' +
							'<md-button ng-if="!channel_update" class="md-primary md-raised edgePadding pull-right" ng-click="onUpdateChannel(channel)">' +
					        	'<label>Update Channel</label>' +
					        '</md-button> ' +
					        '<div layout="row" ng-if="channel_update" flex="100" layout-align="space-around" style="margin-top:-10px;">' +
					            '<md-progress-circular md-mode="indeterminate"></md-progress-circular>' +
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