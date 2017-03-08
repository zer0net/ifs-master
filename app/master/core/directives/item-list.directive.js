app.directive('itemList', ['$rootScope',
	function($rootScope) {

		// item list directive controller
		var controller = function($scope,$element) {			

			// init item list all
			$scope.initItemListAll = function(items) {
				// reset				
				var list_items = [];
				for (var i in items){
					// check if items[i] is array then concat					
					if( Object.prototype.toString.call( items[i] ) === '[object Array]' ) {
						   list_items = list_items.concat(items[i]);
						}					
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
			
			// init item list by media type
			$scope.initItemListByMediaType = function(media_type,channel) {
				// reset
				$scope.media_type = media_type;
				var items;
				if (!channel) {
					items = $scope.items;					
				} else {
					items = channel.items;
				}
				if (items[$scope.media_type]){
					$scope.list_items = items[$scope.media_type];					
					$scope.list_type = 'by content type';
					$scope.categories = $scope.listCategories(media_type,$scope.config.categories,items[$scope.media_type]);										
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

			// list categories
			$scope.listCategories = function(media_type,categories,list_items) {
				var cats;
				categories.forEach(function(category,index) {
					if (category.category_name === media_type){
						cats = category.subcategories;
					}
				});		
				
				// get subcategory file length
				cats.forEach(function(subcats,index) {
						var size = 0;
						list_items.forEach(function(item,index) {
							if (item.subcategory === subcats.category_id){
								 ++size;
							}
						});							
						subcats.size = size;
						subcats.title = subcats.category_name+" ("+size+")";
				});	
				
				return cats;
			};

			// filter 
			$scope.filterItemListByCategory = function(categories,category) {
				categories.forEach(function(cat,index) {
					if (category && cat.category_id === category.category_id){
						cat.selected = true;
						$scope.subcategoryId = cat.category_id;
					} else {
						cat.selected = false;
					}
					console.log(cat.selected);
				});
				if (!category) delete $scope.subcategoryId;
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
							'<ul class="item-list-categories" ng-if="categories.length > 0">' +
								'<li><a class="selected" ng-if="!subcategoryId" ng-click="filterItemListByCategory(categories)">all</a></li>' +
								'<li><a ng-if="subcategoryId" ng-click="filterItemListByCategory(categories)">all</a></li>' +
								'<li ng-repeat="category in categories |orderBy:\'category_name\'"><a ng-class="{selected:category.selected}" ng-click="filterItemListByCategory(categories,category)" ng-bind="category.title"></a></li>' +
							'</ul>' +
							'<md-grid-list ng-if="list_items" md-cols-xs="2" md-cols-sm="3" md-cols-md="4" md-cols-gt-md="5" sm-row-height="3:4" md-row-height="4:5" md-gutter="12px" md-gutter-gt-sm="8px">' +
							    '<!-- grid item -->' +
								'<md-grid-tile class="list-item" ng-repeat="item in list_items | orderBy:\'-date_added\' | startFrom : paging.startFrom | limitTo:config.listing.items_per_page | filter:{subcategory:subcategoryId}" ng-if="item.channel">' + // | itemsPerPage:config.listing.items_per_page track by $index
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