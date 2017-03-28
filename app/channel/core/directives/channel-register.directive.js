app.directive('channelRegister', ['Channel','$rootScope','$window',
	function(Channel,$rootScope,$window) {

		// channel register controller
		var controller = function($scope,$element) {

			$scope.clIndex = 0;

			// init new channel
			$scope.initNewChannelForm = function(page) {
				console.log('init new channel form');
				console.log('-------------------------------');				
				$scope.channel = {
					channel_name:page.site_info.cert_user_id.split('@')[0]+"'s channel",
					channel_description:page.site_info.cert_user_id.split('@')[0]+"'s channel description"
				};
			}

			// on create channel
			$scope.onCreateChannel = function(channel,scope) {
				console.log('create new channel');
				console.log('-------------------------------');
				// if scope var is passed in function
				if (scope){
					$scope.config = scope.config;
					$scope.page = scope.page;
				}
				// if no user cert id
				if (!$scope.page.site_info.cert_user_id){
					console.log('no user certificate id');
					$rootScope.$broadcast('onCreateIfsCert');
				} else {
					$scope.createChannel(channel);
				}
			};

			$rootScope.$on('onChangeUserCertId',function(event,mass){
				console.log(mass);
				$scope.page = mass;
			});

			// create channel
			$scope.createChannel = function(channel){

				// cluster id
				var cluster_id;
				if ($scope.user) {cluster_id = $scope.user.cluster_id;}
				else {cluster_id = $scope.config.cluster.cluster_id;}

				// get user's comment.json
				var inner_path = "merged-"+$scope.page.site_info.content.merger_name+"/"+cluster_id+"/data/users/"+$scope.page.site_info.auth_address+"/data.json";			
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
					
					// data file
					if (data) { data = JSON.parse(data); } 
					else { data = {"next_channel_id":1,"channels":[]}; }

					// channel
					channel.channel_address = data.next_channel_id.toString() + '_' + $scope.page.site_info.auth_address;
					channel.cluster_id = cluster_id;
					channel.date_added = +(new Date);
					channel.user_id = $scope.page.site_info.auth_address;

					// push channel to user's data.json
					data.channels.push(channel);
					data.next_channel_id += 1;

					// write to file					
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));					
					Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
						// sign & publish site
						Page.cmd("sitePublish",{"inner_path":inner_path}, function(res) {
							// apply to scope
							$scope.$apply(function() {
								Page.cmd("wrapperNotification", ["done", "Channel created!", 10000]);
								if (!$scope.u_channels) $scope.u_channels = [];
								$scope.u_channels.push(channel);
							});
						});
					});
			    });
			};

		}

		var template =  '<div class="new-channel-form">' +
				    		'<div class="form-row" layout="row" flex="100">' +
					    		'<label flex="30">Channel Name</label>' +
					    		'<input flex="70" class="form-control" type="text" ng-model="channel.channel_name">' +
				    		'</div>' +
				    		'<div class="form-row" layout="row" flex="100">' +
				    			'<label flex="30">Channel Description</label>' +
				    			'<textarea flex="70" class="form-control" ng-model="channel.channel_description"></textarea>' +
							'</div>' +
							'<hr/>' +
							'<md-button class="md-primary md-raised edgePadding pull-left" style="margin:0;" ng-click="hide()">Cancel</md-button>' +
							'<md-button class="md-primary md-raised edgePadding pull-right" style="margin:0;" ng-click="onCreateChannel(channel,items.scope)">Create Channel</md-button>' + 				       
				    	'</div>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);