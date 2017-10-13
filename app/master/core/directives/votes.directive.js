app.directive('votes', ['$rootScope','$location','Channel','Vote',
	function($rootScope,$location,Channel,Vote) {

		var controller = function($scope,$element) {

			// get & render votes
			$scope.getVotes = function(item){
				// item vote vars
				item.upVoted = false;
				item.downVoted = false;
				item.downVotes = 0;
				item.upVotes = 0;
				// get votes 				
				var query = ["SELECT * FROM vote WHERE item_id='"+item.item_id+"'"];				
				Page.cmd("dbQuery", query, function(votes) {
					// determine if item is upvoted / downvoted by user
					item.upVotes = 0;
					item.downVotes = 0;
					if (votes.length > 0) {
						item.votes = votes;
						item.votes.forEach(function(vote,index){
							if (vote.vote === 1){
								item.upVotes += 1;
								if (vote.user_id === $scope.page.site_info.cert_user_id){
									item.upVoted = true;
								}
							} else if (vote.vote === 0){
								item.downVotes += 1;
								if (vote.user_id === $scope.page.site_info.cert_user_id){
									item.downVoted = true;
								}
							}
						});
					} else {
						item.votes = [];
					}
					$scope.postingVote = false;					
					$scope.$apply();
				});
			};

			// on up vote
			$scope.onUpVote = function(item){
				var vote_type = "up";
				$scope.onVoteItem(item,vote_type);
			};

			// on down vote
			$scope.onDownVote = function(item){
				var vote_type = "down";
				$scope.onVoteItem(item,vote_type);
			};

			// on vote item
			$scope.onVoteItem = function(item,vote_type){
				$scope.postingVote = true;
				Page.cmd("siteInfo",{},function(site_info){
					$scope.$apply(function(){
						$scope.page.site_info = site_info;
						if (!$scope.page.site_info.cert_user_id){
							$scope.selectUser();
						} else {
							if (vote_type === "up"){
								if (item.upVoted) vote_type = "delete";
								else if (item.downVoted) vote_type = "change";
							} else if (vote_type === "down") {
								if (item.upVoted) vote_type = "change";
								else if (item.downVoted) vote_type = "delete";
							}
							$scope.voteItem(item,vote_type);			
						}
					});
				});
			};

			// vote item
			$scope.voteItem = function(item,vote_type){
				// set timeout for info message
				$scope.setInfoMsgTimeOut();
				// inner path
				var votes_inner_path = "merged-"+$scope.page.site_info.content.merger_name+"/"+$scope.user.cluster+"/data/users/"+$scope.page.site_info.auth_address+"/data.json";	
				Page.cmd("fileGet", { "inner_path": votes_inner_path, "required": false },function(data) {
					// hide info msg
					$scope.hideInfoMsg();
					$scope.$apply(function(){
						data = Vote.renderDataOnItemVote(data,item,vote_type,$scope.page.site_info.cert_user_id);
						var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));
						Page.cmd("fileWrite", [votes_inner_path, btoa(json_raw)], function(res) {
							console.log(res);
							// sign & publish site
							Page.cmd("sitePublish",{"inner_path":votes_inner_path}, function(res) {
								console.log(res);
								// apply changes to scope
								$scope.$apply(function() {
									$scope.getVotes(item);			
								});
							});
						});
					});
			    });		
			}

		};

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
		}

	}
]);