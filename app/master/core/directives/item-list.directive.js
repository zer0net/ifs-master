app.directive('itemList', ['$rootScope',
	function($rootScope) {

		// item list directive controller
		var controller = function($scope,$element) {			

			// init item list all
			$scope.initItemListAll = function(items) {
				console.log(items);
				// reset
				var list_items = [];
				for (var i in items){
					list_items = list_items.concat(items[i]);
				}
				$scope.list_items = list_items;
				$scope.list_type = 'all';				
				// paging object
			    $scope.paging = {
			        totalItems: $scope.list_items.length,
			        numPages: Math.ceil( $scope.list_items.length / $scope.config.listing.items_per_page),
			        currentPage: 1,
			    };
			    // start from var for item list paging
			    $scope.paging.startFrom = $scope.config.listing.items_per_page * ($scope.paging.currentPage - 1);
			};
			
			// init item list by file type
			$scope.initItemListByFileType = function(file_type) {
				// reset
				$scope.file_type = file_type;
				if ($scope.file_types_items[$scope.file_type]){
					$scope.list_items = $scope.file_types_items[$scope.file_type];
					$scope.list_type = 'by file type';
					// paging object
				    $scope.paging = {
				        totalItems: $scope.list_items.length,
				        numPages: Math.ceil( $scope.list_items.length / $scope.config.listing.items_per_page),
				        currentPage: 1,
				    };
				    // start from var for item list paging
				    $scope.paging.startFrom = $scope.config.listing.items_per_page * ($scope.paging.currentPage - 1);
				}
			};


			
			// init item list by media type
			$scope.initItemListByMediaType = function(media_type) {
				// reset
				$scope.media_type = media_type;
				if ($scope.items[$scope.media_type]){
					$scope.list_items = $scope.items[$scope.media_type];
					$scope.list_type = 'by media type';
					// paging object
				    $scope.paging = {
				        totalItems: $scope.list_items.length,
				        numPages: Math.ceil( $scope.list_items.length / $scope.config.listing.items_per_page),
				        currentPage: 1,
				    };
				    // start from var for item list paging
				    $scope.paging.startFrom = $scope.config.listing.items_per_page * ($scope.paging.currentPage - 1);
				}
			};

			// choose item style
			$scope.chooseStyle = function(is_loaded) {
				if(is_loaded) {
					return 'itemLoaded';
				} else {
					return 'itemNotLoaded';					
				}
			}

			// render item 
			$scope.renderItem = function(item) {
				item.view_url = '/' + $scope.page.site_info.address + '/view.html?type=' + item.content_type + '-c=' + item.channel.channel_address + item.content_type.charAt(0) + '=' + item.item_id;
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

			// on main filter
			$rootScope.$on('mainFilter',function(event,mass){
				if ($scope.list_type === 'by file type'){
					$scope.initItemListByFileType($scope.file_type);
				} else if ($scope.list_type === 'all'){
					$scope.initItemListAll(mass.channel_items);
				}
			});
		};

		var template =  '<section class="item-list-section container">' +
							'<md-grid-list ng-if="list_items" md-cols-xs="2" md-cols-sm="3" md-cols-md="4" md-cols-gt-md="5" sm-row-height="3:4" md-row-height="3:3" md-gutter="12px" md-gutter-gt-sm="8px">' +
							    '<!-- grid item -->' +
								'<md-grid-tile class="list-item" ng-repeat="item in list_items | orderBy:\'-date_added\' | startFrom : paging.startFrom">' + // | itemsPerPage:config.listing.items_per_page track by $index
									'<div class="inner-wrap md-whiteframe-1dp" ng-init="renderItem(item)"  ng-class="chooseStyle(item.is_loaded)">' +
										'<!-- img -->' +
										'<div class="item-img {{item.file_type}}-file md-whiteframe-1dp">' +
											'<a style="background-position: center;background-repeat: no-repeat;background-size: {{item.imgSize}};background-image:url(\'{{item.img}}\');" href="/{{page.site_info.address}}/view.html?type={{item.content_type}}+id={{item.item_id}}"></a>' +
										'</div>' +
										'<!-- img -->' +
										'<!-- info -->' +
										'<md-grid-tile-footer>' +
											'<h3><a href="/{{page.site_info.address}}/view.html?type={{item.content_type}}+id={{item.item_id}}">{{item.title}}</a></h3>' +
											'<ul class="video-info">' +
							    				'<li><span>{{item.channel.channel_name}}</span></li>' +
							    				'<li><span>{{item.peer}} peers</span></li>' +
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
							'</md-grid-list>' +
    						'<ul ng-show="paging" ng-if="paging.numPages > 1" uib-pagination total-items="paging.totalItems" items-per-page="config.listing.items_per_page" ng-model="paging.currentPage" ng-change="pageChanged()" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;" boundary-links="true"></ul>' +
						'</section>';

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);