app.directive('categorySelectMenu', ['$location','Item',
	function($location,Item) {

		// image upload controller
		var controller = function($scope,$element) {

			// init category select menu
			$scope.initCategorySelectMenu = function(file,categories,parent){
				$scope.file = file;
				$scope.categories = categories;
				$scope.toggleMenu = false;
				// set scope attribute name - category / subcategory
				if (parent){
					$scope.attr_name = 'subcategory';
					$scope.parent = file.category;
				} else {
					$scope.attr_name = 'category';
					$scope.parent = categories;
				}
			};

		};

		var template =  '<div class="select-menu-container" ng-class="{active: toggleMenu}">' +
							'<button class="toggle-select-menu" ng-click="toggleCategorySelectMenu()">' + 
								'<span class="selected-category-name" ng-bind="file[attr_name].category_name"></span>' +
								'<span class="arrow"><span class="glyphicon glyphicon-triangle-bottom"></span></span>' +
							'</button>' +
							'<div class="select-menu">' +
								'<ul class="select-options">' +
									'<li ng-click="selectCategory(category,file)" ng-repeat="category in categories" ng-class="{selected: category.category_name == file[attr_name].category_name}">{{category.category_name}}</li>' + 
									'<li class="divider"></li>' + 
									'<li class="new-category-form-container">' +
										'<form name="newCategoryForm" layout="row">' +
											'<input flex="80" class="form-control" type="text" ng-model="category_name" placeholder="Add New Category.."/>' +
											'<button flex="20" ng-click="createCategory(category_name,file.category)">Add</button>' +
										'</form>' +  
									'</li>' + 
								'</ul>' + 
							'</div>' + 
						'</div>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);