app.directive('itemViewEmbed', [
	function() {

		// topic embed controller
		var controller = function($scope,$element) {
			
			$scope.initItemEmbedCode = function(item){
				console.log(item);
				$scope.embed_url = 'merged-'+$scope.page.site_info.content.merger_name+'/'+item.cluster_id+'/data/users/'+item.channel_address.split('_')[1]+'/'+item.file_name;
			};

			$scope.copyEmbedLink = function(embed_url){
			    document.getElementById('embed-code-url').focus();
			    document.getElementById('embed-code-url').select();
			    document.execCommand("Copy", false, null);
			};

		};

		var template =  '<div class="item-embed ">' + 
							'<div class="section-header"><h3>Embed Url</h3></div>'+
							'<hr/>' +
							'<div class="textarea-container">'+
								'<textarea id="embed-code-url" class="well" onclick="this.focus();this.select()" ng-bind="embed_url"></textarea>' +
								'<button style="margin-top:10px;" ng-click="copyEmbedLink(embed_url)">copy embed link</button>' +
							'</div>'+
						'</div>';
		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);