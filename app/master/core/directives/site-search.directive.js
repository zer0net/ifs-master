app.directive('siteSearch', ['$mdDialog', '$mdMedia','$rootScope',
	function($mdDialog,$mdMedia,$rootScope) {


		// site search directive controller
		var controller = function($scope,$element) {

			// init site search
			$scope.initSiteSearch = function(){
				var channelAddress;
				if ($scope.channel) channelAddress = $scope.channel.channel_address;
				$scope.ppFilter = {
					channel:{
						address:channelAddress
					}
				};
			};

			// filter channel
	    	$scope.filterChannel = function(channel){
				$scope.ppFilter.channel.address = channel.channel_address;
	    	};

	    	// rootscope on filter channel
	    	$rootScope.$on('onFilterChannel',function(event,mass){
		    	$scope.filterChannel(mass);
	    	});

	    	// remove filter channel
	    	$scope.removeFilterChannel = function(){
				$scope.ppFilter.channel.address = '';
	    	};

	    	// rootscope on remove filter channel
	    	$rootScope.$on('onRemoveFilterChannel',function(event,mass){
	    		$scope.removeFilterChannel();
	    	});

			$scope.filterMediaType = function(type)
			{
				$scope.filerRemove();
				$('#filterMediaType').val(type);				
				$('#filterMediaType').trigger('input');
			}

			$scope.filterFileType = function(type)
			{
				$scope.filerRemove();
				$('#filterFileType').val(type);			
				$('#filterFileType').trigger('input');	
			}

			$scope.filerRemove = function()
			{
				$('#filterMediaType').val('');
				$('#filterFileType').val('');

				$('#filterMediaType').trigger('input');	
				$('#filterFileType').trigger('input');
			}

			$scope.filterChannelRemove = function()
			{
				$('#filterChannel').val('');
				$('#filterChannel').trigger('input');				
				$('#channelInfo').html('');			
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
          					    '<ul><li><a ng-click="filterFileType(\'nes\')"> NINTENDO </a></li>'+
          					    '<li><a ng-click="filterFileType(\'sna\')">AMSTRAD </a> </li>'+
          					    '<li><a ng-click="filterFileType(\'zip\')">DOS </a> </li>'+
          					    '<li><a ng-click="filterFileType(\'bin\')">ATARI</a> </li>'+
          					  '</div>'+
          					'</div>' +
							'<a ng-click="filterMediaType(\'video\')" style="color: #777;padding:10px 20px;">VIDEO</a>' + 
							'<a ng-click="filerRemove()" style="color: #777;padding:10px 20px;"><span class="glyphicon glyphicon-filter" style="text-decoration: line-through"></span></a>' + 
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