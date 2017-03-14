app.directive('videoListSidebar', [
	function() {

		var template =	'<div class="md-whiteframe-1dp" layout="column">' +
							'<ul>' +
						    	'<li ng-repeat="video in items.videos | orderBy:\'-date_added\' track by $index">' +
							    	'<a href="/{{page.site_info.address}}/view.html?type={{video.content_type}}+id={{video.item_id}}">{{video.title}}</a>' +
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