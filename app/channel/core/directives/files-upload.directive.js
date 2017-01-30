app.directive('filesUpload', ['$location','Item',
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

			// read files
			$scope.readFile = function(file,xhr,formData){
				file.state = 'pending';	
				// reader instance
				$scope.reader = new FileReader();
				// reader onload
				$scope.reader.onload = function(){
					// render file on read
					file = Item.renderFileOnRead(file,this);
					// select menus
					file.catToggleMenu = false;
					file.subCatToggleMenu = false;
					// if zip file, get inner file
					if (file.file_type === 'zip'){
						// js zip instance
						var zip = new JSZip();
						// js zip - loop through files in zip in file
						zip.loadAsync(file).then(function(zip) {
							// for every file in zip
							for (var i in zip.files){ 
								var f = zip.files[i];
								// if file is .com / .exe
								if (f.name.indexOf(".COM") > -1 || 
									f.name.indexOf(".EXE") > -1 || 
									f.name.indexOf(".com") > -1 ||
									f.name.indexOf(".exe") > -1){
									// inner file
									file.inner_file  = f.name;
									// files array
									if (!$scope.files) $scope.files = [];
									// push file to files array
									$scope.files.push(file);
									// apply to scope
									$scope.$apply();
								}
							}
						});
					} else {
						// files array
						if (!$scope.files) $scope.files = [];
						// push file to files array
						$scope.files.push(file);
						// apply to scope
						$scope.$apply();
					}
				};
				// reader read file
				$scope.reader.readAsDataURL(file);
			};

			// assign default category
			$scope.assignDefaultCategory = function(file,categories){
				file = Item.assignDefaultCategory(file,categories);
			};

			// select category 
			$scope.selectCategory = function(category,file){
				file.category = category;
				var type = 'category';
				$scope.removeError(type);
				$scope.toggleCategorySelectMenu(file);
			};

			// toggle category select menu
			$scope.toggleCategorySelectMenu = function(file){
				console.log(file.catToggleMenu);
				if (file.catToggleMenu === false){
					file.catToggleMenu = true;
				} else {
					file.catToggleMenu = false;
				}
			};

			// select category 
			$scope.selectSubCategory = function(category,file){
				file.subcategory = category;
				var type = 'subcategory';
				$scope.removeError(file,type);
				$scope.toggleSubCategorySelectMenu(file);
			};

			// toggle category select menu
			$scope.toggleSubCategorySelectMenu = function(file){
				console.log(file.subCatToggleMenu);
				if (file.subCatToggleMenu === false){
					file.subCatToggleMenu = true;
				} else {
					file.subCatToggleMenu = false;
				}
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
							msg:'please select category'
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
				for (var i = 0, len = $scope.chJson.games.length; i < len; i++) {
				  if ($scope.chJson.games[i].file_name == file.name) {
				    b = true;
				    break;
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



		var template = '<div id="files-upload" ng-init="init()">' +
							'<h2>Upload</h2>' + 
							'<hr/>' + 
							'<button style="width:100%;height:200px;" dropzone="itemsUploadConfig" ng-hide="files" multiple>Click here to upload OR Drag & drop files</button>' +
							'<ul ng-show="files" categories ng-init="getCategories()">'+
								'<li class="list-header" layout="row"><span flex="35">File</span><span flex="5">Type</span><span flex="10">Size</span><span flex="20">Category</span><span flex="20">Sub</span><span flex="5">State</span>' +
								'<li ng-repeat="file in files" layout="column">' +
									'<div layout="row">' + 
										'<div flex="35" class="file-title">' +  
											'<span ng-bind="file.f_name"></span>' + 
											'<span ng-if="file.inner_file"> ({{file.inner_file}})</span>' + 
										'</div>' +
										'<div flex="5" ng-bind="file.file_type" class="file-type"></div>' +
										'<div flex="10" class="file-size">{{file.size|filesize}}</div>' +
										'<div flex="20" class="file-category" ng-init="assignDefaultCategory(file,categories)">' +
											'<div class="select-menu-container" ng-class="{active: file.catToggleMenu}">' +
												'<button class="toggle-select-menu" ng-click="toggleCategorySelectMenu(file)">' + 
													'<span class="selected-category-name" ng-bind="file.category.category_name"></span>' +
													'<span class="arrow"><span class="glyphicon glyphicon-triangle-bottom"></span></span>' +
												'</button>' +
												'<div class="select-menu">' +
													'<ul class="select-options">' +
														'<li ng-click="selectCategory(category,file)" ng-repeat="category in categories" ng-class="{selected: category.category_name == file.category.category_name}">{{category.category_name}}</li>' + 
														'<li class="divider"></li>' + 
														'<li class="new-category-form-container">' +
															'<form name="newCategoryForm" layout="row">' +
																'<input flex="80" class="form-control" type="text" ng-model="category_name" placeholder="Add New Category.."/>' +
																'<button flex="20" ng-click="createCategory(category_name)">Add</button>' +
															'</form>' +  
														'</li>' + 
													'</ul>' + 
												'</div>' + 
											'</div>' +
										'</div>' +
										'<div flex="20" class="file-subcategory">' +
											'<div class="select-menu-container" ng-class="{active: file.subCatToggleMenu}">' +
												'<button class="toggle-select-menu" ng-click="toggleSubCategorySelectMenu(file)">' + 
													'<span class="selected-category-name" ng-bind="file.subcategory.category_name"></span>' +
													'<span class="arrow"><span class="glyphicon glyphicon-triangle-bottom"></span></span>' +
												'</button>' +
												'<div class="select-menu">' +
													'<ul class="select-options">' +
														'<li ng-click="selectSubCategory(category,file)" ng-repeat="category in file.category.subcategories" ng-class="{selected: category.category_name == file.subcategory.category_name}">{{category.category_name}}</li>' + 
														'<li class="divider"></li>' + 
														'<li class="new-category-form-container">' +
															'<form name="newCategoryForm" layout="row">' +
																'<input flex="80" class="form-control" type="text" ng-model="subcategory_name" placeholder="Add New Category.."/>' +
																'<button flex="20" ng-click="createCategory(subcategory_name)">Add</button>' +
															'</form>' +  
														'</li>' + 
													'</ul>' + 
												'</div>' + 
											'</div>' +
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