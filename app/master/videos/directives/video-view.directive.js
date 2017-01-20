app.directive('videoView', ['$location',
	function($location) {

		var template =  '<div class="item-view" layout="row" layout-padding ng-init="getItem(item)">' +
							'<div ng-if="error_msg" flex="100" ng-hide="game" ng-bind="error_msg" style="font-weight: bold;text-align: center;"></div>' +
							'<!-- video main -->' +
							'<md-content class="item-view video-view" flex="65">' +
								'<div ng-if="video" ng-init="loadVideo(video)">' +
									'<!-- player -->' +
									'<video-player></video-player>' +
									'<!-- /player -->' +
									'<hr class="divider"/>' +
									'<!-- info -->' +
									'<item-view-details ng-init="initItemViewDetails(video)"></item-view-details>' +
									'<!-- /info -->' +
									'<hr class="divider"/>' +
									'<!-- comments -->' +
									'<item-view-comments ng-init="initItemViewComments(video)"></item-view-comments>' +
									'<!-- /comments -->' +
								'</div>' +
							'</md-content>' +
							'<!-- /video main -->' +
							'<!-- video list -->' +
							'<md-content class="video-list" flex="35"  ng-if="videos" style="background-color: transparent;">' +
								'<video-list-sidebar></video-list-sidebar>' +
							'</md-content>' +
							'<!-- /video list -->' +
						'</div>';

		return {
			restrict: 'AE',
			replace:false,
			template:template
		}

	}
]);