app.directive('infoMessage', ['$rootScope','$location',
	function($rootScope,$location) {

		// item view controller
		var controller = function($scope,$element) {

			// init info message
			$scope.initInfoMessage = function(){
				$scope.info_text = 'it seems that there is an error with your user certificate.' +
								   'if you still see this message, please change user certifiate or create a new ifs user account';
			};

			// on select user
			$scope.onSelectUser = function(){
				$scope.hideInfoMsg();
				$scope.selectUser();
			};

			// on create user
			$scope.onCreateUser = function(){
				$scope.info_text = 'please select the "unique to site" account option ( on the zeronet select account menu on the right side of the screen), and then click on "create account"';
				$scope.selectUser();
			};
		};

		var template = '<div id="info-message-modal" ng-init="initInfoMessage()">' +
							'<div class="info-message-header">' +
								'<h3>Info</h3>' +
							'</div>' +
							'<div class="info-message-body">' +
								'{{info_text}}' +
							'</div>' +
							'<div class="info-message-footer">' +
								'<button class="pull-left" ng-click="onSelectUser()">Change</md-button>' +
								'<button class="pull-right" ng-click="onCreateUser()">Create New</md-button>' + 							
							'</div>' +
					   '</div>'

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);