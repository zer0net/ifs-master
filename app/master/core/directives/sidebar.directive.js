app.directive('sidebar', ['$mdDialog', '$mdMedia',
	function($mdDialog,$mdMedia) {		

		// header directive controller
		var controller = function($scope,$element) {

			$scope.filterMediaType = function(type)
			{
				$scope.filerRemove();
				$('#filterMediaType').val(type);				
				$('#filterMediaType').trigger('input');
			}

			$scope.filterFileType = function(type)
			{
				$scope.filerRemove();
				$('#filterFileType').val(type);			
				$('#filterFileType').trigger('input');	
			}

			$scope.filerRemove = function()
			{
				$('#filterMediaType').val('');
				$('#filterFileType').val('');

				$('#filterMediaType').trigger('input');	
				$('#filterFileType').trigger('input');
			}
			

			
			$scope.onFilterChannel = function(channel) {
				if (channel.logo){
					channel.logo_src = '/'+$scope.channel_master_address+'/merged-'+$scope.merger_name+'/'+channel.channel_address+'/uploads/images/'+channel.logo;
				}
				$scope.filterChannel(channel)
			};
			$scope.filterChannelRemove = function()
			{
				$('#filterChannel').val('');
				$('#filterChannel').trigger('input');				
				$('#channelInfo').html('');			
			}
			
		};

		var template =  '<div id="sidebar-wrapper">' +
						    '<ul class="sidebar-nav">' +
						       '<div channel-register ng-if="channels.length > 0">' +
							       '<li class="sidebar-brand">' +
							          'Channels  <span class="glyphicon glyphicon-refresh"  ng-click="filterChannelRemove()" ></span>' +
							        '</li>' +
							       	'<li ng-repeat="channel in channels | orderBy:\'-date_added\'" ng-init="getChannelInfo(channel)"  ng-click="onFilterChannel(channel)">' +
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