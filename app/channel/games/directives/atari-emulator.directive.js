app.directive('atariEmulator', ['$location','$timeout',
	function($location,$timeout) {

		var controller = function($scope,$element) {
			console.log('atari emulator controller');
			// init atari emulator
			$scope.initAtariEmulator = function(game){
				// $scope.loadScript('assets/lib/games/javatari/javatari.js', 'text/javascript', 'utf-8');
				Javatari.ROM_AUTO_LOAD_URL = game.path;
				Javatari.IMAGES_PATH = window.Javatari_IMAGES_PATH || '/' + Page.site_info.address+'/assets/lib/games/javatari/';
				Javatari.start();
				console.log(Javatari);
			};
		};

		var template =  '<section id="javatari">' +
							'<div style="margin:0 auto; min-height: 594px;">' +
							    '<div id="javatari-screen" style="margin-bottom:5px;"></div>' +
							    '<div id="javatari-console-panel" style="margin: 0 auto; display:none;"></div>' +
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