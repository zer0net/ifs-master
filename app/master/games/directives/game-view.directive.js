app.directive('gameView', ['$location','$rootScope',
	function($location,$rootScope) {

		var template = '<div class="item-view" layout="row"  layout-padding ng-if="items" ng-init="getItem(item)">' +
							'<div ng-if="error_msg" flex="100" ng-hide="item" ng-bind="error_msg" style="font-weight: bold;text-align: center;"></div>' +
							'<!-- game -->' +
							'<md-content style="background-color:transparent;" flex="65" ng-if="item">' +
								'<!-- dosbox -->' +
								'<dosbox ng-if="item.file_type === \'zip\'" ng-init="initDosBox()"></dosbox>' +
								'<!-- /dosbox -->' +
								'<!-- nes -->' +
								'<nes-emulator ng-if="item.file_type === \'nes\'" ng-init="initNesEmulator()"></nes-emulator>' +
								'<!-- /nes -->' +
								'<!-- cpc -->' +
								'<cpc-emulator ng-if="item.file_type === \'sna\'"  ng-init="initCpcEmulator()"></cpc-emulator>' +
								'<!-- /cpc -->' +
								'<!-- atari -->' +
								'<atari-emulator ng-if="item.file_type === \'bin\'" ng-init="initAtariEmulator()"></atari-emulator>' +
								'<!-- atari -->' +
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