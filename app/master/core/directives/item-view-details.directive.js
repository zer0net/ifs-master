app.directive('itemViewDetails', ['$location','$rootScope',
	function($location,$rootScope) {

		// item view details controller
		var controller = function($scope,$element) {

			// init item view details
			$scope.initItemViewDetails = function(item){
				$scope.item = item;
			};

		};


		var template =  '<section ng-if="item" class="section md-whiteframe-1dp item-info">' +
							'<div class="section-header item-info-header">' +
								'<h3 ng-bind="item.title"></h3>' +
								'<a href="/{{page.site_info.address}}/index.html?channel={{item.channel.address}}">{{item.channel.content.title}}</a>' +
								'<div class="item-views">' +
									'<span>{{item.site_file.peer}} Peers </span>' +
								'</div>' +
							'</div>' +
							'<hr/>' +
							'<div class="item-details">' +
								'<div class="votes" votes ng-init="getVotes(item)">' +
									'<a class="up-vote" ng-click="onUpVote(item)">' +
										'<span class="glyphicon glyphicon-thumbs-up"></span>' +
										'<span class="number">{{item.upVotes}}</span>' +
									'</a>' +
									'<a class="down-vote" ng-click="onDownVote(item)">' +
										'<span class="glyphicon glyphicon-thumbs-down"></span>' +
										'<span class="number">{{item.downVotes}}</span>' +
									'</a>' +
								'</div>' +
								'<ul>' +
									'<li><b>size:</b> {{item.file_size|filesize}}</li>' +
									'<li><b>date added:</b> <span am-time-ago="item.date_added"></span>' +
								'</ul>' +
								'<article layout-padding ng-show="item.description">' +
									'<hr/>' +
									'<p ng-bind="item.description"></p>' +
								'</article>' +
							'</li>' +
						'</section>';

		return {
			restrict: 'AE',
			template:template,
			replace:false,
			controller: controller,
		}

	}
]);