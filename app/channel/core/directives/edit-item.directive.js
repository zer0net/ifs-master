app.directive('editItem', [
	function() {

		// site header controller
		var controller = function($scope,$element) {

			// init edit view
			$scope.init = function(){
				// scope mode
				$scope.item.image_path = '/12MVkvYGcRW6u2NYbpfwVad1oQeyG4s9Er/merged-'+$scope.config.merger_name+'/'+$scope.item.cluster_id+'/data/users/'+$scope.item.item_id.split('_')[1]+'/'+$scope.item.file_name;
				$scope.mode = 'edit';
				for (var attr in $scope.channel){
					console.log(attr);
				}
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