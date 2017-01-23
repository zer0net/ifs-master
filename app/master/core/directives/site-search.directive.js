app.directive('siteSearch', ['$rootScope','$location','$window',
	function($rootScope,$location,$window) {


		// site search directive controller
		var controller = function($scope,$element) {

			// init site search
			$scope.initSiteSearch = function(){				
				// remove filter
				$scope.filterRemove();
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
					$scope.mainFilterChannel(channel);
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
	    		delete $scope.ppFilter.channel.address;
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
			}
		
		};

		var template =  '<form class="navbar-form navbar-left" ng-init="initSiteSearch()">'+
        					'<div class="form-group">'+
          					'<input type="text" class="form-control" placeholder="Search" ng-model="ppFilter.title">'+
          					'<input type="text" class="form-control" ng-model="ppFilter.channel.address"  id="filterChannel" style="display:none">'+
          					'<input type="text" class="form-control" ng-model="ppFilter.media_type"  id="filterMediaType" style="display:none">'+
          					'<input type="text" class="form-control" ng-model="ppFilter.file_type"  id="filterFileType" style="display:none">'+
          					'<div class="dropdown">'+
          					    '<a ng-click="filterMediaType(\'game\')" style="color:#777; padding:10px 20px;" >GAME</a>'+
          					    '<div class="dropdown-content">'+
          					    '<ul>' + 
	          					    '<li><a ng-click="filterFileType(\'nes\')"> NINTENDO </a></li>'+
	          					    '<li><a ng-click="filterFileType(\'sna\')">AMSTRAD </a> </li>'+
	          					    '<li><a ng-click="filterFileType(\'zip\')">DOS </a> </li>'+
	          					    '<li><a ng-click="filterFileType(\'bin\')">ATARI</a> </li>'+
          					    '</ul>' +
          					  '</div>'+
          					'</div>' +
							'<a ng-click="filterMediaType(\'video\')" style="color: #777;padding:10px 20px;">VIDEO</a>' + 
							'<a ng-click="filterRemove()" style="color: #777;padding:10px 20px;"><span class="glyphicon glyphicon-filter" style="text-decoration: line-through"></span></a>' + 
        					'</div>' +        					
      					'</form>';
		
		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);