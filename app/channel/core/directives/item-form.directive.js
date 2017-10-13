app.directive('itemForm', [
	function() {

		var template = '<div class="md-whiteframe-1dp item-info item-form">' +
						    '<md-tabs md-dynamic-height md-border-bottom>' +
						    	'<md-tab ng-repeat="tab in formTabs" label="{{tab.title}}">' +
						    		'<md-content ng-repeat="section in tab.sections" class="md-padding" layout="{{section.type}}">' +
						    			'<md-input-container ng-repeat="field in section.fields" flex="{{field.flex}}">' +
						    				'<label ng-if="field.label" ng-bind="field.label"></label>' +
						    				'<input ng-if="field.type === \'input\'" ng-model="item[field.model]"/>' +
									    	'<input ng-if="field.type === \'executable-file\'" executable-file-input ng-model="item.inner_file"/>' +
										    '<textarea ng-if="field.type === \'textarea\'" ng-model="item[field.model]"></textarea>' +
											'<md-select ng-if="field.type === \'select\'" ng-model="item[field.model]">' +
								        		'<md-option ng-repeat="option in field.options" ng-bind="option" ng-value="option"></md-option>' +
								            '</md-select>' +
								            '<zip-content ng-if="field.type === \'zip-contents\'"></zip-content>' +
						    			'</md-input>' +
						    		'</md-content>' +
					    			'<md-content class="preview-container" ng-if="tab.title === \'preview\'">' +
					    				'<div ng-if="item.content_type === \'game\'">' +
					    					'<md-button class="md-primary md-raised edgePadding" ng-click="showEmulator()">show emulator</md-button>' +
					    					'<div ng-if="show_emulator">' +
												'<!-- player -->' +
												'<div id="js-dos-container" ng-if="item.file_type === \'zip\'">' +
													'<dosbox ng-init="initDosBox(item)"></dosbox>' +
												'</div>' +
												'<div id="nes-container" ng-if="item.file_type === \'nes\'">' +
													'<nes-emulator ng-init="initNesEmulator(item)"></nes-emulator>' +
												'</div>' +
												'<div id="atari-container" ng-if="item.file_type === \'bin\'">' +
													'<atari-emulator style="margin:0 auto;" ng-init="initAtariEmulator(item)"></atari-emulator>' +
												'</div>' +
												'<div id="cpc-container" ng-if="item.file_type === \'sna\'">' +
													'<cpc-emulator ng-init="initCpcEmulator(item)"></cpc-emulator>' +
												'</div>' +
												'<!-- /player -->' +
											'</div>' +
										'</div>' +
										'<div ng-if="item.content_type === \'image\'">' +
											'<img ng-src="{{item.image_path}}" style="width:100%;" />' +
										'</div>' +
					    			'</md-content>' +
						    	'</md-tab>' +
						    '</md-tabs>' +
						'</div>';

		return {
			restrict: 'AE',
			replace:false,
			template: template
		}

	}
]);