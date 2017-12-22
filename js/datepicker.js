//getting the datepicker container
var datepickerContainer = $("#datepicker");
//creating the current date
var currentdate = new Date();

//getting the date from the datepicker
datepickerContainer.datepicker({
    onSelect: function(dateText, inst) {
        //getting the date [String and Object]
        var dateAsString = dateText; //the first parameter of this function
        var dateAsObject = $(this).datepicker( 'getDate' ); //the getDate method

        //checking if the date is in the past and not the future
        if (dateAsObject < currentdate){
            console.log('date is in the past')
        }
    }
});