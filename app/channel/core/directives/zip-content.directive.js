app.directive('zipContent', [
	function() {

		// zip content directive controller
		var controller = function($scope,$element){

			// show zip content
			$scope.showZipContent = function(){
				$scope.zipFiles = [];
				console.log($scope.item);
				// get remote zip file
				JSZipUtils.getBinaryContent('/'+$scope.page.site_info.address + '/merged-'+$scope.merger_name + '/' + $scope.item.channel + '/' + $scope.item.path, function(err, data) {
				    if(err) {
				        throw err; // or handle err
				    }
				    // read zip file
				    JSZip.loadAsync(data).then(function (zip) {
						// for every file in zip
						for (var i in zip.files){ 
							var file = zip.files[i];
							$scope.zipFiles.push(file);
							$scope.$apply();
						}
				    });
				});
			};

			// select executable file
			$scope.selectExecutableFile = function(file){
				$scope.item.file_name = file.name;
			};		
		};

		var template =  '<div class="zip-content-container" ng-init="showZipContent()">' +
							'<pre>' +
								'<h3>ZIP CONTENT</h3>' +
								'<hr/>' +							
								'<ul flex="100" layout="column"><li ng-repeat="file in zipFiles"><a ng-click="selectExecutableFile(file)">{{file.name}}</a></li></ul>' +
							'</pre>' +
						'</div>';

		return {
			restrict: 'AE',
			replace:false,
			template: template,
			controller:controller
		}

	}
]);