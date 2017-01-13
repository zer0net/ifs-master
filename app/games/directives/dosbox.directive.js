app.directive('dosbox', ['$location','$timeout',
	function($location,$timeout) {

		var controller = function($scope,$element) {

			// init dosbox
			$scope.initDosBox = function(){
				// dosbox size
				$scope.dosboxSize = 'normal';
				// emulator status 
				$scope.emulator_status = 'Downloading ...';
				// dosbox config
				var dosbox = new Dosbox({
					id: "dosbox",
					onrun: function (dosbox, app) {
						console.log("App '" + app + "' is runned");
						console.log(Page);
						$scope.emulator_status = 'Running';
						$scope.$apply();
					},
					onload: function (dosbox) {
						console.log($scope.game.title + ' running ...');
						dosbox.run("/"+$scope.site_address+"/merged-"+$scope.merger_name+"/"+$scope.game.channel.address+"/uploads/games/"+$scope.game.zip_name, "./"+$scope.game.file_name);
						$scope.emulator_status = 'Launching ...'
						console.log(Page);
						$scope.$apply();
					}
				});
				$timeout(function () {
					// run dosbox
					console.log(dosbox);
					dosbox.ui.start[0].click();
				});
			};

			// toggle full screen
			$scope.toggleFullScreen = function(){
				if ($scope.dosboxSize === 'full') { $scope.dosboxSize = 'normal'; }
				else { $scope.dosboxSize = 'full'; }
			};

		};

		var template = 	'<section id="dosbox-section-container">' +		
							'<div id="dosbox-section" class="{{dosboxSize}} md-whiteframe-1dp" ng-init="initDosBox()">' +
								'<script type="text/javascript" src="assets/lib/js-dos/js-dos.js"></script>' +
								'<style type="text/css">' +
									'.dosbox-overlay {background-image: url("{{game.img}}");}' +
								'</style>' +
								'<div id="dosbox"></div>' +
								'<div ng-if="dosboxSize === \'full\'" class="dosbox-exit-fullscreen">' +
									'<a ng-click="toggleFullScreen()">Exit Full Screen</a>' +
								'</div>' +
								'<a ng-click="toggleFullScreen()" class="fullscreen-btn"><span class="glyphicon glyphicon-fullscreen"></span></a>' +
							'</div>' +
							'<p id="emulator-status" ng-bind="emulator_status"></p>' +
						'</section>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);