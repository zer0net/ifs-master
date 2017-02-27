app.directive('gameListSidebar', [
	function() {

		var template =	'<div class="md-whiteframe-1dp" layout="column">' +
							'<ul>' +
						    	'<li ng-repeat="item in items.games | limitTo:15 | orderBy:\'-date_added\' track by $index" layout="row" layout-padding>'+
									'<figure flex="35" class="game-img" style="background-position: center;background-repeat: no-repeat;background-size: contain;background-image:url(\'{{item.img}}\');">' +
										'<a href="/{{page.site_info.address}}/view.html?type={{item.content_type}}+id={{item.item_id}}"></a>' +
									'</figure>' +
									'<div flex="65" class="game-info">' +
							    		'<h3><a href="/{{page.site_info.address}}/view.html?type={{item.content_type}}+id={{item.item_id}}">{{item.title}}</a></h3>' +
							    		'<span><b>size:</b> {{item.file_size|filesize}}</span><br/>' +
							    		'<span><b>date added:</b> <span am-time-ago="item.date_added"></span></span>' +
							    	'</div>' +
							    	'<hr/>' +
						    	'</li>' +
							'</ul>' +
						'</div>';

		return {
			restrict: 'AE',
			replace:true,
			template:template
		}

	}
]);