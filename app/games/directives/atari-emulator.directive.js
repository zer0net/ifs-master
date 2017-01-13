app.directive('atariEmulator', ['$location','$timeout',
	function($location,$timeout) {

		var controller = function($scope,$element) {
			console.log('atari emulator controller');
			// init atari emulator
			$scope.initAtariEmulator = function(){
				$scope.loadScript('assets/lib/games/javatari/javatari.js', 'text/javascript', 'utf-8');
				Javatari.ROM_AUTO_LOAD_URL = '/' + $scope.page.site_info.address + '/merged-IFS/' + $scope.game.channel.address + '/' + $scope.game.path;
				Javatari.IMAGES_PATH = window.Javatari_IMAGES_PATH || '/' + $scope.page.site_info.address+'/assets/lib/games/javatari/';
				Javatari.start();
				console.log(Javatari);
			};
		};

		var template =  '<section id="javatari" style="background:transparent;">' +
							'<div style="margin:auto 0;" ng-init="initAtariEmulator()">' +
							    '<div id="javatari-screen" style="margin: 0 auto; box-shadow: 2px 2px 10px rgb(60, 60, 60);"></div>' +
							    '<div id="javatari-console-panel" style="display:none"></div>' +
							'</div>'+
							'<script src="assets/lib/games/javatari/javatari.js" type="text/javascript" charset="utf-8"></script>' +
						'</section>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);