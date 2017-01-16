app.directive('editItem', [
	function() {

		// site header controller
		var controller = function($scope,$element) {

			// init edit view
			$scope.init = function(){
				// scope mode
				$scope.mode = 'edit';
				// generate items properties array
				$scope.generateItemProperties();
			};

			// on update item
			$scope.onUpdateItem = function(){
				if ($scope.item.img){
					$scope.uploadPosterImage();
				} else {
					$scope.updateItem();
				}
			};


		};

		return {
			restrict: 'AE',
			replace:false,
			controller: controller
		}

	}
]);