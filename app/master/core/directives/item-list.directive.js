app.directive('itemList', [
	function() {

		// item list directive controller
		var controller = function($scope,$element) {			
			
			// init item list by file type
			$scope.initItemListByFileType = function(file_type) {
				$scope.list_title = file_type;
				$scope.list_items = $scope.file_types_items[$scope.file_type];
				// paging object
			    $scope.paging = {
			        totalItems: $scope.list_items.length,
			        numPages: Math.ceil($scope.list_items.length / $scope.config.listing.items_per_page),
			        currentPage: 1,
			    };
			    // start from var for item list paging
			    $scope.paging.startFrom = $scope.config.listing.items_per_page * ($scope.paging.currentPage - 1);
			};

			// choose item style
			$scope.chooseStyle = function(x_is_load) {
				if(x_is_load) {
					return 'itemLoaded';
				} else {
					return 'itemNotLoaded';					
				}
			}

			// render item 
			$scope.renderItem = function(item) {
				item.item_id_name = item.media_type + '_id';
				item.view_url = '/' + $scope.page.site_info.address + '/view.html?type=' + item.media_type + '-c=' + item.channel.address + item.media_type.charAt(0) + '=' + item[item.item_id_name];
				// if not video
				if (!item.media_type === 'video'){
					// if zip file
					if (item.file_type === 'zip') {
	 					item.view_url += 'z=' + item.zip_name + 'f=' + item.file_name;
					} else {
						item.view_url += 'z=f=' + item.file_name;
					}
				}
			}

			// on item list page change
			$scope.pageChanged = function() {
				$scope.paging.startFrom = $scope.config.listing.items_per_page * ($scope.paging.currentPage - 1);
			};
		};

		var template =  '<section class="item-list-section container">' +
							'<div class="item-list-header">' +
								'<h2>{{list_title}}</h2>' + 
								'<span class="item-total-number-label">{{list_items.length}}</span>' + 
							'</div>' + 
							'<hr/>' + 
							'<md-grid-list ng-if="list_items" md-cols-xs="2" md-cols-sm="3" md-cols-md="4" md-cols-gt-md="5" sm-row-height="3:4" md-row-height="3:3" md-gutter="12px" md-gutter-gt-sm="8px">' +
							    '<!-- grid item -->' +
								'<md-grid-tile class="list-item" ng-repeat="item in list_items | orderBy:\'-date_added\' | startFrom : paging.startFrom | itemsPerPage:config.listing.items_per_page track by $index">' +
									'<div class="inner-wrap md-whiteframe-1dp" ng-init="renderItem(item)"  ng-class="chooseStyle(item.x_is_load)">' +
										'<!-- img -->' +
										'<div class="item-img md-whiteframe-1dp" style="background-position: center;background-repeat: no-repeat;background-size: {{item.imgSize}};background-image:url(\'{{item.img}}\');">' +
											'<a href="{{item.view_url}}"></a>' +
										'</div>' +
										'<!-- img -->' +
										'<!-- info -->' +
										'<md-grid-tile-footer>' +
											'<h3><a href="{{item.view_url}}">{{item.title}}</a></h3>' +
											'<ul class="video-info">' +
							    				'<li><span>{{item.channel.content.title}}</span></li>' +
							    				'<li><span><i am-time-ago="item.date_added"></i></span></li>' +
							    				'<li class="votes-count" votes ng-init="getVotes(item)">' +
													'<span class="up-vote">' +
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
							    				'<li class="peers-count"><span> {{item.channel.peers}} peers</span></li>' +
											'</ul>' +
										'</md-grid-tile-footer>' +
										'<!-- /info -->' +
									'</div>' +
								'</md-grid-tile>' +
								'<!-- grid item -->' +
							'</md-grid-list>' +
    						'<ul ng-if="paging" uib-pagination total-items="paging.totalItems" items-per-page="config.listing.items_per_page" ng-model="paging.currentPage" ng-change="pageChanged()" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;" boundary-links="true"></ul>' +
						'</section>';

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);