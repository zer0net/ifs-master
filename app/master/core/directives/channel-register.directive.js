app.directive('channelRegister', ['Channel','$rootScope','$window',
	function(Channel,$rootScope,$window) {

		// channel register controller
		var controller = function($scope,$element) {

			// init new channel
			$scope.initNewChannelForm = function() {
				$scope.channel = {
					channel_name:'New Channel',
					channel_description:'channel description'
				};
			}

			// on create channel
			$scope.createNewChannel = function(channel,scope) {
				console.log('create new channel');
				console.log('-------------------------------');
				// if scope var is passed in function
				if (scope){
					$scope.clusters = scope.clusters;
					$scope.config = scope.config;
					$scope.merger_name = scope.merger_name;
					$scope.page = scope.page;
				}

				// if no user cert id
				if (!$scope.page.site_info.cert_user_id){
					console.log('no user certificate id');
					console.log('-------------------------------');
					$rootScope.$broadcast('onSelectUser');
				} else {
					$scope.findUserDirectory(channel);
				}
			};

			$rootScope.$on('onChangeUserCertId',function(event,mass){
				console.log(mass);
				$scope.page = mass;
			});

			// find user directory in clusters
			$scope.findUserDirectory = function(channel){
				console.log('find user directory');
				// loop through clusters
				$scope.clusters.forEach(function(cluster,index){
					// get cluster content.json
					var inner_path = "merged-"+$scope.page.site_info.content.merger_name+"/"+cluster.cluster_id+"/data/users/"+$scope.page.site_info.auth_address+"/content.json";
					Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(contentJson) {
						if (contentJson){
							// if a content.json in USERID directory exists
							console.log(cluster.cluster_id + '/data/users/' + $scope.page.site_info.auth_address + '/content.json found!');
							// parse data
							$scope.contentJson = JSON.parse(contentJson);
							// set global inner_path var
							$scope.inner_path = 'merged-'+$scope.page.site_info.content.merger_name+'/'+cluster.cluster_id+'/data/users/' + $scope.page.site_info.auth_address + '/';
							// get users channels.json
							$scope.getUserChannelsJson(channel,cluster.cluster_id);
						} else {
							if ((index + 1) === $scope.clusters.length){
								var cluster_id = $scope.config.cluster.cluster_id
								// if no channels.json for user found
								console.log('no user directory in registered clusters found');
								// inner path					
								$scope.inner_path = 'merged-'+$scope.page.site_info.content.merger_name+'/'+ cluster_id +'/data/users/' + $scope.page.site_info.auth_address + '/';
								// on create user channels json
								$scope.createUserChannelsJson(channel,cluster_id);
							}
						}
						$scope.$apply();
					});
				});
			};

			// get user channels json
			$scope.getUserChannelsJson = function(channel,cluster_id){
				Page.cmd("fileGet", { "inner_path": $scope.inner_path + 'channels.json', "required": false },function(channelsJson) {
					if (channelsJson){
						console.log('channels.json in user directory found!');
						// bind channelsJson to scope
						$scope.channelsJson = JSON.parse(channelsJson);
						// add channel
						$scope.onCreateChannelJson(channel,cluster_id);
					} else {
						console.log('no channels.json in user directory! creating channels.json...');
						// ON create user channels.json
						$scope.createUserChannelsJson(channel,cluster_id);
					}
					$scope.$apply();
				});	
			};

			// on create user directory
			$scope.createUserChannelsJson = function(channel,cluster_id){
				// channels json obj
				$scope.channelsJson = {
					next_channel_id:1,
					channels:[],
					user_id:$scope.page.site_info.auth_address
				};
				// convert channels json object to json raw
				var json_raw = unescape(encodeURIComponent(JSON.stringify($scope.channelsJson, void 0, '\t')));
				// create new user directory in CLUSTER/data/users/USER_ID with a channels.json
				Page.cmd("fileWrite", [$scope.inner_path + 'channels.json', btoa(json_raw)], function(res) {
					console.log(res);
					if (res === 'ok'){
						console.log('channels json created!');
						$scope.$apply();						
						// sign & publish
						Page.cmd("sitePublish",{"inner_path":$scope.inner_path + 'channels.json'}, function(res) {
							console.log(res);
							// get users content.json file
							Page.cmd("fileGet", { "inner_path": $scope.inner_path + 'content.json', "required": false },function(contentJson) {
								// bind content.json to scope
								$scope.contentJson = JSON.parse(contentJson);
								// add channel
								$scope.onCreateChannelJson(channel,cluster_id);
							});
						});
					} else {
						console.log('failed to create user directory! response :' + res);
					}
				});
			};

			// create channel json
			$scope.onCreateChannelJson = function(channel,cluster_id){
				// add optional to content.json
				if (!$scope.contentJson.optional) $scope.contentJson.optional = "((?!json).)*$";		
				// convert content json object to json raw
				var json_raw = unescape(encodeURIComponent(JSON.stringify($scope.contentJson, void 0, '\t')));
				Page.cmd("fileWrite", [$scope.inner_path + 'content.json', btoa(json_raw)], function(res) {
					if (res === 'ok'){
						console.log('content json updated!');
						// create channel unique json
						$scope.createChannelJson(channel,cluster_id);
						$scope.$apply();
					} else {
						console.log('failed to update user content.json! response :' + res);
					}
				});
			};

			// create channel unique json
			$scope.createChannelJson = function(channel,cluster_id){
				// assign info to channel obj
				channel.cluster_id = cluster_id;
				channel.channel_id = $scope.channelsJson.next_channel_id;
				channel.channel_address = $scope.channelsJson.next_channel_id + '_' + $scope.page.site_info.auth_address.toString();
				// channel json obj
				var chJson = {
					channel:channel,
					items:{},
					next_item_id:1
				}
				// convert channel json object to json raw
				var json_raw = unescape(encodeURIComponent(JSON.stringify(chJson, void 0, '\t')));
				// create new user directory in CLUSTER/data/users/USER_ID with a channels.json
				Page.cmd("fileWrite", [$scope.inner_path + channel.channel_address + '.json', btoa(json_raw)], function(res) {
					console.log(res);
					if (res === 'ok'){
						console.log('channel json ' + channel.channel_address + '.json created!');
						// add channel to channels json
						$scope.addChannel(channel,cluster_id);
						$scope.$apply();
					} else {
						console.log('failed to create ' + channel.channel_address + '.json! response :' + res);
					}
				});

			};

			// add channel
			$scope.addChannel = function(channel,cluster_id){
				// push channel record to users channels array
				$scope.channelsJson.channels.push(channel);	
				$scope.channelsJson.next_channel_id += 1;
				// convert channels json object to json raw
				var json_raw = unescape(encodeURIComponent(JSON.stringify($scope.channelsJson, void 0, '\t')));
				// create new user directory in CLUSTER/data/users/USER_ID with a channels.json
				Page.cmd("fileWrite", [$scope.inner_path + 'channels.json', btoa(json_raw)], function(res) {
					console.log(res);
					if (res === 'ok'){
						console.log('channel added!');
						// sign & publish
						Page.cmd("sitePublish",{"inner_path":$scope.inner_path + 'channels.json'}, function(res) {
							console.log(res);
							// create channel record in master site
							$scope.createChannelRecord(channel,cluster_id);
							$scope.$apply();
						});
					} else {
						console.log('failed to add channel! response :' + res);
					}
				});

			};

			// create channel
			$scope.createChannelRecord = function(channel,cluster_id) {
				// get users channel.json file
				var inner_path = "data/users/"+Page.site_info.auth_address+"/channel.json";
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
		        	// data
					if (data){ 
						data = JSON.parse(data);
						if (!data.channel){
							data.channel = [];
							data.next_channel_id = 1;
						}
					} else { 
						data = { 
							next_channel_id:1, 
							channel:[] 
						}; 
					}
					// adjust channel obj to a master db channel record
					channel.channel_id = data.next_channel_id;
					channel.cluster_id = cluster_id;
					channel.date_added =  +(new Date);
					// update channel.json
					data.channel.push(channel);
					data.next_channel_id += 1;
					// write to file
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));
					Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
						// sign & publish site
						Page.cmd("sitePublish",{"inner_path":inner_path}, function(res) {
							// apply to scope
							$scope.$apply(function() {
								Page.cmd("wrapperNotification", ["done", "Channel Created!", 10000]);
								$window.location.href = '/'+ $scope.page.site_info.address +'/user/index.html?cl='+cluster_id+'+ch='+channel.channel_address;
							});
						});
					});
			    });
			};

		}

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
		}

	}
]);