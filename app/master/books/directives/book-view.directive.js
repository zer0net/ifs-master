app.directive('bookView', ['$location','$rootScope',
	function($location,$rootScope) {

		var template = '<div class="item-view" layout="row"  layout-padding ng-if="items" ng-init="getItem(item)">' +
							'<div ng-if="error_msg" flex="100" ng-hide="item" ng-bind="error_msg" style="font-weight: bold;text-align: center;"></div>' +
							'<!-- game -->' +
							'<md-content style="background-color:transparent;" flex="65" ng-if="item">' +
								'<book-reader ng-init="initBookReader(item)"></book-reader>' +
								'<hr class="divider"/>' +
								'<!-- info -->' +
								'<item-view-details ng-init="initItemViewDetails(item)"></item-view-details>' +
								'<!-- /info -->' +
								'<hr class="divider"/>' +
								'<!-- comments -->' +
								'<item-view-comments ng-init="initItemViewComments(item)"></item-view-comments>' +
								'<!-- /comments -->' +
							'</md-content>' +
							'<!-- /game -->' +
							'<!-- game list -->' +
							'<md-content class="game-list" flex="35" ng-if="item">' +
								'<game-list-sidebar></game-list-sidebar>' +
							'</md-content>' +
							'<!-- /game list -->' +
						'</div>';


		return {
			restrict: 'AE',
			template:template,
			replace:true
		}

	}
]);