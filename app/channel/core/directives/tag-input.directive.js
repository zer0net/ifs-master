app.directive('tagInput', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind("keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function() {
                        scope.tags.push(element[0].value);
                        element[0].value = '';
                    });
                }
            });
        }
    };
}]);