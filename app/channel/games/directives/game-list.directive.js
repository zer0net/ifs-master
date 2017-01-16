app.directive('gameList', ['$mdDialog','$mdMedia',
	function($mdDialog,$mdMedia) {

		// game interface controller
		var controller = function($scope,$element) {

			$scope.itemsPerPage=15;

			$scope.sortKey='file_name';
			$scope.reverse=false;

			$scope.sort = function(keyname){
				
				if($scope.sortKey==keyname)
				{
					$scope.reverse = !$scope.reverse; //if true make it false and vice versa	
				}else
				{
					$scope.sortKey = keyname;   //set the sortKey to the param passed				
					$scope.reverse=false;					
					if($scope.sortKey=='date_added' || $scope.sortKey=='x_peer'||$scope.sortKey=='x_is_load') $scope.reverse=true; // special case
				}			
		    }

		    //$scope.games = $scope.directories[0].files;
		    $scope.games=$scope.chJson.games;

			
		    // game preview dialog
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
											'<md-content id="dosbox-dialog-contaner" style="width:700px;">' +
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

		    // game preview dialog
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
											'<md-content id="nes-emulator-dialog-contaner" style="width:700px;">' +
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

						if($scope.nes.isRunning)
						{
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

		};

			var template=  '<div class="container"><form class="form-inline"><div class="form-group"><label >Search</label><input id="searchfield" type="text" ng-model="query" class="form-control" placeholder="Search"> [{{(games|filter:query).length}}] Items Per Page:<span  class="btn btn-primary" ng-click="itemsPerPage=10">10</span>&nbsp;&nbsp;<span  class="btn btn-primary" ng-click="itemsPerPage=15">15</span>&nbsp;&nbsp;<span class="btn btn-primary" ng-click="itemsPerPage=20">20</span>&nbsp;&nbsp;<span class="btn btn-primary" ng-click="itemsPerPage=50">50</span> </div> <span class="pull-right"> Total {{games.length}} files  | {{optionalFileList.length}} files in cache </span></form>'+							
							'<table class="table table-striped table-hover"><thead><tr><th ng-click="sort(\'file_name\')">Title<span class="glyphicon sort-icon" ng-show="sortKey==\'title\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>'+
							'<th ng-click="sort(\'x_is_load\')">in Cache<span class="glyphicon sort-icon" ng-show="sortKey==\'x_is_load\'" ng-class="{\'glyphicon-chevron-up\':reverse,\'glyphicon-chevron-down\':!reverse}"></span></th>'+
							'<th ng-click="sort(\'x_peer\')">peers<span class="glyphicon sort-icon" ng-show="sortKey==\'x_peer\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>'+							
							'<th ng-click="sort(\'file_size\')">Size<span class="glyphicon sort-icon" ng-show="sortKey==\'file_size\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>'+
							'<th ng-click="sort(\'date_added\')">Date<span class="glyphicon sort-icon" ng-show="sortKey==\'date_added\'" ng-class="{\'glyphicon-chevron-up\':reverse,\'glyphicon-chevron-down\':!reverse}"></span></th>'+
							'<th ng-if="owner">Action</th></tr></thead>' +
							'<tr ' +
								'dir-paginate="item in games|orderBy:sortKey:reverse|filter:query |itemsPerPage:itemsPerPage track by $index">' +									
									'<td ng-click="nesPreviewDialog($event,item)" >{{item.file_name}}</td>'+
									'<td><span ng-if="item.x_is_load" style="color:green">\u2713</span></td>'+
									'<td><span ng-if="item.x_peer" >{{item.x_peer}}</span> </td>'+
							    	'<td>{{item.file_size|filesize}}</td>' +
									'<td><i am-time-ago="item.date_added"></i></td>' +
									'<td ng-if="owner">'+
									'<span ng-click="deleteGame(item)" class="glyphicon glyphicon-trash"></span>' +
									'<a href="/{{site_address}}/edit.html?item={{item.game_id}}type=game">' +
									'<span class="glyphicon glyphicon-pencil"></span></a>' +
									'<span ng-click="gamePreviewDialog($event,item)" class="glyphicon glyphicon-eye-open"></span>' +
									'</td>'+
							'</tr>' +
							'</table>'+
							'<dir-pagination-controls max-size="10" direction-links="true" boundary-links="true" > </dir-pagination-controls>'+						
							'</div>';


		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);