app.directive('channelRegisterList', ['$location','$rootScope','Central',
	function($location,$rootScope,Central) {

		// interface controller
		var controller = function($scope,$element) {

			$scope.initChannelsList = function(){
				// config list 
				$scope.itemsPerPage = 10;
				$scope.sortKey = 'date_added';
				$scope.reverse = true;	
				$scope.query = '';	
				$scope.selectedCluster=null;
				$scope.moderations_on = true;
				var cluster_id = $location.$$absUrl.split('cluster:')[1].split('&')[0];
				if (cluster_id){
					var cluster =Central.findClusterByAddress(cluster_id,$scope.clusters);
					$scope.onFilterCluster(cluster);
				}
			};
		    		    
		    // on filter channel
		    $scope.onFilterChannel = function(channel) {
		    	// on filter channel
		    	$rootScope.$broadcast('onFilterChannel',channel);
		    };

		    // on filter cluster
		    $scope.onFilterCluster = function(cluster) {
		    	// on filter cluster		 
		    	if(cluster=='all'){
		    		$scope.query='';
		    		$scope.selectedCluster=null;
		    	}else{
		    		$scope.query = {cluster_id:cluster.address};
		    		$scope.selectedCluster=cluster;   		
		    	}		    	
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
			// distribute cluster files
			$scope.distrubuteClusterFiles = function(cluster){
				console.log(cluster.settings.autodownloadoptional);
				if (cluster.settings.autodownloadoptional === false){
					Page.cmd("optionalHelpAll",[true, cluster.address],function(res){
						$scope.$apply(function(){
							console.log(res);
						});
					});
				} else if (cluster.settings.autodownloadoptional === true) {
					Page.cmd("optionalHelpAll",[false, cluster.address],function(res){
						$scope.$apply(function(){
							console.log(res);
						});
					});
				}
			};

			// seed all clusters
			$scope.seedAllClusters = function(){
				console.log($scope.cl_id);
				console.log($scope.clusters);
				Page.cmd("mergerSiteAdd",[$scope.cl_id],function(data){
					Page.cmd("wrapperNotification", ["info", "refresh this site to view new content", 10000]);
				});
			};

		};

		var template=  '<div ng-init="initChannelsList()" channels class="container" id="channel-register-list">' +								
							/*'<ul class="item-clusters">' +	
								'<li><a ng-class="{selected:selectedCluster==null}"  ng-click="onFilterCluster(\'all\')">ALL</a></li>' +					
								'<li ng-repeat="c in clusters"><a ng-class="{selected:selectedCluster.address==c.address}" ng-bind="c.content.title" ng-click="onFilterCluster(c)"></a></li>' +							
							'</ul>' +*/
							'<div class="section-header">'+
								'<h2 ng-if="selectedCluster">' +
									'<span class="cluster-title" ng-bind="selectedCluster.content.title"></span>' +
									'<md-switch class="md-primary" md-no-ink aria-label="Switch No Ink" ng-click="distrubuteClusterFiles(selectedCluster)" ng-model="selectedCluster.settings.autodownloadoptional">' +
										'<span>Help distribute all files</span>' +
									'</md-switch>' +
								'</h2>' +
								'<h2 ng-if="!selectedCluster"><span style="float:left;">ALL</span><small style="margin-top:-8px; float:right;"><md-button class="md-primary md-raised edgePadding pull-right" ng-click="seedAllClusters()">Access	 all Clusters of this server</a></md-button></small></h2>'+
								'<span class="label" ng-hide="loading">Channels: <span>{{(channels | filter:query).length }}</span></span>'+
								'<hr/>'+
							'</div>'+				
							'<table channels ng-init="getChannels(moderations_on)" class="table table-striped table-hover table-sm">' +
								'<thead>' +
									'<tr>' +
										'<th ng-click="sort(\'channel_name\')">Channel Name<span class="glyphicon sort-icon" ng-show="sortKey==\'channel_name\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +										
										'<th ng-click="sort(\'channel_description\')">Description<span class="glyphicon sort-icon" ng-show="sortKey==\'channel_description\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'date_added\')">Date<span class="glyphicon sort-icon" ng-show="sortKey==\'date_added\'" ng-class="{\'glyphicon-chevron-up\':reverse,\'glyphicon-chevron-down\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'audios\')">Audio<span class="glyphicon sort-icon" ng-show="sortKey==\'audios\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'books\')">Books<span class="glyphicon sort-icon" ng-show="sortKey==\'books\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'games\')">Games<span class="glyphicon sort-icon" ng-show="sortKey==\'games\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
										'<th ng-click="sort(\'videos\')">Videos<span class="glyphicon sort-icon" ng-show="sortKey==\'videos\'" ng-class="{\'glyphicon-chevron-down\':reverse,\'glyphicon-chevron-up\':!reverse}"></span></th>' +
									'</tr>' +
								'</thead>' +
								'<tr dir-paginate="channel in channels|orderBy:sortKey:reverse | filter:query |itemsPerPage:itemsPerPage track by $index" pagination-id="channel-register-list-pid" moderations ng-if="channel.hide !== 1 || channel.hide === 1 && page.site_info.settings.own">' +
									'<td><a href="/{{page.site_info.address}}/index.html?route:main+id:{{channel.channel_address}}">{{channel.channel_name}}</a></td>' +									
									'<td>{{channel.channel_description }}</td>' +
									'<td><span am-time-ago="channel.date_added"></span></td>' +
									'<td><span ng-if="channel.audio_count > 0" ng-bind="channel.audio_count"></span></td>' +
									'<td><span ng-if="channel.book_count > 0" ng-bind="channel.book_count"></span></td>' +
									'<td><span ng-if="channel.game_count > 0" ng-bind="channel.game_count"></span></td>' +
									'<td><span ng-if="channel.video_count > 0" ng-bind="channel.video_count"></span></td>' +						    	
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