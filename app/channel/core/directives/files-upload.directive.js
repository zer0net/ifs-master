app.directive('filesUpload', ['$location','Item','$mdDialog','$mdMedia',
	function($location,Item,$mdDialog,$mdMedia) {

		// image upload controller
		var controller = function($scope,$element) {

			// init
			$scope.init = function(chJson,site,merger_name){
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

			// loading & msg
			$scope.showUploadImg = function(){				
				$scope.uploading = true;
			};

			// finish loading
			$scope.finishUploadImg = function(){
				$scope.uploading = false;
			};

			// read files
			$scope.readFile = function(file,xhr,formData){
				file.state = 'pending';	
				// reader instance
				$scope.reader = new FileReader();
				// reader onload
				$scope.reader.onload = function(){
					// render file on read
					file = Item.renderFileOnRead(file,this);

					// if zip file, get inner file
					if (file.file_type === 'zip'){
						// js zip instance
						var zip = new JSZip();
						// js zip - loop through files in zip in file
						zip.loadAsync(file).then(function(zip) {
							file.zip_files = [];
							// for every file in zip
							for (var i in zip.files){ 
								var f = zip.files[i];
								file.zip_files.push(f);
								// if file is .com / .exe
								if (f.name.indexOf(".COM") > -1 || 
									f.name.indexOf(".EXE") > -1 || 
									f.name.indexOf(".com") > -1 ||
									f.name.indexOf(".exe") > -1){
									// inner file
									file.inner_file  = f.name;
									$scope.$apply();
								}
							}
						});
					}

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

			// assign default category
			$scope.assignDefaultCategory = function(file,categories){
				file = Item.assignDefaultCategory(file,categories);
			};

			// on select category
			$scope.onSelectCategory = function(category){
				$scope.getSubcategories(category);
				console.log($scope.subcategories);
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
					// if no category
					if (!file.category){
						if (!file.errors) file.errors = [];
						$scope.errors = true;
						var error = {
							type:'category',
							msg:'please select category'
						};
						file.errors.push(error);
					}
					// if no subcategory
					if (!file.subcategory){
						if (!file.errors) file.errors = [];
						$scope.errors = true;
						var error = {
							type:'subcategory',
							msg:'please select subcategory'
						};
						file.errors.push(error);						
					}
				});
				// if no error check
				if ($scope.errors === false){
					$scope.uploadFiles();
				}
			};

			// upload files
			$scope.uploadFiles = function(){
				$scope.file_index = 0;
				$scope.uploadFile($scope.files[$scope.file_index]);
			};
			
			// check if file existing
			$scope.ifFileExist = function(file){
				var b = false;
				if ($scope.chJson[file.media_type + 's']){
					for (var i = 0, len = $scope.chJson[file.media_type + 's'].length; i < len; i++) {
					    if ($scope.chJson[file.media_type + 's'][i].file_name == file.name) {
					   		b = true;
					    	break;
					    }
					}
				}
				return b;
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
					var item = Item.createNewItem(file,$scope.chJson,$scope.channel);
					var inner_path = 'merged-IFS/'+$scope.channel.cluster_id+'/data/users/'+$scope.page.site_info.auth_address+'/'+item.file_name;
					// write to file
					Page.cmd("fileWrite",[inner_path, file.data.split('base64,')[1]], function(res) {
						$scope.$apply(function(){
							// file state
							file.state = 'done';
							// item id update
							$scope.chJson.next_item_id += 1;
							// push item to channel json items
							var media_type = item.content_type + 's';
							if (!$scope.chJson.items[media_type]){$scope.chJson.items[media_type] = [];}
							$scope.chJson.items[media_type].push(item);
							console.log(media_type);
							console.log($scope.chJson);
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
							'<button style="width:100%;height:200px;" dropzone="itemsUploadConfig" ng-hide="files" multiple>Click here to upload OR Drag & drop files</button>' +
							'<ul ng-show="files" categories ng-init="getCategories()">'+
								'<li class="list-header" layout="row"><span flex="35">File</span><span flex="5">Type</span><span flex="10">Size</span><span flex="20">Category</span><span flex="20">Sub</span><span flex="5">State</span>' +
								'<li ng-repeat="file in files" layout="column">' +
									'<div layout="row">' + 
										'<div flex="35" class="file-title">' +  
											'<span ng-bind="file.f_name"></span><br/>' + 
											'<a ng-click="selectInnerFileDialog($event,file)"><small ng-if="file.inner_file">Inner file: ({{file.inner_file}})</small></a>' + 
										'</div>' +
										'<div flex="5" ng-bind="file.file_type" class="file-type"></div>' +
										'<div flex="10" class="file-size">{{file.size|filesize}}</div>' +
										'<div flex="20" class="file-category" ng-init="assignDefaultCategory(file,categories)">' +
											'<select class="form-control" ng-model="file.category" value="category.category_name" ng-options="category.category_name for category in categories"></select>' +
										'</div>' +
										'<div flex="20" class="file-subcategory" ng-if="file.category">' +
											'<select class="form-control" ng-model="file.subcategory" value="subcategory.category_name" ng-options="subcategory.category_name for subcategory in file.category.subcategories"></select>' +
										'</div>' +
										'<div flex="5" class="file-actions">' +
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
	            			'<md-button ng-if="files" flex="100" style="margin: 16px 0 0 0; width:100%;" class="md-primary md-raised edgePadding pull-right" ng-click="onUploadFiles()">' +
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