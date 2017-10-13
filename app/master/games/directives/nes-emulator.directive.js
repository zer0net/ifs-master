app.directive('nesEmulator', ['$location','$rootScope','$timeout',
	function($location,$rootScope,$timeout) {

		var controller = function($scope,$element) {

			// init nes emulator
			$scope.initNesEmulator = function(item){
				// nes file url
				if (item) { $scope.item = item; }
				var nesFile = "/"+$scope.page.site_info.address+"/merged-"+$scope.page.site_info.content.merger_name+"/"+$scope.item.cluster_id+"/data/users/"+$scope.item.channel_address.split('_')[1]+"/"+$scope.item.file_name;
				$timeout(function () {
					$scope.$apply(function(){
						// init jsnes
				        var nes = new JSNES({
				            'ui': $('#emulator').JSNESUI({
				                "Working": [ ]
				            })
				        });
				        // remove select options
						nes.ui.romSelect.children().remove();
						// create select option
						$('<option value="'+nesFile+'">'+$scope.item.title+'</option>').appendTo(nes.ui.romSelect);
						// select rom
						nes.ui.romSelect.val(nesFile);
						// load nes
						nes.ui.loadROM();
					});
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
								            '<span><b>Button</b></span>' +
								            '<span><b>Player 1</b></span>' +
								            '<span><b>Player 2</b></span>' +
							            '</li>' + 
							            '<li>' +
								            '<span>Left</span>' +
								            '<span>Left</span>' +
								            '<span>Num-4</span>' +
							            '</li>' +
							    		'<li>' +
								            '<span>Right</span>' +
								            '<span>Right</span>' +
								            '<span>Num-6</span>' +
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