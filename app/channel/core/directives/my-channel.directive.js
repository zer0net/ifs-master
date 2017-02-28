app.directive('myChannel', ['$sce','$location',
	function($sce,$location) {

		var controller = function($scope,$element) {

			// file reader instance
			var reader = new FileReader();

			// init
			$scope.initChannelEdit = function (chJson,page,merger_name,channel) {
				// bind vars to scope
				$scope.chJson = chJson;
				$scope.page = page;
				$scope.merger_name = merger_name;
				$scope.channel = channel;
				// dropzone config
				$scope.dropzoneConfig = {	
				    'options': { // passed into the Dropzone constructor
				      'url': 'upload.php'
				    },
					'eventHandlers': {
						'sending': function (file, xhr, formData) {
							$scope.file = file;
							$scope.chJson.channel.logo_file = file.name;
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
						$scope.imgSrc = reader.result;
					});
				};
				reader.readAsDataURL(file);
			};

			// upload poster image
			$scope.uploadLogoImage = function(){
				var logo_path = 'merged-IFS/'+$scope.channel.cluster_id+'/data/users/'+$scope.page.site_info.auth_address+'/'+item.poster_file;
				Page.cmd("fileWrite",[logo_path, $scope.imgSrc.split('base64,')[1] ], function(res) {
					if (mode === 'create'){
						$scope.createItem(item);
					} else if (mode === 'edit') {
						$scope.updateItem(item);
					}
				});
			};


			// upload preview image
			$scope.uploadPreviewImage = function(){
			    var path = 'merged-' + $scope.merger_name + '/' + $scope.site.address + '/uploads/images/' + $scope.chJson.channel.img;
			    var previewImgUrl = $scope.imgSrc.split(',')[1];
				Page.cmd("fileWrite",{"inner_path":path,"content_base64": previewImgUrl, "ignore_bad_files": true}, function(res) {
					console.log(res);
					if (res === 'ok') $scope.updateChannelJson();
				});
			};

			// save channel details
			$scope.saveChannelDetails = function() {
				console.log('save details');
				if ($scope.imgSrc){ $scope.uploadPreviewImage();}
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