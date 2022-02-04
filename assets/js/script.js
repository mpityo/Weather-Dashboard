var getWeatherImage = function (condition) {  
    switch(condition) {

    }
}
var getUvIndex = function (index) {  

}

var updateWeatherInfo = function (data) {
    $("#current-weather").addClass("card");
    $("#5-day").addClass("card");
	$("#current-temp").text(Math.round(data.main.temp));
	$("#hi-temp").text("HI: " + Math.round(data.main.temp_max));
	$("#low-temp").text("LOW: " + Math.round(data.main.temp_min));
    $("#uv-index").text("UV Index: " + getUvIndex(Math.round()));
    $("#humidity").text("Humidity: " + Math.round(data.main.humidity) + "%");
    $("#wind").text("Wind speed: " + Math.round(data.wind.speed) + " MPH");
    $("#conditions").text(data.weather.main);
    $("#weather-image").attr('src', 'http://openweathermap.org/img/wn/' + data.weather.icon + '@4x.png');
}

var getWeatherInfo = function (areaOfSearch) {
    var appid = "c66c7201cb23e0dca6ae60ccc9c0c236";
    if (areaOfSearch.length === 1) {
        var geoLocationApi = 'https://api.openweathermap.org/geo/1.0/direct?q=' + areaOfSearch[0] + '&appid=' + appid;
    } else if (areaOfSearch.length === 2) {
        var geoLocationApi = 'https://api.openweathermap.org/geo/1.0/direct?q=' + areaOfSearch[0] + ',' + areaOfSearch[1] + '&appid=' + appid;
    } else if (areaOfSearch.length === 3) {
        var geoLocationApi = 'https://api.openweathermap.org/geo/1.0/direct?q=' + areaOfSearch[0] + ',' + areaOfSearch[1] + ',' + areaOfSearch[2] + '&appid=' + appid;
    } else {
        alert("Too many search parameters");
        return;
    }
    fetch(geoLocationApi).then(function(response) {
		if (response.ok) {
			response.json().then(function(data) {
				if (data.length > 0) {
                    $("#city-name").text(data[0].name);
                    $("#secondary-name").text(data[0].country);
                    var lat = data[0].lat;
                    var lon = data[0].lon;
                    console.log(data);
                    var weatherApi = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + appid + "&units=imperial";
                    fetch(weatherApi).then(function(response) {
                        if (response.ok) {
                            response.json().then(function(data) {
                                updateWeatherInfo(data);
                            });
                        } else {
                            alert("Coordinated did not find a response");
                        }
                    });
                } else {
                    alert("No such city");
                }
			});
		} else {
			alert("No city found!");
		}
	});
}

$("#display-iframe").click(function () {  
    var lookUp = $(".input").val().split(",");
    getWeatherInfo(lookUp);
});