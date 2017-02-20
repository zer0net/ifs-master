app.controller('MainCtrl', ['$rootScope','$scope','$location','$mdDialog', '$mdMedia','Item','Channel','Central',
	function($rootScope,$scope,$location,$mdDialog,$mdMedia,Item,Channel,Central) {

		/* INIT SITE */

			// init
			$scope.init = function(){
				// config
				$scope.config = {
					media_types:[						
						'games',
						'videos'
					],
					listing:{
						type:'by file type',
						items_per_page:10
					}
				}
				// site ready var to fix loading inconsistancies
				$scope.site_ready = false;				
				// loading
				$scope.showLoadingMessage('Loading');
				// get site info
				Page.cmd("siteInfo", {}, function(site_info) {					
					$scope.merger_name = site_info.content.merger_name;
					$scope.site_address = site_info.address;
					$scope.channel_master_address = site_info.address;	
					$scope.owner = site_info.settings.own;
					// apply site info to Page obj
					Page.site_info = site_info;
					// page
					$scope.page = Page;
					// update site
					Page.cmd('siteUpdate',{"address":$scope.site_address});
					// apply auth address to scope
					if (Page.site_info.cert_user_id) { $scope.user = Page.site_info.cert_user_id; } 
					else { $scope.user = Page.site_info.auth_address; }
					// merger site permission
					$scope.getMergerPermission();	
		    	});
			};

			// get merger site permission
			$scope.getMergerPermission = function(){						
				// if user allready has permission for merger type
		    	if (Page.site_info.settings.permissions.indexOf("Merger:"+$scope.merger_name) > -1){
		    		$scope.$apply(function(){
		    			// get merged sites
		    			$scope.getMergedSites();
		    		});
		    	} else {
		    		// if not, ask user for permission
					Page.cmd("wrapperPermissionAdd", "Merger:"+$scope.merger_name, function() {
						$scope.$apply(function(){
			    			// get merged sites
			    			$scope.getMergedSites();
						});
					});
		    	}
			};  

		    // get merged sites
		    $scope.getMergedSites = function(){		    	
		    	// loading		    	
				$scope.showLoadingMessage('Listing merged sites');
				// merged sites array		    	
		    	$scope.sites = [];
				Page.cmd("mergerSiteList", {query_site_info: true}, function(sites) {		
					// for every site in sites obj					
					for (var site in sites) {
					    if (!sites.hasOwnProperty(site)) continue;
					    var site = sites[site];
					    // push site to sites array
					    $scope.sites.push(site);
					}
					$scope.$apply(function(){
						// get channels
						$scope.getChannels();
					});
				});
		    };

			// get channels
			$scope.getChannels = function(){
				// loading
				$scope.showLoadingMessage('Loading Channels');					
				// get channels				
				var query = ["SELECT * FROM channel where hide = 0 ORDER BY date_added"];
				Page.cmd("dbQuery", query, function(channels) {	
					if (channels.length > 0){
						$scope.channels = channels;
						// render channels														
						$scope.renderChannels();
					} else {
						$scope.$apply(function(){
							$scope.finishedLoading();
						});
					}
				});

			};

			// render channels
			$scope.renderChannels = function(){
				// items array, named ny media type var
				$scope[$scope.media_type] = [];
				$scope.cIndex = 0;
				$scope.renderChannel($scope.channels[$scope.cIndex]);
			};

			// render channel 
			$scope.renderChannel = function(channel){
				$scope.cIndex += 1;
				if ($scope.channels.length > $scope.cIndex){
					var siteExists = false;
					// loop through sites array
					$scope.sites.forEach(function(site,sIndex){
						// if channel's id exists in merged sites array
						if (site.address === channel.channel_address){
							siteExists = true;
							for (var attr in site) { 
								channel[attr] = site[attr];
							}
						}
					});
					// if site exists get channel, if not add merged site
					if (siteExists === true){
						console.log('before get channel ' + ($scope.cIndex - 1 ));
						// get channel						
						$scope.getChannel(channel);
					} else {						
						console.log('site ' + channel.channel_address + ' doesnt exists! adding site...');
						// add merger site
						$scope.addSite(channel,cIndex);
					}
				} else {
					console.log('finished loading before');
					$scope.finishLoadingChannels();
				}
			};
			
			// add merger site
			$scope.addSite = function(channel,cIndex){
				Page.cmd("mergerSiteAdd",{"addresses":channel.channel_address},function(data){
					// list merger sites					
					Page.cmd("mergerSiteList", {query_site_info: true}, function(sites) {						
						// for each site in merger site list
						for (var site in sites) {
						    var site = sites[site];
						    var siteFound = false;
							// if channel's id exists in merged sites array
						    if (site.address === channel.channel_address){
						    	siteFound = true;
						    	// info prompt
								Page.cmd("wrapperNotification", ["info", "Refresh this page to view new content", 10000]);
						    	// push site to sites array
								$scope.sites.push(site);
								// get channel						
								$scope.getChannel(site,cIndex);
						    }
						}
						// if no matching site found in merger site list after adding
						if (siteFound === false){
						// finish loading		    	
						    $scope.finishLoadingChannels(cIndex);								
						}
					});					
				});
			};

			// get channel
			$scope.getChannel = function(channel){
				// get channel's content.json
				var inner_path = 'merged-'+$scope.merger_name+'/'+channel.address+'/content.json';
				Page.cmd("fileGet",{"inner_path":inner_path},function(data){
					// check if site has content.json
				    if (!data){
						console.log('No content.json found for '+channel.address+'!');
						$scope.renderChannel($scope.channels[$scope.cIndex])
					} else {
						data = JSON.parse(data);
						// channel info
						channel.channel_name = data.title;
						channel.channel_description = data.description;
						// get channel.json
						var inner_path = 'merged-'+$scope.merger_name+'/'+channel.address+'/data/channel.json';					
						Page.cmd("fileGet",{"inner_path":inner_path},function(data){
							// assign games
							data = JSON.parse(data);
							// if channel has data
							if (!data){
								console.log('no data');
								$scope.renderChannel($scope.channels[$scope.cIndex]);
							} else {
								console.log('yes data');
								// render channel on get
								channel = Channel.renderChannelOnGet(channel,data,$scope.media_type);
								// apply to scope
								if (channel.hide==0){ // add item if channel is not hidden
									$scope.$apply(function() {
										// get channel items
										$scope.addChannelItems(data,channel);
									});
								}
							}
						});
					}
				});
			};
	
			// add channels items
			$scope.addChannelItems = function(data,channel,cIndex){
				// list optional files
				Page.cmd("optionalFileList", { address: channel.address, limit:2000 }, function(site_files){
					var totalItems = $scope.countChannelItems(data);
					var totalItemsIndex = 0;
		      		// for every media type in site config				      		
					for (var media_type in $scope.config.media_types){
						media_type = $scope.config.media_types[media_type];
						// if channel has media type array
						if (data[media_type] && data[media_type].length > 0){
							// loop through items in data
							data[media_type].forEach(function(item,itemIndex){
								totalItemsIndex++;
								// render channel item via Item service
								item = Item.renderChannelItem($scope,item,site_files,channel);
								// apply to general scope items array
								if (!$scope.items) $scope.items = [];
								$scope.items.push(item);
							});
						}
					}
		      		if (totalItemsIndex === totalItems){
		      			console.log('finished adding channel items ' + ($scope.cIndex - 1));
						$scope.renderChannel($scope.channels[$scope.cIndex])
		      		}
			    });
			};			
	
			// count channel items
			$scope.countChannelItems = function(data){
				var totalItems = 0;
				for (var media_type in $scope.config.media_types){
					media_type = $scope.config.media_types[media_type];
					if (data[media_type] && data[media_type].length>0){
						totalItems += data[media_type].length;
					}
				}	      		
				return totalItems;			
			};

			// finish loading channels
			$scope.finishLoadingChannels = function(){
				// render items before finish loading
				if ($scope.config.listing.type === 'by media type'){
					// render items by media types
					$scope = Central.listItemsByMediaType($scope);
				} else if ($scope.config.listing.type === 'by file type'){
					// render items by file type
					$scope = Central.listItemsByFileType($scope);
				}
				// finished loading & apply to scope
				$scope.$apply(function(){
					// finish loading					
					$scope.finishedLoading();
				});
			};

		/* /INIT SITE */

		/* FILTER */

			// main filter function
			$scope.mainFilter = function(ppFilter) {
				// render items before finish loading
				if ($scope.config.listing.type === 'by media type'){
					// render items by media types
					$scope = Central.listItemsByMediaType($scope,ppFilter);
				} else if ($scope.config.listing.type === 'by file type'){
					// render items by file type
					$scope = Central.listItemsByFileType($scope,ppFilter);
				}
				// rootscope broadcast
				$rootScope.$broadcast('mainFilter',$scope);
			};

			// main remove filter function
			$scope.mainRemoveFilter = function() {
				// render items before finish loading
				if ($scope.config.listing.type === 'by media type'){
					// render items by media types
					$scope = Central.listItemsByMediaType($scope);
				} else if ($scope.config.listing.type === 'by file type'){
					// render items by file type
					$scope = Central.listItemsByFileType($scope);
				}
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
		    	Page.cmd("certSelect", [["zeroid.bit"]]);
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
				$scope.cloneFileHub();
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

// dialog controller
var DialogController = function($scope, $mdDialog) {
	$scope.hide = function() {
		$mdDialog.hide();
	};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	$scope.answer = function(answer) {
		$mdDialog.hide(answer);
	};
};