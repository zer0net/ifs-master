app.directive('dosbox', ['$location',
	function($location) {

		var controller = function($scope,$element) {

			// init dosbox
			$scope.initDosBox = function(){
			/*	// dosbox size
				$scope.dosboxSize = 'normal';
				// dosbox config
				var dosbox = new Dosbox({
					id: "dosbox",
					onrun: function (dosbox, app) {
						console.log("App '" + app + "' is runned");
					},
					onload: function (dosbox) {
						console.log($scope.game.title + ' running...');
						dosbox.run("/"+$scope.site_address+"/merged-"+$scope.merger_name+"/"+$scope.game.channel.address+"/uploads/games/"+$scope.game.zip_name, "./"+$scope.game.file_name);
					}
				});
			*/
				var emulatorPath = "/assets/lib/emulators/em-dosbox/dosbox-sync.js";
				var gamePath = "/merged-"+$scope.merger_name+"/"+$scope.game.channel.address+"/uploads/games/"+$scope.game.zip_name;
				var dosBoxLoader = new DosBoxLoader(DosBoxLoader.emulatorJS(emulatorPath),
									DosBoxLoader.locateAdditionalEmulatorJS(locateAdditionalFiles),
									DosBoxLoader.nativeResolution(640, 480),
									DosBoxLoader.mountZip("c",
	                                    DosBoxLoader.fetchFile("Game File",gamePath)),
	                                    	DosBoxLoader.startExe($scope.game.file_name));
				console.log(dosBoxLoader);
				var emulator =  new Emulator(document.querySelector("#canvas"), null, dosBoxLoader);
				emulator.start({ waitAfterDownloading: true });
				console.log(emulator);

				function locateAdditionalFiles(filename) {
					console.log('filename - ' + filename);
					if (filename === "dosbox.html.mem") {
					  return "emulators/em-dosbox/dosbox-sync.mem";
					}
					return "emulators/em-dosbox/"+ filename;
				}
			};

			// toggle full screen
			$scope.toggleFullScreen = function(){
				if ($scope.dosboxSize === 'full') { $scope.dosboxSize = 'normal'; }
				else { $scope.dosboxSize = 'full'; }
			};

		};

		var template = 				
		'<div id="dosbox-section" class="{{dosboxSize}} md-whiteframe-1dp" ng-init="initDosBox()">' +
			/*'<style type="text/css">' +
				'.dosbox-overlay {background-image: url("{{game.img}}");}' +
			'</style>' +
			'<div id="dosbox"></div>' +
			'<div ng-if="dosboxSize === \'full\'" class="dosbox-exit-fullscreen">' +
				'<a ng-click="toggleFullScreen()">Exit Full Screen</a>' +
			'</div>' +
			'<a ng-click="toggleFullScreen()" class="fullscreen-btn"><span class="glyphicon glyphicon-fullscreen"></span></a>' + */
			'<canvas id="canvas" style="width: 50%; height: 50%; display: block; margin: 0 auto;"/>' +
		'</div>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);