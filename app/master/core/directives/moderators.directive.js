app.directive('moderators', ['Item','Channel','$mdDialog', '$mdMedia',
	function(Item,Channel,$mdDialog,$mdMedia) {

		// moderators directive controller
		var controller = function($scope,$element) {

			// get moderators
			$scope.getModerators = function(){
			    // get channels
			    var query = ["SELECT * FROM moderator"]
				Page.cmd("dbQuery", query, function(moderators){
					$scope.$apply(function(){
						$scope.mods = moderators;
					});		
				});
			};

			// get moderator
			$scope.getModerator = function(userId){
			    // get channels
			    var query = ["SELECT * FROM moderator WHERE user_id='"+userId+"'"];
				Page.cmd("dbQuery", query, function(moderator){
					if (moderator.length > 0){
						$scope.$apply(function(){
							$scope.moderator = moderator[0];
						});
					}
				});
			};

			// init moderator form
			$scope.initModeratorForm = function(){
				$scope.privilege_options = [{
					label:'Admin',
					value:'admin'
				},{
					label:'Cluster Operator',
					value:'cluster'
				}]
			};

			// on create moderator
			$scope.onCreateModerator = function(moderator,scope){
				// find user cluster 
				var cluster_id = Channel.findUserCluster(scope.page.site_info.auth_address,scope.clusters);
				if (cluster_id === false){
					cluster_id = scope.config.cluster.cluster_id;
				}
				// get user's comment.json
				var inner_path = "merged-"+scope.page.site_info.content.merger_name+"/"+cluster_id+"/data/users/"+scope.page.site_info.auth_address+"/data.json";	
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
					
					// data file
					if (data) { 
						data = JSON.parse(data); 
						if (!data.moderator){
							data.moderator = [];
							data.next_moderator_id = 1;
						}
					} 
					else { data = {"next_moderator_id":1,"moderator":[]}; }

					// moderator
					moderator.moderator_id = data.next_moderator_id + '_' + scope.page.site_info.auth_address;
					moderator.user_id = scope.page.site_info.auth_address;
					moderator.date_added = +(new Date);

					// next moderator id
					data.next_moderator_id += 1;

					// push moderator to user's data.json
					data.moderator.push(moderator);
					// write to file					
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));					
					Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
						// sign & publish site
						Page.cmd("sitePublish",{"inner_path":inner_path}, function(res) {
							// apply to scope
							$scope.$apply(function() {
								Page.cmd("wrapperNotification", ["done", "Moderator Added!", 10000]);
								scope.mods.push(moderator);
								$scope.hide();
							});
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