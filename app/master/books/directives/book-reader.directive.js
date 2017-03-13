app.directive('bookReader', ['$location','$timeout',
	function($location,$timeout) {

		var controller = function($scope,$element) {
			console.log('book reader controller');
			// init atari emulator
			$scope.initBookReader = function(item){

				// book file url
				if (item) { $scope.item = item; }

				$scope.file = "merged-"+$scope.page.site_info.content.merger_name+"/"+$scope.item.channel.cluster_id+"/data/users/"+$scope.item.channel.user_id+"/"+$scope.item.file_name;
				$scope.loadScript('/'+$scope.page.site_info.address + '/assets/lib/jszip/dist/jszip.min.js', 'text/javascript', 'utf-8');
				$scope.loadScript('/'+$scope.page.site_info.address + '/assets/lib/jszip/dist/jszip.utils.js', 'text/javascript', 'utf-8');
				$scope.loadScript('/'+$scope.page.site_info.address + '/assets/lib/epubjs/epub.min.js', 'text/javascript', 'utf-8');
				Page.cmd("fileGet", { "inner_path": $scope.file, "required": false },function(data) {
					console.log(data);
					var Book = ePub({ restore: true }); 
					console.log(Book);
					Book.open(data); 
					Book.renderTo($element);
					$scope.$apply();
				});
			};
		};

		var template =  '<div id="book"></div>';

		return {
			restrict: 'E',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);