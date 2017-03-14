app.directive('commentForm', ['$rootScope','$sce','$location',
	function($rootScope,$sce,$location) {

		// comment form controller
		var controller = function($scope,$element) {

			// init comment form
			$scope.initCommentForm = function(){
				$scope.comment = '';
			};

		    // on text area focus
		    $scope.onTextAreaFocus = function(){
		    	// query site info
		    	Page.cmd('siteInfo',{},function(site_info) {
		    		Page.site_info = site_info;
					if (Page.site_info.cert_user_id) {
						$scope.user = Page.site_info.cert_user_id;
					} else {
						$scope.createIfsCert();
					}
					$scope.$apply();
		    	});
		    };

		    // on change user cert id
		    $rootScope.$on('onChangeUserCertId',function(event,mass){
		    	$scope.page = mass;
		    	$scope.user = $scope.page.site_info.cert_user_id;
		    	$scope.$apply();
		    });

		    // render key down event
		    $scope.renderKeyDownEvent = function(text,key){
		    	if (key === 'Backspace'){
		    		text = text.slice(0,-1);
		    	} else {
			    	text += key;
		    	}

		    	return text;
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
				var inner_path = "data/users/"+$scope.page.site_info.auth_address+"/comment.json";			
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
					// data file
					if (data) { data = JSON.parse(data); } 
					else { data = {"next_comment_id":1,"comment":[]}; }
					// comment
					comment = {
						channel:item.channel.channel_address,
						comment:comment,
						user_id:$scope.page.site_info.cert_user_id,
						date_added:+(new Date)
					};
					// item id
					comment.item_id = item.item_id;
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
								$scope.pushComment(comment);
								$scope.comment = "";
							});
						});
					});
			    });
			};

		};

		var template =  '<form layout="row" ng-init="initCommentForm()" layout-padding>' +
							'<div flex="10">' +
			                	'<identicon class="md-whiteframe-1dp" username="user" size="64"></identicon>' +
							'</div>' +
							'<div flex="90">' +
								'<md-input-container class="md-block" flex-gt-sm>' +
					              	'<label>Add comment as {{user}}...</label>' +
									'<textarea ng-model="comment" ng-keydown="onTextAreaKeyDown($event,comment)" ng-focus="onTextAreaFocus()"></textarea>' +
					            '</md-input-container>' +
						        '<md-button class="md-primary md-raised edgePadding pull-right" ng-click="onPostComment(comment,item)">' +
						        	'<label>Post</label>' +
						        '</md-button>' +
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