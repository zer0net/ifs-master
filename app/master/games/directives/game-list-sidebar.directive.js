app.directive('gameListSidebar', [
	function() {

		var template =	'<div class="md-whiteframe-1dp" layout="column">' +
							'<ul>' +
						    	'<li ng-repeat="game in games|limitTo:15 | orderBy:\'-date_added\' track by $index" layout="row" layout-padding>'+
									'<figure flex="35" class="game-img" style="background-position: center;background-repeat: no-repeat;background-size: contain;background-image:url(\'{{game.img}}\');">' +
										'<a href="/{{site_address}}/view.html?type=game-c={{game.channel.address}}g={{game.game_id}}z={{game.zip_name}}f={{game.file_name}}"></a>' +
									'</figure>' +
									'<div flex="65" class="game-info">' +
							    		'<h3><a href="/{{site_address}}/view.html?type=game-c={{game.channel.address}}g={{game.game_id}}z={{game.zip_name}}f={{game.file_name}}">{{game.title}}</a></h3>' +
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
			template:template
		}

	}
]);