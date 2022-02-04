var getWeatherImage = function (condition) {  
    
}
var getUvIndex = function (index) {  
	if (index < 3) {
		$("#uv-index-color").addClass("has-background-success");
		return index;
	} else if (index > 3 && index < 7) {
		$("#uv-index-color").addClass("has-background-warning");
		return index;
	} else if (index > 7) {
		$("#uv-index-color").addClass("has-background-danger");
		return index;
	}
}

var updateWeatherInfo = function (data) {
    $("#current-weather").addClass("card");
    $("#5-day").addClass("card");
	$("#current-temp").text(Math.round(data.current.temp));
	$("#hi-temp").text("HI: " + Math.round(data.daily[0].temp.max));
	$("#low-temp").text("LOW: " + Math.round(data.daily[0].temp.min));
	$("#uv-index-container").text("UV Index: ");
    $("#uv-index").text(getUvIndex(data.current.uvi));
    $("#humidity").text("Humidity: " + Math.round(data.current.humidity) + "%");
    $("#wind").text("Wind speed: " + Math.round(data.current.wind_speed) + " MPH");
    $("#conditions").text(data.weather[0].main);
    $("#weather-image").attr('src', 'http://openweathermap.org/img/wn/' + data.current.weather.icon + '@4x.png');
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
                    $("#secondary-name").text(data[0].state +", " + data[0].country);
                    var lat = data[0].lat;
                    var lon = data[0].lon;
                    var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,alerts&appid=" + appid + "&units=imperial";
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

getWeatherInfo(["London"]);