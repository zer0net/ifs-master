app.directive('comments', ['$rootScope','$sce','$location',
	function($rootScope,$sce,$location) {

		// comments controller
		var controller = function($scope,$element) {

			// get comments
			$scope.getComments = function(item){
				$scope.comments = [];
				var query = ["SELECT * FROM comment WHERE item_id='"+item.item_id+"' ORDER BY date_added"];
				Page.cmd("dbQuery", query, function(comments) {
					$scope.comments = comments;
					$scope.$apply();
				});
			};

			// count comments 
			$scope.countComments = function(item){
				$scope.commentCount = 0;
				var query = ["SELECT * FROM comment WHERE item_id='"+item.item_id+"' ORDER BY date_added"];
				Page.cmd("dbQuery", query, function(comments) {
					$scope.commentCount = comments.length;
					$scope.$apply();
				});
			};

			// push comment 
			$scope.pushComment = function(comment){
				if (!$scope.comments) $scope.comments = [];
				$scope.comments.push(comment);
			};
		};

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
		}

	}
]);