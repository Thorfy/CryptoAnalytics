/**
 * Load new data depending on the selected min and max
 */
function afterSetExtremes(e) {

    var chart = Highcharts.charts[0];

    chart.showLoading('Loading data from server...');
    $.getJSON('https://www.highcharts.com/samples/data/from-sql.php?start=' + Math.round(e.min) +
            '&end=' + Math.round(e.max) + '&callback=?', function (data) {

        chart.series[0].setData(data);
        chart.hideLoading();
    });
}

// See source code from the JSONP handler at https://github.com/highcharts/highcharts/blob/master/samples/data/from-sql.php
//$.getJSON('https://www.highcharts.com/samples/data/from-sql.php?callback=?', function (data) {
$.getJSON('cryptoAnaliticsApi/inc/getHistorical.inc.php/?function=getHistoricalDay', function (response) {
    var data = response.Data;
    // Add a null value for the end date
    data = [].concat(data, [[Date.UTC(2011, 9, 14, 19, 59), null, null, null, null]]);

    // create the chart
    Highcharts.stockChart('container', {
        chart: {
            type: 'candlestick',
            zoomType: 'x'
        },

        navigator: {
            adaptToUpdatedData: false,
            series: {
                data: data
            }
        },

        scrollbar: {
            liveRedraw: false
        },

        title: {
            text: 'BTC History pour le 11/06/2018'
        },

        subtitle: {
            text: 'ceci affiche un candlestick pour le btc'
        },

        rangeSelector: {
            buttons: [{
                    type: 'day',
                    count: 1,
                    text: '1d'
                }],
            inputEnabled: false, // it supports only days
            selected: 1 //
        },

        xAxis: {
            events: {
                //afterSetExtremes: afterSetExtremes
            },
            minRange: 3600 * 1000 // one hour
        },

        yAxis: {
            floor: 0
        },

        series: [{
                data: data,
                dataGrouping: {
                    enabled: false
                }
            }]
    });
});


