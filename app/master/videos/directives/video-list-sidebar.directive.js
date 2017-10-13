app.directive('videoListSidebar', [
	function() {

		var controller =  function($scope,$element) {
			
			// get videos
			$scope.getVideos = function(){
				var q = "SELECT * FROM item WHERE content_type='video'";
				if ($scope.hidden_channels) {
					q += " AND channel NOT IN ("; 
					$scope.hidden_channels.forEach(function(hc,index){
						if (index > 0) q+=",";
						q+= "'"+hc+"'";
					});
					q += ")";	
				}
				Page.cmd("dbQuery",[q],function(videos){
					$scope.$apply(function(){
						$scope.videos = videos;
					});
				});
			};

		};

		var template =	'<div class="md-whiteframe-1dp" layout="column" ng-if="item" ng-init="getVideos()">' +
							'<ul>' +
						    	'<li ng-repeat="video in videos | orderBy:\'-date_added\' track by $index">' +
							    	'<a href="/{{page.site_info.address}}/index.html?route:item+id:{{video.item_id}}+type:{{video.content_type}}">{{video.title}}</a>' +
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