app.directive('gameInterface', [
	function() {

		// game interface controller
		var controller = function($scope,$element) {

			// init game interface
			$scope.init = function(){

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
						title:$scope.item.content_type + ' Info',
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
					},{
						title:'preview',
						sections:[]
					}
				];

				// determine game type acording to file type
				if ($scope.item.file_type === 'zip'){
					// executable file input
					var exeField = {
						label:'Executable File Name',
						type:'executable-file',
						model:'inner_file',
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

			// show emulator
			$scope.showEmulator = function(){
				$scope.show_emulator = true;
			};

		};

		var template = '<div class="game-interface" style="padding: 0;" ng-init="init()">' +
							'<!-- form -->' +
							'<item-form ng-if="formTabs"></item-form>' +
							'<!-- /form -->' +
						'</div>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);