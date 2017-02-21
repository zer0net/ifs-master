app.directive('categories', [
	function() {

		// categories directive controller
		var controller = function($scope,$element) {

			// get categories
			$scope.getCategories = function(){
				var inner_path = "content/categories.json";			
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(catJson) {
					catJson = JSON.parse(catJson);
					var categories = [];
					catJson.categories.forEach(function(category,index){
						if (category.category_parent === 0){
							category.subcategories = $scope.getSubcategories(category,catJson.categories);
							categories.push(category);
						}
					});
					$scope.categories = categories;
					$scope.$apply();
				});
			};

			// get sub categories
			$scope.getSubcategories = function(category,categories){
				var subcategories = [];
				categories.forEach(function(cat,index){
					console.log(index);
					if (parseInt(cat.category_parent) === category.category_id){
						console.log('hi');
						subcategories.push(cat);
					}
				});
				console.log(subcategories);
				return subcategories;
			};

			// create category
			$scope.createCategory = function(category_name,parent){
				if (category_name && category_name.length > 2){
					// get user's categories.json
					var inner_path = "data/users/"+Page.site_info.auth_address+"/category.json";			
					Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
						// data file
						if (data) { data = JSON.parse(data); } 
						else { data = {"next_category_id":1,"category":[]}; }
						// category
						category = {
							category_name:category_name,
							date_added:+(new Date)
						};
						// category parent
						if (parent){
							category.category_parent = parent.category_id;
						} else {
							category.category_parent = 0;
						}
						// category id
						category.category_id = data.next_category_id;
						data.next_category_id += 1;
						// push comment to user's comment.json
						data.category.push(category);
						// write to file					
						var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));					
						Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
							// sign & publish site
							Page.cmd("sitePublish",{"inner_path":inner_path}, function(res) {
								// apply to scope
								$scope.$apply(function() {
									Page.cmd("wrapperNotification", ["done", "Category created!", 10000]);
									if (parent) {parent.subcategories.push(category)}
									else {$scope.categories.push(category)}
									$scope.category_name = "";
								});
							});
						});
				    });
				}
			};

		};

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
		}

	}
]);