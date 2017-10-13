app.directive('itemList', ['$rootScope',
	function($rootScope) {

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

			// show default item img
			$scope.showDefaultItemIcon = function(item){
				var a;
				if (item.file && !item.file.is_downloaded){
					a = true;
				} else if (!item.poster_path){
					a = true;
				} else if (item.poster_path ){
					a = false;
				} else {
					a = false;
				}
				return a;
			};

			// get sort option menu item style
			$scope.getSortOptionMenuItemStyle = function (s_option,sort_by) {
				var css_class;
				if (s_option.val === sort_by.val){
					css_class = 'selected';
				}	
				return css_class
			};

			// render item 
			$scope.renderItem = function(item) {
				item.view_url = '/' + $scope.page.site_info.address + '/index.html?route:item+id:' + item.item_id + '+type:'+item.content_type; 
			}

		};

		var template =  '<section class="item-list-section container  {{list_items_container_class}}">' +
							'<!-- categories -->' +								
							'<ul class="item-list-categories" ng-if="subcategories.length > 0 && config.listing.type === \'by category\'">' +
								'<li ng-repeat="sub in subcategories | orderBy:\'category_name\'">' + 
									'<a ng-class="getSubCatMenuItemStyle(sub,subcategory)" ng-click="selectSubCategory(sub)">' +
										'<span>{{sub.category_name}} ({{sub.total}})</span>' +
									'</a>' +
								'</li>' +
							'</ul>' +
							'<!-- /categories -->' +
							'<!-- subcategories -->' +
							'<ul class="item-list-categories" ng-if="f_types.length > 0 && config.listing.type === \'by content type\'">' +
								'<li ng-repeat="ft in f_types | orderBy:\'type\'" ng-if="ft.total > 0">' + 
									'<a ng-class="getFileTypeMenuItemStyle(ft,f_type)" ng-click="selectFileType(ft)">{{ft.type}} ({{ft.total}})</a>' +
								'</li>' +
							'</ul>' +
							'<!-- /subcategories -->' +
							'<!-- sort options -->' +
							'<ul class="item-list-sort-options">' + 
								'<li>sort by:</li>' +
								'<li ng-repeat="s_option in sort_options" ng-class="getSortOptionMenuItemStyle(s_option,sort_by)">' +
									'<a ng-click="sortItemList(s_option)" ng-bind="s_option.label"></a>' +
								'</li>' +
							'</ul>' +
							'<!-- /sort options -->' +
							'<!-- items -->' +
							'<ul ng-hide="list_loading" ng-if="list_items" class="list-items" masonry preserve-order reload-on-show load-images="true" ng-show="items_loading">' +
								'<li ng-repeat="item in list_items | filter:{subcategory:subcategoryId,title:title}" ng-class="chooseStyle(item.file.is_downloaded)" class="masonry-brick col-lg-3 col-md-3 col-sm-4 col-xs-6">' +
									'<div class="list-item-wrapper md-whiteframe-1dp">' +
										'<div class="item-img">' +
											'<a href="{{item.view_url}}">'+
												'<img ng-if="item.poster_path" ng-src="{{item.poster_path}}">' +
												'<div class="deafult-icon-container" ng-if="showDefaultItemIcon(item)">' +
													'<img ng-if="item.content_type === \'audio\'" src="assets/master/img/music.png"/>' +
													'<img ng-if="item.content_type === \'book\'" src="assets/master/img/book_default_icon.jpg"/>' +
													'<img ng-if="item.content_type === \'image\'" src="assets/master/img/image_default_icon.jpg"/>' +
													'<img ng-if="item.content_type === \'video\'" src="assets/master/img/video_default_icon.jpg"/>' +
													'<img ng-if="item.content_type === \'game\' && item.file_type === \'zip\'" src="assets/master/img/logo_dos.gif"/>' +
													'<img ng-if="item.content_type === \'game\' && item.file_type === \'nes\'" src="assets/master/img/logo_nes.png"/>' +
													'<img ng-if="item.content_type === \'game\' && item.file_type === \'bin\'" src="assets/master/img/logo_atari.jpg"/>' +
													'<img ng-if="item.content_type === \'game\' && item.file_type === \'sna\'" src="assets/master/img/logo_sna.jpg"/>' +
												'</div>' +
											'</a>' +
											'<span class="item-c-type">{{item.content_type}}</span>' +
										'</div>' +	
										'<div class="item-info">' + 
											'<h3><a href="{{item.view_url}}">{{item.title}}</a></h3>' +
											'<ul class="item-info-menu">' +
												'<li>{{item.channel_name}}</li>' +
												'<li><span class="item-date-added" am-time-ago="{{item.date_added}}"></span></li>' +
												'<li>{{item.file_type}} &#9679 {{item.file_size|filesize}}</li>' +
											'</ul>' +
											'<ul layout="row" class="item-bottom-menu">' +
												'<li flex="25" class="peer-count">' +
													'<i class="fa fa-users fa-25x" aria-hidden="true"></i>' +
													'<span ng-if="item.file.peer" class="count">{{item.file.peer}}</span>' +
													'<span ng-if="!item.file.peer" class="count">?</span>' +
												'</li>' +
												'<li flex="25" class="votes-count up-votes">' +
													'<i class="fa fa-thumbs-up fa-25x" aria-hidden="true"></i>' +
													'<span class="count">{{item.up_votes}}</span>' +
												'</li>' +
												'<li flex="25" class="votes-count down-votes">' +
													'<i class="fa fa-thumbs-down fa-25x" aria-hidden="true"></i>' +
													'<span class="count">{{item.down_votes}}</span>' +
							    				'</li>' +
							    				'<li flex="25" class="comments-count">' +
													'<i class="fa fa-comments fa-25x" aria-hidden="true"></i>' +
													'<span class="count">{{item.comment_count}}</span>' +
							    				'</li>' +
											'</ul>' +
										'</div>' +
									'</diV>' +
								'</li>' +
							'</ul>' +
							'<!-- /items -->' +
						'</section>';

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);