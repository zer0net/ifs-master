app.directive('bookView', ['$location','$rootScope',
	function($location,$rootScope) {

		var template = '<div class="item-view" layout="row"  layout-padding ng-init="getItem(item)">' +
							'<div ng-if="error_msg" flex="100" ng-hide="item" ng-bind="error_msg" style="font-weight: bold;text-align: center;"></div>' +
							'<!-- book -->' +
							'<md-content style="background-color:transparent;" flex="100" ng-if="item">' +
								'<book-reader ng-init="initBookReader(item)"></book-reader>' +
							'</md-content>' +
							'<!-- /book -->' +
						'</div>';


		return {
			restrict: 'AE',
			template:template,
			replace:true
		}

	}
]);