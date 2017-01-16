app.directive('gameInterface', [
	function() {

		// game interface controller
		var controller = function($scope,$element) {

			// init game interface
			$scope.init = function(){
				console.log('init game interface');
				// config form tabs & fields
				$scope.formTabs = [
					{
						title:'Basic Info',
						sections:[{
							type:'column',
							fields: [{
								label:'Title',
								type:'input',
								model:'title',
								flex:'100'
							}]
						}]
					},{
						title:$scope.item.media_type + ' Info',
						sections:[{
							type:'row',
							fields:[{
								label:'Publisher',
								type:'input',
								model:'publisher',
								flex:'70'
							},{
								label:'Year',
								type:'input',
								model:'year',
								flex:'10'
							},{
								label:'Genre',
								type:'select',
								model:'genre',
								flex:'20',
								options:[
									'Action',
									'Platform',
									'RPG',
									'Shooter',
									'Sport'
								]
							}]
						},{
							type:'column',
							fields:[{
								label:'Description',
								type:'textarea',
								model:'description',
								flex:'100'
							}]
						}]
					}
				];

				// determine game type acording to file type
				if ($scope.item.file_type === 'zip'){
					// executable file input
					var exeField = {
						label:'Executable File Name',
						type:'executable-file',
						model:'file_name',
						flex:'100'
					};
					// executable file list
					var exeFileSelection = {
						type:'zip-contents',
						flex:'100'
					};
					// push to form fields array
					$scope.formTabs[0].sections[0].fields.push(exeField);
					$scope.formTabs[0].sections[0].fields.push(exeFileSelection);
				}
			};

		};

		var template = '<div class="game-interface" style="padding: 0;" ng-init="init()">' +
							'<!-- form -->' +
							'<item-form ng-if="formTabs"></item-form>' +
							'<!-- /form -->' +
							'<!-- player -->' +
							'<div id="js-dos-container" ng-if="item.file_type === \'zip\'">' +
								'<dosbox ng-init="initDosBox(item)"></dosbox>' +
							'</div>' +
							'<div id="nes-container" ng-if="item.file_type === \'nes\'">' +
								'<nes-emulator ng-init="initNesEmulator(item)"></nes-emulator>' +
							'</div>' +
							'<div id="atari-container" ng-if="item.file_type === \'bin\'">' +
								'<atari-emulator style="margin:0 auto;" ng-init="initAtariEmulator(item)"></atari-emulator>' +
							'</div>' +
							'<div id="cpc-container" ng-if="item.file_type === \'sna\'">' +
								'<cpc-emulator ng-init="initCpcEmulator(item)"></cpc-emulator>' +
							'</div>' +																	
							'<!-- /player -->' +
						'</div>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);