app.directive('imageInterface', [
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
							},{
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