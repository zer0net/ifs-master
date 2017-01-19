app.directive('multipleFilesUpload', ['$location','Item',
	function($location,Item) {

		// image upload controller
		var controller = function($scope,$element) {

			// loading & msg
			$scope.showUploadImg = function(){				
				$scope.uploading = true;
			};

			// finish loading
			$scope.finishUploadImg = function(){
				$scope.uploading = false;
			};

			// init
			$scope.init = function(chJson,site,merger_name){
				// bind site & chJson to scope
				$scope.chJson = chJson;		
				$scope.site = site;
				$scope.merger_name = merger_name;
				// items upload config
				$scope.itemsUploadConfig = {
				    'options': { // passed into the Dropzone constructor
				      'url': 'content.json',
				      'uploadMultiple':true
				    },
					'eventHandlers': {
						'sending': function (file, xhr, formData) {
							$scope.readFile(file,xhr,formData);
						}
					}
				};
			};

			// check if file existing
			$scope.ifFileExist = function(file){
				var b = false;
				for (var i = 0, len = $scope.chJson.games.length; i < len; i++) {
				  if ($scope.chJson.games[i].file_name == file.name) {
				    b = true;
				    break;
				  }				 
				}
				return b;
			};

			// read files
			$scope.readFile = function(file,xhr,formData){
				file.state = 'pending';	
				// reader instance
				$scope.reader = new FileReader();
				// reader onload
				$scope.reader.onload = function(){
					// file data uri
					file.data = this.result;
			    	// get items file type
					var splitByLastDot = function(text) {
					    var index = text.lastIndexOf('.');
					    return [text.slice(0, index), text.slice(index + 1)]
					}
					file.file_type = splitByLastDot(file.name)[1];
					// name
					file.f_name = file.name.split('.'+file.file_type)[0];
					// files array
					if (!$scope.files) $scope.files = [];
					// push file to files array
					$scope.files.push(file);
					// apply to scope
					$scope.$apply();
				};
				// reader read file
				$scope.reader.readAsDataURL(file);
			};

			// upload files
			$scope.uploadFiles = function(){
				$scope.file_index = 0;
				$scope.uploadFile($scope.files[$scope.file_index]);
			};

			
			// upload  file
			$scope.uploadFile = function(file){
				if ($scope.ifFileExist(file)) {
					file.state = 'exists';
					$scope.uploadNextFile();
				} else {
					// file state
					file.state = 'uploading';
					// create new item
					var item = Item.createNewItem(file,$scope.chJson,$scope.site);					
					// write to file
					Page.cmd("fileWrite",['merged-'+$scope.merger_name+'/'+$scope.site.address+'/'+item.path, file.data.split('base64,')[1]], function(res) {
						$scope.$apply(function(){
							// file state
							file.state = 'done';
							// item id update
							$scope.chJson.next_item_id += 1;
							// push item to channel json items
							var media_type = item.media_type + 's';
							if (!$scope.chJson[media_type]){$scope.chJson[media_type] = [];}
							$scope.chJson[media_type].push(item);
							// upload next file
							$scope.uploadNextFile();
						});
					});
				}	
			};
			
			// upload next file
			$scope.uploadNextFile = function(){
				$scope.file_index += 1;
				if (($scope.file_index + 1) <= $scope.files.length){
					$scope.uploadFile($scope.files[$scope.file_index]);
				} else {
					$scope.updateChannelJson();
				}
			};
			
		};



		var template = '<div id="multiple-files-upload">' +
							'<button style="width:100%;height:100px;" dropzone="itemsUploadConfig" ng-hide="files" multiple>Click here to upload OR Drag & drop files</button>' +
							'<ul ng-show="files">'+
								'<li class="list-header" layout="row"><span flex="70">File</span><span flex="10">Type</span><span flex="15">Size</span><span flex="15">State</span>' +
								'<li ng-repeat="file in files" layout="row">' +
									'<span flex="70" ng-bind="file.f_name"></span>' +
									'<span flex="10" ng-bind="file.file_type"></span>' +
									'<span flex="15">{{file.size|filesize}}</span>' +
									'<span flex="15">' +
										'<span ng-if="file.state === \'pending\'" class="glyphicon glyphicon-option-horizontal"></span>' +
										'<md-progress-circular ng-if="file.state==\'uploading\'" md-diameter="20px" style="float:left;width: 20px; height: 20px;" md-mode="indeterminate"></md-progress-circular>' +
										'<span ng-if="file.state === \'done\'" style="rgb(63,81,181)" class="glyphicon glyphicon-ok-circle"></span>' +
									'</span>' +									
								'</li>' +
							'</ul>' +
	            			'<md-button ng-if="files" flex="100" style="margin: 16px 0 0 0; width:100%;" class="md-primary md-raised edgePadding pull-right" ng-click="uploadFiles()">' +
	            				'<label>Upload files</label>' +
	            			'</md-button>'
						'</div>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);