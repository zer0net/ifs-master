app.directive('gameView', ['$location',
	function($location) {

		var controller = function($scope,$element) {

			// init game view
			$scope.initGameView = function(){
				// get channels & game id from url
				var channelId = window.location.href.split('&')[0].split('c=')[1].split('g=')[0];
				var gameId = parseInt(window.location.href.split('&')[0].split('g=')[1].split('z')[0]);
				// loop through games array
				$scope.games.forEach(function(game,index){
					// if game id & channel exist in array
					if (game.game_id === gameId && game.channel.address === channelId){
						// apply game to scope
						$scope.game = game;
						// get file info
						Page.cmd("optionalFileList", { address: $scope.game.channel.address, limit:2000 }, function(site_files){
							site_files.forEach(function(site_file){
								if (site_file.inner_path === $scope.game.path){
									$scope.game.site_file = site_file;
									console.log(site_file);
								}
							});
						});

					}
				});
			};

		};


		var template = '<md-content flex="65" class="item-view" ng-if="games" ng-init="initGameView()">' +
							'<!-- dosbox -->' +
							'<dosbox ng-if="game.file_type === \'zip\'"></dosbox>' +
							'<!-- /dosbox -->' +
							'<!-- nes -->' +
							'<nes-emulator ng-if="game.file_type === \'nes\'"></nes-emulator>' +
							'<!-- /nes -->' +
							'<!-- cpc -->' +
							'<cpc-emulator ng-if="game.file_type === \'sna\'"></cpc-emulator>' +
							'<!-- /cpc -->' +
							'<!-- atari -->' +
							'<atari-emulator ng-if="game.file_type === \'bin\'"></atari-emulator>' +
							'<!-- atari -->' +
							'<hr class="divider"/>' +
							'<!-- info -->' +
							'<section class="section md-whiteframe-1dp item-info">' +
								'<div class="section-header item-info-header">' +
									'<h3 ng-bind="game.title"></h3>' +
									'<a href="/{{game.channel.address}}">{{game.channel.content.title}}</a>' +
									'<div class="item-views">' +
										'<span>{{game.site_file.peer}} Peers </span>' +
									'</div>' +
								'</div>' +
								'<hr/>' +
								'<div class="item-details">' +
									'<div class="votes" votes ng-init="getVotes(game)">' +
										'<a class="up-vote" ng-click="onUpVote(game)">' +
											'<span class="glyphicon glyphicon-thumbs-up"></span>' +
											'<span class="number">{{game.upVotes}}</span>' +
										'</a>' +
										'<a class="down-vote" ng-click="onDownVote(game)">' +
											'<span class="glyphicon glyphicon-thumbs-down"></span>' +
											'<span class="number">{{game.downVotes}}</span>' +
										'</a>' +
									'</div>' +
									'<ul>' +
										'<li><b>size:</b> {{game.file_size|filesize}}</li>' +
										'<li><b>date added:</b> <span am-time-ago="game.date_added"></span>' +
									'</ul>' +
									'<article layout-padding ng-show="game.description">' +
										'<hr/>' +
										'<p ng-bind="game.description"></p>' +
									'</article>' +
								'</li>' +
							'</section>' +
							'<!-- /info -->' +
							'<hr class="divider"/>' +
							'<!-- comments -->' +
							'<comments ng-init="getComments(game)">' +
								'<div class="item-comments">' +
									'<!-- comment form -->' +
									'<section class="comment-form section md-whiteframe-1dp"  style="margin-top:16px;">' +
										'<div class="section-header" layout-padding>' +
											'<h2>Comments</h2>' +
											'<span class="comment-counter">' +
												'<span class="glyphicon glyphicon-comment"></span>' +
												'<span class="number">{{comments.length}}</span>' +
											'</span>' +
										'</div>' +
									    '<hr/>' +
										'<form layout="row" layout-padding>' +
											'<div flex="10">' +
							                	'<identicon class="md-whiteframe-1dp" username="user" size="64"></identicon>' +
											'</div>' +
											'<div flex="90">' +
												'<md-input-container class="md-block" flex-gt-sm>' +
									              	'<label>Add comment as {{user}}...</label>' +
													'<textarea ng-model="comment" ng-focus="onTextAreaFocus()"></textarea>' +
									            '</md-input-container>' +
										        '<md-button class="md-primary md-raised edgePadding pull-right" ng-click="onPostComment(comment,game)">' +
										        	'<label>Post</label>' +
										        '</md-button>' +
										    '</div>' +
									    '</form>' +
									'</section>' +
									'<!-- /comment form -->' +
									'<!-- comment list -->' +
									'<section class="comment-list md-whiteframe-1dp" id="comments-section" layout-padding ng-show="comments.length > 0">' +
										'<ul>' +
											'<li ng-repeat="comment in comments | orderBy:\'-date_added\'" layout="row">' +
												'<div flex="10">' +
								                	'<identicon class="md-whiteframe-1dp" username="comment.user_id" size="56"></identicon>' +
												'</div>' +
												'<div flex="90">' +
													'<span ng-bind="comment.user_id" class="user-name"></span> • ' +
													'<span am-time-ago="comment.date_added" class="time-ago"></span>' +
													'<p ng-bind="comment.comment"></p>' +
											    '</div>' +
											'</li>' +
										'</ul>' +
									'</section>' +
									'<!-- comment list -->' +
								'</div>' +
							'</comments>' +
							'<!-- /comments -->' +
						'</md-content>';


		return {
			restrict: 'AE',
			template:template,
			replace:true,
			controller: controller,
		}

	}
]);