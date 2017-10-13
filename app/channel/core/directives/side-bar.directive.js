app.directive('sideBar', ['Item',
	function(Item) {

		// site header controller
		var controller = function($scope,$element) {

			// init
			$scope.init = function(){
				if ($scope.item.poster_file){
					$scope.item.poster_path = '/' + $scope.page.site_info.address + '/merged-' + $scope.page.site_info.content.merger_name + '/' + $scope.item.channel.cluster_id + '/data/users/' + $scope.item.channel.user_id + '/' + $scope.item.poster_file;
				}
				$scope.generateItemProperties();
			};

			// generate item properties
			$scope.generateItemProperties = function(){
				var query = "SELECT sql FROM sqlite_master WHERE tbl_name = 'item' AND type = 'table'";
				Page.cmd("dbQuery",[query],function(result) {
					$scope.$apply(function(){
						var column_names = [];
 						var columnParts = result[0].sql.replace(/^[^\(]+\(([^\)]+)\)/g, '$1').split(','); ///// RegEx
 						columnParts.forEach(function(column,index) {
 							var col = column.split(' ')[0];
 							column_names.push(col);
 						});
 						$scope.column_names = column_names;
					});
				});
			};

			// disply property
			$scope.displyProperty = function(item,col) {
				var a;
				if (item[col] && 
					col !== 'json_id' &&
					col !== 'title'){
					a = true;
				} else {
					a = false;
				}
				return a;
			};

		};

		// site header template
		var template = 	'<aside flex="30" layout="column" layout-padding style="padding-top:0;">' +
							'<ul class="item-details md-whiteframe-1dp" flex="100" ng-init="init()">' +
								'<li class="item-property" ng-repeat="col in column_names" ng-show="displyProperty(item,col)">' +
									'<b class="key">{{col}}:</b> ' +
									'<span class="value" ng-if="col === \'date_added\'" am-time-ago="item[col]"></span>' +
									'<span class="value" ng-if="col === \'file_size\'">{{item[col]|filesize}}</span>' +
									'<span class="value" ng-if="col !== \'file_size\' && col !== \'date_added\'">{{item[col]}}</span>' +
								'</li>' +
							'</ul>' +
							'<div ng-if="item.content_type !== \'image\'" class="thumb-image-section md-whiteframe-1dp" flex="100">' +
								'<h3>Poster</h3>'+
								'<hr/>'+
								'<!-- item image -->' +
								'<img ng-src="{{item.poster_path}}" ng-if="!item.poster" ng-show="item.poster_file" style="margin-bottom:8px;"/>' +
								'<img ng-src="{{item.poster}}" ng-if="item.poster" ng-show="item.poster" style="margin-bottom:8px;"/>' +
								'<!-- /item image -->' +
								'<!-- image upload -->' +
								'<image-upload></image-upload>' +
								'<!-- /image upload -->' +
							'</div>' +
						'</aside>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);