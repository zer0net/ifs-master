app.factory('User', [
	function() {
		
		var User = {};

		User.getUserClusterFromJsons = function(jsons,clusters){
			var cl;
			jsons.forEach(function(json,index){
				clusters.forEach(function(cluster,index){
					if (json.directory.split('/')[0] === cluster.cluster_id){
						cl = cluster.cluster_id;
					}
				});
			});
			return cl;
		};

		return User;
	}
]);