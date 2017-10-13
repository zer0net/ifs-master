app.directive('adminView', ['Channel','$rootScope','$window','$mdDialog','$mdMedia',
	function(Channel,$rootScope,$window,$mdDialog,$mdMedia) {

		// user area controller
		var controller = function($scope,$element) {

			$scope.moderations_on = false;

		    // open new moderators dialog
			$scope.openNewModeratorDialog = function(ev) {
				console.log(ev);
				// dialog vars
				$scope.status = '';
				$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
			    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			    // dialog template
			    var dialogTemplate = 
			    	'<md-dialog class="add-moderator-dialog" style="width:500px;">' +
					    '<md-toolbar>' +
					    	'<div class="md-toolbar-tools">' +
						        '<h2>Add Moderator</h2>' +
						        '<span flex></span>' +
								'<md-button class="md-icon-button pull-right" ng-click="hide()">'+
									'<span class="glyphicon glyphicon-remove"></span>'+
								'</md-button>'+
					    	'</div>' +
					    '</md-toolbar>' +
					    '<md-dialog-content layout-padding moderators ng-init="initModeratorForm()">' +
							'<div class="new-moderator-form">' +
					    		'<div class="form-row" layout="row" flex="100">' +
						    		'<label flex="30">User ID</label>' +
						    		'<input flex="70" class="form-control" type="text" ng-model="moderator.user_id">' +
					    		'</div>' +
					    		'<div class="form-row" layout="row" flex="100">' +
						    		'<label flex="30">Privilege</label>' +
									'<select flex="70" class="form-control" ng-model="moderator.privilege">' +
										'<option value="{{option.value}}" ng-repeat="option in privilege_options">{{option.label}}</option>' +
									'</select>' +
					    		'</div>' +
					    		'<div class="form-row" layout="row" flex="100" ng-if="moderator.privilege === \'cluster\'">' +
						    		'<label flex="30">Cluster</label>' +
									'<select flex="70" class="form-control" ng-model="moderator.cluster">' +
										'<option value="{{cluster.address}}" ng-repeat="cluster in items.scope.clusters">{{cluster.content.title}}</option>' +
									'</select>' +
					    		'</div>' +
								'<hr/>' +
					    		'<div class="form-row" layout="row" flex="100">' +
									'<md-button class="md-primary md-raised edgePadding pull-right" style="margin:0;" ng-click="onCreateModerator(moderator,items.scope)">Create Moderator</md-button>' +
					    		'</div>' +
					    	'</div>' +
					    '</md-dialog-content>' +
					'</md-dialog>';

				// show dialog
			    $mdDialog.show({
					controller: DialogController,
					template: dialogTemplate,
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose:true,
					fullscreen: true,
					locals:{
						items:{
							scope:$scope
						}
					}		

			    });
			};

		}

		var template =  '<section id="admin-section" flex layout="column" layout-padding>' +
						    '<section class="wrap-section">' +
						        '<section moderators class="container" ng-init="getModerator(page.site_info.auth_address)">' +
						            '<h2>Admin Section</h2>' +
						            '<hr/>' +
									'<uib-tabset active="active" ng-if="page.site_info.settings.own || moderator">' +
										'<uib-tab index="0" channels ng-init="getChannels(moderations_on)">' +
											'<uib-tab-heading>Channels ({{channels.length}})</uib-tab-heading>' +
											'<ul class="admin-list" moderations>' +
											    '<li class="list-header" layout="row" flex="100">' +
											        '<span flex="35">Channel Name</span>' +
											        '<span flex="5">Audio</span>' +
											        '<span flex="5">Books</span>' +
											        '<span flex="5">Images</span>' +											        
											        '<span flex="5">Games</span>' +
											        '<span flex="5">Videos</span>' +
											        '<span flex="10">Date Added</span>' +
											        '<span flex="15">Channel</span>' +
											        '<span flex="15">User</span>' +
											    '</li>' +
											    '<li ng-repeat="channel in channels | orderBy:\'-date_added\'" layout="row" flex="100">' +
											        '<span flex="35"><a href="/{{page.site_info.address}}/index.html?route:main+id:{{channel.channel_address}}">{{channel.channel_name}}</a></span>' +
											        '<span flex="5">{{channel.audio_count}}</span>' +
											        '<span flex="5">{{channel.book_count}}</span>' +
											        '<span flex="5">{{channel.image_count}}</span>' +
											        '<span flex="5">{{channel.game_count}}</span>' +
											        '<span flex="5">{{channel.video_count}}</span>' +
											        '<span flex="10" am-time-ago="channel.date_added"></span>' +
											        '<span flex="15">' +
											        	'<a ng-if="channel.hide === 0 || !channel.hide" href="#" ng-click="toggleChannelVisibility(channel)">hide</a>' +
											        	'<a ng-if="channel.hide === 1" href="#" ng-click="toggleChannelVisibility(channel)">show</a>' +
											        '</span>' +
											        '<span flex="15">' +
											        	'<a ng-if="channel.user_hide === 0 || !channel.user_hide" href="#" ng-click="toggleUserChannelsVisibility(channel)">hide</a>' +
											        	'<a ng-if="channel.user_hide === 1" href="#" ng-click="toggleUserChannelsVisibility(channel)">show</a>' +
											        '</span>' +
											    '</li>' +
											'</ul>' +
										'</uib-tab>' +
										'<uib-tab ng-if="page.site_info.settings.own" index="1">' +
											'<uib-tab-heading>Moderators</uib-tab-heading>' +
											'<ul class="admin-list" ng-init="getModerators()">' +
											    '<li class="list-header" layout="row" flex="100">' +
											        '<span flex="25">Name</span>' +
											        '<span flex="25">ID</span>' +
											        '<span flex="15">Privilege</span>' +
											        '<span flex="15">Date Added</span>' +
											        '<span flex="20">Last Action</span>' +
											    '</li>' +
											    '<li ng-repeat="mod in mods" layout="row" flex="100">' +
											        '<span flex="25">{{mod.user_name}}</span>' +
											        '<span flex="25">{{mod.user_id}}</span>' +
											        '<span flex="15">{{mod.privilege}}</span>' +
											        '<span flex="15" am-time-ago="mod.date_added"></span>' +
											        '<span flex="20">{{mod.last_action}}</span>' +
											    '</li>' +
											'</ul>' +
											'<a ng-click="openNewModeratorDialog()">Add Moderator</a>' +											
										'</uib-tab>' +
									'</uib-tabset>' +
						        '</section>' +
						    '</section>' +
						'</section>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);