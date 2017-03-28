app.controller('ChannelMainCtrl', ['$scope','$rootScope','$location','$window','Channel',
	function($scope,$rootScope,$location,$window,Channel) {

		/** INIT **/

			// init user section
			$scope.init = function(){
				if ($scope.channels){
					var u_channels = [];
					$scope.channels.forEach(function(ch,index){
						if (ch.user === $scope.page.site_info.cert_user_id){
							u_channels.push(ch);
						}
					});
					if (u_channels.length > 0){
						// render channel list
						$scope.u_channels = Channel.renderChannels(u_channels);
						// assign current user channel
						$scope.assignCurrentUserChannel();
					} else {
						// route user section
						$scope.routeUserView();
					}
				} else {
					// route user section
					$scope.routeUserView();
				}
			};

			// assign current user site
			$scope.assignCurrentUserChannel = function(){
				var path = $location.$$absUrl.split('/user/')[1].split('&')[0];
				if (path.indexOf('+type=') > -1) path = path.split('+type=')[0];
				// if path has "?cl=" (cluster id url prefix)
				if (path.indexOf('?cl=') > -1){
					// channel address
					var channel_address = path.split('+ch=')[1];
					// url suffix for inner links
					$scope.url_suffix = '?cl=' + path.split('?cl=')[1];
					// find channel by channel address
					$scope.channel = Channel.findChannelByAddress($scope.u_channels,channel_address);
				} else {
					// apply first channel to scope
					$scope.channel = $scope.u_channels[0];
				}
				// cluster
				$scope.clusters.forEach(function(cluster,index){
					if ($scope.channel.cluster_id === cluster.address){
						$scope.cluster = cluster;
					}
				});
				// inner path
				$scope.inner_path = 'merged-'+$scope.page.site_info.content.merger_name+'/'+$scope.cluster.address+'/data/users/'+$scope.page.site_info.auth_address+'/';
				// url suffix for inner links
				$scope.url_suffix = '?cl=' + $scope.channel.cluster_id + '+ch=' + $scope.channel.channel_address;
				// get channel items
				$scope.getChannelItems();
			};

			// get channel items
			$scope.getChannelItems = function(){
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
					console.log(site_files);
					$scope.$apply(function(){
						// render channel files
						$scope.ch_files = Channel.renderChannelFiles(site_files,$scope.items);
						console.log($scope.ch_files);
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
				$scope.finishLoading();
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

			// update & save channel json
			$scope.updateChannelJson = function(){
				$scope.showLoadingMsg('updating ' + $scope.chJson.channel.channel_address + '.json');
				$scope.chJson = Channel.renderChannelItemsBeforeUpdate($scope.chJson);
				var json_raw = unescape(encodeURIComponent(JSON.stringify($scope.chJson, void 0, '\t')));
				Page.cmd("fileWrite", [$scope.inner_path  + $scope.chJson.channel.channel_address + '.json', btoa(json_raw)], function(res) {
					if (res === 'ok'){
						console.log('channel json updated');
						$scope.publishSite();
					}
				});
			};

			// publish site
			$scope.publishSite = function(){
				$scope.showLoadingMsg('updating content.json');
				// get content.json
				Page.cmd("fileGet", { "inner_path": $scope.inner_path + 'content.json', "required": false },function(contentJson) {
					// add optional attribute if doesnt exist
					contentJson = JSON.parse(contentJson);
					contentJson.optional = ".*";
					// write content.json to file
					var json_raw = unescape(encodeURIComponent(JSON.stringify(contentJson, void 0, '\t')));
					Page.cmd("fileWrite", [$scope.inner_path + 'content.json', btoa(json_raw)], function(res) {
						console.log(res);
						// apply to scope
						$scope.$apply(function(){
							Page.cmd("wrapperNotification", ["done", "Channel Updated!",10000]);
							$window.location.href = '/'+ $scope.page.site_info.address +'/user/index.html?cl='+$scope.channel.cluster_id + '+ch=' + $scope.channel.channel_address;
						});
					});
				});
			};

			// update channel record
			$scope.updateChannelRecord = function(channel){
				$scope.showLoadingMsg('updating channel record');
				var inner_path = $scope.inner_path +"channels.json";
				// get users channel.json file
				Page.cmd("fileGet", { "inner_path": inner_path , "required": false },function(data) {        	
		        	// data
		        	data = JSON.parse(data);
		        	// find channel in user channels array
		        	var channel_index;
		        	data.channels.forEach(function(ch,index){
		        		if (ch.channel_address === channel.channel_address){
		        			channel_index = index;
		        		}
		        	});
					// update channel.json
					data.channels.splice(channel_index,1);
					data.channels.push(channel);
					// write to file
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));
					Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
						console.log(res);
						// sign & publish site
						Page.cmd("sitePublish",{"inner_path":inner_path}, function(res) {
							// update channel json 
							$scope.chJson.channel = channel;
							$scope.updateChannelJson(channel);
						});
					});
			    });
			};

			// rootScope on update channel
			$rootScope.$on('onUpdateChannelRecord',function(event,channel){
				$scope.updateChannelRecord(channel);
			});

		/** /UPDATE CHANNEL **/


		/** UI **/

			// loading & msg
			$scope.showLoadingMsg = function(msg){
				$scope.msg = msg;
				$scope.loading = true;
			};

			// finish loading
			$scope.finishLoading = function(){
				$scope.loading = false;
			};

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