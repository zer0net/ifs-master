app.directive('channelInput', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind("keyup keydown keypress", function (event) {
                if (element[0].value){
                    scope.showChannel(element[0].value);
                }
            });
        }
    };
}]);