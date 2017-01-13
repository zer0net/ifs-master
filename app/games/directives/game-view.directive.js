app.directive('gameView', ['$location','$rootScope',
	function($location,$rootScope) {

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
						// get site file info
						$scope.getSiteFileInfo(game);
					}
				});
			};

			// get site file info
			$scope.getSiteFileInfo = function(game){
				// get optional files info
				Page.cmd("optionalFileList", { address: game.channel.address, limit:2000 }, function(site_files){
					// for each site file
					site_files.forEach(function(site_file){
						if (site_file.inner_path === game.path){
							console.log('file found');
							// apply site file info to game obj
							game.site_file = site_file;
							// apply game to scope
							$scope.game = game;
							// apply scope
							$scope.$apply();
						}
					});
					// if file is not in site_files
					if (!game.site_file){
						$scope.$apply(function(){
							$scope.error_msg = 'File not found. downloading ...';
							$scope.forceFileDownload(game);
						});
					}
				});
			};

			// force file download
			$scope.forceFileDownload = function(game){
				if (!game.path){
					var fileName;
					if (game.zip_name){
						fileName = game.zip_name
					} else {
						fileName = game.file_name;
					}
					game.path = 'uploads/games/' + fileName;
				}
				// xhttp get dos file
				var inner_path = "merged-"+$scope.merger_name+"/"+game.channel.address+"/"+game.path;
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState === 4){
						console.log('file ready');
						$scope.getSiteFileInfo(game);
					} else {
						console.log("file not found!");
					}
				};
				xhttp.open("GET", inner_path, true);
				xhttp.send();
			};

		};


		var template = '<div class="item-view" layout="row"  layout-padding ng-if="games" ng-init="initGameView()">' +
							'<div ng-if="error_msg" flex="100" ng-hide="game" ng-bind="error_msg" style="font-weight: bold;text-align: center;"></div>' +
							'<!-- game -->' +
							'<md-content style="background-color:transparent;" flex="65" ng-if="game">' +
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
								'<section ng-if="game" class="section md-whiteframe-1dp item-info">' +
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
								'<comments ng-if="game" ng-init="getComments(game)">' +
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
							'</md-content>' +
							'<!-- /game -->' +
							'<!-- game list -->' +
							'<md-content class="game-list" flex="35" ng-if="game">' +
								'<div class="md-whiteframe-1dp" layout="column">' +
									'<ul>' +
								    	'<li ng-repeat="game in games|limitTo:15 | orderBy:\'-date_added\' track by $index" layout="row" layout-padding>'+
											'<figure flex="35" class="game-img" style="background-position: center;background-repeat: no-repeat;background-size: contain;background-image:url(\'{{game.img}}\');">' +
												'<a href="/{{site_address}}/view.html?type=game-c={{game.channel.address}}g={{game.game_id}}z={{game.zip_name}}f={{game.file_name}}"></a>' +
											'</figure>' +
											'<div flex="65" class="game-info">' +
									    		'<h3><a href="/{{site_address}}/view.html?type=game-c={{game.channel.address}}g={{game.game_id}}z={{game.zip_name}}f={{game.file_name}}">{{game.title}}</a></h3>' +
									    		'<span><b>size:</b> {{game.file_size|filesize}}</span><br/>' +
									    		'<span><b>date added:</b> <span am-time-ago="game.date_added"></span></span>' +
									    	'</div>' +
									    	'<hr/>' +
								    	'</li>' +
									'</ul>' +
								'</div>' +
							'</md-content>' +
							'<!-- /game list -->' +
						'</div>';


		return {
			restrict: 'AE',
			template:template,
			replace:true,
			controller: controller,
		}

	}
]);