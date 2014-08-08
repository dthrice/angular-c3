var chartIdCounter = Math.floor((Math.random() * 1000) + 1);
angular.module('c3', [])
    .directive('chart', function () {
        "use strict";
        return {
            restrict: 'EA',
            scope: {
                data: '=',
                options: '=',
                type: '='
            },
            link: function (scope, element, attrs) {
                //Assigning id to the element
                var chartId;
                if (element.attr('id')) {
                    chartId = element.attr('id');
                } else {
                    chartId = 'c3-chart-' + chartIdCounter;
                    element.attr('id', chartId);
                    chartIdCounter += 1;
                }

                //Preparing chart data and options
                var genData = {
                    bindto: '#' + chartId,
                    data: scope.data
                };
                genData.data.type = attrs.chart ? attrs.chart : scope.data.type ? scope.data.type : 'line';
                if (scope.options) {
                    Object.keys(scope.options).forEach(function (key) {
                        genData[key] = scope.options[key];
                    });
                }

                //On data change, reload chart
                var onDataChanged = function (data, oldData) {
                    if (chart) {
                        chart.load(data);
                        if (data.columns.length < oldData.columns.length) {
                            chart.unload(['data' + oldData.columns.length]);
                        }
                    }
                };
                scope.$watch('data', onDataChanged, true);

                //On chart type change, reload chart
                var onTypeChanged = function (type) {
                    if (chart) {
                        scope.data.type = type;
                        chart.load(scope.data);
                    }
                };

                scope.$watch(function () {
                    return scope.type;
                }, onTypeChanged);

                //Generating the chart
                var chart = c3.generate(genData);
            }
        };
    });