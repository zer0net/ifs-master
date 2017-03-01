app.directive('sideBar', [
	function() {

		// site header controller
		var controller = function($scope,$element) {

			$scope.init = function(){
				if ($scope.item.poster_file){
					$scope.item.poster_path = '/' + $scope.page.site_info.address + '/merged-' + $scope.page.site_info.content.merger_name + '/' + $scope.item.channel.cluster_id + '/data/users/' + $scope.item.channel.user_id + '/' + $scope.item.poster_file;
				}
				$scope.generateItemProperties();
			};

			// generate item properties
			$scope.generateItemProperties = function(){
				$scope.itemProperties = [];
				for (var i in $scope.item){
					// create property obj
					var property = {
						key:i.split('_').join(' '),
						value:$scope.item[i]
					};
					// set property type
					if (property.key.indexOf('size') > -1) {property.type = 'size'}
					else if (property.key.indexOf('date') > -1) {property.type = 'date'}
					else if (property.key.indexOf('time') > -1) {property.type = 'time'}
					else {property.type = 'normal'}
					// ommit redundant properties
					if (property.key !== 'channel' && 
						property.key !== 'img' && 
						property.key !== 'file' && 
						property.key !== 'video' &&
						property.key !== 'published' &&
						property.key !== 'path' &&
						property.key !== 'imgPath'){ 
						// push to item properties array
						$scope.itemProperties.push(property); 
					}
				}
			};

		};

		// site header template
		var template = 	'<aside flex="30" layout="column" layout-padding>' +
							'<ul class="item-details md-whiteframe-1dp" flex="100" ng-init="init()">' +
								'<li class="item-property" ng-repeat="property in itemProperties">' +
									'<b class="key">{{property.key}}:</b> ' +
									'<span class="value" ng-if="property.type === \'normal\'">{{property.value}}</span>' +
									'<span class="value" ng-if="property.type === \'size\'">{{property.value|filesize}}</span>' +
									'<span class="value" ng-if="property.type === \'date\'"><span am-time-ago="property.value"></span></span>' +
								'</li>' +
							'</ul>' +
							'<div class="thumb-image-section md-whiteframe-1dp" flex="100">' +
								'<h3>Image</h3>'+
								'<hr/>'+
								'<!-- item image -->' +
								'<img ng-src="{{item.poster_path}}" ng-if="!item.poster" ng-show="item.poster_file" style="margin-bottom:8px;"/>' +
								'<img ng-src="{{item.poster}}" ng-if="item.poster" ng-show="item.poster" style="margin-bottom:8px;"/>' +
								'<!-- /item image -->' +
								'<!-- image upload -->' +
								'<image-upload></image-upload>' +
								'<!-- /image upload -->' +
							'</div>' +
						'</aside>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);