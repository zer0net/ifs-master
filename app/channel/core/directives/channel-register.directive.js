app.directive('channelRegister', ['Channel','$rootScope','$window',
	function(Channel,$rootScope,$window) {

		// channel register controller
		var controller = function($scope,$element) {

			// init new channel
			$scope.initNewChannelForm = function(page,u_channels,cluster,clusters) {
				$scope.clusters = clusters;
				$scope.channel = {
					channel_name:page.site_info.cert_user_id.split('@')[0]+"'s channel",
					channel_description:page.site_info.cert_user_id.split('@')[0]+"'s channel description",
					user:page.site_info.cert_user_id,
				};
				if (cluster){
					$scope.cluster = cluster;
					$scope.channel.cluster_id = cluster.address;
				}
			}

			// on create channel
			$scope.onCreateChannel = function(channel,scope) {
				$scope.ch_loading = true;
				// if scope var is passed in function
				if (scope){
					$scope.config = scope.config;
					$scope.page = scope.page;
					$scope.inner_path = scope.inner_path;
					$scope.cluster = scope.cluster;
					$scope.u_channels = scope.u_channels;
				}
				// if no user cert id
				if (!$scope.page.site_info.cert_user_id){
					$rootScope.$broadcast('onCreateIfsCert');
				} else {
					$scope.checkChannelPath(channel);
				}
			};

			// on change user certificate id
			$rootScope.$on('onChangeUserCertId',function(event,mass){
				$scope.page = mass;
			});

			// check channel path
			$scope.checkChannelPath = function(channel){
				Page.cmd("fileGet", { "inner_path": $scope.inner_path + "data.json", "required": false },function(data) {
					$scope.$apply(function(){
						if (data === null){
							$scope.createChannel(channel);
						} else if (data === 'null') {
							Page.cmd("fileDelete", [$scope.inner_path+"data.json"], function(res) {
								$scope.$apply(function(){
									$scope.createChannel(channel);
								});
							});
						} else {
							$scope.createChannel(channel);							
						}
					});
			    });
			};

			// create channel
			$scope.createChannel = function(channel){
				console.log(channel);
				$scope.inner_path = "merged-"+$scope.config.merger_name+"/"+channel.cluster.cluster_id+"/data/users/"+$scope.page.site_info.auth_address+"/";
				// get user's data.json
				Page.cmd("fileGet", { "inner_path": $scope.inner_path + "data.json", "required": false },function(data) {
					console.log(data);
					// data file
					if (data) { 
						data = JSON.parse(data); 
						if (!data.channel){
							data.channel = [];
							data.next_channel_id = 1;
						}
					} else {
						data = {"next_channel_id":1,"channel":[]}; 
					}

					// next channel id
					data.next_channel_id = Channel.getUserNextChannelId($scope.u_channels);

					// channel
					channel.channel_address = data.next_channel_id + '_' + $scope.page.site_info.auth_address;
					channel.cluster_id = channel.cluster.cluster_id;
					channel.date_added = +(new Date);
					channel.user_id = $scope.page.site_info.auth_address;
					channel.user = $scope.page.site_info.cert_user_id;
					delete channel.cluster;

					// push channel to user's data.json
					data.channel.push(channel);
					data.next_channel_id += 1;
					// write to file					
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));
					Page.cmd("fileWrite", [$scope.inner_path + 'data.json', btoa(json_raw)], function(res) {
						console.log(res);
						// sign & publish site
						$scope.$apply(function() {
							Page.cmd("sitePublish",{"inner_path":$scope.inner_path + 'data.json'}, function(res) {
								console.log(res);
								// apply to scope
								$scope.$apply(function() {
									Page.cmd("wrapperNotification", ["done", "Channel created!", 10000]);
									var mass = {
										inner_path:$scope.inner_path,
										channel:channel
									};
									$rootScope.$broadcast('onPublishSite',mass);
								});
							});
						});
					});
			    });
			};

		}

		var template =  '<div class="new-channel-form">' +
							'<div ng-hide="ch_loading">' +
					    		'<div class="form-row" layout="row" flex="100">' +
						    		'<label flex="30">Cluster</label>' +
									'<select flex="70" class="form-control" ng-model="channel.cluster" value="cl.address" ng-options="cl.content.title for cl in clusters"></select>' +
					    		'</div>' +
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
							'</div>' +
							'<!-- loading -->' +
							'<div id="channel-reg-loading" layout="column" ng-show="ch_loading" flex>' +
							    '<div layout="column" flex="100" style="text-align:center;">' +
							        '<span><b>Creating Channel</b></span>' +
							    '</div>' +
							    '<div layout="row" flex="100" layout-align="space-around">' +
							        '<md-progress-circular md-mode="indeterminate"></md-progress-circular>' +
							    '</div>' +
							'</div>' +
							'<!-- /loading -->' +
				    	'</div>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);