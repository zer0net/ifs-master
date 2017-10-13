app.directive('imageListSidebar', [
	function() {

		var controller =  function($scope,$element) {
			$scope.getImages = function(){
				var query = ["SELECT i.*, c.* FROM item AS i LEFT JOIN channel AS c ON i.channel=c.channel_address WHERE content_type='image' LIMIT 20"];
				Page.cmd("dbQuery",query,function(images){
					$scope.$apply(function(){
						images.forEach(function(image,index){
							console.log(image);
							image.path = "/"+$scope.page.site_info.address+"/merged-"+$scope.page.site_info.content.merger_name+"/"+image.cluster_id+"/data/users/"+image.channel_address.split('_')[1]+"/"+image.file_name;
						});
						$scope.images = images;
					});
				});
			};
		};

		var template =	'<div class="md-whiteframe-1dp" layout="column"  ng-if="item" ng-init="getImages()">' +
							'<ul style="padding:0">' +
						    	'<li ng-repeat="image in images | orderBy:\'-date_added\' track by $index" layout="row" layout-padding>'+
									'<figure flex="35" class="game-img" style="background-position: center;background-repeat: no-repeat;background-size: cover;background-image:url(\'{{image.path}}\');">' +
										'<a href="/{{page.site_info.address}}/index.html?route:item+id:{{image.item_id}}+type:{{image.content_type}}"></a>' +
									'</figure>' +
									'<div flex="65" class="game-info">' +
							    		'<h4><a href="/{{page.site_info.address}}/index.html?route:item+id:{{image.item_id}}+type:{{image.content_type}}">{{image.title}}</a></h4>' +
							    		'<span><b>size:</b> {{image.file_size|filesize}}</span><br/>' +
							    		'<span><b>date added:</b> <span am-time-ago="image.date_added"></span></span>' +
							    	'</div>' +
							    	'<hr/>' +
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