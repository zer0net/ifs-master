app.directive('commentForm', ['$rootScope','$sce','$location','Channel','Keyboard',
	function($rootScope,$sce,$location,Channel,Keyboard) {

		// comment form controller
		var controller = function($scope,$element) {

			// init comment form
			$scope.initCommentForm = function(){
				$scope.comment = '';
				$scope.map = {};
				$scope.user = $scope.page.site_info.cert_user_id;
			};

		    // on text area focus
		    $scope.onTextAreaFocus = function(){
		    	console.log('bla bla');
		    	$scope.is_selected = false;
		    	if ($scope.item.content_type === 'game') $scope.pauseGame();
		    	// query site info
		    	Page.cmd('siteInfo',{},function(site_info) {
					$scope.$apply(function(){
			    		$scope.page.site_info = site_info;
						if (Page.site_info.cert_user_id) { $scope.user = $scope.page.site_info.cert_user_id; } 
						else { $scope.createIfsCert(); }
					});
		    	});
		    };

		    // emulate key press
		    $scope.emulateKeyPress = function(e,comment){
		    	console.log(e.originalEvent.keyCode);
		    	if ($scope.item_type === 'game'){
			    	e.preventDefault();
		   			$scope.map[e.originalEvent.keyCode] = e.type == 'keydown';
			    	if ($scope.map[91] === true || $scope.map[93] === true){
			    		if (e.originalEvent.keyCode === 65){
			    			e.target.selectionStart = 0;
			    		}
			    	} else {
			    		if (e.originalEvent.keyCode === 37 && $scope.map[37] === true){
			    			e.target.selectionStart -= 1;
			    			e.target.selectionEnd = e.target.selectionStart;
			    		} else if (e.originalEvent.keyCode === 39 && $scope.map[39] === true){
			    			e.target.selectionStart += 1;
			    			e.target.selectionEnd = e.target.selectionStart;
			    		} else if (e.originalEvent.keyCode === 38 && $scope.map[38] === true){

			    		} else if (e.originalEvent.keyCode === 40 && $scope.map[40] === true){

			    		} else {
					    	$scope.comment = Keyboard.emulateKeyPress(e.originalEvent,e.target,comment,$scope.map);
			    		}
			    	}
		    	}
		    	console.log($scope.comment);
		    };
			
		    // on change user cert id
		    $rootScope.$on('onChangeUserCertId',function(event,mass){
		    	$scope.page = mass;
		    	$scope.user = $scope.page.site_info.cert_user_id;
		    });

			// post comment
			$scope.postComment = function(comment,item){
				// set timeout for info message
				$scope.setInfoMsgTimeOut();
				$scope.postingComment = true;
				// find user cluster 
				var cluster_id = Channel.findUserCluster($scope.page.site_info.auth_address,$scope.clusters);
				if (cluster_id === false){
					cluster_id = $scope.config.cluster.cluster_id;
				}
				// get user's comment.json
				var inner_path = "merged-"+$scope.page.site_info.content.merger_name+"/"+cluster_id+"/data/users/"+$scope.page.site_info.auth_address+"/data.json";	
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
					// hide info msg
					$scope.hideInfoMsg();
					// data file
					if (data) { 
						data = JSON.parse(data); 
						if (!data.comment){
							data.comment = [];
							data.next_comment_id = 1;
						}
					} 
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
								$scope.postingComment = false;
								$scope.updateContentJson(cluster_id);						
							});
						});
					});
			    });
			};

		};

		var template =  '<form id="item-comment-form" ng-init="initCommentForm()">' +
							'<div class="identicon-container" >' +
			                	'<identicon class="md-whiteframe-1dp" username="user" size="64"></identicon>' +
							'</div>' +
							'<div class="form-fields" ng-hide="postingComment">' +
								'<md-input-container class="md-block" flex-gt-sm>' +
					              	'<label>Add comment as {{user}}...</label>' +
									'<textarea ng-model="comment" id="comment-body" ng-keydown="emulateKeyPress($event,comment)" ng-keyup="emulateKeyPress($event,comment)" ng-focus="onTextAreaFocus()"></textarea>' +
					            '</md-input-container>' +
						        '<md-button ng-if="user" ng-show="comment.length > 0" class="md-primary md-raised edgePadding pull-right" ng-click="postComment(comment,item)">Post Comment</md-button>' +
						        '<md-button ng-if="!user" class="md-primary md-raised edgePadding pull-right" ng-click="createIfsCert()">Select ID</md-button>' +
						    '</div>' +
						    '<!-- loading -->' +
						    '<div id="comment-form-loading" layout="column" ng-show="postingComment" flex>' +
						        '<div layout="column" flex="100" style="text-align:center;margin:20px 0;">' +
						            '<span><b>Posting Comment...</b></span>' +
						        '</div>' +
						        '<div layout="row" flex="100" layout-align="space-around" style="margin-top:-25px;">' +
						            '<md-progress-circular md-mode="indeterminate"></md-progress-circular>' +
						        '</div>' +
						    '</div>' +
						    '<!-- /loading -->' +
					    '</form>';


		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
			template:template
		}

	}
]);