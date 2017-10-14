var mainMaskanta = angular.module("mainMaskanta", ['ngRoute']);

mainMaskanta.config(["$routeProvider",function($routeProvider){
    $routeProvider
        .when("/mashkantaCalc",{
            templateUrl: '../app/maskhantaForm/mashkantaForm.html',
            controller: 'formControl',
            css: '../app/maskhantaForm/mashkantaForm.css'
        })

        .when("/calcResult",{
            templateUrl: '../app/maskhantaFormResult/calcResult.html',
            controller: 'calcMashkanta',
            css:'../app/maskhantaFormResult/calcResult.css'
        })

        .otherwise({
            redirectTo:"/mashkantaCalc"
        });
}]);

mainMaskanta.controller( "formControl" ,["$scope", "$location", "sharedProperties",  function ($scope, $location, sharedProperties) {
    $scope.data = {
        moneyLoan:"",
        percentageRange:1.5,
        refundCash:"",
        yearRange:5,
        tabPosition:true
    };

    $scope.loanByYear = function () {
       $scope.data.tabPosition = true;
       angular.element(document.querySelector( '#refundOrYearRange')).html("הזן כמה שנים תחזיר את ההלואה");

    };

    $scope.loanByRefund =function () {
        $scope.data.tabPosition = false;
        angular.element(document.querySelector( '#refundOrYearRange')).html("הזן סכום החזר חודשי רצוי");
    };

    $scope.addPercentage = function(){
        if(parseFloat($scope.data.percentageRange) < 100)
            $scope.data.percentageRange = (parseFloat($scope.data.percentageRange) + 0.1).toFixed(2);
        else
            $scope.data.percentageRange = 0;
    };

    $scope.dividePercentage = function(){
        if(parseFloat($scope.data.percentageRange) > 0)
            $scope.data.percentageRange = (parseFloat($scope.data.percentageRange) - 0.1).toFixed(2);
        else
            $scope.data.percentageRange = 100;
    };

    $scope.clear = function () {
        $scope.data.moneyLoan = "";
        $scope.data.percentageRange = 1.5;

        if($scope.data.tabPosition)
            $scope.data.yearRange = 5;
        else
            $scope.data.refundCash = "";
    };

    $scope.passToResult = function () {
        sharedProperties.setProperty($scope.data);
        $location.path('/calcResult');
    };
}]);

mainMaskanta.controller( "calcMashkanta" ,["$scope", "$location", "sharedProperties", function ($scope, $location, sharedProperties) {
    $scope.data = sharedProperties.getProperty();

    $scope.interest = $scope.data.percentageRange / 1200;

    if($scope.data.tabPosition){
        calcAmount();
    }else if(!$scope.data.tabPosition){
        calcYearTorefund();
    }

   function calcAmount(){
       if($scope.data.percentageRange > 0) {
            $scope.data.refundCash = $scope.data.moneyLoan / ((1-Math.pow((1 / (1 + $scope.interest)), $scope.data.yearRange * 12)) / $scope.interest);
       }else {
           $scope.data.refundCash = $scope.data.moneyLoan / ($scope.data.yearRange * 12);
       }
    }

    function calcYearTorefund() {
        if($scope.data.percentageRange > 0){
            $scope.data.yearRange = Math.log(($scope.data.refundCash - ($scope.interest * $scope.data.moneyLoan)) / $scope.data.refundCash) / Math.log(1 / (1 + $scope.interest)) / 12;
        }else{
            $scope.data.yearRange = $scope.data.moneyLoan / ($scope.data.refundCash * 12);
        }

        $scope.data.yearRange = $scope.data.yearRange.toFixed(1);
    }
}]);


mainMaskanta.service('sharedProperties', function () {
    var property ={};

    return {
        getProperty: function () {
            return this.property;
        },
        setProperty: function(value) {
            this.property = value;
        }
    };
});

