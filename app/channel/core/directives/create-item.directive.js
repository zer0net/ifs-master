app.directive('createItem', [
	function() {

		// create item controller
		var controller = function($scope,$element) {
			
			// init create item view
			$scope.init = function(){
				// generate empty game
				$scope.item = {};
				// apply scope mode var				
				$scope.mode = 'create';
			};

			// render item
			$scope.renderItem = function(){
				// generate items properties array
				$scope.generateItemProperties();
				// finish loading
				$scope.finishLoading();
			};

		};

		return {
			restrict: 'AE',
			replace:false,
			controller: controller
		}

	}
]);