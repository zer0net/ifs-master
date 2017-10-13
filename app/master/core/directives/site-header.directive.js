app.directive('siteHeader', ['$mdDialog', '$mdMedia','$rootScope','$location',
	function($mdDialog,$mdMedia,$rootScope,$location) {

		// header directive controller
		var controller = function($scope,$element) {

			$scope.initHeader = function(){
				if ($location.$$absUrl.indexOf('view.html') > -1 && $location.$$absUrl.indexOf('type') > -1 ){
					$scope.content_type = $location.$$absUrl.split('?type=')[1].split('+')[0] + 's';
				}
			};

			// on search title
			$scope.onSearchTitle = function(title){
				$rootScope.$broadcast('onSearchTitle',title);
			};

			// on all channels view
			$scope.viewAllChannels = function(){
				var route = 'channels';
				$scope.routeSite(route);
			};

			// on all channels view
			$scope.viewUserChannels = function(){
				var route = 'user';
				$scope.routeSite(route);
			};

		    // show info modal
			$scope.showInfoModal = function(ev) {
				// dialog vars
				$scope.status = '';
				$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
			    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			    // dialog template
			    var dialogTemplate = 
			    	'<md-dialog class="dialog" style="width:500px;">' +
					    '<md-toolbar>' +
					    	'<div class="md-toolbar-tools">' +
						        '<h2>FAQ / Rules</h2>' +
						        '<span flex></span>' +
								'<md-button class="md-icon-button pull-right" ng-click="hide()">'+
									'<span class="glyphicon glyphicon-remove"></span>'+
								'</md-button>'+
					    	'</div>' +
					    '</md-toolbar>' +
					    '<md-dialog-content layout-padding>' +
					    	'<img style="width:100%;" src="/{{items.scope.page.site_info.address}}/assets/master/img/faq-banner.jpg"/>' +
					    	'<div>' +
					    	'Here is a list of what is NOT accepted on this server:<br/>' +
					    	'<ul><li>NO CP/Porn</li></ul>' +
					    	'Visit our Blog: <a href="{{page.site_info.address}}/1Cd1SqtZUUpK8e8KUUqBttHzwPfbG1CU6y">1Cd1SqtZUUpK8e8KUUqBttHzwPfbG1CU6y</a>' +
					    	'</div>' +
					    '</md-dialog-content>' +
					'</md-dialog>';
				// show dialog
			    $mdDialog.show({
					controller: DialogController,
					template: dialogTemplate,
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose:true,
					fullscreen: true,
					locals:{
						items:{
							scope:$scope
						}
					}		

			    });
			};
			
			// open site config dialog
			$scope.openSiteConfigDialog = function(ev){
				// dialog vars
				$scope.status = '';
				$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
			    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			    // dialog template
			    var dialogTemplate = 
			    	'<md-dialog aria-label="Configuration">' +
					    '<md-toolbar>' +
					    	'<div class="md-toolbar-tools">' +
						        '<h2>Configuration</h2>' +
						        '<span flex></span>' +
						        '<md-button class="md-icon-button" ng-click="cancel()">' +
						            '<md-icon md-svg-src="img/icons/ic_close_24px.svg" aria-label="Close dialog"></md-icon>' +
						        '</md-button>' +
					    	'</div>' +
					    '</md-toolbar>' +
					    '<md-dialog-content site-config ng-init="initSiteConfig(items.config)" layout-padding style="width:400px" layout="column">' +
			    			'<label style="margin: 0;padding: 0 8px;">media type</label>' +
							'<md-input-container style="margin:0;" flex>' +
								'<md-checkbox ng-repeat="mediaType in mediaTypes" ng-model="config[mediaType]" aria-label="{{mediaType}}" ng-click="updateMediaTypes(config,mediaType)">{{mediaType}}</md-checkbox>' +
			    			'</md-input-container>' +
				            '<md-button flex="100" class="md-primary md-raised edgePadding pull-right" ng-click="updateConfig(config)">' +
				            	'<label>Update Configuration</label>' +
				            '</md-button>' +
					    '</md-dialog-content>' +				    
					'</md-dialog>';
				// show dialog
			    $mdDialog.show({
					controller: DialogController,
					template: dialogTemplate,
					parent: angular.element(document.body),
					target:ev,
					clickOutsideToClose:true,
					fullscreen: useFullScreen,
					locals:{
						items:{
							config:$scope.config
						}
					}					
			    });
			}

		};


		// dialog controller
		var DialogController= function($scope, $mdDialog ,items) {
			
			// items
			$scope.items = items;	
			
			// hide dialog		
			$scope.hide = function() {
				$mdDialog.hide();
			};
			
			// cancel dialog
			$scope.cancel = function() {
				$mdDialog.cancel();
			};

		};

		var template ='<nav class="navbar navbar-default navbar-fixed-top" id="navbar-fixed-top" ng-init="initHeader()">'+
	  						'<div class="header-left pull-left">' + 
	  							'<span class="glyphicon glyphicon-menu-hamburger navbar-brand" id="menu-toggle" ng-click="toggleMenu($event)"></span>' +
	  							'<a class="navbar-brand" ng-click="routeSite()">IFS <b>- Intergalactic File Server</b></a>' + 
	  							'<a class="navbar-brand" ng-click="routeSite()" ng-if="content_type"><span>/ {{content_type}}</span></a>' +
	  						'</div>'+
	  						'<div class="header-right pull-right">' + 
								'<form class="pull-left">'+
		        					'<div class="form-group">'+
		          					'<input type="text" class="form-control" placeholder="Search" ng-model="ppFilter.title" ng-keyup="onSearchTitle(ppFilter.title)">'+  					
		          					'</div>' +
		      					'</form>' +
		  						'<user-menu ng-if="page.site_info"></user-menu>'+    					
	  						'</div>' +

					'</nav>';
		
		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);