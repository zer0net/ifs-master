app.directive('itemForm', [
	function() {

		var template = '<div class="md-whiteframe-1dp item-info item-form">' +
						    '<md-tabs md-dynamic-height md-border-bottom>' +
						    	'<md-tab ng-repeat="tab in formTabs" label="{{tab.title}}">' +
						    		'<md-content ng-repeat="section in tab.sections" class="md-padding" layout="{{section.type}}">' +
						    			'<md-input-container ng-repeat="field in section.fields" flex="{{field.flex}}">' +
						    				'<label ng-if="field.label" ng-bind="field.label"></label>' +
						    				'<input ng-if="field.type === \'input\'" ng-model="item[field.model]"/>' +
									    	'<input ng-if="field.type === \'executable-file\'" executable-file-input ng-model="item.file_name"/>' +
										    '<textarea ng-if="field.type === \'textarea\'" ng-model="item[field.model]"></textarea>' +
											'<md-select ng-if="field.type === \'select\'" ng-model="item[field.model]">' +
								        		'<md-option ng-repeat="option in field.options" ng-bind="option" ng-value="option"></md-option>' +
								            '</md-select>' +
								            '<zip-content ng-if="field.type === \'zip-contents\'"></zip-content>' +
						    			'</md-input>' +
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