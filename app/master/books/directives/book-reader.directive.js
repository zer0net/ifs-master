app.directive('bookReader', ['$location','$timeout',
	function($location,$timeout) {

		var controller = function($scope,$element) {
			console.log('book reader controller');
			// init atari emulator
			$scope.initBookReader = function(item){
				// book file url
				if (item) { $scope.item = item; }
				
				$scope.file = "merged-"+$scope.page.site_info.content.merger_name+"/"+$scope.item.cluster_id+"/data/users/"+$scope.item.user_id+"/"+$scope.item.file_name;
				console.log($scope.file);
				console.log($scope.item);				
				$scope.loadScript('/'+$scope.page.site_info.address + '/assets/lib/jszip/dist/jszip.min.js', 'text/javascript', 'utf-8');
				$scope.loadScript('/'+$scope.page.site_info.address + '/assets/lib/jszip/dist/jszip.utils.js', 'text/javascript', 'utf-8');
				$scope.loadScript('/'+$scope.page.site_info.address + '/assets/lib/epubjs/epub.min.js', 'text/javascript', 'utf-8');
				
				JSZipUtils.getBinaryContent($scope.file, function(err, data) {
				    if (err) {  throw err; }
				    // read zip file
					$scope.file_list = [];				    
				    JSZip.loadAsync(data).then(function (zip) {
				    	for (var i in zip.files){
				    		$scope.file_list.push(i);
				    	}
				    });
					$scope.$apply();
				});
				/*var Book = ePub({ restore: true }); 
				console.log(Book);
				Book.open($scope.file); 
				Book.renderTo($element);
				$scope.$apply();*/
			};
		};

		var template =  '<div id="book" class="md-whiteframe-1dp">' + 
							'<div class="section-header">' +
								'<h3>{{item.file_type}} package content</h3>' +
							'</div>' +
							'<hr/>' +
							'<ul ng-if="file_list">' +
								'<li ng-repeat="file in file_list">' +
									'{{file}}' +
								'</li>' +
							'</ul>' +
							'<p ng-if="!file_list">no package preview available</p>' +
						'</div>';

		return {
			restrict: 'E',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);