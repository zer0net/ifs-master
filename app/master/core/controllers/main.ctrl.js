app.controller('MainCtrl', ['$rootScope','$scope','$location','$mdDialog', '$mdMedia','Item','Channel','Central',
	function($rootScope,$scope,$location,$mdDialog,$mdMedia,Item,Channel,Central) {

		/* INIT SITE */

			// init
			$scope.init = function(){
				console.log('Init');
				console.log('--------------------------');
				// site ready var to fix loading inconsistancies
				$scope.site_ready = false;
				// loading
				$scope.showLoadingMessage('Loading');
				// get site info
				Page.cmd("siteInfo", {}, function(site_info) {
					// apply site info to Page obj
					Page.site_info = site_info;
					// page
					$scope.page = Page;
					// get config
					Page.cmd("fileGet",{"inner_path":"content/config.json"},function(data){
						console.log('get config file');
						$scope.config = JSON.parse(data);
						console.log($scope.config);
						console.log('--------------------------');
						// get channels
						$scope.getMergerPermission();	
					});
		    	});
			};

			// get merger site permission
			$scope.getMergerPermission = function(){
				console.log('get merger permission');
				console.log('--------------------------');
				// if user allready has permission for merger type
		    	if (Page.site_info.settings.permissions.indexOf("Merger:"+$scope.page.site_info.content.merger_name) > -1){
		    		$scope.$apply(function(){
		    			// get merged sites
		    			$scope.getMergerSites();
		    		});
		    	} else {
		    		// if not, ask user for permission
					Page.cmd("wrapperPermissionAdd", "Merger:"+$scope.page.site_info.content.merger_name, function() {
						$scope.$apply(function(){
			    			// get merged sites
			    			$scope.getMergerSites();
						});
					});
		    	}
			};

			// get merged sites
			$scope.getMergerSites = function(){
				Page.cmd("mergerSiteList", {query_site_info: false}, function(sites) {		
					console.log('get merger sites');
					console.log('--------------------------');
					// for each site in merger site list
					for (var site in sites) {
						if (!$scope.sites) $scope.sites = [];
						$scope.sites.push(site);
					}
					console.log($scope.sites);
					$scope.getClusters();
				});	
			};

		    // get clusters
		    $scope.getClusters = function(){
				// loading
				$scope.showLoadingMessage('Loading Clusters');
				Page.cmd("fileGet",{"inner_path":"content/clusters.json"},function(data){
					$scope.$apply(function() {
						data = JSON.parse(data);
						$scope.clusters = data.clusters;
						console.log('get clusters');
						console.log($scope.clusters);
						console.log('--------------------------');
						$scope.clIndex = 0;
						$scope.varifyClusters();
						$scope.getClusterSiteInfo();
					})
				});
		    };

		    // get cluster site info
		    $scope.getClusterSiteInfo = function(){
		    	// query merger site list
		    	Page.cmd("mergerSiteList", {query_site_info: true}, function(sites) {
		    		// find cluster in sites & bind it to scope
		    		$scope.clusters.forEach(function(item,index){		    					    			
		    			item = Channel.findClusterInMergerSiteList(sites,item.cluster_id);		    			
		    			$scope.clusters[index].title=item.content.title;
		    		});		    				    		
		    	});
		    };

		    // varify cluster
		    $scope.varifyClusters = function(){
				console.log('varify clusters');
		    	console.log('cluster index - '+$scope.clIndex);
		    	console.log('clusters length - '+$scope.clusters.length);
		    	if ($scope.clIndex < $scope.clusters.length){
		    		if ($scope.sites){
						if ($scope.sites.indexOf($scope.clusters[$scope.clIndex].cluster_id) > -1){
							var cluster_id = $scope.clusters[$scope.clIndex].cluster_id;
							if (!$scope.userDirArray) $scope.userDirArray = [];
							Page.cmd("optionalFileList", { address: cluster_id, limit:2000 }, function(site_files){
								$scope.$apply(function(){
									site_files.forEach(function(s_file,index){
										if (s_file.inner_path.indexOf('channels.json') > -1){
											console.log(s_file.inner_path);
											var userDirPath = cluster_id + '/' + $scope.splitByLastSlash(s_file.inner_path);
											if ($scope.userDirArray.indexOf(userDirPath) === -1){
												$scope.userDirArray.push(userDirPath);
											}
										}
									});
									$scope.clIndex += 1;
									$scope.varifyClusters();
								});
							});
						} else {
							console.log('cluster doesnt exist!');
							$scope.addCluster();
						}
		    		} else {
						console.log('cluster doesnt exist!');
		    			$scope.addCluster();
		    		}
		    	} else {
		    		console.log('finished varifying cluster');
					console.log('--------------------------');
		    		$scope.onGetChannels();
		    	}
		    };

		    $scope.splitByLastSlash = function(text){
			    var index = text.lastIndexOf('/');
			    return [text.slice(0, index), text.slice(index + 1)][0];
		    };

		    // add cluster to merger sites
		    $scope.addCluster = function() {
				console.log('adding cluster - ' + $scope.clusters[$scope.clIndex].cluster_id);
				Page.cmd("mergerSiteAdd",{"addresses":$scope.clusters[$scope.clIndex].cluster_id},function(data){
					Page.cmd("wrapperNotification", ["info", "refresh this site to view new content", 10000]);
				});
		    };

		    // on get channels
		    $scope.onGetChannels = function(){
		    	$scope.udIndex = 0;
		    	$scope.channels = [];
		    	$scope.getUserChannels();
		    };

		    // get user channels
		    $scope.getUserChannels = function(){
	    		console.log('get ' + $scope.userDirArray[$scope.udIndex] + '/channels.json');
				console.log('--------------------------');
				var inner_path = 'merged-'+$scope.page.site_info.content.merger_name+'/'+$scope.userDirArray[$scope.udIndex] + '/channels.json';
				Page.cmd("fileGet",{"inner_path":inner_path,"required": false },function(channelsJson){
		    		$scope.$apply(function(){
						channelsJson = JSON.parse(channelsJson);
						$scope.channels = $scope.channels.concat(channelsJson.channels);
			    		$scope.udIndex += 1;

			    		if ($scope.udIndex < $scope.userDirArray.length){
			    			$scope.getUserChannels();
			    		} else {
			    			$scope.getChannels();
			    		}
		    		});
				});	
		    };

			// get channels
			$scope.getChannels = function(){
	    		console.log('get channels');
	    		console.log(channels);
				console.log('--------------------------');
				// loading
				$scope.showLoadingMessage('Loading Channels');
				if ($scope.channels.length > 0){
					var query = ["SELECT * FROM moderation WHERE current = 1"];
					Page.cmd("dbQuery", query ,function(moderations){
						$scope.channels = Central.joinChannelModeration($scope.channels,moderations);
						$scope.cIndex = 0;
						$scope.getChannel($scope.channels[$scope.cIndex]);
						$scope.$apply();
					});
				} else {
					$scope.showLoadingMessage('No Channels!');
					$scope.finishedLoading();
				}
			};

			// get channel
			$scope.getChannel = function(channel){
				console.log('get channel ' + channel.channel_address);
				console.log('--------------------------');
				// update cIndex
				$scope.cIndex += 1;
				if (channel.hide !== 1){
					// get channel.json
					var inner_path = 'merged-'+$scope.page.site_info.content.merger_name+'/'+channel.cluster_id+'/data/users/'+channel.user_id+'/'+channel.channel_address+'.json';
					Page.cmd("fileGet",{"inner_path":inner_path,"required": false },function(chJson){
					    if (chJson){
							chJson = JSON.parse(chJson);
							$scope.addChannelItems(chJson,channel);
						} else {
							console.log('No content.json found for '+channel.channel_address+'!');
							$scope.finishLoadingChannel();
						}
					});
				} else {
					$scope.finishLoadingChannel();
				}
			};
	
			// add channels items
			$scope.addChannelItems = function(chJson,channel){
				// list optional files
				Page.cmd("optionalFileList", { address: channel.cluster_id, limit:2000 }, function(site_files){
					// assign to each file in chJson.items its correspoding site_file
					chJson = Channel.matchItemsWithSiteFiles(chJson,site_files);
					channel.items_total = chJson.items_total;
					channel.items = chJson.items;
					// merge chJson.items to $scope.items
					if (!$scope.items) {
						$scope.items = {
							total:0
						};	
					}
					if (!$scope.media_types) $scope.media_types = [];
					$scope.items = Central.mergeChannelItems($scope.items,$scope.items_total,$scope.media_types,chJson);					
					$scope.finishLoadingChannel();
			    });
			};

			// finish loading channel
			$scope.finishLoadingChannel = function(){
				if ($scope.cIndex < $scope.channels.length){
					$scope.getChannel($scope.channels[$scope.cIndex]);
				} else {
					$scope.finishLoadingChannels();
				}
			};

			// finish loading channels
			$scope.finishLoadingChannels = function(){
				console.log('finish loading channels!');
				console.log('--------------------------');
				// sort media types alphabetically
				$scope.media_types.sort();
				// finished loading & apply to scope
				$scope.$apply(function(){
					// finish loading
					$scope.finishedLoading();
				});
			};

		/* /INIT SITE */

		/* FILTER */

			// filter Cluster
			$scope.onFilterCluster = function(cluster){
				alert(1);
				/*
				$scope.loading_list = true;
				if (!$scope.filters) {
					$scope.filters = {cluster_id:cluster.cluster_id}	
				} 
				else {
					$scope.filters.cluster_id = cluster.cluster_id;
				}
				$scope.cluster = cluster;
				$scope.loading_list = false;
				*/
			};

			// filter channel
			$scope.filterChannel = function(channel){
				$scope.loading_list = true;
				if (!$scope.filters) {
					$scope.filters = {channel_address:channel.channel_address}	
				} 
				else {
					$scope.filters.channel_address = channel.channel_address;
				}
				$scope.channel = channel;
				$scope.mainFilter();
			};

		
			// main filter function
			$scope.mainFilter = function() {
				$scope.channel = Central.filterItemsByChannel($scope.channel,$scope.items,$scope.filters);
				$scope.loading_list = false;
			};

			// remove filter channel
			$scope.removeFilterChannel = function(){
				if ($scope.channel) delete $scope.channel;
				if ($scope.filters) delete $scope.filters.channel_address;
			};

		/* /FILTER */

		/* UI */

			// show loading msg
			$scope.showLoadingMessage = function(msg) {
		    	$scope.loading = true;
		    	$scope.msg = msg;
			};

			// finished loading 
			$scope.finishedLoading = function(){
				$scope.loading = false;
				$scope.msg = '';				
			};

		    // select user
		    $scope.selectUser = function(){
		    	Page.selectUser();
				Page.onRequest = function(cmd, message) {
				    if (cmd == "setSiteInfo") {
						// site info
						Page.site_info = message;
						// attach to scope
						$scope.page = Page;
						// update site
						$scope.$apply(function(){
							$rootScope.$broadcast('onChangeUserCertId',$scope.page);
						});
					}
				};
		    };

		    // on select user
		    $rootScope.$on('onSelectUser',function(event,mass) {
		    	$scope.selectUser();
		    });

		    // load script dynamically
			$scope.loadScript = function(url, type, charset) {
			    if (type===undefined) type = 'text/javascript';
			    if (url) {
		            var body = angular.element(document.getElementsByTagName("body"));
	                if (body) {
	                    script = document.createElement('script');
	                    script.setAttribute('src', url);
	                    script.setAttribute('type', type);
	                    if (charset) script.setAttribute('charset', charset);
	                    body.append(script);
	                }
			        return script;
			    }
			};

			// clone file hub
			$scope.cloneFileHub = function(){
				if (Page.site_info.settings.permissions.indexOf("ADMIN") > -1){
					Page.cmd("siteClone", ["1CG6obEGoFL1fjAoNaxUnemgKES7Zh9YBG", "template-new"]);		    		
		    	} else {
		    		// if not, ask user for ADMIN permission
					Page.cmd("wrapperPermissionAdd", "ADMIN", function() {
						Page.cmd("siteClone", ["1CG6obEGoFL1fjAoNaxUnemgKES7Zh9YBG", "template-new"]);	
					});
		    	}				
			    return false;
			};

			// on clone file hub
			$rootScope.$on('onCloneFileHub',function(event,mass){
				// $scope.cloneFileHub();
			});

			// toggle menu
			$scope.toggleMenu = function(ev) {
				ev.preventDefault();
				if (!$scope.toggled || $scope.toggled === false){
					$scope.toggled = true;
				} else {
					$scope.toggled = false;
				}
			}

			// set channel
			$scope.setChannel = function(channel){
				// if channel has logo
				if (channel.logo){
					channel.logo_src = '/'+$scope.page.site_info.address+'/merged-'+$scope.merger_name+'/'+channel.channel_address+'/uploads/images/'+channel.logo;
				}
				// set channel
				$scope.channel = channel;
			};

			// remove channel
			$scope.removeChannel = function(){
				delete $scope.channel;
			};
			
	    /* /UI */

	}
]);
