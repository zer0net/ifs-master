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
		    };

		    // render file list item
		    $scope.renderFileListItem = function(item){
		    	if (item){
			    	item.edit_url = '/' + $scope.page.site_info.address + '/user/edit.html?item=';
			    	item.view_url = '/' + $scope.page.site_info.address + '/view.html?type=';
			    	if (item.media_type === 'game'){
			    		item.edit_url += item.game_id + 'type=' + item.media_type;
			    		item.view_url += 'game-c=' + $scope.site.address + 'g=' + item.game_id + 'z=' + item.zip_name + 'f=' + item.file_name;
			    	} else if (item.media_type === 'video'){
			    		item.edit_url += item.video_id + 'type=' + item.media_type;
			    		item.view_url += 'video-c=' + $scope.site.address + 'v=' + item.video_id;
			    	}
		    	}
		    };
			
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

		};


		var template=  '<div class="container-fluid" id="file-list">' +							
							'<form class="form-inline">' +
								'<div class="form-group" id="file-search-form">' +
									'<input id="searchfield" type="text" ng-model="query" class="form-control" placeholder="Search"> ' +
									'[{{(ch_files.files|filter:query).length}}] Items Per Page :' +
									'<span class="btn btn-primary" ng-click="itemsPerPage=10">10</span>' +
									'<span class="btn btn-primary" ng-click="itemsPerPage=15">15</span>' +
									'<span class="btn btn-primary" ng-click="itemsPerPage=20">20</span>' +
									'<span class="btn btn-primary" ng-click="itemsPerPage=50">50</span> ' +
								'</div> ' +
								'<span class="pull-right"> Total {{ch_files.total}} files | {{ch_files.total_downloaded}} files in cache </span>' +
							'</form>' +
							'<table class="table table-striped table-hover">' +
								'<thead>' +
									'<tr>' +
										'<th ng-click="sort(\'file_name\')">Filename<span class="glyphicon sort-icon" ng-show="sortKey==\'file_name\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'is_loaded\')">in Cache<span class="glyphicon sort-icon" ng-show="sortKey==\'is_loaded\'" ng-class="{\'glyphicon-chevron-up\':reverse,\'glyphicon-chevron-down\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'peers\')">peers<span class="glyphicon sort-icon" ng-show="sortKey==\'peers\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'file_size\')">Size<span class="glyphicon sort-icon" ng-show="sortKey==\'file_size\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'content_type\')">Type<span class="glyphicon sort-icon" ng-show="sortKey==\'media_type\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'file_type\')">File <span class="glyphicon sort-icon" ng-show="sortKey==\'file_type\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'date_added\')">Date<span class="glyphicon sort-icon" ng-show="sortKey==\'date_added\'" ng-class="{\'glyphicon-chevron-up\':reverse,\'glyphicon-chevron-down\':!reverse}"></span></th>' +
										'<th ng-if="owner">Action</th>' +
									'</tr>' +
								'</thead>' +
								'<tr dir-paginate="item in ch_files.files | orderBy:sortKey:reverse | filter:query | itemsPerPage:itemsPerPage track by $index" ng-init="renderFileListItem(item)">' +
									'<td><a href="{{item.view_url}}">{{item.file_name}}</a></td>' +
									'<td><span ng-if="item.is_loaded" style="color:green">\u2713</span></td>' +
									'<td><span>{{item.peers}}</span> </td>' +
							    	'<td>{{item.file_size|filesize}}</td>' +
							    	'<td>{{item.content_type}}</td>' +
							    	'<td>{{item.file_type}}</td>' +
									'<td><i am-time-ago="item.date_added"></i></td>' +
									'<td>' +
										'<span ng-click="deleteFile(item)" class="glyphicon glyphicon-trash"></span>' +
										'<a href="{{item.edit_url}}">' +
										'<span class="glyphicon glyphicon-pencil"></span></a>' +
									'</td>' +
								'</tr>' +
							'</table>' +
							'<dir-pagination-controls max-size="10" direction-links="true" boundary-links="true"></dir-pagination-controls>' +
						'</div>';


		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);