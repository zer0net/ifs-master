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
				console.log(snaFile);		

			};


		};

		var template = '<div class="main-panel" ng-init="initSnaEmulator()">'+
				'<div id="screen-placeholder">'+
				/*'<canvas id="screen" width="768" height="272" style="display:none"></canvas>'+*/
				'<div id="logo"></div>'+				
				'<div id="option-panel-overlay" style="display:none"></div>'+
				'<div id="option-panel" style="display:none">'+
					'<div id="option-panel-header">'+
						'Settings'+
						'<div id="settings-close">X</div>'+
					'</div>'+
					'<div id="option-panel-content">'+
						'<div class="option-heading">Brand name</div>'+
						'<div class="option-list">'+
							'<input type="radio" id="brand1" name="brand" value="amstrad">'+
							'<label for="brand1" class="option-label">'+
								'<div class="option-name">Amstrad</div>'+
								'<div class="option-comment">Worldwide distributor</div>'+
							'</label>'+
							'<input type="radio" id="brand2" name="brand" value="schneider">'+
							'<label for="brand2" class="option-label">'+
								'<div class="option-name">Schneider</div>'+
								'<div class="option-comment">German distributor</div>'+
							'</label>'+
							'<input type="radio" id="brand3" name="brand" value="awa">'+
							'<label for="brand3" class="option-label">'+
								'<div class="option-name">AWA</div>'+
								'<div class="option-comment">Australian distributor</div>'+
							'</label>'+
						'</div>'+
						'<div class="option-heading">Keyboard</div>'+
						'<div class="option-list">'+
							'<input type="radio" id="keyboard1" name="firmware" value="english">'+
							'<label for="keyboard1" class="option-label">'+
								'<img src="img/flag_uk.png" class="option-flag" />'+
								'<div class="option-comment">English layout</div>'+
							'</label>'+
							'<input type="radio" id="keyboard2" name="firmware" value="french">'+
							'<label for="keyboard2" class="option-label">'+
								'<img src="img/flag_france.png" class="option-flag" />'+
								'<div class="option-comment">French layout</div>'+
							'</label>'+
							'<input type="radio" id="keyboard3" name="firmware" value="spanish">'+
							'<label for="keyboard3" class="option-label">'+
								'<img src="img/flag_spain.png" class="option-flag" />'+
								'<div class="option-comment">Spanish layout</div>'+
							'</label>'+
						'</div>'+
						'<div class="option-heading">CRTC</div>'+
						'<div class="option-list">'+
							'<input type="radio" id="crtc0" name="crtc" value="type0">'+
							'<label for="crtc0" class="option-label">'+
								'<div class="option-name">Type 0</div>'+
								'<div class="option-comment">Hitachi HD6845S</div>'+
							'</label>'+
							'<input type="radio" id="crtc1" name="crtc" value="type1">'+
							'<label for="crtc1" class="option-label">'+
								'<div class="option-name">Type 1</div>'+
								'<div class="option-comment">UMC UM6845R</div>'+
							'</label>'+
							'<input type="radio" id="crtc2" name="crtc" value="type2">'+
							'<label for="crtc2" class="option-label">'+
								'<div class="option-name">Type 2</div>'+
								'<div class="option-comment">Motorola MC6845</div>'+
							'</label>'+
						'</div>'+
						'<div class="option-heading">Monitor</div>'+
						'<div class="option-list">'+
							'<input type="radio" id="monitor1" name="monitor" value="colour">'+
							'<label for="monitor1" class="option-label">'+
								'<div class="option-name"><span style="color:red">Co</span><span style="color:green">lo</span><span style="color:blue">ur</span></div>'+
								'<div class="option-comment">RGB CPC/Plus</div>'+
							'</label>'+
							'<input type="radio" id="monitor2" name="monitor" value="green">'+
							'<label for="monitor2" class="option-label">'+
								'<div class="option-name"><span style="color:#090">Gr</span><span style="color:#0C0">e</span><span style="color:#060">en</span></div>'+
								'<div class="option-comment">Monochrome CPC</div>'+
							'</label>'+
							'<input type="radio" id="monitor3" name="monitor" value="grayscale">'+
							'<label for="monitor3" class="option-label">'+
								'<div class="option-name"><span style="color:#666">Gre</span><span style="color:#999">ysc</span><span style="color:#333">ale</span></div>'+
								'<div class="option-comment">Monochrome Plus</div>'+
							'</label>'+
						'</div>'+
						'<div class="option-heading">Audio mixer</div>'+
						'<div class="option-list">'+
							'<input type="radio" id="audio1" name="audio" value="mono">'+
							'<label for="audio1" class="option-label">'+
								'<div class="option-name">Mono</div>'+
								'<div class="option-comment">CPC internal speaker</div>'+
							'</label>'+
							'<input type="radio" id="audio2" name="audio" value="stereo">'+
							'<label for="audio2" class="option-label">'+
								'<div class="option-name">Stereo</div>'+
								'<div class="option-comment">CPC external & Plus speakers</div>'+
							'</label>'+
						'</div>'+
						'<div class="option-heading">Peripherals</div>'+
						'<div class="option-list">'+
							'<input type="checkbox" id="floppy-option">'+
							'<label for="floppy-option" class="option-label option-name">Extra floppy drive</label>'+
							'<input type="checkbox" id="tape-option">'+
							'<label for="tape-option" class="option-label option-name">Tape deck</label>'+
							'<input type="checkbox" id="ram-option">'+
							'<label for="ram-option" class="option-label option-name">512KB RAM expansion</label>'+
						'</div>'+
					'</div>'+
				'</div>'+
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
					'<input type="range" name="sound-volume" min="1" max="100" value="75" style="display:none" />'+
				'</div>'+	
				'<fieldset id="fieldset-tape" style="display:none">'+
				'<legend>Tape deck</legend>'+
				'<div id="tape-choose" class="button-size2 button" onclick="$(\'#tape-input\').click();"><img src="img/Open_16x16.png" /></div>'+
				'<div id="tape-filename"><i>Empty</i></div>'+
				'<select id="tape-zipselect" style="display:none"></select>'+
				'<input type="file" id="tape-input" />'+
				'<div id="tape-counter">000</div>'+
				'<div id="tape-record"class="button-size2 disabled-button guifx2">4</div>'+
				'<div id="tape-play"class="button-size2 disabled-button guifx2">1</div>'+
				'<div id="tape-rewind"class="button-size2 disabled-button guifx2">5</div>'+
				'<div id="tape-forward"class="button-size2 disabled-button guifx2">6</div>'+
				'<div id="tape-stop"class="button-size2 disabled-button guifx2">3</div>'+
				'<div id="tape-eject" class="button-size2 disabled-button guifx2">\'</div>'+
				'</fieldset>'+
				'<fieldset id="fieldset-drivea" style="display:none">'+
				'<legend>Drive A:</legend>'+
				'<div id="drivea-choose" class="button-size2 button" onclick="$(\'#drivea-input\').click();"><img src="img/Open_16x16.png" /></div>'+
				'<div id="drivea-filename"><i>Empty</i></div>'+
				'<select id="drivea-zipselect" style="display:none"></select>'+
				'<input type="file" id="drivea-input" />'+
				'<div id="drivea-led" class="led"></div>'+
				'<div id="drivea-eject" class="button-size2 disabled-button guifx2">\'</div>'+
			'</fieldset>'+
			'<fieldset id="fieldset-driveb" style="display:none">'+
				'<legend>Drive B:</legend>'+
				'<div id="driveb-choose" class="button-size2 button" onclick="$(\'#driveb-input\').click();"><img src="img/Open_16x16.png" /></div>'+
				'<div id="driveb-filename"><i>Empty</i></div>'+
				'<select id="driveb-zipselect" style="display:none"></select>'+
				'<input type="file" id="driveb-input" />'+
				'<div id="driveb-led" class="led"></div>'+
				'<div id="driveb-eject" class="button-size2 disabled-button guifx2">\'</div>'+
				'</fieldset>'+
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