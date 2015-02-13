var TimeLib = {
    daysPassed: function (start, end) {
        var oneDay = 1000 * 60 * 60 * 24;
        return Math.floor((end - start) / oneDay);
    },

    decimalMinutes: function (date) {
        var format = d3.time.format('%H:%M:%S')
        return (format.parse(date) - format.parse('0:0:0'))/60000
    }

}
