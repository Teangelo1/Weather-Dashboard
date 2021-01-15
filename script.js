$(document).ready(function () {


        // Search Button to return results.
    $(".btn").on("click", function() {

        var cityName = $("#input").val().trim();
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=8c25f6eea238e937dd0781aab2ba1708";



    // This Will Display the current weather conditions.
        






        $("ul").append("<li>" + cityName + "</li>")
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

    });

    
    

})








});