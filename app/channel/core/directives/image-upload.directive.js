app.directive('imageUpload', [
	function() {

		// image upload controller
		var controller = function($scope,$element) {
			// reader instance
			$scope.reader = new FileReader();
			// image upload config
			$scope.imageUploadConfig = {
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
					$scope.item.img = this.result;
					$scope.$apply();
				};
				$scope.reader.readAsDataURL(file);
			};
		};

		var template = '<button style="width:100%;height:100px;" dropzone="imageUploadConfig" ng-hide="item.img">upload poster image</button>';

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);