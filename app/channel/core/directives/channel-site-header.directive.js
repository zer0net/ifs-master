app.directive('channelSiteHeader', ['$rootScope','$location','$mdDialog','$mdMedia',
	function($rootScope,$location,$mdDialog,$mdMedia) {

		// site header controller
		var controller = function($scope,$element) {

		    // open help dialog
			$scope.openHelpDialog = function(ev) {

				$scope.status = '';
				$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
			    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

			    var dialogTemplate = 
			    '<md-dialog aria-label="How To?">' +
				    '<md-toolbar>' +
				    	'<div class="md-toolbar-tools">' +
					        '<h2>How to add videos?</h2>' +
				    	'</div>' +
				    '</md-toolbar>' +
				    '<md-dialog-content layout-padding>' +
						'<md-content id="how-to-section">' +
							'<p></p>' +
							'<ul style="list-style-type: none; padding-left: 15px;padding-right: 15px;">' +
								'<li>0. if this is not your own channel - clone this site & continue with next step then</li>' +
								'<li>1. navigate to this sites folder ('+$scope.site_address+') and create the directories <b>uploads/videos</b>  </li>' +
								'<li>2. copy files to new directory - make sure the file name doesnt contain spaces or special chars!  </li>' +
								'<li>3. click on the "check folder" button in the navigation menu of the site  </li>' +
								'<li>4. view your new videos to confirm & publish!  </li>' +
							'</ul>' +
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
							chJson:$scope.chJson
						}
					}
			    });

			};

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
		var template = 	
		'<md-toolbar ng-if="site" layout-padding class="md-hue-2 header" layout="row">' + 			
			'<div class="col-xs-5">' + 
				/*'<img ng-src="uploads/images/{{chJson.channel.img ? chJson.channel.img : \'x-avatar.png\'}}" class="imgFilehubLogo"/>'+ */
				'<figure class="logo"><img ng-if="chJson.channel.img" ng-src="/{{page.site_info.address}}/merged-{{merger_name}}/{{site.address}}/{{chJson.channel.img ? \'uploads/images/\'+chJson.channel.img : \'../assets/channel/img/x-avatar.png\'}}"/></figure>' +
				'<h3><a href="/{{master_address}}">{{master_name}}</a></h3>' + 
				'<div class="site-title">' + 
					'<h3>' + 
						'<a href="/{{site_address}}">File Hub : {{contentJson.title}} </a>' + 
						'<small ng-if="owner">' + 
							'<a ng- ng-click="openChannelEditDialog(chJson)">' + 
								'<span class="glyphicon glyphicon-pencil"></span>' + 
							'</a>' + 
						'</small>' + 
					'</h3>' + 
					'<div class="sub-title">' + 
						'<small>{{contentJson.description}}</small>' + 
						'<small>Site : &nbsp;{{peers}} peers' +
						' &nbsp; • &nbsp; Files &nbsp;  {{optionalFileList.length}} / {{fileTotalLength}} &nbsp;• &nbsp; Size : &nbsp;{{settings.optional_downloaded|filesize}} / {{settings.size_optional|filesize}} Total' +
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
		        	'<li  ng-if="owner">' + 						
							'<md-button class="md-primary md-raised edgePadding pull-left" ng-click="multipleUploadDialog($event)">Upload</md-button>' + 				       
		        	'</li>' + 		        	
					'<li ng-if="owner">' + 
		        		'<a href="/{{master_address}}/register.html">' + 
		        			'<md-button class="md-primary md-raised edgePadding pull-left">Register</md-button>' + 
				        '</a>' + 

					'</li>' + 
					'<li>' + 
		        		'<a ng-click="openHelpDialog()" class="how-to-btn">' + 
		        			'<md-button class="md-primary md-raised edgePadding pull-left">?</md-button>' + 
				        '</a>' + 
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