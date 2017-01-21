app.directive('channelRegisterList', ['$location','$rootScope',
	function($location,$rootScope) {

		// interface controller
		var controller = function($scope,$element) {
			$scope.itemsPerPage = 10;
			$scope.sortKey = 'date_added';
			$scope.reverse = true;			
		    
		    console.log($scope.channels);

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

		var template=  '<div class="container-fluid" id="channel-register-list">' +			
							'<div class="section-header">'+
								'<h2>Channels</h2>'+
								'<span class="label" ng-hide="loading">total: <span ng-bind="channels.length"></span></span>'+
								'<hr/>'+
							'</div>'+				
							'<table class="table table-striped table-hover">' +
								'<thead>' +
									'<tr>' +
										'<th ng-click="sort(\'channel_name\')">Name<span class="glyphicon sort-icon" ng-show="sortKey==\'channel_name\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'channel_address\')">Address<span class="glyphicon sort-icon" ng-show="sortKey==\'channel_address\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'channel_description\')">Description<span class="glyphicon sort-icon" ng-show="sortKey==\'channel_description\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'date_added\')">Date<span class="glyphicon sort-icon" ng-show="sortKey==\'date_added\'" ng-class="{\'glyphicon-chevron-up\':reverse,\'glyphicon-chevron-down\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'games\')">Games<span class="glyphicon sort-icon" ng-show="sortKey==\'games\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'videos\')">Videos<span class="glyphicon sort-icon" ng-show="sortKey==\'videos\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
										'<th ng-if="owner">Action</th>' +
									'</tr>' +
								'</thead>' +
								'<tr dir-paginate="channel in channels|orderBy:sortKey:reverse|itemsPerPage:itemsPerPage track by $index">' +
									'<td><a href="/{{channel.channel_address}}/">{{channel.channel_name}}</a></td>' +
									'<td>{{channel.channel_address}}</td>' +
									'<td>{{channel.channel_description }}</td>' +
									'<td><span am-time-ago="channel.date_added"></span></td>' +
									'<td>{{channel.games.length}}</td>' +
									'<td>{{channel.videos.length}}</td>' +
									'<td ng-if="owner">'+
									'<a class="pull-right" ng-if="owner" ng-click="toggleChannel(channel,$index)">'+
										'<button class="btn btn-primary" ng-if="channel.hide==0"><span class="glyphicon glyphicon-minus">Hide</span></button>'+
										'<button class="btn btn-primary" ng-if="channel.hide==1" ><span class="glyphicon glyphicon-plus">Show</span></button>'+
									'</a>'+
									'</td>' +							    	
								'</tr>' +
							'</table>' +
							'<dir-pagination-controls max-size="10" direction-links="true" boundary-links="true"></dir-pagination-controls>' +
						'</div>';					

		return {
			restrict: 'AE',
			controller:controller,
			template:template,
			replace:false
		}

	}
]);