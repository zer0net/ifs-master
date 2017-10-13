app.directive('items', ['$rootScope','Channel','Item',
	function($rootScope,Channel,Item) {

		// item list directive controller
		var controller = function($scope,$element) {

			// init
			$scope.init = function(){
				$scope.moderations_on = true;
				$scope.sort_options = Item.generateItemListSortOptions();
				$scope.sort_by = $scope.sort_options[0];
				$scope.initItems();
			};

			// init items 
			$scope.initItems = function(){
				$scope.showItemsLoadingMsg('Loading Items...');			
				if ($scope.config.listing.type === 'by category'){
					delete $scope.categories;
					delete $scope.category;
					delete $scope.subcategories;
					$scope.categories = Item.generateCategoryMenu($scope.config,$scope.content_type,$scope.channel,$scope.moderations_on,$scope.hidden_channels,$scope.hidden_users);
					$scope.catIndex = 0;
					$scope.countCategoryItems();
				} else if ($scope.config.listing.type === 'by content type') {
					delete $scope.content_types;
					delete $scope.c_type;
					delete $scope.f_types;
					$scope.content_types = Item.generateContentTypesMenu($scope.config,$scope.content_type,$scope.channel,$scope.moderations_on,$scope.hidden_channels,$scope.hidden_users);
					$scope.ctIndex = 0;
					$scope.countContentTypeItems();
				}
			};

			// on get items
			$scope.onGetItems = function() {
				$scope.pagination = Item.generateItemsPagination($scope.config,$scope.categories,$scope.category,$scope.subcategory,$scope.content_types,$scope.c_type,$scope.f_type);
				if ($scope.config.listing.type === 'by category'){
					if ($scope.subcategory){
						$scope.getItems();
					} else if ($scope.category){
						$scope.subcategories = Item.generateSubCategoryMenu($scope.category,$scope.content_type,$scope.channel,$scope.moderations_on,$scope.hidden_channels,$scope.hidden_users);
						$scope.subIndex = 0;
						$scope.countSubItems();
					} else {
						$scope.getItems();
					}
				} else if ($scope.config.listing.type === 'by content type'){
					if ($scope.f_type){
						$scope.getItems();
					} else if ($scope.c_type){
						$scope.f_types = Item.generateFileTypeMenu($scope.c_type,$scope.content_type,$scope.channel,$scope.moderations_on,$scope.hidden_channels,$scope.hidden_users);
						$scope.ftIndex = 0;
						$scope.countFileTypeItems();
					} else {
						$scope.getItems();
					}
				}
			};

			// get items
			$scope.getItems = function(){
				$scope.show_loaded_images = false;
				if ($scope.items) delete $scope.items;				
				var query = Item.generateItemsQuery($scope.config,$scope.pagination,$scope.category,$scope.subcategory,$scope.channel,$scope.title,$scope.content_type,$scope.moderations_on,$scope.hidden_channels,$scope.hidden_users,$scope.c_type,$scope.f_type,$scope.sort_by);
				console.log($scope.sort_by);
				Page.cmd("dbQuery", query, function(items){
					$scope.$apply(function(){
						if (items){ 
							$scope.order_by = $scope.sort_by.val2;
							$scope.items = items;
							$scope.renderItems($scope.items);
						}
					});
				});
			};

			// render items
			$scope.renderItems = function(){
				$scope.items_with_img = 0;
				$scope.items.forEach(function(item,index){
					item = Item.getItemSiteFile(item,$scope.clusters);
					item.view_url = '/'+$scope.page.site_info.address+'/index.html?route:item+id:'+item.item_id+'+type:'+item.content_type;
					item.votes_sum = item.votes_up - item.votes_down;
					if (item.content_type === 'image'){
						item.poster_path = '/'+$scope.page.site_info.address+'/merged-'+$scope.page.site_info.content.merger_name+'/'+item.cluster_id+'/data/users/'+item.channel_address.split('_')[1]+'/'+item.file_name;
						if (item.file)$scope.items_with_img += 1;
					} else {
						if (item.poster_file && item.poster_file.length > 0){
							item.poster_path = '/'+$scope.page.site_info.address+'/merged-'+$scope.page.site_info.content.merger_name+'/'+item.cluster_id+'/data/users/'+item.channel_address.split('_')[1]+'/'+item.poster_file;
							if (item.file)$scope.items_with_img += 1;
						}
					}
				});
				if ($scope.items_with_img === 0){
					$scope.show_loaded_images = true;
				}
				$scope.finishLoadingItems();
			};


			// on loaded item img
			$scope.onLoadedItemImg = function() {
				if (!$scope.items_with_img_loaded) $scope.items_with_img_loaded = 0;
				$scope.items_with_img_loaded += 1;
				if (parseInt($scope.items_with_img_loaded) >= parseInt($scope.items_with_img)){
					$scope.show_loaded_images = true;
					$scope.$apply();
				}
			};

			// sort item list
			$scope.sortItemList = function(s_option) {
				$scope.sort_by = s_option;
				$scope.showItemsLoadingMsg('Loading Items...');		
				$scope.getItems();
			};

			// on item list page change
			$scope.pageChanged = function() {
				$scope.showItemsLoadingMsg('Loading Items...');
				$scope.getItems();
			};

			// show items loading msg
			$scope.showItemsLoadingMsg = function(msg){
				$scope.items_msg = msg;
				$scope.items_loading = true;
			};

			// finish loading items
			$scope.finishLoadingItems = function(){
				$scope.items_loading = false;
				$scope.list_loading = false;
			};

			/** BY CATEGORY **/

				// count category items
				$scope.countCategoryItems = function(){
					if ($scope.catIndex < $scope.categories.length){
						var cat = $scope.categories[$scope.catIndex];
						Page.cmd("dbQuery", cat.query , function(total){
							$scope.$apply(function() {
								cat.total = total[0]["count(*)"];
								$scope.catIndex += 1;
								$scope.countCategoryItems();
							})
						});			
					} else {
						$scope.onGetItems();
					}
				};

				// count sub items
				$scope.countSubItems = function(){
					if ($scope.subIndex < $scope.subcategories.length){
						var sub = $scope.subcategories[$scope.subIndex];
						Page.cmd("dbQuery", sub.query , function(total){
							$scope.$apply(function() {
								sub.total = total[0]["count(*)"];
								$scope.subIndex += 1;
								$scope.countSubItems();
							})
						});			
					} else {
						$scope.category.ready = true;					
						$scope.getItems();
					}
				};

				// select category
				$scope.selectCategory = function(category) {
					if (category.category_name === 'All'){
						delete $scope.category;
						delete $scope.subcategory;
						delete $scope.subcategories;					
					} else {
						delete $scope.subcategory;
						delete $scope.subcategories;					
						$scope.category = category;
					}
					$scope.showItemsLoadingMsg('Loading Items...');
					$scope.onGetItems();
				};

				// select subcategory
				$scope.selectSubCategory = function(subcategory) {
					if (subcategory.category_name === 'All'){
						delete $scope.subcategory;	
					} else {
						$scope.subcategory = subcategory;
					}
					$scope.showItemsLoadingMsg('Loading Items...');
					$scope.onGetItems();
				}

				// get cat menu item style
				$scope.getCatMenuItemStyle = function(cat,category) {
					var css = '';
					if (category){
						if (cat.category_id === category.category_id){
							css = 'selected';
						}
					} else {
						if (cat.category_name === 'All'){
							css = 'selected';
						}
					}
					return css;
				}

				// get sub cat menu item style
				$scope.getSubCatMenuItemStyle = function(sub,subcategory) {
					var css = '';
					if (subcategory){
						if (sub.category_id === subcategory.category_id){
							css = 'selected';
						}
					} else {
						if (sub.category_name === 'All'){
							css = 'selected';
						}
					}
					return css;
				}

			/** /BY CATEGORY **/

			/** BY CONTENT TYPE **/

				// count conten type items
				$scope.countContentTypeItems = function(){
					if ($scope.ctIndex < $scope.content_types.length){
						var ct = $scope.content_types[$scope.ctIndex];
						Page.cmd("dbQuery", ct.query , function(total){
							$scope.$apply(function() {
								ct.total = total[0]["count(*)"];
								$scope.ctIndex += 1;
								$scope.countContentTypeItems();
							})
						});			
					} else {
						$scope.onGetItems();
					}
				};

				// count file type items
				$scope.countFileTypeItems = function(){
					if ($scope.ftIndex < $scope.f_types.length){
						var ft = $scope.f_types[$scope.ftIndex];
						Page.cmd("dbQuery", ft.query , function(total){
							$scope.$apply(function() {
								ft.total = total[0]["count(*)"];
								$scope.ftIndex += 1;
								$scope.countFileTypeItems();
							})
						});			
					} else {
						$scope.c_type.ready = true;					
						$scope.getItems();
					}
				};

				// select content type
				$scope.selectContentType = function(c_type) {
					if (c_type.type === 'all'){
						delete $scope.c_type;
						delete $scope.f_type;
						delete $scope.f_types;					
					} else {
						delete $scope.f_type;
						delete $scope.f_types;					
						$scope.c_type = c_type;
					}
					$scope.showItemsLoadingMsg('Loading Items...');
					$scope.onGetItems();
				};

				// select file type
				$scope.selectFileType = function(f_type) {
					if (f_type.type === 'All'){
						delete $scope.f_type;	
					} else {
						$scope.f_type = f_type;
					}
					$scope.showItemsLoadingMsg('Loading Items...');
					$scope.onGetItems();
				};

				// get cat menu item style
				$scope.getContentTypeMenuStyle = function(ct,c_type) {
					var css = '';
					if (c_type){
						if (ct.type === c_type.type){
							css = 'selected';
						}
					} else {
						if (ct.type === 'all'){
							css = 'selected';
						}
					}
					return css;
				}

				// get cat menu item style
				$scope.getFileTypeMenuItemStyle = function(ft,f_type) {
					var css = '';
					if (f_type){
						if (ft.type === f_type.type){
							css = 'selected';
						}
					} else {
						if (ft.type === 'All'){
							css = 'selected';
						}
					}
					return css;
				};


			/** /BY CONTENT TYPE **/

			/** FILTER **/

				// on filter channel
				$scope.onFilterChannel = function(channel) {
					$scope.channel_id = channel.channel_address;
					var route = 'main';
					$scope.routeSite(route);
					if ($scope.channel){
						$scope.removeFilterChannel();
						$timeout(function () {
							$scope.filterChannel(channel);
							$rootScope.$broadcast('onFilterChannel',$scope.channel);
						});
					} else {
						$scope.filterChannel(channel);
						$rootScope.$broadcast('onFilterChannel',$scope.channel);				
					}
				};

				// on search key press
				$scope.onFilterModeration = function(){
					$scope.initItems();
				};

				// on filter channel
				$rootScope.$on('onFilterChannel',function(event,mass){
					$scope.channel = mass;
					$scope.initItems();
				});

				// on search key press
				$rootScope.$on('onSearchTitle',function(event,mass){
					$scope.title = mass;
					$scope.initItems();
				});

				// on remove filter channel
				$scope.onRemoveFilterChannel = function(){
					delete $scope.channel_id;
					$scope.removeFilterChannel();
					$rootScope.$broadcast('onRemoveFilterChannel',$scope.channel);
				};

				// on filter channel
				$rootScope.$on('onRemoveFilterChannel',function(event,mass){
					delete $scope.channel;
					$scope.initItems();
				});

			/** /FILTER **/

		};

		var template =  '<div id="items" ng-init="init()">' +
							'<!-- loading -->' +
							'<div id="items-loading" layout="column" ng-show="items_loading" flex>' +
							    '<div layout="column" flex="100" style="text-align:center; margin-top:10px;">' +
							        '<span><b ng-bind="items_msg"></b></span>' +
							    '</div>' +
							    '<div layout="row" flex="100" layout-align="space-around">' +
							        '<md-progress-circular md-mode="indeterminate"></md-progress-circular>' +
							    '</div>' +
							'</div>' +
							'<!-- /loading -->' +
							'<div class="moderations-switch-container"><md-switch class="md-primary" md-no-ink aria-label="Switch No Ink" ng-change="onFilterModeration()" ng-model="moderations_on">Moderations</md-switch></div>' +
							/*'<ul class="items-category-menu" ng-hide="items_loading">' + 
								'<li ng-repeat="cat in categories" ng-if="cat.total > 0"><a ng-class="getCatMenuItemStyle(cat,category)" ng-click="selectCategory(cat)">{{cat.category_name}} ({{cat.total}})</a></li>' +
							'</ul>' +*/
							'<ul class="items-category-menu" ng-hide="items_loading" >' + 
								'<li ng-repeat="ct in content_types" ng-if="ct.total > 0">' +
									'<a ng-class="getContentTypeMenuStyle(ct,c_type)" ng-click="selectContentType(ct)">' +
										'<i ng-if="ct.label === \'audio\'" class="fa fa-music fa-3x" aria-hidden="true"></i>' +
										'<i ng-if="ct.label === \'books\'" class="fa fa-book fa-3x" aria-hidden="true"></i>' +
										'<i ng-if="ct.label === \'images\'" class="fa fa-picture-o fa-3x" aria-hidden="true"></i>' +
										'<i ng-if="ct.label === \'videos\'" class="fa fa-film fa-3x" aria-hidden="true"></i>' +
										'<i ng-if="ct.label === \'games\'" class="fa fa-gamepad fa-4x" aria-hidden="true"></i>' +
										'<div ng-if="ct.label === \'all\'" class="all-icon-container">' +
											'<i class="fa fa-music" aria-hidden="true"></i>' +
											'<i class="fa fa-book" aria-hidden="true"></i>' +
											'<i class="fa fa-picture-o" aria-hidden="true"></i>' +
											'<i class="fa fa-gamepad" aria-hidden="true"></i>' +										
											'<i class="fa fa-film" aria-hidden="true"></i>' +
										'</div>' +
										'<span>{{ct.label}} ({{ct.total}})</span>' +
									'</a>' +
								'</li>' +
							'</ul>' +
							'<item-list ng-if="items" ng-hide="items_loading" ng-init="initItemList(items)"></item-list>' +
    						'<ul ng-hide="items_loading" ng-if="pagination.numPages > 1" uib-pagination total-items="pagination.totalItems" items-per-page="pagination.items_per_page" ng-model="pagination.currentPage" ng-change="pageChanged()" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;" boundary-links="true"></ul>' +
						'</div>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);