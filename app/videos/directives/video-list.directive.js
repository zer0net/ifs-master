app.directive('videoList', ['$location',
	function($location) {

		var controller = function($scope,$element) {

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

		var template =  '<div class="container-fluid">'+
						'<md-grid-list class="videos-section"' +
						    'md-cols-xs="2" md-cols-sm="3" md-cols-md="4" md-cols-gt-md="5" ' +
						    'sm-row-height="3:4" md-row-height="3:3"' +
						    'md-gutter="12px" md-gutter-gt-sm="8px">' +
							'<md-grid-tile class="video list-item" ' +
								'ng-repeat="video in videos|filter:ppFilter | orderBy:\'-date_added\' track by $index" ng-class="chooseStyle(video.x_is_load)">' +
								'<div class="inner-wrap md-whiteframe-1dp">' +
									'<div class="video-img md-whiteframe-1dp" style="background-image:url(\'{{video.imgSrc}}\');">' +
										'<a href="/{{site_address}}/view.html?type=video-c={{video.channel.address}}v={{video.video_id}}"><span class="video-time">{{video.total_time | date:"mm:ss"}}</span></a>' +
									'</div>' +
									'<md-grid-tile-footer>' +
										'<h3><a href="/{{site_address}}/view.html?type=video-c={{video.channel.address}}v={{video.video_id}}">{{video.title}}</a></h3>' +
										'<ul class="video-info">' +
						    				'<li><span>{{video.channel.content.title}}</span></li>' +
						    				'<li><span><i am-time-ago="video.date_added"></i></span></li>' +
						    				'<li class="votes-count" votes ng-init="getVotes(video)">' +
												'<span class="up-vote">' +
													'<span class="glyphicon glyphicon-thumbs-up"></span>' +
													'<span class="number">{{video.upVotes}}</span>' +
												'</span>' +
												'<span class="down-vote">' +
													'<span class="glyphicon glyphicon-thumbs-down"></span>' +
													'<span class="number">{{video.downVotes}}</span>' +
												'</span>' +
						    				'</li>' +
						    				'<li class="comments-count" comments ng-init="countComments(video)">' +
												'<span class="glyphicon glyphicon-comment"></span>' +
												'<span>{{commentCount}}</span>' +
						    				'</li>' +
						    				/*
						    				'<li class="views-count" views ng-init="getViews(video)">' +
						    					'<span>{{video.views.length}} views</span>' +
						    				'</li>' +
						    				*/
						    				'<li class="peers-count"><span> {{video.channel.peers}} peers</span></li>' +
										'</ul>' +
									'</md-grid-tile-footer>' +
								'</div>' +
							'</md-grid-tile>' +
						'</md-grid-list>'+
						'</div>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);