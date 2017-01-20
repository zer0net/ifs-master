app.directive('channelSiteHeader', ['$rootScope','$location','$mdDialog','$mdMedia',
	function($rootScope,$location,$mdDialog,$mdMedia) {

		// site header controller
		var controller = function($scope,$element) {

			// init
			$scope.init = function() {
				$scope.publishButtonStatus = 'publish';
			};

			// on publish site
			$scope.onPublishSite = function() {
				$scope.publishButtonStatus = 'Now Updating and Publishing...';
				$scope.publishSite();
			};

			$rootScope.$on('resetPublishButton',function(event,mass) {
				$scope.publishButtonStatus = 'publish';
			});


			// multiple upload dialog
			$scope.multipleUploadDialog = function(ev){
				
				$scope.status = '';
				$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
			    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			    var dialogTemplate = '<md-dialog aria-label="Multiple File Upload" class="upload-dialog">' +
									    '<md-toolbar>' +
									    	'<div class="md-toolbar-tools">' +
										        '<h2>Upload Files</h2>' +
									    	'</div>' +
									    '</md-toolbar>' +
									    '<md-dialog-content layout-padding>' +
											'<multiple-files-upload ng-init="init(items.chJson,items.site,items.merger_name)"></multiple-files-upload>'
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
							chJson:$scope.chJson,
							site:$scope.site,
							merger_name:$scope.merger_name
						}
					}
			    });

			};

			// open edit channel dialog
			$scope.openChannelEditDialog = function(ev) {

				$scope.status = '';
				$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
			    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

			    var dialogTemplate = 
			    '<md-dialog aria-label="Edit Channel">' +
				    '<md-toolbar>' +
				    	'<div class="md-toolbar-tools">' +
					        '<h2>Edit Channel Info</h2>' +
				    	'</div>' +
				    '</md-toolbar>' +
				    '<md-dialog-content layout-padding>' +
						'<md-content my-channel ng-init="initChannelEdit(items.chJson,items.page,items.merger_name,items.site)">' +
							'<div class="section-body" layout="row">' +
								'<figure flex="20">' +
									'<img style="width:100%;" ng-src="uploads/images/{{chJson.channel.img}}" ng-show="chJson.channel.img" id="image"/>' +
									'<button dropzone="dropzoneConfig" ng-hide="imgSrc"> Drag and drop files here or click to upload</button>' +
									'<img style="width:100%;" ng-src="{{imgSrc}}" ng-show="imgSrc" id="image"/>' +
								'</figure>' +
								'<div class="channel-info" flex="80" layout-padding>' +
						        '<md-input-container class="md-block" flex-gt-sm>' +
						          	'<label>Channel Name</label>' +
									'<input type="text" ng-model="chJson.channel.name">' +
						        '</md-input-container>' +
						        '<md-input-container class="md-block" flex-gt-sm>' +
						          	'<label>Channel Description</label>' +
									'<textarea ng-model="chJson.channel.description"></textarea>' +
						        '</md-input-container>' +
								'<md-button class="md-primary md-raised edgePadding pull-right" ng-click="saveChannelDetails(chJson)">' +
						        	'<label>Update Channel</label>' +
						        '</md-button> ' +
								'</div>' +
							'</div>' +
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
					locals: {
						items:{
							chJson:$scope.chJson,
							page:$scope.page,
							merger_name:$scope.merger_name,
							site:$scope.site
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
			
			$scope.updateChannelJson = function(){
				$scope.hide();
				$rootScope.$broadcast('onUpdateChannel');
			};

		};

		// site header template
		var template = 	'<md-toolbar ng-init="init()" ng-if="site" layout-padding class="md-hue-2 header" layout="row">' +
							'<div class="col-xs-5">' + 
								'<figure class="logo"><img ng-if="chJson.channel.img" ng-src="/{{page.site_info.address}}/merged-{{merger_name}}/{{site.address}}/{{chJson.channel.img ? \'uploads/images/\'+chJson.channel.img : \'../assets/channel/img/x-avatar.png\'}}"/></figure>' +
								'<div class="site-title">' + 
									'<h3>' + 
										'<a target="_blank" href="/{{page.site_info.address}}/user/index.html?channel={{site.address}}">File Hub : {{contentJson.title}} </a>' + 
										'<small>' + 
											'<a ng-click="openChannelEditDialog(chJson)">' + 
												'<span class="glyphicon glyphicon-pencil"></span>' + 
											'</a>' + 
										'</small>' + 
									'</h3>' + 
									'<a href="/{{site.address}}/"><small style="font-size: 10px;" ng-bind="site.address"></small></a>' +
									'<div class="sub-title">' + 
										'<small>{{contentJson.description}}</small>' + 
										'<small>Site : &nbsp;{{peers}} peers' +
										' &nbsp; • &nbsp; Files &nbsp;  {{optionalFileList.length}} / {{fileTotalLength}} &nbsp;• &nbsp; Size : &nbsp;{{site.settings.optional_downloaded|filesize}} / {{site.settings.size_optional|filesize}} Total' +
										'</small>' + 
									'</div>' + 
								'</div>' + 
							'</div>' + 
							'<div class="pull-right col-xs-7">' + 
								'<ul>' + 		
									'<li>' + 						
										'<md-button ng-if="optionalHelp==false" class="md-primary md-raised edgePadding pull-left" ng-click="onOptionalHelp()"> distribute all files</md-button>' +
										'<md-button ng-if="optionalHelp==true" class="md-primary md-raised edgePadding pull-left" ng-click="onRemoveOptionalHelp()">stop distribute all files</md-button>' +
						        	'</li>' + 			
						        	'<li>' +
										'<md-button class="md-primary md-raised edgePadding pull-left" ng-click="multipleUploadDialog($event)">Upload</md-button>' + 				       
						        	'</li>' + 
						        	'<li>' +
										'<md-button class="md-primary md-raised edgePadding pull-left" ng-click="onPublishSite()">{{publishButtonStatus}}</md-button>' + 				       
						        	'</li>' + 						        	
								'</ul>' + 
					        '</div>' + 
						'</md-toolbar>';

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);