app.directive('sidebar', ['$rootScope','$timeout',
	function($rootScope,$timeout) {

		// header directive controller
		var controller = function($scope,$element) {
			
			// render channel item
			$scope.renderChannelItem = function(channel){
				channel.logo_path = '/'+$scope.page.site_info.address+'/merged-'+$scope.page.site_info.content.merger_name + '/' + channel.cluster_id + '/data/users/' + channel.user_id + '/' + channel.logo_file;
			};

			// on filter channel
			$scope.onFilterChannel = function(channel) {
				if ($scope.channel){
					$scope.removeFilterChannel();
					$timeout(function () {
						$scope.filterChannel(channel);
					});
				} else {
					$scope.filterChannel(channel);
				}
			};

			// on remove filter channel
			$scope.onRemoveFilterChannel = function(){
				$scope.removeFilterChannel();
			};

		};

		var template =  '<div id="sidebar-wrapper">' +
						    '<div ng-if="channels.length > 0">' +
						    	'<ul class="sidebar-nav">' +
							       '<li class="sidebar-brand">' +
							          'Channels  <span class="glyphicon glyphicon-refresh"  ng-click="onRemoveFilterChannel()" ></span>' +
							        '</li>' +
							       	'<li ng-repeat="channel in channels | orderBy:\'-date_added\'" ng-init="renderChannelItem(channel)" ng-click="onFilterChannel(channel)">' +
							            '<div>' +
							                '<a href="#">' +
												'<figure class="channel-list-item-logo"><img ng-if="channel.logo_file" ng-src="{{channel.logo_path}}"/></figure>' +
							                	'<span>{{channel.channel_name}} [{{channel.items_total}}]</span>' +
							                '</a>' +
							            '</div>' +
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