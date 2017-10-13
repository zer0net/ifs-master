app.directive('pdfViewer', ['$location','$timeout',
	function($location,$timeout) {

		var controller = function($scope,$element) {
			console.log('pdf reader controller');
			// init pdf reader
			$scope.initPdfReader = function(item){
				// pdf file url
				if (item) { $scope.item = item; }
				$scope.file = "merged-"+$scope.page.site_info.content.merger_name+"/"+$scope.item.cluster_id+"/data/users/"+$scope.item.user_id+"/"+$scope.item.file_name;
				console.log($scope.file);
			};
		};

		var template =  '<div class="item-view" layout="row"  layout-padding ng-init="getItem(item)">' +
							'<div ng-if="error_msg" flex="100" ng-hide="item" ng-bind="error_msg" style="font-weight: bold;text-align: center;"></div>' +
							'<!-- pdf -->' +
							'<div id="pdf" ng-if="item" class="md-whiteframe-1dp" ng-init="initPdfReader()">' + 
								'<div style="width:100%;height:100%;">' +
									'<pdfjs-viewer src="{{file}}"></pdfjs-viewer>' +
								'</div>' +
							'</div>' +
							'<!-- /pdf -->' +
						'</div>';


		return {
			restrict: 'E',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);