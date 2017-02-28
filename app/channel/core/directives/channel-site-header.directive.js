app.directive('channelSiteHeader', ['$rootScope','$location','$mdDialog','$mdMedia','$window',
	function($rootScope,$location,$mdDialog,$mdMedia,$window) {

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
										    '<md-dialog-content layout-padding>' +
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

		};

		// site header template	
		var template = 	'<div class="wrapper channel-menu">'+
							'<div class="container-fluid select-channel">' +
								'<label>Select channel: </label>' +											
								'<select class="form-control" ng-model="channel" value="channel.channel_address" ng-options="channel.option_label for channel in u_channels" ng-change="onSelectSite(channel)"></select>' +
							'</div>' +
						'</div>'+
						'<md-toolbar ng-init="init()" ng-if="channel" layout-padding class="md-hue-2 header" layout="row">' +
							'<div class="col-xs-5">' + 
								'<div class="channel-header-top">' + 
									'<figure class="logo">' + 
										'<img ng-if="chJson.channel.logo_file" ng-src="/{{page.site_info.address}}/merged-IFS/{{channel.cluster_id}}/data/users/{{channel.user_id}}/{{chJson.channel.logo_file}}"/>' + 
									'</figure>' +
									'<div class="site-title">' + 
										'<h3>' + 
											'<a href="/{{page.site_info.address}}/user/index.html{{url_suffix}}"> {{channel.channel_name}} </a>' + 
											'<small><a ng-click="openChannelEditDialog(chJson)"><span class="glyphicon glyphicon-pencil"></span></a></small>' + 
										'</h3>' + 
										'<a class="channel-address" href="/{{channel.channel_address}}/"><small ng-bind="channel.channel_address"></small></a>' +
										'<div class="channel-description">{{chJson.channel.channel_description}}</div>' +
									'</div>' + 
								'</div>' +
								'<div class="channel-header-bottom">' + 
									'<div class="sub-title">' + 
										'<small>' + 
											'Site : &nbsp;{{cluster.peers}} peers &nbsp; • &nbsp; Files &nbsp;  {{ch_files.total_downloaded}} / {{ch_files.total}} Total &nbsp;• &nbsp; Size : &nbsp;{{ch_files.total_downloaded_size|filesize}} / {{ch_files.total_size|filesize}} Total' +
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
										'<md-button class="md-primary md-raised edgePadding pull-left" href="/{{page.site_info.address}}/user/upload.html{{url_suffix}}" >Upload</md-button>' + 				       
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