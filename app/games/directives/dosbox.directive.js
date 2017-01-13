app.directive('dosbox', ['$location','$timeout',
	function($location,$timeout) {

		var controller = function($scope,$element) {

			// init dosbox
			$scope.initDosBox = function(){
				console.log('hi');
				// inner path
				var inner_path = "merged-"+$scope.merger_name+"/"+$scope.game.channel.address+"/uploads/games/"+$scope.game.zip_name;
				// dosbox size
				$scope.dosboxSize = 'normal';
				// emulator status 
				$scope.emulator_status = 'Downloading ...';				
				// xhttp get dos file
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState === 4){
						console.log(this);
						$scope.runDosBox();						
					} else {

					}
				};
				xhttp.open("GET", inner_path, true);
				xhttp.send();
			};

			// run dosbox
			$scope.runDosBox = function(){
				// dosbox config
				var dosbox = new Dosbox({
					id: "dosbox",
					onrun: function (dosbox, app) {
						console.log("App '" + app + "' is runned");
						if ($scope.game.site_file){
							if ($scope.game.site_file.is_downloaded === 1){
								$scope.emulator_status = 'Running';
							} else {
								$scope.emulator_status = 'File not downloaded';
							}
						} else {
							$scope.emulator_status = 'File not found';
						}
						$scope.$apply();
					},
					onload: function (dosbox) {
						console.log($scope.game.title + ' running ...');
						dosbox.run("/"+$scope.site_address+"/merged-"+$scope.merger_name+"/"+$scope.game.channel.address+"/uploads/games/"+$scope.game.zip_name, "./"+$scope.game.file_name);
						$scope.emulator_status = 'Extracting ...';
						$scope.$apply();
					}
				});

				// run dosbox					
				$timeout(function () {
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