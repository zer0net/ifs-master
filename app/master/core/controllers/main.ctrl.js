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
				Page.cmd("mergerSiteList", {query_site_info: true}, function(sites) {	
					console.log('get merger sites');
					console.log(sites);
					console.log('--------------------------');
					// for each site in merger site list
					for (var site in sites) {
						if (!$scope.sites) $scope.sites = [];
						$scope.sites.push(site);
					}
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
		    			$scope.clusters[index].title = item.content.title;
		    		});		    				    		
		    	});
		    };

		    // varify cluster
		    $scope.varifyClusters = function(){
		    	if ($scope.clIndex < $scope.clusters.length){
		    		if ($scope.sites){
						if ($scope.sites.indexOf($scope.clusters[$scope.clIndex].cluster_id) > -1){
							$scope.mapClusterToUserDirArray();
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

		    // add cluster to merger sites
		    $scope.addCluster = function() {
				console.log('adding cluster - ' + $scope.clusters[$scope.clIndex].cluster_id);
				Page.cmd("mergerSiteAdd",{"addresses":$scope.clusters[$scope.clIndex].cluster_id},function(data){
					Page.cmd("wrapperNotification", ["info", "refresh this site to view new content", 10000]);
				});
		    };

		    // map cluster to user dir array
		    $scope.mapClusterToUserDirArray = function(){
				var cluster_id = $scope.clusters[$scope.clIndex].cluster_id;
				if (!$scope.userDirArray) $scope.userDirArray = [];
				Page.cmd("fileGet",{"inner_path":"merged-"+$scope.page.site_info.content.merger_name+"/"+cluster_id+"/content.json"},function(data){
					data = JSON.parse(data);
					var optionalFiles = data.files_optional;
					for (var i in optionalFiles){
						if (i.indexOf('channels.json') > -1){
							var userDirPath = cluster_id + '/' + $scope.splitByLastSlash(i);
							if ($scope.userDirArray.indexOf(userDirPath) === -1){
								$scope.userDirArray.push(userDirPath);
							}							
						}
					}
					$scope.clIndex += 1;
					$scope.varifyClusters();					
				});
		    };

		    $scope.splitByLastSlash = function(text){
			    var index = text.lastIndexOf('/');
			    return [text.slice(0, index), text.slice(index + 1)][0];
		    };

		    // on get channels
		    $scope.onGetChannels = function(){
	    		console.log('on get channels - user dir list array:');
	    		console.log($scope.userDirArray.length);
				console.log('--------------------------');
		    	$scope.udIndex = 0;
		    	$scope.channels = [];
		    	$scope.channelsIdArray = [];
		    	$scope.getUserChannels();
		    };

		    // get user channels
		    $scope.getUserChannels = function(){
	    		if ($scope.udIndex < $scope.userDirArray.length){
					var inner_path = 'merged-'+$scope.page.site_info.content.merger_name+'/'+$scope.userDirArray[$scope.udIndex] + '/channels.json';
					Page.cmd("fileGet",{"inner_path":inner_path,"required": false },function(channelsJson){
			    		$scope.$apply(function(){
			    			if (channelsJson){
								channelsJson = JSON.parse(channelsJson);
								channelsJson.channels.forEach(function(channel,index){
									var address = 'merged-'+$scope.page.site_info.content.merger_name+'/'+$scope.userDirArray[$scope.udIndex] + '/' + channel.channel_address + '.json';
									$scope.channelsIdArray.push(address);
								});
			    			} else {
			    				console.log('no channels json for ' + $scope.userDirArray[$scope.udIndex] + ' was found');
			    				$scope.getContentJson();
			    			}
						    $scope.udIndex += 1;
		    				$scope.getUserChannels();
			    		});
					});
	    		} else {
	    			$scope.getChannels();
	    		}
		    };

			// force file download
			$scope.getContentJson = function(){
				var inner_path = 'merged-'+$scope.page.site_info.content.merger_name+'/'+$scope.userDirArray[$scope.udIndex] + '/content.json';
				Page.cmd("fileGet",{"inner_path":inner_path,"required": false },function(contentJson){
	    			if (contentJson){
	    				console.log(contentJson);
						contentJson = JSON.parse(contentJson);
						for (var i in contentJson.files){
							if (i.indexOf('.json') > -1 && i.indexOf('channels.json') === -1){
								var address = 'merged-'+$scope.page.site_info.content.merger_name+'/'+$scope.userDirArray[$scope.udIndex] + '/' + i;
								if ($scope.channelsIdArray.indexOf(address) === -1){
									$scope.channelsIdArray.push(address);							
								}
							}
						}
						if (contentJson.files_optional){
							for (var i in contentJson.files_optional){
								if (i.indexOf('.json') > -1 && i.indexOf('channels.json') === -1){
									var address = 'merged-'+$scope.page.site_info.content.merger_name+'/'+$scope.userDirArray[$scope.udIndex] + '/' + i;
									if ($scope.channelsIdArray.indexOf(address) === -1){
										$scope.channelsIdArray.push(address);							
									}
								}
							}
						}
					}
				    $scope.udIndex += 1;
    				$scope.getUserChannels();
				});
			};		    

			// get channels
			$scope.getChannels = function(){
	    		console.log('get channels');
	    		console.log($scope.channelsIdArray);
				console.log('--------------------------');
				// loading
				$scope.showLoadingMessage('Loading Channels');
				if ($scope.channelsIdArray.length > 0){
					$scope.cIndex = 0;
					$scope.getChannel($scope.channelsIdArray[$scope.cIndex]);
				} else {
					$scope.showLoadingMessage('No Channels!');
					$scope.finishedLoading();
				}
			};

			// get channel
			$scope.getChannel = function(channel_address){
				// update cIndex
				if ($scope.cIndex < $scope.channelsIdArray.length){
					// get channel.json
					Page.cmd("fileGet",{"inner_path":$scope.channelsIdArray[$scope.cIndex],"required": false },function(chJson){
					    if (chJson){
							chJson = JSON.parse(chJson);
							$scope.addChannelItems(chJson);
						} else {
							console.log('No content.json found for '+channel_address+'!');
							$scope.cIndex += 1;
							$scope.getChannel();
						}
						$scope.$apply();
					});
				} else {
					$scope.finishLoadingChannels();
				}
			};
	
			// add channels items
			$scope.addChannelItems = function(chJson){
				// list optional files
				Page.cmd("optionalFileList", { address:chJson.channel.cluster_id, limit:2000 }, function(site_files){
					// assign to each file in chJson.items its correspoding site_file
					chJson = Channel.matchItemsWithSiteFiles(chJson,site_files);
					var channel = chJson.channel;
					channel._id = $scope.cIndex;
					channel.items_total = chJson.items_total;
					channel.items = chJson.items;
					$scope.channels.push(channel);
					// merge chJson.items to $scope.items
					if (!$scope.items) {
						$scope.items = {
							total:0
						};	
					}
					if (!$scope.media_types) $scope.media_types = [];
					$scope.items = Central.mergeChannelItems($scope.items,$scope.items_total,$scope.media_types,chJson);					
					$scope.cIndex += 1;
					$scope.getChannel();
			    });
			};

			// finish loading channels
			$scope.finishLoadingChannels = function(){
				console.log('finish loading channels!');
				console.log($scope.channels);
				console.log('total channels - ' + $scope.channels.length);
				console.log('--------------------------');				
				var query = ["SELECT * FROM moderation WHERE current = 1"];
				Page.cmd("dbQuery", query ,function(moderations){
					$scope.channels = Central.joinChannelModeration($scope.channels,moderations);
					// sort media types alphabetically
					$scope.media_types.sort();
					// finished loading & apply to scope
					$scope.$apply(function(){
						// finish loading
						$scope.finishedLoading();
					});
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
