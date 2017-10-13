app.controller('MainCtrl', ['$rootScope','$scope','$location','$window','$mdDialog', '$mdMedia','$anchorScroll','Item','Channel','Moderation','Central','$location',
	function($rootScope,$scope,$location,$window,$mdDialog,$mdMedia,$anchorScroll,Item,Channel,Moderation,Central,$location) {

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
					Page.cmd("serverInfo", {},function(server_info){
						console.log($location);
						console.log(server_info);
						// apply site info to Page obj
						Page.site_info = site_info;
						// get local storage	
						Page.cmd("wrapperGetLocalStorage",[],function(res){
							// local storage response
							if (res){ Page.local_storage = res; } 
							else { Page.local_storage = {}; }
							if (Page.site_info.cert_user_id && Page.site_info.cert_user_id.split('@')[1] === 'ifs.anonymous') Page.local_storage.ifs_cert_created = true;
							// page
							$scope.page = Page;
							// get config
							Page.cmd("fileGet",{"inner_path":"content/config.json"},function(data){
								$scope.config = JSON.parse(data);
								$scope.page.site_info.content.merger_name = $scope.config.merger_name;
								// get merger permission
								$scope.getMergerPermission();
							});
						});

					});
		    	});
			};

			// get merger site permission
			$scope.getMergerPermission = function(){
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
						if (!$scope.sites) {
						 $scope.sites = [];
						 $scope.sites_id = [];	
						}
						$scope.sites.push(sites[site]);
						$scope.sites_id.push(site);
					}
					$scope.getClusters();
				});	
			};

		    // get clusters
		    $scope.getClusters = function(){
				// loading
				$scope.showLoadingMessage('Loading Clusters');
				$scope.clusters = $scope.config.clusters;
				$scope.cl_id = [];
				$scope.clusters.forEach(function(cl,index){
					$scope.cl_id.push(cl.cluster_id);
				});
				$scope.clIndex = 0;
				$scope.varifyClusters();
		    };

		    // varify cluster
		    $scope.varifyClusters = function(){
		    	if ($scope.clIndex < $scope.clusters.length){
		    		if ($scope.sites){
						if ($scope.sites_id.indexOf($scope.clusters[$scope.clIndex].cluster_id) > -1){
							// get optional file list
							Page.cmd("optionalFileList", { address: $scope.clusters[$scope.clIndex].cluster_id, limit:2000 }, function(site_files){
								$scope.$apply(function(){
									$scope.clusters[$scope.clIndex] = Channel.findClusterInMergerSiteList($scope.clusters[$scope.clIndex],$scope.sites);						
									$scope.clusters[$scope.clIndex].files = site_files;
									$scope.clIndex += 1;
									$scope.varifyClusters();
								});					
							});
						} else {
							console.log('cluster '+$scope.clusters[$scope.clIndex].cluster_id+' doesnt exist!');
							$scope.addCluster();
						}
		    		} else {
						console.log('no merged sites!');
		    			$scope.addCluster();
		    		}
		    	} else {
		    		$scope.routeView();
		    	}
		    };

		    // add cluster to merger sites
		    $scope.addCluster = function() {
				Page.cmd("mergerSiteAdd",{"addresses":$scope.cl_id},function(data){
					Page.cmd("wrapperNotification", ["info", "refresh this site to view new content", 10000]);
				});
		    };

		    // config site route
		    $scope.routeView = function(){
		    	$scope.path = $location.$$absUrl.split($scope.page.site_info.address+'/')[1];
		    	if ($scope.path.indexOf('&') > -1) $scope.path = $scope.path.split('&')[0];
		    	if ($scope.path.indexOf('?wrapper') > -1 || $scope.path === ''){
		    		$scope.route = 'main';
		    	} else {
			    	if ($scope.path.indexOf('?') > -1){
				    	$scope.path = $scope.path.split('?')[1];
				    	if ($scope.path.indexOf('route:') > -1){
				    		var route = $scope.path.split('route:')[1];
				    		$scope.route = route;
				    		if (route.indexOf('+') > -1){
				    			$scope.route = route.split('+')[0];
				    			$scope.channel_id = route.split('id:')[1];
				    			if ($scope.channel_id && $scope.channel_id.indexOf('+type') > -1) {
				    				$scope.channel_id = $scope.channel_id.split('+')[0];
				    			}
				    		} else {
				    			$scope.route = route;
				    		}
				    	}
				    } else {
		    			$scope.route = 'main';				    	
				    }
		    	}
		    	console.log('route : ' + $scope.route);
		    	if ($scope.content_type) console.log('content_type: ' + $scope.content_type);
		    	if ($scope.channel_id) {
					console.log('channel : ' + $scope.channel_id);
					var query = ["SELECT * FROM channel WHERE channel_address='"+$scope.channel_id+"'"];
					Page.cmd("dbQuery", query ,function(channel){
						$scope.$apply(function(){
							$scope.channel = channel[0];
						});
					});
		    	}
		    	$scope.getModerations();
		    };

		    // route site
		    $scope.routeSite = function(route){
		    	if (!route){
		    		if ($scope.path.indexOf('route:') > -1){
		    			$window.location.href = '/'+$scope.page.site_info.address+'/';
		    		} else {
			    		var route = 'main';
			    		delete $scope.content_type;
			    		delete $scope.channel_id;
						$scope.removeFilterChannel();
						$rootScope.$broadcast('onRemoveFilterChannel',$scope.channel);
		    		}
		    	}
		    	// scroll DOM
				$location.hash('page-content-wrapper');
				$anchorScroll();	
		    	$scope.route = route;
		    };

		    // on view item
		    $scope.onViewItem = function(item){
		    	$window.location.href = '/'+$scope.page.site_info.address+'/index.html?route:item+id:'+item.item_id+'+type:'+item.content_type;
		    }

		    // show error page
		    $scope.showErrorPage = function(){
		    	var route = '404';
		    	$scope.routeSite(route);
		    };

			// finish loading channels
			$scope.getModerations = function(){
				console.log('get moderations');
				var query = ["SELECT * FROM moderation WHERE current = 1 ORDER BY date_added DESC"];
				Page.cmd("dbQuery", query ,function(moderations){
					$scope.$apply(function(){
						if (moderations){
							$scope.moderations = Moderation.renderModerations(moderations);
							// generate hidden channels id array
							$scope.hidden_channels = Moderation.generateHiddenChannelsArray(moderations);
							$scope.hidden_users = Moderation.generateHiddenUserChannelsArray(moderations);
						}
						// finish loading
						$scope.finishedLoading();
					});
				});
			};

			$rootScope.$on("setGlobalUser",function(event,mass){
				$scope.user = mass;
				$scope.user.user_path = 'merged-'+$scope.page.site_info.content.merger_name+'/'+$scope.user.cluster+'/data/users/'+$scope.user.user_auth_address+'/data.json'
			});

		/* /INIT SITE */

		/* FILTER */

			// filter channel
			$scope.filterChannel = function(channel){
				$scope.channel = channel;
			};

			// remove filter channel
			$scope.removeFilterChannel = function(){
				if ($scope.channel) delete $scope.channel;
			};

		/* /FILTER */

	    /* IFS CERTIFICATE */

			// update content user json
			$scope.updateContentJson = function(cluster_id){
				var inner_path = 'merged-'+$scope.page.site_info.content.merger_name+'/'+cluster_id+'/data/users/'+$scope.page.site_info.auth_address+'/content.json';
				Page.cmd("fileGet", { "inner_path":inner_path, "required": false },function(contentJson) {
					// add optional attribute if doesnt exist
					contentJson = JSON.parse(contentJson);
					contentJson.optional = Central.generateContentJsonOptionalList($scope.config.file_types);
					// write content.json to file
					var json_raw = unescape(encodeURIComponent(JSON.stringify(contentJson, void 0, '\t')));
					Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
						// publish content.json
						Page.cmd("sitePublish",{"inner_path":inner_path}, function(res) {
							// apply to scope
							$scope.$apply();
						});
					});
				});
			};

		    // select user
		    $scope.selectUser = function(){
			    Page.cmd("certSelect",[['ifs.anonymous','zeroid.bit']]);
				Page.onRequest = function(cmd, message) {
					$scope.$apply(function(){
					    if (cmd == "setSiteInfo") {
							// site info
							Page.site_info = message;
							// attach to scope
							$scope.page = Page;
							// broadcast
							$rootScope.$broadcast('onChangeUser');
							$scope.hideInfoMsg();
						}
					});
				};
		    };

	    	// create ifs cert
	    	$scope.createIfsCert = function(name){
		    	if (!name) name = Central.generateRandomString(13);
		        var certname = "ifs.anonymous";
		        var genkey = Central.grk($scope.config);
	    		var genid =  bitcoin.ECPair.fromWIF(genkey);
    			var cert = bitcoin.message.sign(genid, ($scope.page.site_info.auth_address + "#web/") + name).toString("base64");
    			Page.cmd("certAdd", [certname, "web", name, cert], function(res){
    				$scope.page.local_storage['ifs_cert_created'] = true;
    				Page.cmd("wrapperSetLocalStorage",$scope.page.local_storage);	
    				$scope.selectUser();
    			});
	    	};

	    	// 

	    /* /IFS CERTIFICATE */

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

		    // on select user
		    $rootScope.$on('onSelectUser',function(event,mass) {
		    	$scope.createIfsCert();
		    });

		    // on create ifs cert
		    $rootScope.$on('onCreateIfsCert',function(event,mass) {
		    	$scope.createIfsCert();
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
						document.body.append(script);
	                }
			        return script;
			    }
			};
			
			// get channel logo path
			$scope.getChannelLogoPath = function(channel){
				if (channel.logo_file){
					channel.logo_path = '/'+$scope.page.site_info.address+'/merged-CDN/'+channel.cluster_id+'/data/users/'+channel.channel_address.split('_')[1]+'/'+channel.logo_file;
				} else {
					channel.logo_path = '/'+$scope.page.site_info.address+'/assets/channel/img/x-avatar.png';
				}
			}

			// set info message time out
			$scope.setInfoMsgTimeOut = function(sec){
				if (!sec) var sec = 1200;
				console.log("start timeout");
				setTimeout(function() {
					$scope.showInfoMsg();
				}, sec);
			};

			// show info message
			$scope.showInfoMsg = function(){
				if (!$scope.info_msg_canceled){
					$scope.show_info_msg = true;
				}
			};

			// hide info message
			$scope.hideInfoMsg = function(){
				console.log("hide info msg / cancel timeout");
				if (!sec) var sec = 2000;
				$scope.show_info_msg = false;
				$scope.info_msg_canceled = true;
			};

	    /* /UI */

	}
]);
