app.directive('imageUpload', [
	function() {

		// image upload controller
		var controller = function($scope,$element) {
			// reader instance
			$scope.reader = new FileReader();
			// image upload config
			$scope.posterUploadConfig = {
			    'options': { // passed into the Dropzone constructor
			      'url': 'content.json'
			    },
				'eventHandlers': {
					'sending': function (file, xhr, formData) {
						$scope.readImageFile(file);
					}
				}
			};
			// read image file
			$scope.readImageFile = function(file){
				$scope.reader.onload = function(){
					$scope.item.poster = this.result;
					$scope.item.poster_file = '' + $scope.item.file_name.split('.')[0] + '__poster.' + file.type.split('/')[1];
					$scope.$apply();
				};
				$scope.reader.readAsDataURL(file);
			};
		};

		var template = '<button style="width:100%;height:100px;" dropzone="posterUploadConfig" ng-hide="item.poster">upload poster image</button>';

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);