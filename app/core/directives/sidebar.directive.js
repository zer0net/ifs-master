app.directive('sidebar', ['$mdDialog', '$mdMedia',
	function($mdDialog,$mdMedia) {		

		// header directive controller
		var controller = function($scope,$element) {

		};




		var template =  '<div id="sidebar-wrapper">' +
						    '<ul class="sidebar-nav">' +
						       '<div channel-register ng-if="channels.length > 0">' +
							       '<li class="sidebar-brand">' +
							          'Channels  <span class="glyphicon glyphicon-refresh"  ng-click="filerChannelRemove()" ></span>' +
							        '</li>' +
							       	'<li ng-repeat="channel in channels | orderBy:\'-date_added\'" ng-init="getChannelInfo(channel)"  ng-click="filerChannel(channel)">' +
							            '<div ng-if="channel.filesLen">' +
							                '<a href="#">' +
												'<img ng-if="channel.logo" ng-src="/{{channel_master_address}}/merged-{{merger_name}}/{{channel.channel_address}}/uploads/images/{{channel.logo}}" class="imgFilehubLogo"/>' +
							                	'<img ng-hide="channel.logo" src="assets/img/x-avatar.png" class="imgFilehubLogo"/>' +
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