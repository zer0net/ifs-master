app.directive('dosbox', ['$location','$timeout',
	function($location,$timeout) {

		var controller = function($scope,$element) {

			// run dosbox
			$scope.initDosBox = function(item){
				// render zip url
				if (item) { $scope.item = item; }
				var zipUrl = "/"+$scope.page.site_info.address+"/merged-"+$scope.page.site_info.content.merger_name+"/"+$scope.item.channel.cluster_id+"/data/users/"+$scope.item.channel.channel_address.split('_')[1]+"/"+$scope.item.file_name;
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
							console.log($scope.item);
							$scope.emulator_status = 'Running';
							$scope.$apply();
						},
						onload: function (dosbox) {
							console.log($scope.item.title + ' running ...');
							dosbox.run(zipUrl, "./"+$scope.item.inner_file);
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
									'.dosbox-overlay {background-image: url("{{item.img}}");}' +
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