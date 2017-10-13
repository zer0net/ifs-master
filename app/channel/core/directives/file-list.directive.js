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
			
		    // edit item
		    $scope.onEditItem = function(item){
		    	var view = 'edit';
		    	$scope.routeUserView(view,item);
		    };

		    // delete File
		    $scope.deleteFile = function(item){
		    	var file_name_field;
		    	if (item.file_type === 'zip'){
		    		file_name_field = 'zip_name';
		    	} else {
		    		file_name_field = 'file_name';
		    	}
		    	$scope.onDeleteItem(item,file_name_field);
		    };

		};


		var template=  '<div class="container-fluid" id="file-list">' +
							'<form class="form-inline file-list-top-form">' +
								'<div class="form-group" id="file-search-form">' +
									'<input id="searchfield" type="text" ng-model="query" class="form-control" placeholder="Search" style="margin-right: 8px; margin-bottom:8px;"> ' +
									'[{{(ch_files.files|filter:query).length}}] Items Per Page :' +
									'<span class="btn btn-primary" ng-click="itemsPerPage=10">10</span>' +
									'<span class="btn btn-primary" ng-click="itemsPerPage=15">15</span>' +
									'<span class="btn btn-primary" ng-click="itemsPerPage=20">20</span>' +
									'<span class="btn btn-primary" ng-click="itemsPerPage=50">50</span> ' +
								'</div> ' +
								'<span class="pull-right" style="margin: 10px;"> Total {{ch_files.total}} files | {{ch_files.total_downloaded}} files in cache </span>' +
							'</form>' +
							'<section class="channel-file-list">' +
								'<div class="list-header" layout="row">' +
									'<div flex="50"><a ng-click="sort(\'title\')">Title / Filename <span class="glyphicon sort-icon" ng-show="sortKey==\'title\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></a></div>' +
									'<div flex="10"><a ng-click="sort(\'is_loaded\')">In Cache<span class="glyphicon sort-icon" ng-show="sortKey==\'is_loaded\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></a></div>' +
									'<div flex="5"><a ng-click="sort(\'peers\')">Peers<span class="glyphicon sort-icon" ng-show="sortKey==\'peers\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></a></div>' +
									'<div flex="10"><a ng-click="sort(\'file_size\')">Size<span class="glyphicon sort-icon" ng-show="sortKey==\'file_size\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></a></div>' +
									'<div flex="5"><a ng-click="sort(\'content_type\')">Type<span class="glyphicon sort-icon" ng-show="sortKey==\'content_type\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></a></div>' +
									'<div flex="10"><a ng-click="sort(\'file_type\')">Filetype<span class="glyphicon sort-icon" ng-show="sortKey==\'file_type\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></a></div>' +
									'<div flex="10"><a ng-click="sort(\'date_added\')">Date<span class="glyphicon sort-icon" ng-show="sortKey==\'date_added\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></a></div>' +
									'<div flex="10">Action</div>' +
								'</div>' +
								'<div class="list-item" layout="row" dir-paginate="item in ch_files.files | orderBy:sortKey:reverse | filter:query | itemsPerPage:itemsPerPage track by $index">' +
									'<div flex="50">' +
										'<a href="/{{page.site_info.address}}/index.html?route:item+id:{{item.item_id}}+type:{{item.content_type}}">{{item.title}}</a><br/>' +
										'<small>{{item.file_name}}</small>' +
									'</div>' +
									'<div flex="10"><span ng-if="item.is_loaded" style="color:green">\u2713</span></div>' +
									'<div flex="5"><span>{{item.peers}}</span> </div>' +
							    	'<div flex="10">{{item.file_size|filesize}}</div>' +
							    	'<div flex="5">{{item.content_type}}</div>' +
							    	'<div flex="10">{{item.file_type}}</div>' +
									'<div flex="10"><i am-time-ago="item.date_added"></i></div>' +
									'<div flex="10" class="list-item-actions">' +
										'<a ng-click="onEditItem(item)"><span class="glyphicon glyphicon-pencil"></span></a>' +
										'<a ng-click="deleteFile(item)" class="glyphicon glyphicon-trash"></a>' +
									'</div>' +
								'</div>' +
							'</section>' +
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