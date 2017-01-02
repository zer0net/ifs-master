app.directive('itemView', [
	function() {

		var controller = function($scope,$element) {

			$scope.initItemView = function(){
				$scope.item_type = window.location.href.split('&')[0].split('type=')[1].split('-')[0];
				$scope.item_id_name = $scope.item_type + '_id';
				//$scope.item.item_id_name = $scope.item_id_name;
				//console.log($scope.itemType);

			};

		};

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
		}

	}
]);