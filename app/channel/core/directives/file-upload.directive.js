app.directive('fileUpload', ['$sce',
	function($sce) {

		// image upload controller
		var controller = function($scope,$element) {
			
			// upload zone text
			$scope.upload_zone_text	= 'Drag and drop .zip archives of dos games here or click to upload';

			// file upload config
			$scope.fileUploadConfig = {
				// ignore
			    'options': { // passed into the Dropzone constructor
			      'url': 'upload.php'
			    },
				'eventHandlers': {
					'sending': function (file, xhr, formData) {
						// loading
						$scope.showLoadingMsg('preparing file');
						// function to be triggerd upon file add
						$scope.readFile(file);
					}
				}
			};	

			// read zip file
			$scope.readFile = function(file){
				// reader instance
				$scope.reader = new FileReader();
				// reader onload
				$scope.reader.onload = function(){
					
					// apply reader info to scope
					$scope.file = file;
					// render file name
					var file_name = file.name.split(' ').join('_').normalize('NFKD').replace(/[\u0300-\u036F]/g, '').replace(/ß/g,"ss");
					// get file type
					var splitByLastDot = function(text) {
					    var index = text.lastIndexOf('.');
					    return [text.slice(0, index), text.slice(index + 1)]
					}
					$scope.item.file_type = splitByLastDot(file.name)[1];
					// apply to scope item
					$scope.item.title = file_name.split('.'+$scope.item.file_type)[0].split('_').join(' ');
					// item file
					$scope.item.file = this.result;

					// determine media type according to file type
					if ($scope.item.file_type === 'zip'){
						// item media type
						$scope.item.media_type = 'game';
						// item zip file name
						$scope.item.zip_name = file_name;
					} else if ($scope.item.file_type === 'nes' || $scope.item.file_type === 'dsk'){
						// item media type
						$scope.item.media_type = 'game';
						// item file name						
						$scope.item.file_name = file_name;
					} else if ($scope.item.file_type === 'mp4' || $scope.item.file_type === 'ogg' || $scope.item.file_type === 'webm' || $scope.item.file_type === 'ogv'){
						// item media type
						$scope.item.media_type = 'video';
						// item video file name
						$scope.item.file_name = file_name;
					}

					// apply
					$scope.$apply();
				};
				// reader read file
				$scope.reader.readAsDataURL(file);
			};

		};

		var template = '<div class="upload-button-container md-whiteframe-1dp" flex layout="row" layout-padding>' +
			'<button style="width:100%;height:400px;" dropzone="fileUploadConfig">{{upload_zone_text}}</button>' +
		'</div>';

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);