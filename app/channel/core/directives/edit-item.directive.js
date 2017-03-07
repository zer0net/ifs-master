app.directive('editItem', [
	function() {

		// site header controller
		var controller = function($scope,$element) {

			// init edit view
			$scope.init = function(){
				// scope mode
				$scope.mode = 'edit';
				console.log($scope.mode);
			};

			// on update item
			$scope.onUpdateItem = function(item,mode){
				if (item.poster){
					$scope.uploadPosterImage(item,mode);
				} else {
					$scope.updateItem(item);
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