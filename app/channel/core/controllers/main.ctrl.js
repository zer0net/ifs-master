app.controller('ChannelMainCtrl', ['$scope','$rootScope','$sce','$location','$window',
	function($scope,$rootScope,$sce,$location,$window) {

		/** CONFIG **/
		
			// $scope.site_address = $location.$$absUrl.split('0/')[1].split('/')[0];			
			// $scope.site_address = '1Nrpa9niDCoY9wpJ5s4AEeoMjj1Bi6RhG6';
			// $scope.master_address = '12MVkvYGcRW6u2NYbpfwVad1oQeyG4s9Er';			
			// $scope.master_name = 'IFS';
			$scope.inner_path =  'data/channel.json';
			$scope.media_type = 'games';

		/** /CONFIG **/

		/** INIT **/

			// init
			$scope.init = function(){

				Page.cmd("siteInfo", {}, function(site_info) {
					// site info
					Page.site_info = site_info;
					// apply to scope
					$scope.page = Page;
					// create an array of all user's registered sites (channels)
					$scope.channels.forEach(function(channel,index){
						if (channel.user === $scope.page.site_info.auth_address){
							$scope.sites.forEach(function(site,index){
								if (site.address === channel.channel_address && site.settings.own === true){
									if (!$scope.u_sites) $scope.u_sites = [];
									// set u_sites option label in select options
									site.option_label = site.address + " [" +site.content.title +"]";									
									$scope.u_sites.push(site);
								}
							});
						}
					});					
					// get channel data (default - first site in array)
					if ($scope.u_sites) {
						var path = $location.$$absUrl.split('/user/')[1].split('&')[0];
						if (path.indexOf('channel=') > -1){
							var channel_address = path.split('channel=')[1];
							$scope.u_sites.forEach(function(u_site,index){
								if (u_site.address === channel_address){
									$scope.getSiteFileList(u_site);
								}
							});
						} else {
							$scope.getSiteFileList($scope.u_sites[0]);
						}
					} else {
						$scope.no_sites = true;
						$scope.$apply();
					}
				});	
			};

			// get channel data
			$scope.getSiteFileList = function(site){
				// remove channel & site info from scope
				delete $scope.chJson;
				delete $scope.site;
				delete $scope.channel;
				delete $scope.contentJson;
				delete $scope.filesTotal;
				// apply site to scope
				$scope.site = site;
				// optional file list
				Page.cmd("optionalFileList", { address: site.address, limit:2000 }, function(site_files){				      						      		
					$scope.optionalFileList = site_files;
					$scope.$apply(function(){
						// get jsons
						$scope.getSitesJsons(site);
					});
				});
			};
			
			// get sites jsons
			$scope.getSitesJsons = function(site){
				// get content.json
				Page.cmd("fileGet", { "inner_path": 'merged-'+$scope.merger_name+'/'+site.address+'/content.json', "required": false },function(data) {
		    		// store content.json to scope
		    		$scope.contentJson = JSON.parse(data);
		    		// get channel.json
					Page.cmd("fileGet", { "inner_path": 'merged-'+$scope.merger_name+'/'+site.address+'/data/channel.json', "required": false },function(data) {
						// store channel.json to scope
						$scope.chJson = JSON.parse(data);	

						var fileTotalLength = 0;
						var filesTotal=[];
						for (var i in $scope.chJson){
							if (Object.prototype.toString.call($scope.chJson[i]) === '[object Array]'){
								fileTotalLength+=$scope.chJson[i].length;	
								filesTotal = filesTotal.concat($scope.chJson[i]);							
							}
						}	
						$scope.fileTotalLength = fileTotalLength;
						$scope.filesTotal = filesTotal;
												
						angular.forEach($scope.filesTotal, function(value, key) {
							var path = value.path;
							value.x_is_load = false;
							value.x_peer = 0;
							for (var i = 0, len = $scope.optionalFileList.length; i < len; i++) {
							  var inner_path = $scope.optionalFileList[i].inner_path;
							  if(path==inner_path)
								{
									value.x_is_load=true;
									value.x_peer=$scope.optionalFileList[i].peer;
									break;
								}
							}													  
						});
						// render available item media types
						$scope.renderMediaTypes();
						// render channel
						$scope.renderChannel(data);
						// apply to scope
						$scope.$apply();
				    });
		    	});
			};

			// render media types
			$scope.renderMediaTypes = function(){
				$scope.media_types = [];
				for (var i in $scope.chJson){
					if (Object.prototype.toString.call($scope.chJson[i]) === '[object Array]'){
						$scope.media_types.push(i);
					}
				}				
			};

			// render channel
			$scope.renderChannel = function(data){
				$scope.channelLoading = false;
				var update = false;
				if ($scope.chJson){
					$scope.channel = $scope.chJson.channel;
					if (!$scope.channel.name) {
						update = true;
						$scope.chJson.channel.name = $scope.contentJson.title;
					}
					if (!$scope.channel.description) {
						update = true;
						$scope.chJson.channel.description = $scope.contentJson.description;
					}
					if (update === true){
						$scope.updateChannelJson($scope.chJson);
					}
				}			
			};

		/** INIT **/

		/** UPDATE CHANNEL **/

			// update content json in scope
			$scope.updateContentJson = function(){
		    	// get content.json & store to scope
		    	$.getJSON('merged-'+$scope.merger_name+'/'+site.address+'/content.json',function(data){
		    		$scope.contentJson = data;
		    	});
			};

			// update & save channel json
			$scope.updateChannelJson = function(){
				var json_raw = unescape(encodeURIComponent(JSON.stringify($scope.chJson, void 0, '\t')));
				// write to file - channel.json
				Page.cmd("fileWrite", ['merged-'+$scope.merger_name+'/'+$scope.site.address+'/data/channel.json', btoa(json_raw)], function(res) {
					// overwrite content.json title & description
					if ($scope.chJson){
						$scope.contentJson.title = $scope.chJson.channel.name;
						$scope.contentJson.description = $scope.chJson.channel.description;
					}
					var json_raw = unescape(encodeURIComponent(JSON.stringify($scope.contentJson, void 0, '\t')));
					// write to file - content.json
					Page.cmd("fileWrite", ['merged-'+$scope.merger_name+'/'+$scope.site.address+'/content.json',btoa(json_raw)],function(res){
						// sign & publish
						Page.cmd("sitePublish",["stored",'merged-'+$scope.merger_name+'/'+$scope.site.address+'/content.json'], function(res){							
							if (res === 'ok'){
								// apply to scope
								$scope.$apply(function(){
									Page.cmd("wrapperNotification", ["done", "Channel Updated!",10000]);
									$window.location.href = '/'+ $scope.page.site_info.address +'/user/index.html?channel='+$scope.site.address;
								});
							} else {
								Page.cmd("wrapperNotification", ["info", "Please clone this site to create your own channel",10000]);							
							}
						});
					});
				});
			};

			// rootScope on update channel
			$rootScope.$on('onUpdateChannel',function(event,mass){
				$scope.showLoadingMsg('updating channel');
				$scope.updateChannelJson();
			});

			// publish site
			$scope.publishSite = function(){
				// sign & publish
				Page.cmd("sitePublish",["stored",'merged-'+$scope.merger_name+'/'+$scope.site.address+'/content.json'], function(res){
					if (res === 'ok'){
						// apply to scope
						$scope.$apply(function(){
							Page.cmd("wrapperNotification", ["done", "Channel Updated!",10000]);
							$rootScope.$broadcast('resetPublishButton');
						});
					} else {
						Page.cmd("wrapperNotification", ["info", "Please clone this site to create your own channel",10000]);
					}
				});
			};

		/** /UPDATE CHANNEL **/


		/** UI **/

		    // select user
		    $scope.selectUser = function(){
		    	Page.cmd("certSelect", [["zeroid.bit"]]);
		    };

			// loading & msg
			$scope.showLoadingMsg = function(msg){
				$scope.msg = msg;
				$scope.loading = true;
			};

			// finish loading
			$scope.finishLoading = function(){
				$scope.loading = false;
			};


			// on optional help
			$scope.onOptionalHelp = function() {				
				$scope.optionalHelp = true;	
				 return Page.cmd("OptionalHelpAll", [true, $scope.site_address], (function(_this) {
		          return function() {
		            Page.site_info.settings.autodownloadoptional =true;
		            return true;
		          };
		        })(this));
			};

			// on remove optional help
			$scope.onRemoveOptionalHelp = function() {
				Page.cmd("OptionalHelpAll", [false, $scope.site_address], (function(_this) {
				          return function() {
				            Page.site_info.settings.autodownloadoptional = false;				           				            
				          };
				        })(this));
				//Page.cmd("OptionalHelpRemove", ["uploads"]);		
				$scope.optionalHelp = false;
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

		/** /UI **/

	}
]);