app.directive('channelSiteHeader', ['$rootScope','$location','$mdDialog','$mdMedia','$window',
	function($rootScope,$location,$mdDialog,$mdMedia,$window) {

		// site header controller
		var controller = function($scope,$element) {

			// init
			$scope.initChannelHeader = function() {
				$scope.publishButtonStatus = 'republish';
				if ($scope.channel.logo_file) $scope.channel.logo_path = '/'+$scope.page.site_info.address+'/merged-'+$scope.page.site_info.content.merger_name+'/'+$scope.channel.cluster_id+'/data/users/'+$scope.page.site_info.auth_address+'/'+$scope.channel.logo_file;
			};

			// on upload click
			$scope.onUploadClick = function(){
				var view = 'upload';
				$scope.routeUserView(view);
			};

			// on channel main click
			$scope.onChannelMainClick = function(channel){
				if ($scope.path.indexOf('route:user') > -1){
					if ($scope.path.split('+ch:')[1] === channel.channel_address){
						var view = 'main';
						$scope.routeUserView(view);
					} else {
						$window.location.href = '/'+$scope.page.site_info.address+'/index.html?route:user+cl:'+channel.cluster_id+'+ch:'+channel.channel_address;
					}
				} else {
					var view = 'main';
					$scope.routeUserView(view);
				}
			};

			// get channel logo path
			$scope.getChannelLogoPath = function(channel){
				if (channel.logo_file){
					channel.logo_path = '/'+$scope.page.site_info.address+'/merged-CDN/'+channel.cluster_id+'/data/users/'+channel.channel_address.split('_')[1]+'/'+channel.logo_file;
				} else {
					channel.logo_path = '/'+$scope.page.site_info.address+'/assets/channel/img/x-avatar.png';
				}
			}

			// on publish site
			$scope.onRepublishSite = function() {
				$scope.publishButtonStatus = 'Now Updating and Publishing...';
				console.log($scope.inner_path);
				console.log($scope.channel);
				$scope.republishSite($scope.inner_path,$scope.channel);
			};

			$rootScope.$on('resetPublishButton',function(event,mass) {
				$scope.publishButtonStatus = 'publish';
			});

			// on select cluster
			$scope.onSelectCluster = function(cluster){
				$scope.setCluster(cluster);				
				if ($scope.u_channels){
					$scope.u_channels.forEach(function(channel,index){
						if (channel.cluster_id === cluster.address){
							$window.location.href = '/'+$scope.page.site_info.address+'/index.html?route:user+cl:'+channel.cluster_id+'+ch:'+channel.channel_address;						
						}
					});
				}
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
										    	'<channel-edit ng-init="initChannelEdit(items.scope)"></channel-edit>' +
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
							'<div class="channel-site-header-left">' +
								'<figure class="logo" ng-init="getChannelLogoPath(channel)">' +
									'<img ng-if="channel.logo_path" ng-src="{{channel.logo_path}}"/>' + 
								'</figure>' +
								'<div class="site-title">' + 
									'<h3>' + 
										'<a ng-click="onChannelMainClick(channel)"> {{channel.channel_name}} </a>' + 
										'<small><a ng-click="openChannelEditDialog(channel)"><span class="glyphicon glyphicon-pencil"></span></a></small>' + 
									'</h3>' +
								'</div>' + 
							'</div>' +
							'<div class="channel-site-header-right">' +
								'<ul ng-if="u_channels && channel" ng-init="initChannelHeader()">' +
						        	'<li>' +
						        		'<a ng-click="onUploadClick()">'  +
						        			'<i class="fa fa-cloud-upload fa-25x"></i>' +
						        			'<span class="txt">Upload</span>' +
						        		'</a>' +
						        	'</li>' +
						        	'<li>' +
						        		'<a ng-click="onRepublishSite()">'  +
						        			'<i class="fa fa-refresh fa-25x"></i>' +
						        			'<span class="txt">{{publishButtonStatus}}</span>' +
						        		'</a>' +					        	
						        	'</li>' + 	        	
								'</ul>' + 
							'</div>' +
						'</div>';

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);