app.controller('MainCtrl', ['$rootScope','$scope','$location','$mdDialog', '$mdMedia','Item','Channel','Central',
	function($rootScope,$scope,$location,$mdDialog,$mdMedia,Item,Channel,Central) {

		/* INIT SITE */

			// init
			$scope.init = function(){
				console.log('Init');
				// loading
				$scope.showLoadingMessage('Loading');
				// site ready var to fix loading inconsistancies
				$scope.site_ready = false;
				// get site info
				Page.cmd("siteInfo", {}, function(site_info) {
					// apply site info to Page obj
					Page.site_info = site_info;
					// get local storage	
					Page.cmd("wrapperGetLocalStorage",[],function(res){
						// local storage response
						if (res){ Page.local_storage = res; } 
						else { Page.local_storage = {}; }
						// page
						$scope.page = Page;
						// get config
						Page.cmd("fileGet",{"inner_path":"content/config.json"},function(data){
							$scope.config = JSON.parse(data);
							// get merger permission
							$scope.getMergerPermission();
						});
					});					
		    	});
			};

			// get merger site permission
			$scope.getMergerPermission = function(){
				console.log('get merger permission');
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
				console.log('get merger sites');
				Page.cmd("mergerSiteList", {query_site_info: true}, function(sites) {	
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
				console.log('get clusters');
				// loading
				$scope.showLoadingMessage('Loading Clusters');		    	
				$scope.clusters = $scope.config.clusters;
				$scope.clIndex = 0;
				$scope.varifyClusters();
		    };

		    // varify cluster
		    $scope.varifyClusters = function(){
		    	if ($scope.clIndex < $scope.config.clusters.length){
		    		if ($scope.sites){
						if ($scope.sites.indexOf($scope.clusters[$scope.clIndex].cluster_id) > -1){
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
		    		$scope.getClusterSiteInfo();
		    	}
		    };

		    // add cluster to merger sites
		    $scope.addCluster = function() {
				console.log('adding cluster - ' + $scope.clusters[$scope.clIndex].cluster_id);
				Page.cmd("mergerSiteAdd",{"addresses":$scope.clusters[$scope.clIndex].cluster_id},function(data){
					Page.cmd("wrapperNotification", ["info", "refresh this site to view new content", 10000]);
				});
		    };

		    // get cluster site info
		    $scope.getClusterSiteInfo = function(){
		    	// query merger site list
		    	Page.cmd("mergerSiteList", {query_site_info: true}, function(sites) {
		    		// find cluster in sites & bind it to scope
		    		$scope.clusters.forEach(function(item,index){
		    			$scope.clusters[index] = Channel.findClusterInMergerSiteList(sites,item.cluster_id);
		    		});
		    		// get channels
		    		$scope.getChannels();
		    	});
		    };

		    // get channels
		    $scope.getChannels = function(){
	    		console.log('get channels');
				// query channels
				var query = ["SELECT * FROM channel"];
				Page.cmd("dbQuery", query, function(channels){
					$scope.channels = channels;
					// query old channels
					var query = ["SELECT * FROM channel_old"];
					Page.cmd("dbQuery", query, function(channel_old){
						if (channel_old){
							// channel_old = Channel.renderLegacyChannels();
						}
						$scope.channels = $scope.channels.concat(channel_old);
						console.log($scope.channels);
						$scope.$apply(function(){
							console.log($scope.channels);
							if (channels.length > 0 && $scope.route === 'main'){
								$scope.getModerations();
							} else {
								$scope.routeView();
							}
						});
					});
				});
		    };

			// finish loading channels
			$scope.getModerations = function(){
				console.log('get moderations');
				var query = ["SELECT * FROM moderation WHERE current = 1"];
				Page.cmd("dbQuery", query ,function(moderations){
					console.log(moderations);
					$scope.$apply(function(){					
						// channels & moderations
						$scope.channels = Central.joinChannelModeration($scope.channels,moderations);
						// finish loading
						$scope.routeView();
					});
				});
			};

		    // config site route
		    $scope.routeView = function(){
	    		console.log('route view');		    	
		    	var path = $location.$$absUrl.split($scope.page.site_info.address+'/')[1].split('?')[0];
		    	if (path === '' || path === 'index.html'){
		    		$scope.route = 'main';
		    	} else if (path.indexOf('user/') > -1 ) {
		    		$scope.route = 'user';
		    	}
		    	console.log('route view : ' + $scope.route);
		    	$scope.finishedLoading();
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

			// toggle menu
			$scope.toggleMenu = function(ev) {
				ev.preventDefault();
				if (!$scope.toggled || $scope.toggled === false){
					$scope.toggled = true;
				} else {
					$scope.toggled = false;
				}
			}

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
			
	    /* /UI */

	    /* IFS CERTIFICATE */

		    // select user
		    $scope.selectUser = function(){
			    Page.cmd("certSelect",[]);
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
	    			if ($scope.page.local_storage && $scope.page.local_storage.ifs_cert_created === true){
		    			console.log('ifs.bit certificate created');
		    			$scope.selectUser();
	    			} else {
				    	if (!name) name = Central.generateRandomString(13);
				        var certname = "ifs.bit";
				        // var genkey = bitcoin.ECPair.makeRandom().toWIF();
				        var genkey = "5JxRNCL3WTqjHuSivNBqDkaMvVkgzShWDotXYw2rXRmJFrd9RuV";
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
