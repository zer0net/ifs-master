app.directive('gameListSidebar', [
	function() {

		var controller =  function($scope,$element) {
			$scope.getGames = function(){
				var query = ["SELECT * FROM item WHERE content_type='game'"];
				Page.cmd("dbQuery",query,function(games){
					$scope.$apply(function(){
						$scope.games = games;
					});
				});
			};
		};

		var template =	'<div class="md-whiteframe-1dp" layout="column"  ng-if="item" ng-init="getGames()">' +
							'<ul>' +
						    	'<li ng-repeat="game in games | limitTo:15 | orderBy:\'-date_added\' track by $index" layout="row" layout-padding>'+
									'<figure flex="35" class="game-img" style="background-position: center;background-repeat: no-repeat;background-size: contain;background-image:url(\'{{game.img}}\');">' +
										'<a href="/{{page.site_info.address}}/index.html?route:item+id:{{game.item_id}}+type:{{game.content_type}}"></a>' +
									'</figure>' +
									'<div flex="65" class="game-info">' +
							    		'<h3><a href="/{{page.site_info.address}}/index.html?route:item+id:{{game.item_id}}+type:{{game.content_type}}">{{game.title}}</a></h3>' +
							    		'<span><b>size:</b> {{game.file_size|filesize}}</span><br/>' +
							    		'<span><b>date added:</b> <span am-time-ago="game.date_added"></span></span>' +
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