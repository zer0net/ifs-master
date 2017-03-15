app.directive('votes', ['$rootScope','$location',
	function($rootScope,$location) {

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
								if (vote.user_id === $scope.user){
									item.upVoted = true;
								}
							} else if (vote.vote === 0){
								item.downVotes += 1;
								if (vote.user_id === $scope.user){
									item.downVoted = true;
								}
							}
						});
					} else {
						item.votes = [];
					}
					$scope.$apply();
				});
			};

			// on up vote
			$scope.onUpVote = function(item){
				Page.cmd("siteInfo",{},function(site_info){
					Page.site_info = site_info;
					if (!Page.site_info.cert_user_id){
						Page.cmd("wrapperNotification", ["info", $scope.merger_name + " currently supports posting content with zeroid.bit only!", 10000]);
						$scope.selectUser();
					} else {
						if (item.upVoted){ $scope.deleteVote(item); } 
						else if (item.downVoted) { $scope.changeVote(item); } 
						else { $scope.voteUp(item); }
					}
				});
			};

			// on down vote
			$scope.onDownVote = function(item){
				Page.cmd("siteInfo",{},function(site_info){
					Page.site_info = site_info;
					if (!Page.site_info.cert_user_id){
						Page.cmd("wrapperNotification", ["info", $scope.merger_name + " currently supports posting content with zeroid.bit only!", 10000]);
						$scope.selectUser();
					} else {
						if (item.downVoted){ $scope.deleteVote(item); }
						else if (item.upVoted) { $scope.changeVote(item); } 
						else { $scope.voteDown(item); }
					}
				});
			};

			// vote up
			$scope.voteUp = function(item){
				// get file
				var inner_path = "merged-"+$scope.page.site_info.content.merger_name+"/"+$scope.config.cluster.cluster_id+"/data/users/"+$scope.page.site_info.auth_address+"/votes.json";
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
					// data file
					if (data) { data = JSON.parse(data); }
					else { data = {"next_vote_id":1,"vote":[]}; }
					// vote
					var vote = {
						item_id:item.item_id,
						vote:1,
						user_id:$scope.page.site_info.cert_user_id,
						date_added:+(new Date)
					};
					// vote id
					vote.vote_id = data.next_vote_id;
					data.next_vote_id += 1;
					// push vote to votes.json
					data.vote.push(vote);					
					// write to file
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));					
					Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
						// sign & publish site
						Page.cmd("sitePublish",{"inner_path":inner_path}, function(res) {
							// apply changes to scope
							$scope.$apply(function() {
								Page.cmd("wrapperNotification", ["done", "Item Up Voted!", 10000]);
								item.upVoted = true;
								if (!item.votes) { item.votes = [];}
								item.votes.push(vote);
								if (!item.upVotes) {item.upVotes = 0;}
								item.upVotes += 1;
							});
						});
					});
			    });
			};

			// vote down
			$scope.voteDown = function(item){
				// get file
				var inner_path = "merged-"+$scope.page.site_info.content.merger_name+"/"+$scope.config.cluster.cluster_id+"/data/users/"+$scope.page.site_info.auth_address+"/votes.json";
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
					// data file
					if (data) { data = JSON.parse(data); } 
					else { data = {"next_vote_id":1,"vote":[]}; }
					// vote
					var vote = {
						item_id:item.item_id,
						vote:0,
						user_id:$scope.page.site_info.cert_user_id,
						date_added:+(new Date)
					};
					// vote id
					vote.vote_id = data.next_vote_id;
					data.next_vote_id += 1;
					// push vote to vote.json
					data.vote.push(vote);					
					// write to file
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));					
					Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
						// sign & publish site
						Page.cmd("sitePublish",{"inner_path":inner_path}, function(res) {
							// apply change to scope
							$scope.$apply(function() {
								Page.cmd("wrapperNotification", ["done", "Item Down Voted!", 10000]);
								item.downVoted = true;
								if (!item.votes) {item.votes = [];}
								item.votes.push(vote);
								if (!item.downVotes) {item.downVotes = 0;}
								item.downVotes += 1;
							});
						});
					});
			    });
			};

			// delete vote
			$scope.deleteVote = function(item){
				// get vote from votes array
				var voteId;
				var voteType;
				item.votes.forEach(function(vote,index){
					if (vote.user_id === $scope.user){
						voteId = vote.vote_id;
						voteType = vote.vote;
					}
				});
				// get file
				var inner_path = "merged-"+$scope.page.site_info.content.merger_name+"/"+$scope.config.cluster.cluster_id+"/data/users/"+$scope.page.site_info.auth_address+"/votes.json";
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
					data = JSON.parse(data);
					// find vote index in vote.json
					var voteIndex;
					data.vote.forEach(function(vote,index){
						if (vote.vote_id === voteId){
							voteIndex = index;
						}
					});
					// remove vote from vote.json
					data.vote.splice(voteIndex,1);					
					// write to file
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));					
					Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
						// sign & publish site
						Page.cmd("sitePublish",{"inner_path":inner_path}, function(res) {
							// apply change to scope
							$scope.$apply(function() {
								Page.cmd("wrapperNotification", ["done", "Item Vote Deleted!", 10000]);
								if (voteType === 0){
									item.downVoted = false;
									item.downVotes -= 1;
								} else {
									item.upVoted = false;
									item.upVotes -= 1;								
								}
								item.votes.splice(voteIndex,1);
							});
						});
					});
			    });
			};

			// change vote
			$scope.changeVote = function(item){
				// get vote from votes array
				var voteId;
				var voteType;
				item.votes.forEach(function(vote,index){
					if (vote.user_id === $scope.user){
						voteId = vote.vote_id;
						voteType = vote.vote;
					}
				});
				// get file
				var inner_path = "merged-"+$scope.page.site_info.content.merger_name+"/"+$scope.config.cluster.cluster_id+"/data/users/"+$scope.page.site_info.auth_address+"/votes.json";
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
					data = JSON.parse(data);
					// find vote index in vote.json
					var voteIndex;
					var vt;
					data.vote.forEach(function(vote,index){
						if (vote.vote_id === voteId){
							voteIndex = index;
							vt = vote;
							if (voteType === 0) {vote.vote = 1;}
							else if (voteType === 1) {vote.vote = 0;}
						}
					});
					// write to file					
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));					
					Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
						// sign & publish site
						Page.cmd("sitePublish",{"inner_path":inner_path}, function(res) {
							// apply changes to scope
							$scope.$apply(function() {
								Page.cmd("wrapperNotification", ["done", "Item Vote Deleted!", 10000]);
								if (voteType === 0){
									item.downVoted = false;
									item.upVoted = true;
									item.downVotes -= 1;
									item.upVotes += 1;
								} else {
									item.upVoted = false;
									item.downVoted = true;
									item.upVotes -= 1;
									item.downVotes += 1;
								}
								item.votes.splice(voteIndex,1);
								item.votes.push(vt);
							});
						});
					});
			    });
			};

		};

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
		}

	}
]);