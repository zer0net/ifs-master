app.directive('nesEmulator', ['$location','$rootScope','$timeout',
	function($location,$rootScope,$timeout) {

		var controller = function($scope,$element) {

			// init nes emulator
			$scope.initNesEmulator = function(game){
				// render nes url
				var nesFile;
				if (game) { 
					console.log(game.channel);
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
							    '<h2>Controls</h2>' +
							    '<table id="controls">' +
							        '<tr>' +
							            '<th>Button</th>' +
							            '<th>Player 1</th>' +
							            '<th>Player 2</th>' +
							        '</tr>' +
							        '<tr>' +
							            '<td>Left</td>' +
							            '<td>Left</td>' +
							            '<td>Num-4</td>' +
							        '</tr>' +
							        '<tr>' +
							            '<td>Right</td>' +
							            '<td>Right</td>' +
							            '<td>Num-6</td>' +
							        '</tr>' +
							        '<tr>' +
							            '<td>Up</td>' +
							            '<td>Up</td>' +
							            '<td>Num-8</td>' +
							        '</tr>' +
							        '<tr>' +
							            '<td>Down</td>' +
							            '<td>Down</td>' +
							            '<td>Num-2</td>' +
							        '</tr>' +
							        '<tr>' +
							            '<td>A</td>' +
							            '<td>X</td>' +
							            '<td>Num-7</td>' +
							        '</tr>' +
							        '<tr>' +
							            '<td>B</td>' +
							            '<td>Z/Y</td>' +
							            '<td>Num-9</td>' +
							        '</tr>' +
							        '<tr>' +
							            '<td>Start</td>' +
							            '<td>Enter</td>' +
							            '<td>Num-1</td>' +
							        '</tr>' +
							        '<tr>' +
							            '<td>Select</td>' +
							            '<td>Ctrl</td>' +
							            '<td>Num-3</td>' +
							        '</tr>' +
							    '</table>' +
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