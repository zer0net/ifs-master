app.directive('dosbox', ['$location','$rootScope','$timeout',
	function($location,$rootScope,$timeout) {

		var controller = function($scope,$element) {

			// init dosbox
			$scope.initDosBox = function(item){
				// assign item to scope
				$scope.item = item;
				// dosbox size
				$scope.dosboxSize = 'normal';
				// dosbox file
				var zipFile;
				if ($scope.mode === 'create'){
					zipFile = item.file;
				} else {
					zipFile = "/"+Page.site_info.address+"/uploads/games/"+$scope.item.zip_name;
				}
				// dosbox config
				var dosbox = new Dosbox({
					id: "dosbox",
					onrun: function (dosbox, app) {
						console.log("App '" + app + "' is runned");
					},
					onload: function (dosbox) {
						console.log(item.title + ' running...');
						dosbox.run(zipFile, "./"+$scope.item.file_name);
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

			// on executable file name change
			$rootScope.$on('onChangeExecutableFile',function(event,mass){
                $scope.item.file_name = mass;
				// dosbox file
				var zipFile;
				if ($scope.mode === 'create'){
					zipFile = $scope.item.file;
				} else if ($scope.mode === 'edit'){
					zipFile = "/"+$scope.site_address+"/uploads/games/"+$scope.item.zip_name;
				}
				// dosbox onload
                dosbox.onload = function (dosbox) {
					console.log($scope.item.title + ' running...');
					dosbox.run(zipFile, "./"+$scope.item.file_name);
                }
			});

		};

		var template = 				
		'<div id="dosbox-section" class="{{dosboxSize}} md-whiteframe-1dp">' +
			'<script type="text/javascript" src="{{page.site_info.address}}/assets/lib/games/js-dos/js-dos.js"></script>' +
			'<style type="text/css">' +
				'.dosbox-overlay {background-image: url("{{item.imgPath}}");}' +
			'</style>' +
			'<div id="dosbox"></div>' +
			'<div ng-if="dosboxSize === \'full\'" class="dosbox-exit-fullscreen">' +
				'<a ng-click="toggleFullScreen()">Exit Full Screen</a>' +
			'</div>' +
			'<a ng-click="toggleFullScreen()" class="fullscreen-btn"><span class="glyphicon glyphicon-fullscreen"></span></a>' +
		'</div>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);