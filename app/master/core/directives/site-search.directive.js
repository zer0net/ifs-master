app.directive('siteSearch', ['$rootScope','$location','$window',
	function($rootScope,$location,$window) {


		// site search directive controller
		var controller = function($scope,$element) {

			// init site search
			$scope.initSiteSearch = function(){				
				// set filter
				$scope.ppFilter = {
					channel:{},
				};
				// apply url path to scope
				$scope.path = $location.$$absUrl.split($scope.page.site_info.address + '/')[1].split('?');
				// check if index page
				var isIndexPage = $scope.checkIfIndexPage();
				if (isIndexPage){
					$scope.generateFilterByUrl();
				}
			};

			// check if index page
			$scope.checkIfIndexPage = function(){
				if ($scope.path[0] === '') {
					return true;
				} else if ($scope.path[0] === 'index.html') {
					return true;
				} else if ($scope.path[0] === 'view.html') {
					return false;
				} else if ($scope.path[0] === 'register.html'){
					return false;
				} else if ($scope.path[0].indexOf('user/')){
					return false;
				}
			};

			// generate filter by url
			$scope.generateFilterByUrl = function(){
				if ($scope.path[1].indexOf('&') > -1){
					var subPath = $scope.path[1].split('&')[0];
					if (subPath.indexOf('channel') > -1){
						$scope.getFilterChannel(subPath.split('=')[1]);
					} else if (subPath.indexOf('media_type') > -1){
						$scope.filterMediaType(subPath.split('=')[1]);
					} else if (subPath.indexOf('file_type') > -1){
						$scope.filterFileType(subPath.split('=')[1])
					}
				}
			};

			// get filter channel
			$scope.getFilterChannel = function(channel_address){
				$scope.channels.forEach(function(channel,index){
					if (channel.channel_address === channel_address){
						$scope.filterChannel(channel);
					}
				});
			};

			// filter channel
	    	$scope.filterChannel = function(channel){
	    		var isIndexPage = $scope.checkIfIndexPage();
	    		if (isIndexPage){
					// set channel
					$scope.setChannel(channel);
					// filter channel
					$scope.ppFilter.channel.address = channel.channel_address;
					$scope.ppFilter.set = true;
					$scope.mainFilter($scope.ppFilter);
				} else {
					$window.location.href = '/'+ $scope.page.site_info.address +'/index.html?channel='+channel.channel_address;
				}
	    	};

	    	// rootscope on filter channel
	    	$rootScope.$on('onFilterChannel',function(event,mass){
			    $scope.filterChannel(mass);
	    	});

	    	// remove filter channel
	    	$scope.removeFilterChannel = function(){
	    		$scope.removeChannel();
	    		$scope.filterRemove();
	    	};

	    	// rootscope on remove filter channel
	    	$rootScope.$on('onRemoveFilterChannel',function(event,mass){
	    		$scope.removeFilterChannel();
	    	});

	    	// filter media type
	    	$scope.filterMediaType = function(type){
	    		var isIndexPage = $scope.checkIfIndexPage();
	    		if (isIndexPage){
	    			// filter media type
					$scope.ppFilter.media_type = type;
					$scope.ppFilter.set = true;	
					$scope.mainFilter($scope.ppFilter);
				} else {
					$window.location.href = '/'+ $scope.page.site_info.address +'/index.html?media_type='+type;
				}
	    	};

			$scope.filterFileType = function(file_type) {
				$scope.ppFilter.file_type = file_type;
	    		var isIndexPage = $scope.checkIfIndexPage();
	    		if (isIndexPage){
	    			// filter media type
					$scope.ppFilter.file_type = file_type;
					$scope.ppFilter.set = true;					
				} else {
					$window.location.href = '/'+ $scope.page.site_info.address +'/index.html?file_type='+file_type;
				}
			};

			// filter remove
			$scope.filterRemove = function() {
				$scope.ppFilter = {
					channel:{},
				};
				$scope.mainRemoveFilter();
			}
		
		};

		var template =  '<form class="navbar-form navbar-left" ng-init="initSiteSearch()">'+
        					'<div class="form-group">'+
          					'<input type="text" class="form-control" placeholder="Search" ng-model="ppFilter.title">'+  					
      					'</form>';
		
		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);