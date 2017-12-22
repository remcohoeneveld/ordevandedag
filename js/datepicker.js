/*

//getting the datepicker container
var datepickerContainer = $("#datepicker");
//creating the current date
var currentdate = new Date();

//getting the date from the datepicker
datepickerContainer.datepicker({
    changeMonth: true,
    changeYear: true,
    altField: "#alternate",
    altFormat: "DD, d MM, yy",
    dateFormat: "yy-mm-dd",
    yearRange: '2017:2020',
    minDate: new Date(2017, 7, 1),
    showWeek: true,
    firstDay: 1,
    maxDate: "-1",
    onSelect: function(dateText, inst) {
        //getting the date [String and Object]
        var dateAsString = dateText; //the first parameter of this function
        var dateAsObject = $(this).datepicker( 'getDate' ); //the getDate method
        //checking if the date is in the past and not the future
        if (dateAsObject < currentdate){
            console.log(dateAsString);
        }
    }
});

datepickerContainer.datepicker('setDate', '-1');*/
