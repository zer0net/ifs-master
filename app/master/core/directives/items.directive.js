app.directive('items', ['$rootScope',
	function($rootScope) {

		// item list directive controller
		var controller = function($scope,$element) {

			// get items
			$scope.getItems = function(){
				var query;
				if ($scope.channel){
					query = ["SELECT * FROM item WHERE item.channel='"+$scope.channel.channel_address+"'"];
				} else {
					query = ["SELECT * FROM item"];
				}
				Page.cmd("dbQuery", query, function(items){
					$scope.$apply(function(){
						if (items){
							$scope.items = items;
						}
					});
				});
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
		};

		var template =  '<uib-tabset id="main-tabs" active="activePill" type="pills" ng-if="items">' +
						    '<uib-tab index="0" heading="All ({{items.length}})">' +
								'<section class="item-list-section container">' +
										'<ul class="item-list-categories" ng-if="categories.length > 0">' +
											'<li><a class="selected" ng-if="!subcategoryId" ng-click="filterItemListByCategory(categories)">all</a></li>' +
											'<li><a ng-if="subcategoryId" ng-click="filterItemListByCategory(categories)">all</a></li>' +
											'<li ng-repeat="category in categories |orderBy:\'category_name\'"><a ng-class="{selected:category.selected}" ng-click="filterItemListByCategory(categories,category)" ng-bind="category.title"></a></li>' +
										'</ul>' +
										'<item-list ng-init="initItemList(items)"></item-list>' +
								'</section>' +
						    '</uib-tab>' +
						    '<uib-tab index="$index + 1"  ng-repeat="(key, value) in items | groupBy: \'content_type\'" heading="{{key}} ({{value.length}})">' +
								'<section class="item-list-section container">' +
										'<ul class="item-list-categories" ng-if="categories.length > 0">' +
											'<li><a class="selected" ng-if="!subcategoryId" ng-click="filterItemListByCategory(categories)">all</a></li>' +
											'<li><a ng-if="subcategoryId" ng-click="filterItemListByCategory(categories)">all</a></li>' +
											'<li ng-repeat="category in categories |orderBy:\'category_name\'"><a ng-class="{selected:category.selected}" ng-click="filterItemListByCategory(categories,category)" ng-bind="category.title"></a></li>' +
										'</ul>' +
										'<item-list ng-init="initItemList(items)"></item-list>' +
								'</section>' +
						    '</uib-tab>' +
						'</uib-tabset>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);