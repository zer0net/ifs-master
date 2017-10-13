app.directive('userMenu', ['$rootScope','User',
	function($rootScope,User) {

		// header directive controller
		var controller = function($scope,$element) {

			// init user menu
			$scope.initUserMenu = function(){
				if ($scope.page.site_info.cert_user_id){
					$scope.getUser();
				}
			};

			// get user
			$scope.getUser = function(){
				var query = "SELECT * FROM user WHERE user_auth_address='"+$scope.page.site_info.auth_address+"'";
				Page.cmd("dbQuery",[query],function(user){
					if (user && user.length > 0){
						$scope.setUser(user[0]);
					} else {
						console.log('no user');
						$scope.checkUserFiles();
					}
				});
			};

			// find user files
			$scope.checkUserFiles = function(){
				// get users json path
				var query = "SELECT * FROM json WHERE directory LIKE '%"+$scope.page.site_info.auth_address+"'";
				Page.cmd("dbQuery",[query],function(jsons){
					if (jsons && jsons.length > 0){
						// get user's cluster 
						var cluster = User.getUserClusterFromJsons(jsons,$scope.clusters);
						// create user
						$scope.createUser(cluster);
					} else {
						$scope.createUser($scope.config.cluster.cluster_id)
					}
				});
			};

			// create user 
			$scope.createUser = function(cluster){
				// set timeout for info message
				$scope.setInfoMsgTimeOut();
				// inner path
				var inner_path = "merged-"+$scope.page.site_info.content.merger_name+"/"+cluster+"/data/users/"+$scope.page.site_info.auth_address+"/data.json";
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
					$scope.$apply(function(){
						// hide info msg
						$scope.hideInfoMsg();
						// render data.json
						if (data) { 
							data = JSON.parse(data); 
							if (!data.user){
								data.user = [];
								next_user_id = 1;
							}
						}
						else { data = {"next_user_id":1,"user":[]}; }
						// new user object
						var user = {
							user_id:$scope.page.site_info.auth_address + '_user_' + data.next_user_id,
							user_auth_address:$scope.page.site_info.auth_address,
							user_name:$scope.page.site_info.cert_user_id,
							cluster:cluster,
							date_added:+(new Date) 
						}
						// user id
						data.next_user_id += 1;
						// push vote to vote.json
						data.user.push(user);
						// write to file
						var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));					
						Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
							// sign & publish site
							Page.cmd("sitePublish",{"inner_path":inner_path}, function(res) {
								// apply change to scope
								$scope.$apply(function() {
									Page.cmd("wrapperNotification", ["done", "User Registered!", 10000]);
									$scope.setUser(user);
								});
							});
						});
					});
				});
			};

			// set user
			$scope.setUser = function(user){
				$scope.user = user;
				$rootScope.$broadcast("setGlobalUser",$scope.user);
			};

		};

		var template =  '<ul ng-init="initUserMenu()" class="pull-right">'+			  						
	  						'<li ng-if="page" moderators ng-init="getModerator(page.site_info.auth_address)"><a ng-if="moderator" href="/{{page.site_info.address}}/index.html?route:admin" >Admin</a></li>'+  
	  						'<li><a ng-click="showInfoModal(ev)">FAQ/Rules</a></li>'+  
							'<li ng-if="!page.site_info.cert_user_id"><a ng-click="selectUser()">Login</a></li>' +
							'<li ng-if="!page.site_info.cert_user_id"><a ng-click="createIfsCert()">Create Account</a></li>' +
	  						'<li ng-if="page.site_info.cert_user_id"><a href="/{{page.site_info.address}}/index.html?route:user">My Channels</a></li>'+ 
	  						'<li ng-if="page.site_info.cert_user_id"><a ng-click="selectUser()">Change Account</a></li>'+ 								
						'</ul>';
		
		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);