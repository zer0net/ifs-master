app.directive('userView', ['Channel','$rootScope','$window',
	function(Channel,$rootScope,$window) {

		// user area controller
		var controller = function($scope,$element) {

		}

		var template =  '<section class="wrapper" layout="row" id="user-channel-wrapper" ng-controller="ChannelMainCtrl" ng-init="init()">' +
							'<div id="user-side-bar-container">' +
								'<user-side-bar></user-side-bar>' +
							'</div>' +
							'<div id="user-view-main-container">' +
							    '<!-- channel site header -->' +
							    '<channel-site-header ng-if="channel"></channel-site-header>' +
							    '<!-- /channel site  header -->' +
							    '<!-- loading -->' +
							    '<div id="channel-loading" layout="column" ng-show="ch_loading" flex>' +
							        '<div layout="column" flex="100" style="text-align:center;">' +
							            '<span><b ng-bind="ch_msg"></b></span>' +
							        '</div>' +
							        '<div layout="row" flex="100" layout-align="space-around">' +
							            '<md-progress-circular md-mode="indeterminate"></md-progress-circular>' +
							        '</div>' +
							    '</div>' +
							    '<!-- /loading -->' +
							    '<!-- channel site main  -->' +
							    '<section ng-if="!ch_loading" ng-if="u_channels" ng-controller="ItemsCtrl" layout="row" class="container" style="width:100%;padding:0;margin:0;">' +
							    	'<md-content ng-if="channel" ng-hide="ch_loading" flex class="main-content" style="overflow:inherit; width:100%;">' +
							            '<div ng-if="user_view !== \'main\'" class="inner-nav">' +
							                '<md-button class="md-primary md-raised edgePadding pull-left" ng-click="routeUserView()">Back</md-button>' +
							            '</div>' +
							            '<!-- main view -->' +
							            '<div ng-if="user_view === \'main\'">' +
											'<ul class="sub-title">' + 
												'<li><b>Cluster :</b> {{cluster.content.title}}</li>' +
												'<li><b>Files :</b> {{ch_files.total_downloaded}} / {{ch_files.total}} Total</li>' +
												'<li><b>Size :</b> {{ch_files.total_downloaded_size|filesize}} / {{ch_files.total_size|filesize}} Total </li>' + 
											'</ul>' + 
							                '<!-- file list -->' +
							                '<file-list ng-if="ch_files.total > 0"></file-list>' +
							                '<!-- files list -->' +
							                '<p ng-if="ch_files.total === 0">' +
							                    'no files found, <a ng-click="uploadView()">upload something!</a>' +
							                '</p>' +
							            '</div>' +
							            '<!-- /main view -->' +
							            '<!-- upload view -->' +
							            '<div ng-if="user_view === \'upload\'">' +
							                '<files-upload></files-upload>' +
							            '</div>' +
							            '<!-- /upload view -->' +
							            '<!-- edit view -->' +
							            '<div class="edit-item-view" ng-if="user_view === \'edit\'" style="width:100%;">' +
							                '<!-- edit item section -->' +
							                '<md-content class="edit-item-section" edit-item ng-init="init()" ng-if="item" layout="row" style="width:100%;height:100%;">' +
							                    '<!-- item sidebar -->' +
							                    '<side-bar flex="30"></side-bar>' +
							                    '<!-- /item sidebar -->' +
							                    '<!-- item main -->' +
							                    '<section flex="70" layout="column" class="item-main" style="position: relative;" id="item-upload-form" layout-padding>' +
							                        '<!-- game interface -->' +
							                        '<game-interface ng-if="item.content_type === \'game\'"></game-interface>' +
							                        '<!-- /game interface -->' +
							                        '<!-- video interface -->' +
							                        '<video-interface ng-if="item.content_type === \'video\'"></video-interface>' +
							                        '<!-- /video interface -->' +
							                        '<!-- image interface -->' +
													'<image-interface ng-if="item.content_type === \'image\'"></image-interface>' +            
							                        '<!-- /image interface -->' +
							                        '<md-button flex="100" style="margin: 16px 0;" class="md-primary md-raised edgePadding pull-right update-item-button" ng-click="onUpdateItem(item,mode)">' +
							                            '<label>Update {{item.content_type}}</label>' +
							                        '</md-button>' +
							                    '</section>' +
							                    '<!-- /item main -->' +
							                '</md-content>' +
							                '<!-- /edit item section -->' +
							            '</div>' +
							            '<!-- /edit view -->' +
							        '</md-content>' +
							    '</section>' +
							    '<!-- channel site main  -->' +
							    '<div ng-if="!u_channels" ng-hide="ch_loading">' +
							        '<p style="text-align: center; margin-top: 51px;">' +
							            'You dont seem to have any channels yet.<br/>' +
							            'Please select "+New Channel" from the sidebar to create one.' +
							        '</p>' +
							    '</div>' +
							    '<div ng-if="u_channels && no_channels" ng-hide="ch_loading">' +
							        '<p style="text-align: center; margin-top: 51px;">' +
							            'You dont have any channels on {{cluster.content.title}}<br/>' +
							            'create a new channel on this cluster!' +
							        '</p>' +
							    '</div>' +
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