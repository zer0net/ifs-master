app.directive('itemViewComments', ['$rootScope','$sce','$location',
	function($rootScope,$sce,$location) {

		// item view comments controller
		var controller = function($scope,$element) {

			// init item view comments
			$scope.initItemViewComments = function(item) {
				$scope.item = item;
			};

		};

		var template =	'<comments ng-if="item" ng-init="getComments(item)">' +
							'<div class="item-comments">' +
								'<!-- comment form -->' +
								'<section class="comment-form "  style="margin-top:16px;">' +
									'<div class="section-header" layout-padding>' +
										'<h3>Comments</h3>' +
										'<span class="comment-counter">' +
											'<span class="glyphicon glyphicon-comment"></span>' +
											'<span class="number">{{comments.length}}</span>' +
										'</span>' +
									'</div>' +
								    '<hr/>' +
									'<comment-form></comment-form>' +
								'</section>' +
								'<!-- /comment form -->' +
								'<!-- comment list -->' +
								'<section class="comment-list " id="comments-section" layout-padding ng-show="comments.length > 0">' +
									'<ul>' +
										'<li ng-repeat="comment in comments | orderBy:\'-date_added\'" layout="row">' +
											'<div class="identicon-container">' +
							                	'<identicon class="" username="comment.user_id" size="56"></identicon>' +
											'</div>' +
											'<div class="comment-content">' +
												'<span ng-bind="comment.user_id" class="user-name"></span> • ' +
												'<span am-time-ago="comment.date_added" class="time-ago"></span>' +
												'<p ng-bind="comment.comment"></p>' +
										    '</div>' +
										'</li>' +
									'</ul>' +
								'</section>'
								'<!-- comment list -->' +
							'</div>' +
						'</comments>';


		return {
			restrict: 'AE',
			replace:false,
			template:template
		}

	}
]);