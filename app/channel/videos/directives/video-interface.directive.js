app.directive('videoInterface', ['$sce',
	function($sce) {

		// video interface controller
		var controller = function($scope,$element) {

			// init video interface
			$scope.init = function(){
				console.log('init video interface');
				// config form tabs & fields
				$scope.formTabs = [
					{
						title:'Basic Info',
						sections:[{
							type:'column',
							fields: [{
								label:'Title',
								type:'input',
								model:'title',
								flex:'100'
							},{
								label:'Description',
								type:'textarea',
								model:'description',
								flex:'100'
							}]
						}]
					}
				];

				// if mode is create
				if ($scope.mode === 'create'){
					$scope.video = $sce.trustAsResourceUrl($scope.item.file);
				} else {
					$scope.video = '/'+$scope.site_address+'/uploads/videos/'+$scope.item.file_name;
				}
				// read video file
				$scope.readVideoFile();
			};

			// read video file
			$scope.readVideoFile = function(){
				// video player
				$scope.player = {
					autoPlay:true,
					sources: [
						{
							src:$scope.video,
							type:'video/'+$scope.item.file_type
						}
					],
					theme: "/" + $scope.site_address + "/assets/lib/videos/videogular-themes-default/videogular.css"
				};
			};

		};

		var template = '<div class="video-interface" style="padding: 0;" ng-init="init()">' +
							'<!-- form -->' +
							'<item-form ng-if="formTabs"></item-form>' +
							'<!-- /form -->' +
							'<!-- player -->' +
							'<video-player></video-player>' +
							'<!-- /player -->' +
						'</div>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);