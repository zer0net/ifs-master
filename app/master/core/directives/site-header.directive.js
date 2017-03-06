app.directive('siteHeader', ['$mdDialog', '$mdMedia','$rootScope','$location',
	function($mdDialog,$mdMedia,$rootScope,$location) {

		// header directive controller
		var controller = function($scope,$element) {

			$scope.initHeader = function(){
				if ($location.$$absUrl.indexOf('view.html') > -1 && $location.$$absUrl.indexOf('type') > -1){
					$scope.media_type = $location.$$absUrl.split('?type=')[1].split('+')[0] + 's';
				}
			};

		    // show info modal
			$scope.showInfoModal = function(ev) {
				// dialog vars
				$scope.status = '';
				$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
			    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			    // dialog template
			    var dialogTemplate = 
			    	'<md-dialog class="fullscreen-dialog" >' +
					    '<md-toolbar>' +
					    	'<div class="md-toolbar-tools">' +
					    	  '<md-button class="md-icon-button" ng-click="hide()">'+
					            '<span class="glyphicon glyphicon-remove"></span>'+
					          '</md-button>'+
						        '<h2>FAQ</h2>' +
						        '<span flex></span>' +						        
					    	'</div>' +
					    '</md-toolbar>' +
					    '<md-dialog-content channel-register>' +
					    	'<p> comming soon ... '+
					    	'<p><button  ng-click="handleCloneClick(items.scope)"> new Channel </button> click on button to create new channel'+							
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

			// handle clone click
			$scope.handleCloneClick = function() {
				console.log('handle clone click')
		    	$rootScope.$broadcast('onCreateChannel',$scope.items.scope);
			};

		};

		var template ='<nav class="navbar navbar-default navbar-fixed-top" id="navbar-fixed-top" ng-init="initHeader()">'+
  						'<div class="container-fluid" style="background-color:#041b2c">'+
	  						'<div class="navbar-header">' + 
	  							'<span class="glyphicon glyphicon-menu-hamburger navbar-brand" id="menu-toggle" ng-click="toggleMenu($event)"></span>' +
	  							'<a class="navbar-brand" href="/{{page.site_info.address}}">IFS - Intergalactic File Server</a>' + 
	  							'<a class="navbar-brand" href="/{{page.site_info.address}}/index.html?media_type={{media_type}}" ng-if="media_type"><span>/ {{media_type}}</span></a>' +
	  						'</div>'+
	  						'<div class="container">' + 
		  						'<site-search ng-if="!loading"></site-search>' +
		  						'<ul class="nav navbar-nav navbar-right">'+			  						
			  						'<li><a ng-click="showInfoModal(ev)" >FAQ</a></li>'+  
			  						'<li><a href="/{{page.site_info.address}}/user/">My Channels</a></li>'+  
									'<li><a href="/{{page.site_info.address}}/register.html">All Channels</button></a></li>'+
								'</ul>'+    					
	  						'</div>' +
	  					'</div>'+
					'</nav>';
		
		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);