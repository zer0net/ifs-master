app.directive('views', [
	function() {

		var controller = function($scope,$element) {

			// get views
			$scope.getViews = function(item){

				/** temporate paused. for view page not publish 14.12.2016
				// init view array
				item.views = [];
				// get views
				var query = ["SELECT * FROM view WHERE item_id="+item[item.item_id_name]+" AND channel='"+item.channel.address+"' ORDER BY date_added"];
				Page.cmd("dbQuery", query, function(views) {
					if (views.length > 0){
						item.views = views;
						item.viewed = false;
						item.views.forEach(function(view,index){
							if (view.user_id === Page.site_info.cert_user_id){
								item.viewed = true;
							}
						});
						if (window.location.href.indexOf('view') > -1){
							if (item.viewed === false){
								if (Page.site_info.cert_user_id){
									$scope.createView(item);
								}
							}
						}
					} else {
						
						if (window.location.href.indexOf('view') > -1){
							if (Page.site_info.cert_user_id){
								$scope.createView(item);
							}
						}
						
					}
				});
				**/
			};

			// create view
			$scope.createView = function(item){
				// get user's view.json
				var inner_path = "data/users/"+Page.site_info.auth_address+"/view.json";			
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
					// data file
					if (data) { data = JSON.parse(data); } 
					else { data = {"next_view_id":1,"view":[]}; }
					// create view db record
					var view = {
						channel:item.channel.address,
						user_id:Page.site_info.cert_user_id,
						date_added:+(new Date)
					};
					// view item id
					view.item_id = item[$scope.item_id_name];
					// view id
					view.view_id = data.next_view_id;
					data.next_view_id += 1;
					// push view to user's views array
					data.view.push(view);					
					// write to file
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));					
					Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
						console.log(res);
						// sign & publish site
						Page.cmd("sitePublish",["stored",inner_path], function(res) {
							console.log(res);
							// apply to scope
							$scope.$apply(function() {
								item.views.push(view);
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