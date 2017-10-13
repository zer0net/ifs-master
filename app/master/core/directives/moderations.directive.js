app.directive('moderations', ['Item','Channel',
	function(Item,Channel) {

		// comments controller
		var controller = function($scope,$element) {

			// toggle channel visibility
			$scope.toggleChannelVisibility = function(channel){

				// new moderation object
				var moderation = {
					moderation_type:'channel',
					item_id:channel.channel_address,
					current:1
				};

				if (channel.hide === 1){
					moderation.hide = 0;
					channel.hide = 0;
				} else {
					moderation.hide = 1;
					channel.hide = 1;
				}

				// create moderation
				$scope.createModeration(moderation);
			};

			// toggle user channels visibility
			$scope.toggleUserChannelsVisibility = function(channel){
				// new moderation object
				var moderation = {
					moderation_type:'user_channels',
					item_id:channel.user_id,
					current:1
				};
				if (channel.user_hide === 1){
					moderation.hide = 0;
					channel.user_hide = 0;
				} else {
					moderation.hide = 1;
					channel.user_hide = 1;
				}
				$scope.createModeration(moderation);
			};

			// create moderation
			$scope.createModeration = function(moderation){
				// find user cluster 
				var cluster_id = Channel.findUserCluster($scope.page.site_info.auth_address,$scope.clusters);
				if (cluster_id === false){
					cluster_id = $scope.config.cluster.cluster_id;
				}
				// get user's data.json
				var inner_path = "merged-"+$scope.page.site_info.content.merger_name+"/"+cluster_id+"/data/users/"+$scope.page.site_info.auth_address+"/data.json";	
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
					// data file
					if (data) { 
						data = JSON.parse(data); 
						if (!data.moderation){
							data.moderation = [];
							next_moderation_id = 1;
						}
					} 
					else { data = {"next_moderation_id":1,"moderation":[]}; }
					// moderation
					moderation.date_added = +(new Date)
					moderation.moderation_id = data.next_moderation_id;
					// find current moderation for moderated item & set current to 0
					data.moderation = Item.removeCurrentModeration(data.moderation,moderation);
					// push comment to user's comment.json
					data.moderation.push(moderation);
					// write to file					
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));					
					Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
						// sign & publish site
						Page.cmd("sitePublish",{"inner_path":inner_path}, function(res) {
							// apply to scope
							$scope.$apply(function() {
								Page.cmd("wrapperNotification", ["done", "Channel Hidden!", 10000]);
								if (!$scope.moderations) $scope.moderations = [];
								$scope.moderations.push(moderation);
							});
						});
					});
			    });
			};

		};

		return {
			restrict: 'AE',
			replace:false,
			controller: controller
		}

	}
]);