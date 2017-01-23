app.directive('gameListTemplate', ['$location',
	function($location) {

		var controller = function($scope,$element) {	
				
			// render game
			$scope.renderGame = function(game){
				game.item_id_name = 'game_id';

			};

			$scope.chooseStyle = function(x_is_load)
			{
				if(x_is_load) {
					return 'itemLoaded';
				}else
				{
					return 'itemNotLoaded';					
				}
			}
		};
		
		var linkFunction = function($scope, element, attr)
		{	
			$scope.filetype = attr["filetype"];			
			$scope.items = $scope.$parent["games_"+attr["filetype"]];								
			$scope.items.key = "gameslist"+attr["filetype"];					
		}


		var template =  '<section class="game-list-section" >'+
							'<md-grid-list md-cols-xs="2" md-cols-sm="3" md-cols-md="4" md-cols-gt-md="5" ' +
						    'sm-row-height="3:4" md-row-height="3:3" ' +
						    'md-gutter="12px" md-gutter-gt-sm="8px">' +
						    '<!-- grid item -->' +
							'<md-grid-tile class="list-item" dir-paginate="game in items|filter:ppFilter| orderBy:\'-date_added\' |itemsPerPage:5 track by $index"  pagination-id="items.key">' +
								'<div class="inner-wrap md-whiteframe-1dp" ng-init="renderGame(game)"  ng-class="chooseStyle(game.x_is_load)">' +
									'<!-- img -->' +
									'<div class="item-img md-whiteframe-1dp" style="background-position: center;background-repeat: no-repeat;background-size: {{game.imgSize}};background-image:url(\'{{game.img}}\');">' +
										'<a href="/{{site_address}}/view.html?type=game-c={{game.channel.address}}g={{game.game_id}}z={{game.zip_name}}f={{game.file_name}}"><span ng-if="game.genre" ng-bind="game.genre" class="game-genre {{game.genre}}"></span></a>' +
									'</div>' +
									'<!-- img -->' +
									'<!-- info -->' +
									'<md-grid-tile-footer>' +
										'<h3><a href="/{{site_address}}/view.html?type=game-c={{game.channel.address}}g={{game.game_id}}z={{game.zip_name}}f={{game.file_name}}">{{game.title}}</a></h3>' +
										'<ul class="video-info">' +
						    				'<li><span>{{game.channel.content.title}}</span></li>' +
						    				'<li><span><i am-time-ago="game.date_added"></i></span></li>' +
						    				'<li class="votes-count" votes ng-init="getVotes(game)">' +
												'<span class="up-vote">' +
													'<span class="glyphicon glyphicon-thumbs-up"></span>' +
													'<span class="number">{{game.upVotes}}</span>' +
												'</span>' +
												'<span class="down-vote">' +
													'<span class="glyphicon glyphicon-thumbs-down"></span>' +
													'<span class="number">{{game.downVotes}}</span>' +
												'</span>' +
						    				'</li>' +
						    				'<li class="comments-count" comments ng-init="countComments(game)">' +
												'<span class="glyphicon glyphicon-comment"></span>' +
												'<span>{{commentCount}}</span>' +
						    				'</li>' +						    				
						    				'<li class="peers-count"><span> {{game.channel.peers}} peers</span></li>' +
										'</ul>' +
									'</md-grid-tile-footer>' +
									'<!-- /info -->' +
								'</div>' +
							'</md-grid-tile>' +
							'<!-- grid item -->' +						
							'</md-grid-list>'+
							'<dir-pagination-controls max-size="10" direction-links="true" boundary-links="true" pagination-id="items.key"> </dir-pagination-controls>'+
						'</section>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template,	
			scope:{},
			link:linkFunction			
		}

	}
]);