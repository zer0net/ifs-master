app.directive('siteConfig', ['$window',
	function($window) {

		// site header controller
		var controller = function($scope,$element) {

			$scope.initSiteConfig = function(config){
				if (!config) { 
					var config = {};
				} else {
					config.media_types.forEach(function(val,index){
						console.log(val);
						config[val] = true;
						console.log(config);
					});
				}
				$scope.mediaTypes = [
					'all',
					'games',
					'videos'
				];
				$scope.config = config;
			};

			$scope.updateMediaTypes = function(config,mediaType){
				if (!config.media_types) {config.media_types = []}
				if (config[mediaType] === false || config[mediaType] === undefined){
					config.media_types.push(mediaType);
				} else {
					config.media_types.forEach(function(val,index){
						if (val === mediaType){
							config.media_types.splice(index,1);
						}
					});
				}
			};

			// update config 
			$scope.updateConfig = function(config){

				// get user's view.json
				var inner_path = "data/"+Page.user+"config.json";			
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
					// data file
					if (data) { data = JSON.parse(data); } 
					else { data = {"media_types":[]};}
					data.media_types = config.media_types;	
					// write to file
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));					
					Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
						// sign & publish site
						Page.cmd("sitePublish",["stored",inner_path], function(res) {
							$window.location.href = '/'+ $scope.site_address +'/';
						});
					});

			    });

			};


		};

		return {
			restrict: 'AE',
			replace:false,
			controller: controller
		}

	}
]);