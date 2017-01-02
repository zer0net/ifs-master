app.directive('comments', ['$rootScope','$sce','$location',
	function($rootScope,$sce,$location) {

		var controller = function($scope,$element) {

			// get comments
			$scope.getComments = function(item){
				console.log(item);
				$scope.comments = [];
				var query = ["SELECT * FROM comment WHERE item_id="+item[item.item_id_name]+" AND channel='"+item.channel.address+"' ORDER BY date_added"];
				Page.cmd("dbQuery", query, function(comments) {
					$scope.comments = comments;
					$scope.$apply();
				});
			};

			// count comments 
			$scope.countComments = function(item){
				$scope.commentCount = 0;
				var query = ["SELECT * FROM comment WHERE item_id="+item[item.item_id_name]+" AND channel='"+item.channel.address+"' ORDER BY date_added"];
				Page.cmd("dbQuery", query, function(comments) {
					$scope.commentCount = comments.length;
					$scope.$apply();
				});
			};

		    // on text area focus
		    $scope.onTextAreaFocus = function(){
		    	// query site info
		    	Page.cmd('siteInfo',{},function(site_info) {
		    		Page.site_info = site_info;
					if (Page.site_info.cert_user_id) {
						$scope.user = Page.site_info.cert_user_id;
					} else {
						$scope.user = Page.site_info.auth_address;
						if (!$scope.focused){
							$scope.focused = true;
							$scope.selectUser();
						}
					}
					$scope.$apply();
		    	});
		    };

		    // on post comment
		    $scope.onPostComment = function(comment,item){
		    	if (comment){
					Page.cmd("siteInfo",{},function(site_info){
						Page.site_info = site_info;
						if (!Page.site_info.cert_user_id){
							Page.cmd("wrapperNotification", ["info", $scope.merger_name + " currently supports posting content with zeroid.bit only!", 10000]);
							$scope.selectUser();
						} else {
							$scope.postComment(comment,item);
						}
					});
		    	}
		    };

			// post comment
			$scope.postComment = function(comment,item){
				// get user's comment.json
				var inner_path = "data/users/"+Page.site_info.auth_address+"/comment.json";			
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
					// data file
					if (data) { data = JSON.parse(data); } 
					else { data = {"next_comment_id":1,"comment":[]}; }
					// comment
					comment = {
						channel:item.channel.address,
						comment:comment,
						date_added:+(new Date)
					};
					// item id
					comment.item_id = item[$scope.item_id_name];
					// user
					if (Page.site_info.cert_user_id) { comment.user_id = Page.site_info.cert_user_id; } 
					else { comment.user_id = Page.site_info.auth_address; }
					// comment id
					comment.comment_id = data.next_comment_id;
					data.next_comment_id += 1;
					// push comment to user's comment.json
					data.comment.push(comment);
					// write to file					
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));					
					Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
						// sign & publish site
						Page.cmd("sitePublish",{"inner_path":inner_path}, function(res) {
							// apply to scope
							$scope.$apply(function() {
								Page.cmd("wrapperNotification", ["done", "Comment posted!", 10000]);
								$scope.user = Page.site_info.cert_user_id;
								$scope.comments.push(comment);
								$scope.comment = "";
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