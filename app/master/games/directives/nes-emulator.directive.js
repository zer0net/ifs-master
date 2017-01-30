app.directive('nesEmulator', ['$location','$rootScope','$timeout',
	function($location,$rootScope,$timeout) {

		var controller = function($scope,$element) {

			// init nes emulator
			$scope.initNesEmulator = function(game){
				// render nes url
				var nesFile;
				if (game) { 
					$scope.game = game;
					nesFile = "/"+$scope.site_address+"/merged-"+$scope.merger_name+"/"+$scope.game.channel+"/"+$scope.game.path;
				} else {
					nesFile = "/"+$scope.site_address+"/merged-"+$scope.merger_name+"/"+$scope.game.channel.address+"/"+$scope.game.path;
				}

				// load scripts 
				$scope.loadScript('/'+$scope.page.site_info.address + '/assets/lib/games/nes/lib/dynamicaudio-min.js', 'text/javascript', 'utf-8');
				$scope.loadScript('/'+$scope.page.site_info.address + '/assets/lib/games/nes/nes.js', 'text/javascript', 'utf-8');
				$scope.loadScript('/'+$scope.page.site_info.address + '/assets/lib/games/nes/utils.js', 'text/javascript', 'utf-8');
				$scope.loadScript('/'+$scope.page.site_info.address + '/assets/lib/games/nes/cpu.js', 'text/javascript', 'utf-8');
				$scope.loadScript('/'+$scope.page.site_info.address + '/assets/lib/games/nes/keyboard.js', 'text/javascript', 'utf-8');
				$scope.loadScript('/'+$scope.page.site_info.address + '/assets/lib/games/nes/mappers.js', 'text/javascript', 'utf-8');
				$scope.loadScript('/'+$scope.page.site_info.address + '/assets/lib/games/nes/papu.js', 'text/javascript', 'utf-8');
				$scope.loadScript('/'+$scope.page.site_info.address + '/assets/lib/games/nes/ppu.js', 'text/javascript', 'utf-8');
				$scope.loadScript('/'+$scope.page.site_info.address + '/assets/lib/games/nes/rom.js', 'text/javascript', 'utf-8');
				$scope.loadScript('/'+$scope.page.site_info.address + '/assets/lib/games/nes/ui.js', 'text/javascript', 'utf-8');

				$timeout(function () {
					// init jsnes
			        var nes = new JSNES({
			            'ui': $('#emulator').JSNESUI({
			                "Working": [ ]
			            })
			        });
			        // remove select options
					nes.ui.romSelect.children().remove();
					// create select option
					$('<option value="'+nesFile+'">'+$scope.game.title+'</option>').appendTo(nes.ui.romSelect);
					// select rom
					nes.ui.romSelect.val(nesFile);
					// load nes
					nes.ui.loadROM();
				});
			};

		};

		var template = 	'<center id="nes-emulator-container">' +
						    '<div id="emulator"></div>' +
						    '<div id="emcontrols" style="display: none">' +
						    	'<section class="section-header item-info-header">' +
							    	'<h2>Controls</h2>' +
							    '</section>' +
							    '<section class="section md-whiteframe-1dp item-info">' +
							    	'<ul>' +
							    		'<li>' +
								            '<span>Button</span>' +
								            '<span>Player 1</span>' +
								            '<span>Player 2</span>' +
							            '</li>' + 
							            '<li>' +
								            '<td>Left</td>' +
								            '<td>Left</td>' +
								            '<td>Num-4</td>' +
							            '</li>' +
							    		'<li>' +
								            '<td>Right</td>' +
								            '<td>Right</td>' +
								            '<td>Num-6</td>' +
							            '</li>' + 
								        '<li>' +
								            '<span>Up</span>' +
								            '<span>Up</span>' +
								            '<span>Num-8</span>' +
								        '</li>' +
								        '<li>' +
								            '<span>Down</span>' +
								            '<span>Down</span>' +
								            '<span>Num-2</span>' +
								        '</li>' +
								        '<li>' +
								            '<span>A</span>' +
								            '<span>X</span>' +
								            '<span>Num-7</span>' +
								        '</li>' +
								        '<li>' +
								            '<span>B</span>' +
								            '<span>Z/Y</span>' +
								            '<span>Num-9</span>' +
								        '</li>' +
								        '<li>' +
								            '<span>Start</span>' +
								            '<span>Enter</span>' +
								            '<span>Num-1</span>' +
								        '</li>' +
								        '<li>' +
								            '<span>Select</span>' +
								            '<span>Clil</span>' +
								            '<span>Num-3</span>' +
								        '</li>' +
							    	'</ul>' +
							    '</section>' +
						    '</div>' +
						'</center>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);