app.directive('sidebar', ['$rootScope',
	function($rootScope) {

		// header directive controller
		var controller = function($scope,$element) {
			
			// on filter channel
			$scope.onFilterChannel = function(channel) {
				// on filter channel
				$scope.filterChannel(channel);
			};

			// on remove filter channel
			$scope.onRemoveFilterChannel = function(){
				delete $scope.channel;
				$rootScope.$broadcast('onRemoveFilterChannel');
			};

		};

		var template =  '<div id="sidebar-wrapper">' +
						    '<div ng-if="channels.length > 0">' +
						    	'<ul class="sidebar-nav">' +
							       '<li class="sidebar-brand">' +
							          'Channels  <span class="glyphicon glyphicon-refresh"  ng-click="onRemoveFilterChannel()" ></span>' +
							        '</li>' +
							       	'<li ng-repeat="channel in channels | orderBy:\'-date_added\'" ng-click="onFilterChannel(channel)">' +
							            '<div>' +
							                '<a href="#">' +
												'<figure class="channel-list-item-logo"><img ng-if="channel.logo" ng-src="/{{page.site_info.address}}/merged-{{merger_name}}/{{channel.channel_address}}/uploads/images/{{channel.logo}}"/></figure>' +
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