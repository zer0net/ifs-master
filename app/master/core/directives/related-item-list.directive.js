app.directive('relatedItemList', ['Item',
	function(Item) {

		var controller =  function($scope,$element) {

			// get related items
			$scope.getRelatedItems = function(item){
				var limit = 15;
				var query = Item.generateItemsQuery($scope.config,$scope.pagination,$scope.category,$scope.subcategory,$scope.channel,$scope.title,item.content_type,$scope.moderations_on,$scope.hidden_channels,$scope.hidden_users,$scope.c_type,$scope.f_type,$scope.sort_by,limit);
				Page.cmd("dbQuery", query, function(related_items){
					$scope.$apply(function(){
						$scope.related_items = related_items;
						$scope.renderItems();
					});							
				});
			};

			// render items
			$scope.renderItems = function(){
				$scope.related_items.forEach(function(item,index){
					item = Item.getItemSiteFile(item,$scope.clusters);
					item.view_url = '/'+$scope.page.site_info.address+'/index.html?route:item+id:'+item.item_id+'+type:'+item.content_type;
					if (item.content_type === 'image'){
						item.poster_path = '/'+$scope.page.site_info.address+'/merged-'+$scope.page.site_info.content.merger_name+'/'+item.cluster_id+'/data/users/'+item.channel_address.split('_')[1]+'/'+item.file_name;
					} else {
						if (item.poster_file && item.poster_file.length > 0){
							item.poster_path = '/'+$scope.page.site_info.address+'/merged-'+$scope.page.site_info.content.merger_name+'/'+item.cluster_id+'/data/users/'+item.channel_address.split('_')[1]+'/'+item.poster_file;
						}
					}
				});	
				$scope.related_items_loaded = true;	
			};

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

		};

		var template =	'<div class="related-item-list" layout="column"  ng-if="item" ng-init="getRelatedItems(item)">' +
							'<ul ng-if="related_items_loaded">' +
						    	'<li ng-repeat="r_item in related_items | limitTo:15 | orderBy:\'-date_added\' track by $index" layout="row" layout-padding>'+
									'<a href="/{{page.site_info.address}}/index.html?route:item+id:{{r_item.item_id}}+type:{{r_item.content_type}}">' + 
										'<figure>' +
											'<img ng-if="r_item.poster_path" ng-src="{{r_item.poster_path}}">' +
											'<div class="deafult-icon-container" ng-if="showDefaultItemIcon(r_item)">' +
												'<img ng-if="r_item.content_type === \'audio\'" src="assets/master/img/music.png"/>' +
												'<img ng-if="r_item.content_type === \'book\'" src="assets/master/img/book_default_icon.jpg"/>' +
												'<img ng-if="r_item.content_type === \'image\'" src="assets/master/img/image_default_icon.jpg"/>' +
												'<img ng-if="r_item.content_type === \'video\'" src="assets/master/img/video_default_icon.jpg"/>' +
												'<img ng-if="r_item.content_type === \'game\' && r_item.file_type === \'zip\'" src="assets/master/img/logo_dos.gif"/>' +
												'<img ng-if="r_item.content_type === \'game\' && r_item.file_type === \'nes\'" src="assets/master/img/logo_nes.png"/>' +
												'<img ng-if="r_item.content_type === \'game\' && r_item.file_type === \'bin\'" src="assets/master/img/logo_atari.jpg"/>' +
												'<img ng-if="r_item.content_type === \'game\' && r_item.file_type === \'sna\'" src="assets/master/img/logo_sna.jpg"/>' +
											'</div>' +
										'</figure>' +
										'<div class="item-info">' +
								    		'<h3>{{r_item.title}}</h3>' +
								    		'<span><b>size:</b> {{r_item.file_size|filesize}}</span><br/>' +
								    		'<span><b>date added:</b> <span am-time-ago="r_item.date_added"></span></span>' +
								    	'</div>' +
									'</a>' +
						    	'</li>' +
							'</ul>' +
						'</div>';

		return {
			restrict: 'AE',
			replace:true,
			controller:controller,
			template:template
		}

	}
]);