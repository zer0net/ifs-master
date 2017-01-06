app.directive('snaEmulator', ['$location','$rootScope',
	function($location,$rootScope) {

		var controller = function($scope,$element) {

			// init nes emulator
			$scope.initSnaEmulator = function(){
				// init jsnes
		        $("#snapshot").val('fruity_frank.sna');
				// sna file
				var snaFile  = "/"+$scope.site_address+"/merged-"+$scope.merger_name+"/"+$scope.game.channel.address+"/uploads/games/"+$scope.game.file_name;
				
				$( "#snapshot" ).trigger( "change" );
				
			
				 $("#button-run").removeAttr("disabled");
				$( "#button-run" ).trigger( "click" );


			};


		};

		var template = '<div class="main-panel" ng-init="initSnaEmulator()">'+
				'<div id="screen-placeholder">'+
					'<div id="logo"></div>'+					
				'</div>'+
				'<div id="status">Paused</div>'+
				'<div class="control-panel">'+
					'<select id="snapshot" rows="1" autocomplete="off">'+
						'<option value="none">Choose configuration...</option>'+
						'<optgroup label="Boot">'+
							'<option value="boot_cpc464">CPC 464</option>'+
							'<option value="boot_cpc664">CPC 664</option>'+
							'<option value="boot_cpc6128">CPC 6128</option>'+
						'</optgroup>'+
						'<optgroup label="Games">'+
							'<option value="bomb_jack.sna">Bomb Jack</option>'+
							'<option value="boulder_dash.sna">Boulder Dash</option>'+
							'<option value="buggy_boy.sna">Buggy Boy</option>'+
							'<option value="cybernoid.sna">Cybernoid</option>'+
							'<option value="donkey_kong.sna">Donkey Kong</option>'+
							'<option value="fruity_frank.sna">Fruity Frank</option>'+
							'<option value="archon.sna">Archon</option>'+
						'</optgroup>'+
					'</select>'+
					'<div id="button-run" class="button-size1 disabled-button"><span class="guifx2">d </span> Resume</div>'+
					'<div id="button-reset" title="Reset CPC" class="button-size1 disabled-button guifx2">q</div>'+
					'<div id="checkbox-settings" title="Settings"></div>'+
					'<div id="checkbox-fullscreen" title="Fullscreen"></div>'+
					'<div id="checkbox-joystick" title="Disable CPC joystick"></div>'+
					'<div id="checkbox-sound" title="Unmute"></div>'+	
				'</div>'+			
				'<div id="browser-nfo" class="nfo">'+
				'<div>CPC joystick mapped to <i>Ctrl, Alt and arrow keys.</i><br />'+
				'Another fine release by h.p.tuttle.'+
				'</div>'+
				'</div>'+
			'</div>';

		


		return {
			controller: controller,
			restrict: 'AE',
			replace:true,			
			template:template
		}

	}
]);