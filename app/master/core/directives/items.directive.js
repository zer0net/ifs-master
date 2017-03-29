app.directive('items', ['$rootScope','Channel',
	function($rootScope,Channel) {

		// item list directive controller
		var controller = function($scope,$element) {

			// init items 
			$scope.initItems = function(){
				if ($scope.legacy){
					$scope.lcIndex = 0;
					$scope.getLegacyItems();
				} else {
					$scope.getItems();
				}
			};

			// get legacy items
			$scope.getLegacyItems = function(){
				$scope.items_old = [];
				$scope.channels_old.forEach(function(och,index){
					$scope.items_old = $scope.items_old.concat(och.items);
				});
				$scope.getItems();
			};

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
						if ($scope.items_old) items = items.concat($scope.items_old);
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

		var template =  '<div ng-init="initItems()">' +
						'<uib-tabset id="main-tabs" active="activePill" type="pills" ng-if="items">' +
						    '<uib-tab index="0" heading="All ({{items.length}})">' +
								'<item-list ng-init="initItemList(items)"></item-list>' +
						    '</uib-tab>' +
						    '<uib-tab index="$index + 1"  ng-repeat="(key, value) in items | groupBy: \'content_type\'" heading="{{key}} ({{value.length}})">' +
								'<item-list ng-init="initItemList(value,key)"></item-list>' +
						    '</uib-tab>' +
						'</uib-tabset>' + 
						'</div>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);