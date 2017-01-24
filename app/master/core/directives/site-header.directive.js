app.directive('siteHeader', ['$mdDialog', '$mdMedia','$rootScope',
	function($mdDialog,$mdMedia,$rootScope) {

	
		// dialog controller
		var DialogController= function($scope, $mdDialog,items) {
			
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
		    	$rootScope.$broadcast('onCloneFileHub');
			};

		};

		// header directive controller
		var controller = function($scope,$element) {

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
						        '<h2>How to upload?</h2>' +
						        '<span flex></span>' +						        
					    	'</div>' +
					    '</md-toolbar>' +
					    '<md-dialog-content >' +
							'<ol style="padding: 8px 24px;"><li>click on button "new Filehub" below and confirm to create your filehub <br/><button  ng-click="handleCloneClick()"> new Filehub </button> </li>' +						
							'<li>upload stuff on your newly created filehub</li>' +
							'<li>click "Register" button on header to add your hub.</li><li>done!</li></ol>'+
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
						items:null
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




		var template ='<nav class="navbar navbar-default navbar-fixed-top" id="navbar-fixed-top">'+
  						'<div class="container-fluid" style="background-color:#041b2c">'+
	  						'<div class="navbar-header"><span class="glyphicon glyphicon-menu-hamburger navbar-brand" id="menu-toggle" ng-click="toggleMenu($event)"></span> <a class="navbar-brand" href="/{{site_address}}">IFS - Intergalactic File Server</a></div>'+
	  						'<div class="container">' + 
		  						'<site-search ng-if="!loading"></site-search>' +
		  						'<ul class="nav navbar-nav navbar-right">'+
			  						'<li><a href="/{{page.site_info.address}}/user/">USER</a></li>'+  
			  						'<li><a ng-click="showInfoModal(ev)" >FAQ</a></li>'+  
									'<li><a href="/{{page.site_info.address}}/register.html">REGISTER</button></a></li>'+  												
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