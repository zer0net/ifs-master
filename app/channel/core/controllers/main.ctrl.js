app.controller('ChannelMainCtrl', ['$scope','$rootScope','$location','$window','Channel','Central',
	function($scope,$rootScope,$location,$window,Channel,Central) {

		/** INIT **/

			// init user section
			$scope.init = function(channel){
				$scope.showLoadingMsg('Loading User Channels');
				var query = ["SELECT * FROM channel WHERE channel_address LIKE '%"+$scope.page.site_info.auth_address+"'"];
				Page.cmd("dbQuery",query,function(u_channels){
					$scope.$apply(function(){
						if (u_channels.length > 0){
							// render channel list
							$scope.u_channels = Channel.renderChannels(u_channels);
							// assign current user channel
							$scope.assignCurrentUserChannel(channel);
						} else {
							$scope.no_channels = true;
							// cluster
							$scope.clusters.forEach(function(cluster,index){
								if ($scope.config.cluster.cluster_id === cluster.address){
									$scope.cluster = cluster;
								}
							});							
							// inner path
							$scope.inner_path = 'merged-'+$scope.page.site_info.content.merger_name+'/'+$scope.config.cluster.cluster_id+'/data/users/'+$scope.page.site_info.auth_address+'/';
							// route user section
							$scope.routeUserView();
						}
					});
				});
			};

			// assign current user site
			$scope.assignCurrentUserChannel = function(channel,cluster){
				delete $scope.channel;
				if (channel){
					$scope.channel = channel;
				} else if ($scope.path.indexOf('route:user+cl:') > -1){
					// cluster address
					var cluster_id = $scope.path.split('+cl:')[1].split('+')[0];
					// channel address
					var channel_address = $scope.path.split('+ch:')[1];
					// url suffix for inner links
					$scope.url_suffix = '?route:user+cl:' + $scope.path.split('+cl:')[1];
					// find channel by channel address
					$scope.channel = Channel.findChannelByAddress($scope.u_channels,channel_address,cluster_id);
				} else {
					if (!cluster){
						// apply first channel to scope
						$scope.channel = $scope.u_channels[0];
					} else {
						$scope.no_channels = true;					
					}
				}
				if (!$scope.no_channels){
					// cluster
					$scope.clusters.forEach(function(cluster,index){
						if ($scope.channel.cluster_id === cluster.address){
							$scope.cluster = cluster;
						}
					});
					// inner path
					$scope.inner_path = 'merged-'+$scope.page.site_info.content.merger_name+'/'+$scope.cluster.cluster_id+'/data/users/'+$scope.page.site_info.auth_address+'/';
					// url suffix for inner links
					$scope.url_suffix = '?cl=' + $scope.channel.cluster_id + '+ch=' + $scope.channel.channel_address;
					// get channel items
					$scope.getChannelItems();
				} else {
					$scope.inner_path = 'merged-'+$scope.page.site_info.content.merger_name+'/'+$scope.cluster.cluster_id+'/data/users/'+$scope.page.site_info.auth_address+'/';
					$scope.routeUserView();					
				}
			};

			// get channel items
			$scope.getChannelItems = function(){
				$scope.showLoadingMsg('Loading ' + $scope.channel.channel_name + ' Channel Items');
				var query = ["SELECT * FROM item WHERE item.channel='"+$scope.channel.channel_address+"'"];
				Page.cmd("dbQuery", query, function(items){
					$scope.$apply(function(){
						$scope.items = items;
						$scope.getChannelFilesInfo();
					});
				});
			};

			// get channel files list
			$scope.getChannelFilesInfo = function(){
				// get optional file list
				Page.cmd("optionalFileList", { address: $scope.channel.cluster_id, limit:2000 }, function(site_files){
					$scope.$apply(function(){
						// render channel files
						$scope.cluster.site_files = site_files;
						$scope.ch_files = Channel.renderChannelFiles(site_files,$scope.items,$scope.channel);
						// route user view
						$scope.routeUserView();
					});					
				});
			};

			// route user view
			$scope.routeUserView = function(view, item){
				if (view) { 
					$scope.user_view = view; 
					if (item) $scope.item = item;
				} else { 
					$scope.user_view = 'main'; 
					delete $scope.item;
				}
				console.log("route user view");
				$scope.finishLoading();
			};

			// set cluster
			$scope.setCluster = function(cluster){
				$scope.cluster = cluster;
				$scope.inner_path = 'merged-'+$scope.page.site_info.content.merger_name+'/'+cluster.address+'/data/users/'+$scope.page.site_info.auth_address+'/';
				$scope.no_channels = true;
			};

			$rootScope.$on('onRouteUserView',function(event,mass){
				$scope.routeUserView(mass);
			});

			$scope.uploadView = function(){
				var view = 'upload';
				$scope.routeUserView(view);
			};

		/** INIT **/

		/** UPDATE CHANNEL **/

			// publish site
			$scope.publishSite = function(inner_path,channel){
				$scope.showLoadingMsg('updating content.json');
				if (inner_path){ $scope.inner_path = inner_path }
				if (channel){ $scope.channel = channel; }
				// get content.json
				Page.cmd("fileGet", { "inner_path": $scope.inner_path + 'content.json', "required": false },function(contentJson) {
					// add optional attribute if doesnt exist
					contentJson = JSON.parse(contentJson);
					if (contentJson){
						contentJson.optional = Central.generateContentJsonOptionalList($scope.config.file_types);
					}
					// write content.json to file
					var json_raw = unescape(encodeURIComponent(JSON.stringify(contentJson, void 0, '\t')));
					Page.cmd("fileWrite", [$scope.inner_path + 'content.json', btoa(json_raw)], function(res) {
						// publish content.json
						Page.cmd("sitePublish",{"inner_path":$scope.inner_path + 'content.json'}, function(res) {
							// apply to scope
							$scope.$apply(function(){
								Page.cmd("wrapperNotification", ["done", "Channel Published!",10000]);
								var cluster_id;
								if ($scope.channel && !$scope.channel.cluster_id){
									cluster_id = $scope.config.cluster.cluster_id;
								} else {
									cluster_id = $scope.channel.cluster_id;
								}
								$window.location.href = '/'+ $scope.page.site_info.address +'/index.html?route:user+cl:'+ cluster_id + '+ch:' + $scope.channel.channel_address;
							});
						});
					});
				});
			};

			// republish site
			$scope.republishSite = function(inner_path,channel){
				$scope.showLoadingMsg('updating data.json');
				if (inner_path){ $scope.inner_path = inner_path }
				if (channel){ $scope.channel = channel; }
				// set timeout for info message
				$scope.setInfoMsgTimeOut();	
				// get content.json
				Page.cmd("fileGet", { "inner_path": $scope.inner_path + 'data.json', "required": false },function(data) {
					// hide info msg
					$scope.hideInfoMsg();
					// write content.json to file
					Page.cmd("fileWrite", [$scope.inner_path + 'data.json', btoa(data)], function(res) {
						// publish content.json
						Page.cmd("sitePublish",{"inner_path":$scope.inner_path + 'data.json'}, function(res) {
							// apply to scope
							$scope.$apply(function(){
								$scope.publishSite(inner_path,channel);
							});
						});
					});
				});
			};

			// rootScope on update channel
			$rootScope.$on('onPublishSite',function(event,mass){
				$scope.publishSite(mass.inner_path,mass.channel);
			});

		/** /UPDATE CHANNEL **/


		/** UI **/

			// loading & msg
			$scope.showLoadingMsg = function(msg){
				$scope.ch_msg = msg;
				$scope.ch_loading = true;
			};

			// finish loading
			$scope.finishLoading = function(){
				$scope.ch_loading = false;
			};

			$rootScope.$on('onShowLoadingMsg',function(event,mass){
				$scope.showLoadingMsg(mass);
			});

			// on change user
			$rootScope.$on('onChangeUser',function(event,mass){
				$scope.showLoadingMsg('Loading User Channels');
				var query = ["SELECT * FROM channel WHERE channel_address LIKE '%"+$scope.page.site_info.auth_address+"'"];
				Page.cmd("dbQuery",query,function(u_channels){
					$scope.$apply(function(){
						if (u_channels.length > 0){
							// render channel list
							$scope.u_channels = Channel.renderChannels(u_channels);
							// assign current user channel
							$scope.assignCurrentUserChannel();
						} else {
							// inner path
							$scope.inner_path = 'merged-'+$scope.page.site_info.content.merger_name+'/'+$scope.config.cluster.cluster_id+'/data/users/'+$scope.page.site_info.auth_address+'/';
							// route user section
							$scope.routeUserView();
						}
					});
				});
			});

		/** /UI **/

	}
]);

// dialog controller
var DialogController = function($scope, $mdDialog, $rootScope, items) {

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
	
	$scope.updateChannelRecord = function(channel){
		$scope.hide();
		$rootScope.$broadcast('onUpdateChannelRecord',channel);
	};

};