app.directive('sidebar', ['$rootScope','$timeout','Channel',
	function($rootScope,$timeout,Channel) {

		// header directive controller
		var controller = function($scope,$element) {

			// render channel item
			$scope.renderChannelItem = function(channel){
				// channel logo
				if (channel.logo_file !== null){
					channel.logo_path = '/'+$scope.page.site_info.address+'/merged-'+$scope.page.site_info.content.merger_name + '/' + channel.cluster_id + '/data/users/' + channel.channel_address.split('_')[1] + '/' + channel.logo_file;
					var logo_file = Channel.getChannelLogoSiteFile(channel,$scope.clusters);
					if (!logo_file){
						$scope.forceFileDownload(channel.logo_path);
					}
				}
			};

			// force file download
			$scope.forceFileDownload = function(inner_path,item){
				// xhttp get dos file
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState === 4){
						console.log("file ready");
					} else {
						console.log("file not found!");
					}
				};
				xhttp.open("GET", inner_path, true);
				xhttp.send();
			};

			// on filter channel
			$scope.onFilterChannel = function(channel) {
				$scope.channel_id = channel.channel_address;
				var route = 'main';
				$scope.routeSite(route);
				if ($scope.channel){
					$scope.removeFilterChannel();
					$timeout(function () {
						$scope.filterChannel(channel);
						$rootScope.$broadcast('onFilterChannel',$scope.channel);
					});
				} else {
					$scope.filterChannel(channel);
					$rootScope.$broadcast('onFilterChannel',$scope.channel);				
				}
			};

			// on remove filter channel
			$scope.onRemoveFilterChannel = function(){
				delete $scope.channel_id;
				$scope.removeFilterChannel();
				$rootScope.$broadcast('onRemoveFilterChannel',$scope.channel);
			};

		};

		var template =  '<div ng-if="!loading" id="sidebar-wrapper">' + 
							'<ul class="sidebar-nav">' +
								'<li>Clusters<br/><hr/></li>' +
								'<li><a href="/{{page.site_info.address}}/index.html?route:channels">All</a></li>' +
								'<li ng-repeat="cluster in clusters"><a href="/{{page.site_info.address}}/index.html?route:channels+cluster:{{cluster.cluster_id}}">{{cluster.content.title}}</button></a></li>' 
							'</ul>'+ //
						'</div>';
		
		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);