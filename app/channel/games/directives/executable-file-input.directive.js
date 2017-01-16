app.directive('executableFileInput', ['$parse','$rootScope' ,function ($parse,$rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind("keyup keydown keypress", function (event) {
                if (element[0].value){
                    var fileName = element[0].value;
                    $rootScope.$broadcast('onChangeExecutableFile',fileName);
                }
            });
        }
    };
}]);