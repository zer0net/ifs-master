app.directive('filesUpload', ['$location','Item','File','$mdDialog','$mdMedia',
	function($location,Item,File,$mdDialog,$mdMedia) {

		// image upload controller
		var controller = function($scope,$element) {

			// init
			$scope.init = function(){
				// items upload config
				$scope.itemsUploadConfig = {
				    'options': { // passed into the Dropzone constructor
				      'url': 'content.json',
				      'uploadMultiple':true
				    },
					'eventHandlers': {
						'sending': function (file, xhr, formData) {
							$scope.loading_files = true;
							$scope.readFile(file,xhr,formData);
						}
					}
				};
			};

			// read files
			$scope.readFile = function(file,xhr,formData){
				file.state = 'pending';	
				// reader instance
				$scope.reader = new FileReader();
				// reader onload
				$scope.reader.onload = function(){
					// check folder for duplicate file name etc'
					file = File.onFileRead($scope.cluster,$scope.channel,this,file);
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

			// remove file
			$scope.removeFile = function(index){
				$scope.files.splice(index,1);
				if ($scope.files.length === 0) delete $scope.files;
			};

			// assign default category
			$scope.assignDefaultCategory = function(file,categories){
				file = Item.assignDefaultCategory(file,categories);
			};

			// remove error
			$scope.removeError = function(file,type){
				var spliceIndex;
				file.errors.forEach(function(err,index){
					if (err.type === type){
						spliceIndex = index;
					}
				});
				file.errors.splice(spliceIndex,1);
			};

			// on upload file
			$scope.onUploadFiles = function(){
				// error check
				$scope.errors = false;
				$scope.files.forEach(function(file,index){
					file.errors = [];
					// if no category
					if (!file.category){
						$scope.errors = true;
						var error = {
							type:'category',
							msg:'please select category'
						};
						file.errors.push(error);
					}
					// if no subcategory
					if (!file.subcategory){
						$scope.errors = true;
						var error = {
							type:'subcategory',
							msg:'please select subcategory'
						};
						file.errors.push(error);						
					}
					// if file type nor allowed
					if ($scope.config.file_types.indexOf(file.file_type) === -1){
						$scope.errors = true;
						var error = {
							type:'file_type',
							msg:'file type .'+file.file_type+' not supported'
						};
						file.errors.push(error);
					}
				});
				// if no error check
				if ($scope.errors === false){
					$scope.file_index = 0;					
					$scope.uploadFiles();
				}
			};

			// upload files
			$scope.uploadFiles = function(){
				// set timeout for info message
				$scope.setInfoMsgTimeOut();				
				$scope.uploading = true;
				$scope.data_json_path = $scope.inner_path + 'data.json';
				Page.cmd("fileGet",{"inner_path":$scope.data_json_path},function(data){
					// hide info msg
					$scope.hideInfoMsg();					
					$scope.$apply(function(){
						if (data) { 
							data = JSON.parse(data);
							if (!data.item){
								data.next_item_id = 1;
								data.item = [];
							}
							$scope.dataJson = data;
							$scope.uploadFile($scope.files[$scope.file_index]);
						} else {
							$scope.fixWrongCluster();
						}
					});
				});
			};
			
			// upload  file
			$scope.uploadFile = function(file){
				if (File.ifFileExist(file,$scope.items)) {
					file.state = 'exists';
					$scope.uploadNextFile();
				} else {
					// file state
					file.state = 'uploading';
					// create new item
					var item = Item.createNewItem(file,$scope.dataJson.next_item_id,$scope.channel);
					// write to file
					Page.cmd("fileWrite",[$scope.inner_path + item.file_name, file.data.split('base64,')[1]], function(res) {
						$scope.$apply(function(){
							// file state
							file.state = 'done';
							// push item to channel json items
							$scope.dataJson.item.push(item);
							$scope.dataJson.next_item_id += 1;
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
					$scope.finishUploadingFiles();
				}
			};

			// finish uploading files
			$scope.finishUploadingFiles = function(){
				$scope.showLoadingMsg('updating data.json');
				var json_raw = unescape(encodeURIComponent(JSON.stringify($scope.dataJson, void 0, '\t')));
				Page.cmd("fileWrite", [$scope.data_json_path, btoa(json_raw)], function(res) {
					// sign & publish site
					Page.cmd("sitePublish",{"inner_path":$scope.data_json_path}, function(res) {
						Page.cmd("wrapperNotification", ["done", "Finished Uploading Files!", 10000]);
						$scope.publishSite();
					});
				});			
			};
			
			// loading & msg
			$scope.showUploadImg = function(){				
				$scope.uploading = true;
			};

			// finish loading
			$scope.finishUploadImg = function(){
				$scope.uploading = false;
			};

			// fix wrong cluster
			$scope.fixWrongCluster = function(){
				var inner_path = 'merged-IFS/1MzV32sv55VSD5Vr7u3mcMPsX2oG9PHusr/data/users/'+$scope.page.site_info.auth_address+'/data.json';
				Page.cmd("fileGet",{"inner_path":inner_path},function(data){
					if (data){
						data = JSON.parse(data);
						var chIndex;
						data.channel.forEach(function(ch,index){
							if (ch.channel_address === $scope.channel.channel_address){
								chIndex = index;
							}
						});
						data.channel.splice(chIndex,1);
						var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));
						Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
							// sign & publish site
							Page.cmd("sitePublish",{"inner_path":inner_path}, function(res) {
								$scope.dataJson = {
									channel:$scope.channel,
									next_channel_id:2,
									item:[],
									next_item_id:1
								};
								$scope.$apply(function(){
									$scope.uploadFile($scope.files[$scope.file_index]);
								});
							});
						});
					} else {
						$scope.dataJson = {
							channel:$scope.channel,
							next_channel_id:2,
							item:[],
							next_item_id:1
						};
						$scope.$apply(function(){
							$scope.uploadFile($scope.files[$scope.file_index]);
						});
					}
				});
			};

			// select inner file dialog
			$scope.selectInnerFileDialog = function(ev,file){
				
				$scope.status = '';
				$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
			    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			    var dialogTemplate = '<md-dialog aria-label="Select Inner File">' +
									    '<md-toolbar>' +
									    	'<div class="md-toolbar-tools">' +
										        '<h2>Select Inner File</h2>' +
									    	'</div>' +
									    '</md-toolbar>' +
									    '<md-dialog-content layout-padding class="select-inner-file-dialog">' +
									    	'<div class="file-item" ng-repeat="inner_file in items.file.zip_files"><a ng-click="selectInnerFile(items.file,inner_file)" ng-bind="inner_file.name"></a></div>' +
									    '</md-dialog-content>' +
									'</md-dialog>';

			    $mdDialog.show({
					controller: DialogController,
					template: dialogTemplate,
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose:true,
					fullscreen: useFullScreen,
					locals: {
						items: {
							file:file
						}
					}
			    });

			};

		};

		// dialog controller
		var DialogController = function($scope, $mdDialog,$rootScope,items) {
			// items
			$scope.items = items;

			$scope.selectInnerFile = function(file,inner_file){
				file.inner_file = inner_file.name;
				$scope.hide();
			};

			$scope.hide = function() {
				$mdDialog.hide();
			};
			
			$scope.cancel = function() {
				$mdDialog.cancel();
			};
			
			$scope.answer = function(answer) {
				$mdDialog.hide(answer);
			};

		};


		var template = '<div id="files-upload" ng-init="init()">' +
							'<h2>Upload</h2>' + 
							'<hr/>' + 
							'<button style="width:100%;height:200px;" dropzone="itemsUploadConfig" ng-if="!files" multiple>Click here to upload OR Drag & drop files</button>' +
							'<ul ng-show="files" categories ng-init="getCategories()">'+
								'<li class="list-header" layout="row">' +
									'<span flex="20">Title</span>' +
									'<span flex="20">File Name</span>' +
									'<span flex="5">Type</span>' +
									'<span flex="5">Filetype</span>' +
									'<span flex="10">Size</span>' +
									'<span flex="15">Category</span>' +
									'<span flex="15">Sub</span>' +
									'<span style="text-align:center;" flex="5">Actions</span>' +
									'<span style="text-align:center;" flex="5">State</span>' +
								'</li>' +
								'<li ng-repeat="file in files" layout="column">' +
									'<div layout="row" class="file-item-row">' + 
										'<div flex="20" class="file-title">' +  
											'<span>{{file.title}}</span>' + 
										'</div>' +
										'<div flex="20" class="file-name">' +
												'<span>' +
													'{{file.file_name}}<br/>' + 
													'<a ng-click="selectInnerFileDialog($event,file)"><small class="inner-file-name" ng-if="file.inner_file">Inner file: ({{file.inner_file}})</small></a>' + 
												'</span>' +
											'</div>' +
										'<div flex="5" class="file-type">{{file.content_type}}</div>' +
										'<div flex="5" class="file-filetype">{{file.file_type}}</div>' +
										'<div flex="10" class="file-size">{{file.size|filesize}}</div>' +
										'<div flex="15" class="file-category" ng-init="assignDefaultCategory(file,categories)">' +
											'<select class="form-control" ng-model="file.category" value="category.category_name" ng-options="category.category_name for category in categories"></select>' +
										'</div>' +
										'<div flex="15" class="file-subcategory" ng-if="file.category">' +
											'<select class="form-control" ng-model="file.subcategory" value="subcategory.category_name" ng-options="subcategory.category_name for subcategory in file.category.subcategories"></select>' +
										'</div>' +
										'<div flex="5" class="file-actions">' +
											'<a ng-click="removeFile($index)"><span class="glyphicon glyphicon-remove"></span></a>' +
										'</div>' +
										'<div flex="5" class="file-state">' +
											'<span ng-if="file.state === \'pending\'" class="glyphicon glyphicon-option-horizontal"></span>' +
											'<md-progress-circular ng-if="file.state==\'uploading\'" md-diameter="20px" style="float:left;width: 20px; height: 20px;" md-mode="indeterminate"></md-progress-circular>' +
											'<span ng-if="file.state === \'done\'" style="rgb(63,81,181)" class="glyphicon glyphicon-ok-circle"></span>' +
										'</div>' +
									'</div>' + 
									'<div layout="row" class="errors">' + 
										'<span ng-repeat="error in file.errors">* {{error.msg}}</span>' +
									'</div>' +								
								'</li>' +
							'</ul>' +
							'<hr style="margin-top: 20px;margin-bottom: 0;"/>' +
	            			'<md-button ng-hide="uploading" ng-if="files" flex="100" style="margin: 16px 0 0 0; width:100%;" class="md-primary md-raised edgePadding pull-right" ng-click="onUploadFiles()">Upload files</md-button>' +
	            			'<!-- loading -->' +
							'<div id="upload-loading" layout="column" ng-show="uploading" flex>' +
							    '<div layout="column" flex="100" style="text-align:center;">' +
							        '<span>uploading files..</span>' +
							    '</div>' +
							    '<div layout="row" flex="100" layout-align="space-around">' +
							        '<md-progress-circular md-mode="indeterminate"></md-progress-circular>' +
							    '</div>' +
							'</div>' +
							'<!-- /loading -->' +
						'</div>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);