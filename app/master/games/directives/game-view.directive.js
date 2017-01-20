app.directive('gameView', ['$location','$rootScope',
	function($location,$rootScope) {

		var controller = function($scope,$element) {

			// init game view
			$scope.initGameView = function(item){
				$scope.game = game;
			};

		};


		var template = '<div class="item-view" layout="row"  layout-padding ng-if="games" ng-init="getItem(item)">' +
							'<div ng-if="error_msg" flex="100" ng-hide="game" ng-bind="error_msg" style="font-weight: bold;text-align: center;"></div>' +
							'<!-- game -->' +
							'<md-content style="background-color:transparent;" flex="65" ng-if="game">' +
								'<!-- dosbox -->' +
								'<dosbox ng-if="game.file_type === \'zip\'" ng-init="initDosBox()"></dosbox>' +
								'<!-- /dosbox -->' +
								'<!-- nes -->' +
								'<nes-emulator ng-if="game.file_type === \'nes\'" ng-init="initNesEmulator()"></nes-emulator>' +
								'<!-- /nes -->' +
								'<!-- cpc -->' +
								'<cpc-emulator ng-if="game.file_type === \'sna\'"  ng-init="initCpcEmulator()"></cpc-emulator>' +
								'<!-- /cpc -->' +
								'<!-- atari -->' +
								'<atari-emulator ng-if="game.file_type === \'bin\'" ng-init="initAtariEmulator()"></atari-emulator>' +
								'<!-- atari -->' +
								'<hr class="divider"/>' +
								'<!-- info -->' +
								'<item-view-details ng-init="initItemViewDetails(game)"></item-view-details>' +
								'<!-- /info -->' +
								'<hr class="divider"/>' +
								'<!-- comments -->' +
								'<item-view-comments ng-init="initItemViewComments(game)"></item-view-comments>' +
								'<!-- /comments -->' +
							'</md-content>' +
							'<!-- /game -->' +
							'<!-- game list -->' +
							'<md-content class="game-list" flex="35" ng-if="game">' +
								'<game-list-sidebar></game-list-sidebar>' +
							'</md-content>' +
							'<!-- /game list -->' +
						'</div>';


		return {
			restrict: 'AE',
			template:template,
			replace:true,
			controller: controller,
		}

	}
]);