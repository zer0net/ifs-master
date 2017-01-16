app.directive('sideBar', [
	function() {

		// site header controller
		var controller = function($scope,$element) {

		};

		// site header template
		var template = 	'<aside flex="30" layout="column" layout-padding>' +
							'<ul class="item-details md-whiteframe-1dp" flex="100">' +
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
								'<img ng-src="{{item.imgPath}}" ng-if="!item.img" ng-show="item.imgPath" style="margin-bottom:8px;"/>' +
								'<img ng-src="{{item.img}}" ng-if="item.img" ng-show="item.img" style="margin-bottom:8px;"/>' +
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