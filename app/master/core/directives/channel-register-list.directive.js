app.directive('channelRegisterList', ['$location','$rootScope',
	function($location,$rootScope) {

		// interface controller
		var controller = function($scope,$element) {
			$scope.itemsPerPage = 10;
			$scope.sortKey = 'date_added';
			$scope.reverse = true;	
			$scope.query='';		
		    		    
		    // on filter channel
		    $scope.onFilterChannel = function(channel) {
		    	// on filter channel
		    	$rootScope.$broadcast('onFilterChannel',channel);
		    };

		    // on filter cluster
		    $scope.onFilterCluster = function(cluster) {
		    	// on filter cluster		    	
		    	$scope.query = {cluster_id:cluster.cluster_id};		    	
		    };
			// sort file list
			$scope.sort = function(keyname){
				if($scope.sortKey==keyname) {
					$scope.reverse = !$scope.reverse; //if true make it false and vice versa	
				} else {
					$scope.sortKey = keyname;   //set the sortKey to the param passed				
					$scope.reverse=false;									
					if ($scope.sortKey=='date_added'||$scope.sortKey=='games'||$scope.sortKey=='videos') $scope.reverse=true; // special case
				}			
		    };		   
		};

		var template=  '<div class="container" id="channel-register-list">' +								
							'<ul class="item-clusters">' +	
								'<li><h3>Clusters</h3></li>' +							
								'<li ng-repeat="c in clusters"><a class="selected" ng-bind="c.title" ng-click="onFilterCluster(c)"></a></li>' +							
							'</ul>' +
							'<div class="section-header">'+
								'<h2>Channels</h2>'+
								'<span class="label" ng-hide="loading">total: <span>{{(channels | filter:query).length }}</span></span>'+
								'<hr/>'+
							'</div>'+				
							'<table class="table table-striped table-hover table-sm">' +
								'<thead>' +
									'<tr>' +
										'<th ng-click="sort(\'channel_name\')">Name<span class="glyphicon sort-icon" ng-show="sortKey==\'channel_name\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +										
										'<th ng-click="sort(\'channel_description\')">Description<span class="glyphicon sort-icon" ng-show="sortKey==\'channel_description\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'date_added\')">Date<span class="glyphicon sort-icon" ng-show="sortKey==\'date_added\'" ng-class="{\'glyphicon-chevron-up\':reverse,\'glyphicon-chevron-down\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'audios\')">Audios<span class="glyphicon sort-icon" ng-show="sortKey==\'audios\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'books\')">Books<span class="glyphicon sort-icon" ng-show="sortKey==\'books\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'games\')">Games<span class="glyphicon sort-icon" ng-show="sortKey==\'games\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'videos\')">Videos<span class="glyphicon sort-icon" ng-show="sortKey==\'videos\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
										'<th ng-if="page.site_info.settings.own">Action</th>' +
									'</tr>' +
								'</thead>' +
								'<tr dir-paginate="channel in channels|orderBy:sortKey:reverse | filter:query |itemsPerPage:itemsPerPage track by $index" pagination-id="channel-register-list-pid" moderations ng-if="channel.hide !== 1 || channel.hide === 1 && page.site_info.settings.own">' +
									'<td><a ng-click="onFilterChannel(channel)">{{channel.channel_name}}</a></td>' +									
									'<td>{{channel.channel_description }}</td>' +
									'<td><span am-time-ago="channel.date_added"></span></td>' +
									'<td>{{channel.items.audios.length}}</td>' +
									'<td>{{(channel.items.books.length==0)?"":channel.items.books.length}}</td>' +
									'<td>{{channel.items.games.length}}</td>' +
									'<td>{{channel.items.videos.length}}</td>' +
									'<td ng-if="page.site_info.settings.own" >'+
										'<a class="pull-right" ng-click="toggleChannelVisibility(channel)">'+
											'<button class="btn btn-primary" ng-if="!channel.hide || channel.hide === 0"><span class="glyphicon glyphicon-minus">Hide</span></button>'+
											'<button class="btn btn-primary" ng-if="channel.hide==1" ><span class="glyphicon glyphicon-plus">Show</span></button>'+
										'</a>'+
									'</td>' +							    	
								'</tr>' +
							'</table>' +
							'<dir-pagination-controls max-size="10" direction-links="true" boundary-links="true" pagination-id="channel-register-list-pid"></dir-pagination-controls>' +
						'</div>';					

		return {
			restrict: 'AE',
			controller:controller,
			template:template,
			replace:false
		}

	}
]);