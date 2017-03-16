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
					Page.cmd("wrapperGetLocalStorage",[],function(res){
						if (res){
							Page.local_storage = res;
						} else {
							Page.local_storage = {};
						}
						// apply site info to Page obj
						Page.site_info = site_info;
						// page
						$scope.page = Page;
						console.log($scope.page);
						// get config
						Page.cmd("fileGet",{"inner_path":"content/config.json"},function(data){
							console.log('get config file');
							$scope.config = JSON.parse(data);
							console.log('--------------------------');
							// get channels
							$scope.getMergerPermission();
						});
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
							console.log('cluster '+ $scope.clusters[$scope.clIndex].cluster_id +' exists!');
							$scope.clIndex += 1;
							$scope.varifyClusters();
						} else {
							console.log('cluster '+$scope.clusters[$scope.clIndex].cluster_id+' doesnt exist!');
							$scope.addCluster();
						}
		    		} else {
						console.log('no merged sites!');
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

		    // on get channels
		    $scope.onGetChannels = function(){
	    		console.log('on get channels');
				console.log('--------------------------');
		    	$scope.jsons = [];
		    	$scope.channelsAddressArray = [];
				var query = ["SELECT * FROM json"];
				Page.cmd("dbQuery", query, function(jsons) {
					$scope.$apply(function(){
						if (jsons){
							console.log(jsons);
							jsons.forEach(function(json,index){
								if (json.file_name === 'content.json'){
									var cJson = json.site + '/' + json.directory;
									$scope.jsons.push(cJson);
								}
							});
							if ($scope.jsons){
								console.log('getting content jsons');
								$scope.cJsonIndex = 0;
								$scope.getContentJson();
							} else {
								$scope.showLoadingMessage('No Channels!');
								$scope.finishedLoading();
							}					
						} else {
							$scope.showLoadingMessage('No Channels!');
							$scope.finishedLoading();
						}
					});
				});
		    };

		    // get content json
		    $scope.getContentJson = function(){
		    	if ($scope.cJsonIndex < $scope.jsons.length){
					// get content.json
					Page.cmd("fileGet",{"inner_path":'merged-'+$scope.page.site_info.content.merger_name+'/'+$scope.jsons[$scope.cJsonIndex] + '/content.json',"required": false },function(contentJson){
						$scope.$apply(function(){
							if (contentJson){
								contentJson = JSON.parse(contentJson);
								// check files optional
								for (var i in contentJson.files_optional){
									if (i.indexOf('.json') > -1 && i !== 'channels.json' && i !== 'comments.json' &&  i !== 'comment.json' && i !== 'votes.json' && i !== 'moderation.json'){
										var channelJsonAddress = $scope.jsons[$scope.cJsonIndex] + '/' + i;
										$scope.channelsAddressArray.push(channelJsonAddress);
									}
								}
								// check files
								for (var i in contentJson.files){
									if (i.indexOf('.json') > -1 && i !== 'channels.json' && i !== 'comments.json' &&  i !== 'comment.json' && i !== 'votes.json' && i !== 'moderations.json'){
										var channelJsonAddress = $scope.jsons[$scope.cJsonIndex] + '/' + i;
										$scope.channelsAddressArray.push(channelJsonAddress);
									}
								}
							}
							$scope.cJsonIndex += 1;
							$scope.getContentJson();
						});
					});
				} else {
					$scope.getChannels();
				}    	
		    };

			// get channels
			$scope.getChannels = function(){
	    		console.log('get channels');
				console.log('--------------------------');
				$scope.cIndex = 0;
				$scope.channels = [];
				if ($scope.channelsAddressArray.length > 0){
					$scope.getChannel();
				} else {
					$scope.showLoadingMessage('No Channels!');
					$scope.finishedLoading();
				}
			};

			// get channel
			$scope.getChannel = function(){
					console.log( ) ;
					$scope.showLoadingMessage('Loading Channels ('+parseInt(($scope.cIndex / $scope.channelsAddressArray.length) * 100)+'%)');
				// update cIndex
				if ($scope.cIndex < $scope.channelsAddressArray.length){
					var inner_path = 'merged-'+$scope.page.site_info.content.merger_name+'/'+$scope.channelsAddressArray[$scope.cIndex];
					// get channel.json
					Page.cmd("fileGet",{"inner_path":inner_path,"required": false },function(chJson){
					    if (chJson){
							chJson = JSON.parse(chJson);
							$scope.addChannelItems(chJson);
						} else {
							console.log('missing channel json - '+inner_path+'!');
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
					$scope.$apply(function(){
						// assign to each file in chJson.items its correspoding site_file
						chJson = Channel.matchItemsWithSiteFiles(chJson,site_files);
						// merge chJson.items to $scope.items
						if (!$scope.items) {
							$scope.items = {
								total:0
							};	
						}
						if (!$scope.media_types) $scope.media_types = [];
						$scope.items = Central.mergeChannelItems($scope.items,$scope.items_total,$scope.media_types,chJson);
						var channel = chJson.channel;
						channel.items_total = chJson.items_total;
						$scope.channels.push(channel);
						$scope.cIndex += 1;
						$scope.getChannel();
					});
			    });
			};

			// finish loading channels
			$scope.finishLoadingChannels = function(){
				console.log('finish loading channels!');
				console.log($scope.channels);
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
				$scope.site_ready = true;				
				$scope.loading = false;
				$scope.msg = '';				
			};

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

	    /* IFS CERTIFICATE */

		    // select user
		    $scope.selectUser = function(){
			    Page.cmd("certSelect",[['ifs.bit']]);
				Page.onRequest = function(cmd, message) {
					$scope.$apply(function(){
					    if (cmd == "setSiteInfo") {
							// site info
							Page.site_info = message;
							// attach to scope
							$scope.page = Page;
						}
					});
				};
		    };

	    	// create ifs cert
	    	$scope.createIfsCert = function(name){

	    		if ($scope.page.site_info.cert_user_id && $scope.page.site_info.cert_user_id.split('@')[1] === 'ifs.bit'){
	    			console.log('allready using @ifs.bit certificate');
    				Page.local_storage['ifs_cert_created'] = true;
    				Page.cmd("wrapperSetLocalStorage",Page.local_storage);	
	    			$scope.selectUser();
	    		} else {
	    			console.log('not using @ifs.bit certificate');
	    			if ($scope.page.local_storage.ifs_cert_created === true){
		    			console.log('ifs.bit certificate created');
		    			$scope.selectUser();
	    			} else {
				    	if (!name) name = Central.generateRandomString(13);
				        var certname = "ifs.bit"
				        var genkey = bitcoin.ECPair.makeRandom().toWIF();
			    		var genid =  bitcoin.ECPair.fromWIF(genkey);
		    			var cert = bitcoin.message.sign(genid, ($scope.page.site_info.auth_address + "#web/") + name).toString("base64");
		    			Page.cmd("certAdd", [certname, "web", name, cert], function(res){
		    				Page.local_storage['ifs_cert_created'] = true;
		    				Page.cmd("wrapperSetLocalStorage",Page.local_storage);	
		    				$scope.selectUser();
		    			});
	    			}
	    		}
	    	};

		    // on select user
		    $rootScope.$on('onSelectUser',function(event,mass) {
		    	$scope.createIfsCert();
		    });

		    // on create ifs cert
		    $rootScope.$on('onCreateIfsCert',function(event,mass) {
		    	$scope.createIfsCert();
		    });

	    /* /IFS CERTIFICATE */


	}
]);
