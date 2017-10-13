app.directive('userSideBar', ['Channel','$rootScope','$window','$mdDialog','$mdMedia',
	function(Channel,$rootScope,$window,$mdDialog,$mdMedia) {

		// user area controller
		var controller = function($scope,$element) {

			// get channel logo path
			$scope.getChannelLogoPath = function(channel){
				if (channel.logo_file){
					channel.logo_path = '/'+$scope.page.site_info.address+'/merged-CDN/'+channel.cluster_id+'/data/users/'+channel.channel_address.split('_')[1]+'/'+channel.logo_file;
				} else {
					channel.logo_path = '/'+$scope.page.site_info.address+'/assets/channel/img/x-avatar.png';
				}
			}


			// on open new channel dialog
			$scope.onOpenNewChannelDialog = function(){
				if ($scope.page.site_info.cert_user_id){
					$scope.openNewChannelDialog();
				} else {
					$scope.createIfsCert();
				}
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
										    	'<channel-register  ng-init="initNewChannelForm(items.scope.page,items.scope.u_channels,items.scope.cluster,items.scope.clusters)"></channel-register>' +
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

		}

		var template =  '<section id="user-side-bar">' +
							'<div class="channels-menu">' +
								'<ul>' +
									'<li ng-repeat="ch in u_channels" ng-if="ch.channel_address !== channel.channel_address">' +
										'<a href="/{{page.site_info.address}}/index.html?route:user+cl:{{ch.cluster_id}}+ch:{{ch.channel_address}}">' + 
											'<figure class="logo" ng-init="getChannelLogoPath(ch)">' +
												'<img ng-src="{{ch.logo_path}}"/>' + 
											'</figure>' +
										'</a>' +
									'</li>' +
									'<li>' +
						        		'<a style="text-align:center;" ng-click="onOpenNewChannelDialog()">'  +
						        			'<i class="fa fa-plus-circle fa-25x" style="font-size: 56px;margin-top: -4px;"></i>' +
						        			'<span class="txt">New Channel</span>' +
						        		'</a>' +
									'</li>' +
								'</ul>' +
							'</div>' +
						'</section>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);