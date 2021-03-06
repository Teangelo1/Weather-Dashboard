$(document).ready(function () {

    let savedInput = JSON.parse(localStorage.getItem("savedInput"));
    if (savedInput === null) {
        savedInput = ["Detroit"] // If User refreshes page, keep last saved city entered
    };
    function citySearch(cityName) {
        // Getting City Name from 5 Day 3 Hour Weather API
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=8c25f6eea238e937dd0781aab2ba1708";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var lon = response.city.coord.lon;
            var lat = response.city.coord.lat;
            // Used a different API to retrieve the longitude and latitude. 5 Weather 3 Hour API does not retrieve lon + lat
            var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=8c25f6eea238e937dd0781aab2ba1708";
            // console.log(response);
            $.ajax({
                url: oneCallUrl,
                method: "GET"
            }).then(function (response) {
                console.log(response);

                // Displaying Current date/Temp/Humidity/WindSpeed
                var currentDate = Date(response.current.dt);
                $(".namecity").text(cityName);
                $(".currentdate").text(currentDate);
                $(".icon").attr("src", "http://openweathermap.org/img/wn/" + response.current.weather[0].icon + ".png");
                $(".currenttemp").text("Temperature: " + Math.floor((response.current.temp - 273) * 1.8 + 32) + "°F");
                $(".currenthumidity").text("Humidity: " + response.current.humidity + "%");
                $(".current-wind-speed").text("Wind Speed: " + response.current.wind_speed);
                $(".current-uvindex").text("UV Index: " + response.daily[0].uvi);

                //If statement to check UV Index to determine the color based on temperature
                if (response.daily[0].uvi <= 3) {
                    $("#uv-Index").addClass("green");
                } else if (response.daily[0].uvi >= 3 && response.daily[0].uvi < 6) {
                    $("#uv-Index").addClass("yellow");
                } else if (response.daily[0].uvi >= 6 && response.daily[0].uvi < 9) {
                    $("#uv-Index").addClass("orange");
                } else {
                    $("#uv-Index").addClass("red");
                } console.log(response.current.uvi);


                // For loop for for 5 Day forecast.
                var days = response.daily;
                //used empty function so that recent forecast is cleared once new forecast is displayed
                $("#forecast").empty();

                for (var i = 1; i < 6; i++) {
                    var date = new Date(days[i].dt); // Date is not displaying correctly
                    var temp = days[i].temp.day;
                    var humidity = days[i].humidity;
                    var container = $("<div>").addClass("col-3 future-day");

                    var dateContainer = $("<div>").text(date);
                    var tempContainer = $("<div>").text("Temperature: " + (Math.floor(temp - 273)* 1.8 + 32) + "°F");
                    var humidityContainer = $("<div>").text("Humidity: " + humidity + "%");

                    container.append(dateContainer, tempContainer, humidityContainer);
                    $("#forecast").append(container);
                }
                savedInput.push(cityName);

                localStorage.setItem("savedInput", JSON.stringify(savedInput));
            });


        });

    }

    // Search Button to add results to list and Grab API data
    $(".mainSearch").on("click", function () {

        var cityName = $("#input").val().trim();
        let saveButton = $("<button>")
            .addClass("savedSearch btn")
            .attr("id", cityName)
            .html(cityName);
        $(".recent-searches").prepend(saveButton);


        citySearch(cityName);

    })
      // On Click of the previous searched City, the user will be displayed with the current weather conditions of the city that was clicked.
    $(".recent-searches").on("click", (e) => {
        e.preventDefault();
        citySearch(e.target.id);

    })

citySearch(savedInput[savedInput.length - 1]);
});

