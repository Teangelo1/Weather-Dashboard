$(document).ready(function () {

     let savedInput = JSON.parse(localStorage.getItem("savedInput"));
     if(savedInput === null){
         savedInput = []
     };
     // Search Button to return results.
    $(".btn").on("click", function () {

       
        var cityName = $("#input").val().trim();
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=8c25f6eea238e937dd0781aab2ba1708";
        $("ul").prepend("<li>" + cityName + "</li>");
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var lon = response.city.coord.lon;
            var lat = response.city.coord.lat;
            var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=8c25f6eea238e937dd0781aab2ba1708";
            // console.log(response);
            $.ajax({
                url: oneCallUrl,
                method: "GET"
            }).then(function (response) {
                console.log(response);

                // Displaying Current date/Temp/Hum/WindS
               var currentDate = Date(response.current.dt);
                $(".namecity").text(cityName);
                $(".currentdate").text(currentDate);
                $(".icon").attr("src", "http://openweathermap.org/img/wn/" + response.current.weather[0].icon + ".png");
                $(".currenttemp").text("Temperature: " + response.current.temp);
                $(".currenthumidity").text("Humidity: " + response.current.humidity + "%");
                $(".current-wind-speed").text("Wind Speed: " + response.current.wind_speed);
                $(".current-uvindex").text(response.daily[0].uvi);

                //Checking date to determine uv index color
                if (response.daily[0].uvi <= 3) {
                    $("#uv-Index").addClass("green");
                   } else if (response.daily[0].uvi >= 3 && response.daily[0].uvi < 6 ) {
                     $("#uv-Index").addClass("yellow");
                   } else if (response.daily[0].uvi >= 6 && response.daily[0].uvi < 9) {
                       $("#uv-Index").addClass("orange");
                   } else  { 
                       $("#uv-Index").addClass("red");
                   } console.log(response.current.uvi);
            

                   // For loop for 5 Day Forecast
               var days = response.daily;
               //used empty function so that recent forecast is cleared once new forecast is displayed
               $("#forecast").empty();

               for(var i = 1; i < 6; i++) {
                var date = new Date (days[i].dt);
                var temp = days[i].temp.day;
                var humidity = days[i].humidity;
                var container = $("<div>").addClass("col-md-3 future-day");
                
                var dateContainer = $("<div>").text(date);
                var tempContainer = $("<div>").text(temp);
                var humidityContainer = $("<div>").text(humidity);

                container.append(dateContainer,tempContainer,humidityContainer);
                $("#forecast").append(container);
                } 
                savedInput.push(cityName);

               window.localStorage.setItem("savedInput", JSON.stringify(savedInput));
            });
            
    
});
        

                })

});

