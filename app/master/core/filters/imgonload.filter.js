app.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                scope.onLoadedItemImg();
            });
            element.bind('error', function(){
                scope.onLoadedItemImg();
            });
        }
    };
});