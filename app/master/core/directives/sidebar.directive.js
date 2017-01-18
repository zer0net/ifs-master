app.directive('sidebar', ['$rootScope',
	function($rootScope) {

		// header directive controller
		var controller = function($scope,$element) {
			
			// on filter channel
			$scope.onFilterChannel = function(channel) {
				// on filter channel
				$rootScope.$broadcast('onFilterChannel',channel);
			};



			// on remove filter channel
			$scope.onRemoveFilterChannel = function(){
				delete $scope.channel;
				$rootScope.$broadcast('onRemoveFilterChannel');
			};

		};

		var template =  '<div id="sidebar-wrapper">' +
						    '<ul class="sidebar-nav">' +
						       '<div ng-if="channels.length > 0">' +
							       '<li class="sidebar-brand">' +
							          'Channels  <span class="glyphicon glyphicon-refresh"  ng-click="onRemoveFilterChannel()" ></span>' +
							        '</li>' +
							       	'<li ng-repeat="channel in channels | orderBy:\'-date_added\'" ng-click="onFilterChannel(channel)">' +
							            '<div ng-if="channel.filesLen">' +
							                '<a href="#">' +
												'<img ng-if="channel.logo" ng-src="/{{channel_master_address}}/merged-{{merger_name}}/{{channel.channel_address}}/uploads/images/{{channel.logo}}" class="imgFilehubLogo"/>' +
							                	'<img ng-hide="channel.logo" src="assets/master/img/x-avatar.png" class="imgFilehubLogo"/>' +
							                	'<span>{{channel.channel_name}} [{{channel.filesLen}}]</span>' +
							                '</a>' +
							            '</div>' +
							        '</li>' +
						        '</div>' +
						    '</ul>' +
						'</div>';
		
		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);