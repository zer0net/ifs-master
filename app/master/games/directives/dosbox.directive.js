app.directive('dosbox', ['$location','$timeout',
	function($location,$timeout) {

		var controller = function($scope,$element) {

			// run dosbox
			$scope.initDosBox = function(game){
				// render zip url
				var zipUrl;
				if (game) { 
					$scope.game = game;
					zipUrl = "/"+$scope.site_address+"/merged-"+$scope.merger_name+"/"+$scope.game.channel+"/uploads/games/"+$scope.game.zip_name;
				} else {
					zipUrl = "/"+$scope.site_address+"/merged-"+$scope.merger_name+"/"+$scope.game.channel.address+"/uploads/games/"+$scope.game.zip_name;
				}
				// script url
				$scope.loadScript('/'+$scope.page.site_info.address + '/assets/lib/games/js-dos/js-dos.js', 'text/javascript', 'utf-8');
				// dosbox size
				$scope.dosboxSize = 'normal';
				// emulator status 
				$scope.emulator_status = 'Loading ...';	
				// run dosbox					
				$timeout(function () {
					// dosbox config
					var dosbox = new Dosbox({
						id: "dosbox",
						onrun: function (dosbox, app) {
							console.log("App '" + app + "' is runned");
							console.log($scope.game.site_file);
							$scope.emulator_status = 'Running';
							$scope.$apply();
						},
						onload: function (dosbox) {
							console.log($scope.game.title + ' running ...');
							dosbox.run(zipUrl, "./"+$scope.game.file_name);
							$scope.emulator_status = 'Extracting ...';
							$scope.$apply();
						}
					});
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
							'<div id="dosbox-section" class="{{dosboxSize}} md-whiteframe-1dp">' +
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