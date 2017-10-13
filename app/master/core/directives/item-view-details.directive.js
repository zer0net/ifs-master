app.directive('itemViewDetails', ['$location','$rootScope',
	function($location,$rootScope) {

		// item view details controller
		var controller = function($scope,$element) {

			// init item view details
			$scope.initItemViewDetails = function(item){
				$scope.item = item;
				$scope.item_download_href = 'merged-'+$scope.page.site_info.content.merger_name+'/'+$scope.item.cluster_id+'/data/users/'+$scope.item.channel_address.split('_')[1]+'/'+$scope.item.file_name;
			};

		};


		var template =  '<section ng-if="item" class=" item-info">' +
							'<div class="section-header item-info-header">' +
								'<h3><a href="/{{page.site_info.address}}/index.html?route:item+id:{{item.item_id}}+type:{{item.content_type}}" ng-bind="item.title"></a></h3>' +
								'<a href="/{{page.site_info.address}}/index.html?route:main+id:{{item.channel_address}}">{{item.channel_name}}</a>' +
								'<div class="item-views">' +
									'<span ng-if="item.file.peer > 0">{{item.file.peer}} Peers </span>' +
									'<span ng-if="!item.file.peer || item.file.peer === 0">{{item.file_size|filesize}}</span>' +
								'</div>' +
							'</div>' +
							'<hr/>' +
							'<div class="item-details">' +
								'<div class="votes" votes ng-init="getVotes(item)">' +
									'<div ng-hide="postingVote">' +
										'<a class="up-vote" ng-click="onUpVote(item)">' +
											'<span class="glyphicon glyphicon-thumbs-up"></span>' +
											'<span class="number">{{item.upVotes}}</span>' +
										'</a>' +
										'<a class="down-vote" ng-click="onDownVote(item)">' +
											'<span class="glyphicon glyphicon-thumbs-down"></span>' +
											'<span class="number">{{item.downVotes}}</span>' +
										'</a>' +
									'</div>' +
									'<!-- loading -->' +
								    '<div flex="90" id="vote-form-loading" layout="column" ng-show="postingVote" style="margin-top: -15px;" flex>' +
								        '<div layout="row" flex="100" layout-align="space-around">' +
								            '<md-progress-circular md-mode="indeterminate"></md-progress-circular>' +
								        '</div>' +
								    '</div>' +
								    '<!-- /loading -->' +
								'</div>' +
								'<ul>' +
									'<li><b>size:</b> {{item.file_size|filesize}}</li>' +
									'<li><b>date added:</b> <span am-time-ago="item.date_added"></span>' +
									'<li><b>file name:</b> <span>{{item.file_name}}</span><a class="item-download-link" href="{{item_download_href}}" download>download {{item_type}}</a></li>' +
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