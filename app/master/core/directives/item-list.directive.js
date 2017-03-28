app.directive('itemList', [
	function() {

		// item list directive controller
		var controller = function($scope,$element) {
			// init item list
			$scope.initItemList = function(list_items){
				$scope.list_items = list_items;
			};

			// choose item style
			$scope.chooseStyle = function(is_downloaded) {
				var css_class;
				if(is_downloaded && is_downloaded>0) {
					css_class = 'itemLoaded';
				} else {
					css_class = 'itemNotLoaded';					
				}
				return css_class;
			}

			// render item 
			$scope.renderItem = function(item) {
				if (item.poster_file){
					item.poster_path = '/'+$scope.page.site_info.address+'/merged-'+$scope.page.site_info.content.merger_name+'/'+item.channel.cluster_id+'/data/users/'+item.channel.user_id+'/'+item.poster_file;
				}
			}

		};

		var template =  '<md-grid-list ng-if="list_items" md-cols-xs="2" md-cols-sm="3" md-cols-md="4" md-cols-gt-md="5" sm-row-height="3:4" md-row-height="4:5" md-gutter="12px" md-gutter-gt-sm="8px">' +
						    '<!-- grid item -->' +
							'<md-grid-tile class="list-item" ng-repeat="item in list_items | orderBy:\'-date_added\' | startFrom : paging.startFrom | limitTo:config.listing.items_per_page | filter:{subcategory:subcategoryId}">' +
								'<div class="inner-wrap md-whiteframe-1dp" ng-init="renderItem(item)"  ng-class="chooseStyle(item.is_downloaded)">' +
									'<!-- img -->' +
									'<div class="item-img {{item.file_type}}-file md-whiteframe-1dp">' +
										'<a style="background-position: center;background-repeat: no-repeat;background-size: cover;background-image:url(\'{{item.poster_path}}\');" href="/{{page.site_info.address}}/view.html?type={{item.content_type}}+id={{item.item_id}}"></a>' +
									'</div>' +
									'<!-- img -->' +
									'<!-- info -->' +
									'<md-grid-tile-footer>' +
										'<h3><a href="/{{page.site_info.address}}/view.html?type={{item.content_type}}+id={{item.item_id}}">{{item.title}}</a></h3>' +
										'<ul class="video-info">' +
						    				'<li><span>{{item.channel.channel_name}}</span></li>' +
						    				'<li><span>{{(item.peer>0)?item.peer:" - "}} peers</span></li>' +
						    				'<li class="votes-count" votes ng-init="getVotes(item)">' +
												'<span class="up-vote" ng-click="onUpVote(item)">' +
													'<span class="glyphicon glyphicon-thumbs-up"></span>' +
													'<span class="number">{{item.upVotes}}</span>' +
												'</span>' +
												'<span class="down-vote">' +
													'<span class="glyphicon glyphicon-thumbs-down"></span>' +
													'<span class="number">{{item.downVotes}}</span>' +
												'</span>' +
						    				'</li>' +
						    				'<li class="comments-count" comments ng-init="countComments(item)">' +
												'<span class="glyphicon glyphicon-comment"></span>' +
												'<span>{{commentCount}}</span>' +
						    				'</li>' +
						    				'<li class="peers-count"><span><i am-time-ago="item.date_added"></i></span></li>' +
										'</ul>' +
									'</md-grid-tile-footer>' +
									'<!-- /info -->' +
								'</div>' +
							'</md-grid-tile>' +
							'<!-- grid item -->' +
						'</md-grid-list>';

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);