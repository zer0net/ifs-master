app.directive('myChannel', ['$sce','$location',
	function($sce,$location) {

		var controller = function($scope,$element) {

			// file reader instance
			var reader = new FileReader();

			// init
			$scope.initChannelEdit = function (chJson) {
				$scope.chJson = chJson;
				// dropzone config
				$scope.dropzoneConfig = {	
				    'options': { // passed into the Dropzone constructor
				      'url': 'upload.php'
				    },
					'eventHandlers': {
						'sending': function (file, xhr, formData) {
							$scope.file = file;
							$scope.chJson.channel.img = file.name;
							$scope.showPreviewImage(file);
						}
					}
				};
			};

			// show preview image
			$scope.showPreviewImage = function(file){
				// reader on load
				reader.onload = function(){
					// apply to scope
					$scope.$apply(function() {
						// file url
						var dataURL = reader.result;
						var src = $sce.trustAsResourceUrl(dataURL);
						// temp scope var
						$scope.imgSrc = dataURL;
					});
				};
				reader.readAsDataURL(file);
			};

			// upload preview image
			$scope.uploadPreviewImage = function(){
			    var path = 'uploads/images/' + $scope.chJson.channel.img;
			    var previewImgUrl = $scope.imgSrc.split(',')[1];
				Page.cmd("fileWrite",{"inner_path":path,"content_base64": previewImgUrl, "ignore_bad_files": true}, function(res) {
					if (res === 'ok') $scope.updateChannelJson();
				});
			};

			// save channel details
			$scope.saveChannelDetails = function() {
				console.log('save details');
				if ($scope.file){ $scope.uploadPreviewImage();}
				else { $scope.updateChannelJson(); }
			};

		};

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
		}

	}
]);