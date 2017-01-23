app.directive('channelRegisterPreview', ['$location','$rootScope',
	function($location,$rootScope) {

		// interface controller
		var controller = function($scope,$element) {
			
			console.log($scope.channel);	   
				$scope.itemsPerPage = 10;
				$scope.sortKey = 'title';
				$scope.reverse = true;			
			    			  
				// sort file list
				$scope.sort = function(keyname){
					if($scope.sortKey==keyname) {
						$scope.reverse = !$scope.reverse; //if true make it false and vice versa	
					} else {
						$scope.sortKey = keyname;   //set the sortKey to the param passed				
						$scope.reverse=false;									
						if ($scope.sortKey=='date_added') $scope.reverse=true; // special case
					}			
			    };		 

		};

		var template= '<div class="container-fluid" id="channel-register-preview">' +			
							'<div class="section-header">'+
								'<h2>{{channel.channel_name}}</h2>'+
								'<p>{{channel.channel_description}}</p>'+
								'<span class="label" ng-hide="loading">total: <span ng-bind="channel.items.length"></span></span>'+
								'<hr/>'+
							'</div>'+				
							'<table class="table table-striped table-hover">' +
								'<thead>' +
									'<tr>' +
										'<th ng-click="sort(\'file_name\')">Name<span class="glyphicon sort-icon" ng-show="sortKey==\'file_name\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'file_type\')">File<span class="glyphicon sort-icon" ng-show="sortKey==\'file_type\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'media_type\')">Type<span class="glyphicon sort-icon" ng-show="sortKey==\'media_type\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'date_added\')">Date<span class="glyphicon sort-icon" ng-show="sortKey==\'date_added\'" ng-class="{\'glyphicon-chevron-up\':reverse,\'glyphicon-chevron-down\':!reverse}"></span></th>' +										
									'</tr>' +
								'</thead>' +
								'<tr dir-paginate="item in channel.items|orderBy:sortKey:reverse|itemsPerPage:itemsPerPage track by $index" pagination-id="channel-register-preview-pid">' +
									'<td>{{item.file_name}}</td>' +
									'<td>{{item.file_type}}</td>' +
									'<td>{{item.media_type }}</td>' +
									'<td><span am-time-ago="item.date_added"></span></td>' +									
								'</tr>' +
							'</table>' +
							'<dir-pagination-controls max-size="10" direction-links="true" boundary-links="true" pagination-id="channel-register-preview-pid"></dir-pagination-controls>' +
						'</div>';	

		var template_ = '<h2 ng-bind="channel.channel_name"></h2>'+
				 		'<p ng-bind="channel.channel_description"></p>'+
				    	'<hr/>'+

				    	'<!-- channel items -->'+
					    '<ul class="item-list">'+
					    	'<li ng-repeat="game in channel.items track by $index | orderBy:\'-date_added\'">'+
					    		'<div class="game-info">'+
							    	'<span ng-bind="game.title" class="title"></span> • '+
									'<span class="zip-name">{{game.zip_name}}</span> • '+
									'<span class="zip-size">{{game.zip_size}}</span> • '+
									'<span class="file-name">{{game.file_name}}</span> • '+
									'<span><i am-time-ago="video.date_added"></i></span>'+
								'</div>'+
					    	'</li>'+
					    '</ul>';

		return {
			restrict: 'AE',
			template:template,
			controller:controller,
			replace:false
		}

	}
]);