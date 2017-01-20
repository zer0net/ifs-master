app.controller('MainCtrl', ['$rootScope','$scope','$location','$mdDialog', '$mdMedia','Item','Channel',
	function($rootScope,$scope,$location,$mdDialog,$mdMedia,Item,Channel) {

		/* INIT SITE */

			// init
			$scope.init = function(){
				$scope.site_ready = false;				
				// loading
				$scope.showLoadingMessage('Loading');
				// get site info
				Page.cmd("siteInfo", {}, function(site_info) {					
					$scope.site_address = site_info.address;
					$scope.channel_master_address = site_info.address;	
					$scope.merger_name = site_info.content.merger_name;
					// apply site info to Page obj
					Page.site_info = site_info;
					// owner					
					$scope.owner = site_info.settings.own;
					// page
					$scope.page = Page;
					// update site
					Page.cmd('siteUpdate',{"address":$scope.site_address});
					// apply auth address to scope
					if (Page.site_info.cert_user_id) { $scope.user = Page.site_info.cert_user_id; } 
					else { $scope.user = Page.site_info.auth_address; }
					// merger site permission
					$scope.getConfig();
		    	});
			};

			// get config json
			$scope.getConfig = function(){
				$scope.config = {
					media_types:[
						'all',
						'games',
						'videos'
					]
				}
				$scope.getMergerPermission();
			};

			// generate config
			$scope.generateConfig = function(){
				// dialog vars
				$scope.status = '';
				$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
			    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
			    // dialog template
			    var dialogTemplate = 
			    	'<md-dialog aria-label="Configuration">' +
					    '<md-toolbar>' +
					    	'<div class="md-toolbar-tools">' +
						        '<h2>Configuration</h2>' +
						        '<span flex></span>' +
						        '<md-button class="md-icon-button" ng-click="cancel()">' +
						            '<md-icon md-svg-src="img/icons/ic_close_24px.svg" aria-label="Close dialog"></md-icon>' +
						        '</md-button>' +
					    	'</div>' +
					    '</md-toolbar>' +
					    '<md-dialog-content site-config ng-init="initSiteConfig()" layout-padding style="width:400px" layout="column">' +
			    			'<label style="margin: 0;padding: 0 8px;">media type</label>' +
							'<md-input-container style="margin:0;" flex>' +
								'<md-checkbox ng-repeat="mediaType in mediaTypes" ng-model="config[mediaType]" aria-label="{{mediaType}}" ng-click="updateMediaTypes(config,mediaType)">{{mediaType}}</md-checkbox>' +
			    			'</md-input-container>' +
				            '<md-button flex="100" class="md-primary md-raised edgePadding pull-right" ng-click="updateConfig(config)">' +
				            	'<label>Update Configuration</label>' +
				            '</md-button>' +
					    '</md-dialog-content>' +				    
					'</md-dialog>';
				// show dialog
			    $mdDialog.show({
					controller: DialogController,
					template: dialogTemplate,
					parent: angular.element(document.body),
					clickOutsideToClose:true,
					fullscreen: useFullScreen
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
				// for each channel
				$scope.channels.forEach(function(channel,cIndex){
	 				// check if site exists
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
						// get channel
						$scope.getChannel(channel,cIndex);
					} else {						
						console.log('site ' + channel.channel_address + ' doesnt exists! adding site...');
						// add merger site
						$scope.addSite(channel,cIndex);
					}
				});
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
			$scope.getChannel = function(channel,cIndex){
				// get channel's content.json
				var inner_path = 'merged-'+$scope.merger_name+'/'+channel.address+'/content.json';
				Page.cmd("fileGet",{"inner_path":inner_path},function(data){
					// check if site has content.json
				    if (!data){
						console.log('No content.json found for '+channel.address+'!');
						$scope.finishLoadingChannels(cIndex);
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
								$scope.finishLoadingChannels(cIndex);
							} else {
								// render channel on get
								channel = Channel.renderChannelOnGet(channel,data,$scope.media_type);
								// apply to scope
								$scope.$apply(function() {
									// get channel items
									$scope.addChannelItems(data,channel,cIndex);									
								});
							}
						});
					}
				});
			};
	
			// add channels items
			$scope.addChannelItems = function(data,channel,cIndex){
				Page.cmd("optionalFileList", { address: channel.address, limit:2000 }, function(site_files){
					var totalItems = $scope.countChannelItems(data);
					var totalItemsIndex = 0;
		      		for (var media_type in data){
		      			if (Object.prototype.toString.call(data[media_type]) === '[object Array]'){
		      				if (data[media_type].length > 0){
			      				if ($scope.config.media_types.indexOf(media_type) > -1){
			      					if (data[media_type].length)
			      					// loop through items in data
			      					data[media_type].forEach(function(item,itemIndex){
			      						totalItemsIndex++;
			      						// render channel item via Item service
			      						item = Item.renderChannelItem($scope,item,site_files,channel);
			      						// apply to scope items array						
			      						if (!$scope[media_type]) $scope[media_type] = [];
			      						$scope[media_type].push(item);
			      					});
			      				}
		      				}
		      			}
		      		}
		      		if (totalItemsIndex === totalItems){
						// finish loading
						$scope.finishLoadingChannels(cIndex);
		      		}
			    });
			};
	
			// count channel items
			$scope.countChannelItems = function(data){
				var totalItems = 0;
	      		for (var media_type in data){
	      			if (Object.prototype.toString.call(data[media_type]) === '[object Array]'){
	      				totalItems += data[media_type].length;

	      			}
	      		}
				return totalItems;			
			};

			// finish loading channels
			$scope.finishLoadingChannels = function(cIndex){
				// if channel index + 1 equals number of channels
				if ((cIndex + 1) === $scope.channels.length){
					// finished loading & apply to scope
					$scope.$apply(function(){
						// finish loading
						$scope.finishedLoading();
					});
				}
			};

		/* /INIT SITE */

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