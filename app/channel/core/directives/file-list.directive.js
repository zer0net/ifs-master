app.directive('fileList', ['$mdDialog','$mdMedia',
	function($mdDialog,$mdMedia) {

		// interface controller
		var controller = function($scope,$element) {

			$scope.itemsPerPage = 15;
			$scope.sortKey = 'file_name';
			$scope.reverse = false;			
		    $scope.games = $scope.filesTotal;

			// sort file list
			$scope.sort = function(keyname){
				if($scope.sortKey==keyname) {
					$scope.reverse = !$scope.reverse; //if true make it false and vice versa	
				} else {
					$scope.sortKey = keyname;   //set the sortKey to the param passed				
					$scope.reverse=false;					
					if ($scope.sortKey=='date_added' || $scope.sortKey=='x_peer'||$scope.sortKey=='x_is_load') $scope.reverse=true; // special case
				}			
		    }
			
		    // delete File
		    $scope.deleteFile = function(item){
		    	var file_name_field;
		    	if (item.file_type === 'zip'){
		    		file_name_field = 'zip_name';
		    	} else {
		    		file_name_field = 'file_name';
		    	}
		    	$scope.deleteItem(item,file_name_field);
		    };

		    // item preview dialog
		    $scope.itemPreviewDialog = function(ev,item){
		    	console.log(item);
		    	if (item.media_type === 'game'){
			    	if (item.file_type === 'zip'){
			    		$scope.dosPreviewDialog(ev,item);
			    	} else if (item.file_type === 'nes'){
			    		$scope.nesPreviewDialog(ev,item);
			    	} else if (item.file_type === 'bin'){
			    		$scope.atariPreviewDialog(ev,item);
			    	} else if (item.file_type === 'sna'){
			    		$scope.cpcPreviewDialog(ev,item);
			    	}
		    	} else if (item.media_type === 'video'){
		    		$scope.videoPreviewDialog(ev,item);
		    	}
		    };

		    // dos preview dialog
			$scope.dosPreviewDialog = function(ev,item) {

				$scope.status = '';
				$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
			    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

			    var dialogTemplate = '<md-dialog aria-label="{{items.item.title}}">' +
									    '<md-toolbar>' +
									    	'<div class="md-toolbar-tools">' +
										        '<h2>{{items.item.title}}</h2>' +
									    	'</div>' +
									    '</md-toolbar>' +
									    '<md-dialog-content layout-padding>' +
											'<md-content id="dosbox-dialog-container" style="width:700px;">' +
												'<dosbox ng-if="items.item" ng-init="initDosBox(items.item)"></dosbox>' +
											'</md-content>' +
									    '</md-dialog-content>' +
									  '</md-dialog>';

			    $mdDialog.show({
					controller: DialogController,
					template: dialogTemplate,
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose:true,
					fullscreen: useFullScreen,
					locals: {
						items: {
							item:item
						}
					}
			    });

			};

		    // nes preview dialog
			$scope.nesPreviewDialog = function(ev,item) {

				$scope.status = '';
				$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
			    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

			    var dialogTemplate = '<md-dialog aria-label="{{items.item.title}}">' +
									    '<md-toolbar>' +
									    	'<div class="md-toolbar-tools">' +
										        '<h2>{{items.item.title}}</h2>' +
									    	'</div>' +
									    '</md-toolbar>' +
									    '<md-dialog-content layout-padding>' +
											'<md-content id="nes-emulator-dialog-container" style="width:512px;padding:0">' +
												'<nes-emulator ng-if="items.item" ng-init="initNesEmulator(items.item)"></nes-emulator>' +
											'</md-content>' +
									    '</md-dialog-content>' +
									  '</md-dialog>';

			    $mdDialog.show({
					controller: DialogController,
					template: dialogTemplate,
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose:true,
					fullscreen: useFullScreen,	
					onRemoving:function(){		
						if($scope.nes.isRunning) {
							$scope.nes.stop();	
						}
					},
					locals: {
						items: {
							item:item
						}
					}
			    });

			};

		    // atari preview dialog
			$scope.atariPreviewDialog = function(ev,item) {

				$scope.status = '';
				$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
			    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

			    var dialogTemplate = '<md-dialog aria-label="{{items.item.title}}">' +
									    '<md-toolbar>' +
									    	'<div class="md-toolbar-tools">' +
										        '<h2>{{items.item.title}}</h2>' +
									    	'</div>' +
									    '</md-toolbar>' +
									    '<md-dialog-content layout-padding>' +
											'<md-content id="atari-emulator-dialog-container" style="width:640px;padding:0">' +
												'<atari-emulator ng-if="items.item" ng-init="initAtariEmulator(items.item)"></atari-emulator>' +
											'</md-content>' +
									    '</md-dialog-content>' +
									  '</md-dialog>';

			    $mdDialog.show({
					controller: DialogController,
					template: dialogTemplate,
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose:true,
					fullscreen: useFullScreen,	
					onRemoving:function(){		
						if($scope.nes.isRunning) {
							$scope.nes.stop();	
						}
					},
					locals: {
						items: {
							item:item
						}
					}
			    });

			};

		    // cpc preview dialog
			$scope.cpcPreviewDialog = function(ev,item) {

				$scope.status = '';
				$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
			    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

			    var dialogTemplate = '<md-dialog aria-label="{{items.item.title}}">' +
									    '<md-toolbar>' +
									    	'<div class="md-toolbar-tools">' +
										        '<h2>{{items.item.title}}</h2>' +
									    	'</div>' +
									    '</md-toolbar>' +
									    '<md-dialog-content layout-padding>' +
											'<md-content id="cpc-emulator-dialog-contanier" style="width:768px;padding:0">' +
												'<cpc-emulator ng-if="items.item" ng-init="initCpcEmulator(items.item)"></cpc-emulator>' +
											'</md-content>' +
									    '</md-dialog-content>' +
									  '</md-dialog>';

			    $mdDialog.show({
					controller: DialogController,
					template: dialogTemplate,
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose:true,
					fullscreen: useFullScreen,	
					onRemoving:function(){		

					},
					locals: {
						items: {
							item:item
						}
					}
			    });

			};

		    // video preview dialog
			$scope.videoPreviewDialog = function(ev,item) {

				$scope.status = '';
				$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
			    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

				// video player
				var player = {
					autoPlay:true,
					sources: [
						{
							src:'/'+$scope.site_address+'/uploads/videos/'+item.file_name,
							type:'video/'+item.file_type
						}
					],
					theme: "/" + $scope.site_address + "/assets/lib/videos/videogular-themes-default/videogular.css"
				};

			    var dialogTemplate = '<md-dialog aria-label="{{items.item.title}}">' +
									    '<md-toolbar>' +
									    	'<div class="md-toolbar-tools">' +
										        '<h2>{{items.item.title}}</h2>' +
									    	'</div>' +
									    '</md-toolbar>' +
									    '<md-dialog-content layout-padding>' +
											'<md-content id="video-dialog-container" style="width:768px;padding:0">' +
												'<video-player ng-init="initVideoPlayer(items.player)"></video-player>' +
											'</md-content>' +
									    '</md-dialog-content>' +
									  '</md-dialog>';

			    $mdDialog.show({
					controller: DialogController,
					template: dialogTemplate,
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose:true,
					fullscreen: useFullScreen,
					locals: {
						items: {
							item:item,
							player:player
						}
					}
			    });

			};
		};

		// dialog controller
		var DialogController = function($scope, $mdDialog,$rootScope,items) {

			// items
			$scope.items = items;

			$scope.hide = function() {
				$mdDialog.hide();
			};
			
			$scope.cancel = function() {
				$mdDialog.cancel();
			};
			
			$scope.answer = function(answer) {
				$mdDialog.hide(answer);
			};

		    // load script dynamically
			$scope.loadScript = function(url, type, charset) {
			    if (type===undefined) type = 'text/javascript';
			    if (url) {
		            var body = angular.element(document.getElementsByTagName("body"));
	                if (body) {
	                    script = document.createElement('script');
	                    script.setAttribute('src', url);
	                    script.setAttribute('type', type);
	                    if (charset) script.setAttribute('charset', charset);
	                    body.append(script);
	                }
			        return script;
			    }
			};

		};

			var template=  '<div class="container-fluid" id="file-list">' +
								'<form class="form-inline">' +
									'<div class="form-group" id="file-search-form">' +
										'<input id="searchfield" type="text" ng-model="query" class="form-control" placeholder="Search"> ' +
										'[{{(games|filter:query).length}}] Items Per Page :' +
										'<span class="btn btn-primary" ng-click="itemsPerPage=10">10</span>' +
										'<span class="btn btn-primary" ng-click="itemsPerPage=15">15</span>' +
										'<span class="btn btn-primary" ng-click="itemsPerPage=20">20</span>' +
										'<span class="btn btn-primary" ng-click="itemsPerPage=50">50</span> ' +
									'</div> ' +
									'<span class="pull-right"> Total {{games.length}} files  | {{optionalFileList.length}} files in cache </span>' +
								'</form>' +
								'<table class="table table-striped table-hover">' +
									'<thead>' +
										'<tr>' +
											'<th ng-click="sort(\'file_name\')">Filename<span class="glyphicon sort-icon" ng-show="sortKey==\'file_name\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
											'<th ng-click="sort(\'x_is_load\')">in Cache<span class="glyphicon sort-icon" ng-show="sortKey==\'x_is_load\'" ng-class="{\'glyphicon-chevron-up\':reverse,\'glyphicon-chevron-down\':!reverse}"></span></th>' +
											'<th ng-click="sort(\'x_peer\')">peers<span class="glyphicon sort-icon" ng-show="sortKey==\'x_peer\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
											'<th ng-click="sort(\'file_size\')">Size<span class="glyphicon sort-icon" ng-show="sortKey==\'file_size\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
											'<th ng-click="sort(\'media_type\')">Type<span class="glyphicon sort-icon" ng-show="sortKey==\'media_type\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
											'<th ng-click="sort(\'file_type\')">File <span class="glyphicon sort-icon" ng-show="sortKey==\'file_type\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
											'<th ng-click="sort(\'date_added\')">Date<span class="glyphicon sort-icon" ng-show="sortKey==\'date_added\'" ng-class="{\'glyphicon-chevron-up\':reverse,\'glyphicon-chevron-down\':!reverse}"></span></th>' +
											'<th ng-if="owner">Action</th>' +
										'</tr>' +
									'</thead>' +
									'<tr dir-paginate="item in games|orderBy:sortKey:reverse|filter:query |itemsPerPage:itemsPerPage track by $index">' +
										'<td ng-if="item.file_type !== \'zip\'"><a href="/{{page.site_info.address}}/view.html?type={{item.media_type}}-c={{site.address}}g={{item.game_id}}z=f={{item.file_name}}">{{item.file_name}}</a></td>' +
										'<td ng-if="item.file_type === \'zip\'"><a href="/{{page.site_info.address}}/view.html?type={{item.media_type}}-c={{site.address}}g={{item.game_id}}z={{item.zip_name}}f={{item.file_name}}">{{item.zip_name}}</a></td>' +
										'<td><span ng-if="item.x_is_load" style="color:green">\u2713</span></td>' +
										'<td><span ng-if="item.x_peer" >{{item.x_peer}}</span> </td>' +
								    	'<td>{{item.file_size|filesize}}</td>' +
								    	'<td>{{item.media_type}}</td>' +
								    	'<td>{{item.file_type}}</td>' +
										'<td><i am-time-ago="item.date_added"></i></td>' +
										'<td ng-if="owner">' +
											'<span ng-click="deleteFile(item)" class="glyphicon glyphicon-trash"></span>' +
											'<a href="/{{site_address}}/edit.html?item={{item.game_id}}type={{item.media_type}}">' +
											'<span class="glyphicon glyphicon-pencil"></span></a>' +
										'</td>' +
									'</tr>' +
								'</table>' +
								'<dir-pagination-controls max-size="10" direction-links="true" boundary-links="true"></dir-pagination-controls>' +
							'</div';


		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);