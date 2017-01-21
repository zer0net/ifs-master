app.directive('channelPreview', ['$location','$rootScope',
	function($location,$rootScope) {

		var template = '';


		return {
			restrict: 'AE',
			template:template,
			replace:true
		}

	}
]);