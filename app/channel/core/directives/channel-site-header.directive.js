app.directive('channelSiteHeader', ['$rootScope','$location','$mdDialog','$mdMedia','$window',
	function($rootScope,$location,$mdDialog,$mdMedia,$window) {

		// site header controller
		var controller = function($scope,$element) {

			// init
			$scope.init = function() {
				$scope.publishButtonStatus = 'publish';
				if ($scope.chJson.channel.logo_file) $scope.chJson.channel.logo_path = '/'+$scope.page.site_info.address+'/merged-'+$scope.page.site_info.content.merger_name+'/'+$scope.chJson.channel.cluster_id+'/data/users/'+$scope.page.site_info.auth_address+'/'+$scope.chJson.channel.logo_file;
			};

			// on upload click
			$scope.onUploadClick = function(){
				var view = 'upload';
				$scope.routeUserView(view);
			};

			// on channel main click
			$scope.onChannelMainClick = function(){
				var view = 'main';
				$scope.routeUserView(view);
			};

			// on publish site
			$scope.onPublishSite = function() {
				$scope.publishButtonStatus = 'Now Updating and Publishing...';
				$scope.publishSite();
			};

			$rootScope.$on('resetPublishButton',function(event,mass) {
				$scope.publishButtonStatus = 'publish';
			});

			// on select site
			$scope.onSelectSite = function(channel){
				$window.location.href = '/'+ $scope.page.site_info.address +'/user/index.html?cl='+channel.cluster_id + '+ch=' + channel.channel_address;
			};

			/** DIALOGS **/

			// open edit channel dialog
			$scope.openChannelEditDialog = function(ev) {
				$scope.status = '';
				$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
			    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			    var dialogTemplate = 	'<md-dialog aria-label="Edit Channel">' +
										    '<md-toolbar>' +
										    	'<div class="md-toolbar-tools">' +
											        '<h2>Edit Channel Info</h2>' +
										    	'</div>' +
										    '</md-toolbar>' +
										    '<md-dialog-content>' +
										    	'<channel-edit ng-init="initChannelEdit(items.chJson,items.page,items.merger_name,items.channel)"></channel-edit>' +
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
							merger_name:$scope.page.site_info.content.merger_name,
							channel:$scope.channel
						}
					}
			    });
			};


			// open edit channel dialog
			$scope.openNewChannelDialog = function(ev) {
				$scope.status = '';
				$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
			    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			    var dialogTemplate = 	'<md-dialog aria-label="New Channel">' +
										    '<md-toolbar>' +
										    	'<div class="md-toolbar-tools">' +
											        '<h2>Create New Channel</h2>' +
										    	'</div>' +
										    '</md-toolbar>' +
										    '<md-dialog-content layout-padding>' +
										    	'<div class="new-channel-form" ng-init="initNewChannelForm(items.scope.page,items.scope.u_channels)" channel-register>' +
										    		'<div class="form-row" layout="row" flex="100">' +
											    		'<label flex="30">Channel Name</label>' +
											    		'<input flex="70" class="form-control" type="text" ng-model="channel.channel_name">' +
										    		'</div>' +
										    		'<div class="form-row" layout="row" flex="100">' +
										    			'<label flex="30">Channel Description</label>' +
										    			'<textarea flex="70" class="form-control" ng-model="channel.channel_description"></textarea>' +
													'</div>' +
													'<hr/>' +
													'<md-button class="md-primary md-raised edgePadding pull-left" style="margin:0;" ng-click="hide()">Cancel</md-button>' +
													'<md-button class="md-primary md-raised edgePadding pull-right" style="margin:0;" ng-click="createNewChannel(channel,items.scope)">Create Channel</md-button>' + 				       
										    	'</div>' +
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
							scope:$scope
						}
					}
			    });
			};

		};

		// site header template	
		var template = 	'<div class="wrapper channel-menu">'+
							'<div class="container-fluid select-channel">' +
								'<label>Select channel: </label>' +											
								'<select class="form-control" ng-model="channel" value="channel.channel_address" ng-options="channel.option_label for channel in u_channels" ng-change="onSelectSite(channel)"></select>' +
								'<md-button class="md-primary md-raised edgePadding pull-right" style="margin:0;" ng-click="openNewChannelDialog()">New Channel</md-button>' + 				       
							'</div>' +
						'</div>' +
						'<md-toolbar ng-if="u_channels" ng-init="init()" layout-padding class="md-hue-2 header" layout="row">' +
							'<div class="col-xs-5">' + 
								'<div class="channel-header-top">' + 
									'<figure class="logo">' + 
										'<img ng-if="chJson.channel.logo_file" ng-src="{{chJson.channel.logo_path}}">' +
									'</figure>' +
									'<div class="site-title" ng-if="channel">' + 
										'<h3>' + 
											'<a ng-click="onChannelMainClick()"> {{channel.channel_name}} </a>' + 
											'<small><a ng-click="openChannelEditDialog(chJson)"><span class="glyphicon glyphicon-pencil"></span></a></small>' + 
										'</h3>' + 										
										'<div class="channel-description">{{chJson.channel.channel_description}}</div>' +
									'</div>' + 
								'</div>' +
								'<div class="channel-header-bottom" ng-if="channel">' + 
									'<div class="sub-title">' + 
										'<small>' + 
											'Cluster : &nbsp;{{cluster.content.title}} &nbsp; • &nbsp; Files &nbsp;  {{ch_files.total_downloaded}} / {{ch_files.total}} Total &nbsp;• &nbsp; Size : &nbsp;{{ch_files.total_downloaded_size|filesize}} / {{ch_files.total_size|filesize}} Total' +
										'</small>' + 
									'</div>' + 
								'</div>' +
							'</div>' + 
							'<div class="pull-right col-xs-7">' + 
								'<ul>' +	
						        	'<li>' +
										'<md-button class="md-primary md-raised edgePadding pull-left" ng-click="onUploadClick()">Upload</md-button>' + 				       
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