app.directive('channels', ['$location','$rootScope','Channel','Central',
	function($location,$rootScope,Channel,Central) {

		// channels directive controller
		var controller = function($scope,$element) { 

			// get channels
			$scope.getChannels = function(moderations_on){
				console.log('get channels');
				$scope.moderations_on = moderations_on;
				console.log(moderations_on);
			    // get channels
			    var query = Channel.genearteChannelsQuery($scope.content_type,$scope.moderations_on,$scope.hidden_channels,$scope.hidden_users);
				Page.cmd("dbQuery", query, function(channels){
					$scope.$apply(function(){
						if (channels.length > 0){
							$scope.channels = channels;
							if ($scope.moderations){
								// channels & moderations
								$scope.channels = Central.joinChannelModeration($scope.channels,$scope.moderations);
							}
							if ($scope.channel_id){
								$scope.channels.forEach(function(channel,index) {
									if (channel.channel_address === $scope.channel_id){
										$scope.onFilterChannel(channel);
									}
								});
							}
						}
					});		
				});
			};
		};

		return {
			restrict: 'AE',
			controller:controller,
			replace:false
		}

	}
]);