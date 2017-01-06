app.directive('gameView', ['$location',
	function($location) {

		var controller = function($scope,$element) {

			// init game view
			$scope.initGameView = function(){
				// get channels & game id from url
				var channelId = window.location.href.split('&')[0].split('c=')[1].split('g')[0];
				var gameId = parseInt(window.location.href.split('&')[0].split('g=')[1].split('z')[0]);
				// loop through games array
				$scope.games.forEach(function(game,index){
					// if game id & channel exist in array
					if (game.game_id === gameId && game.channel.address === channelId){
						// apply game to scope
						$scope.game = game;
					}
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