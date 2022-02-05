var getWeatherImage = function (condition) {  
    switch (condition) {
        case "Clouds":
            return "fa-cloud";
        case "Mist":
        case "Smoke":
        case "Haze":
        case "Dust":
        case "Fog":
        case "Sand":
        case "Ash":
        case "Squall":
        case "Torando":
            return "fa-smog";
        case "Thunderstorm":
            return "fa-poo-storm";
        case "Drizzle":
            return "fa-cloud-rain";
        case "Rain":
            return "fa-cloud-showers-heavy";
        case "Snow":
            return "fa-snowflake";
        case "Clear":
        default:
            return "fa-sun";
    }
}
var getUvIndex = function (index) {  
	if (index < 3) {
		$("#uv-index").addClass("has-background-success");
		return index;
	} else if (index > 3 && index < 7) {
		$("#uv-index").addClass("has-background-warning");
		return index;
	} else if (index > 7) {
		$("#uv-index").addClass("has-background-danger");
		return index;
	}
}

var updateWeatherInfo = function (data) {
    // current weather
    $("#current-weather").addClass("card");
	$("#current-temp").text(Math.round(data.current.temp) + "\u00B0");
	$("#hi-temp").text("HI: " + Math.round(data.daily[0].temp.max));
	$("#low-temp").text("LOW: " + Math.round(data.daily[0].temp.min));
    $("#uv-index").text(getUvIndex(data.current.uvi));
    $("#humidity").text("Humidity: " + Math.round(data.current.humidity) + "%");
    $("#wind").text("Wind speed: " + Math.round(data.current.wind_speed) + " MPH");
    $("#conditions").text(data.current.weather[0].main);
    $("#weather-image").addClass(getWeatherImage(data.current.weather[0].main));

        $("#5-day-container").remove();
        var containerEle = document.createElement("div");
        containerEle.className = "columns is-flex content";
        containerEle.id = "5-day-container";

        var headerEl = document.createElement("div");
        headerEl.classList = "content pt-5 pl-4";
        var textEl = document.createElement("h2");
        textEl.textContent = "Looking to the next 5 days:";
        headerEl.appendChild(textEl);

        $("#5-day").append(headerEl);
        $("#5-day").append(containerEle);

    // 5 day forecast
    for (var i = 0; i < 5; i++) {
        var containerEl = document.createElement("div");
        containerEl.className = "column five-day content";
        containerEl.id = "day-" + (i+1);

        var dateEl = document.createElement("h2");
        dateEl.textContent = "Day " + (i+1);

        var weatherImageEl = document.createElement("i");
        weatherImageEl.className = "fa fa-2x " + getWeatherImage(data.daily[i].weather[0].main);

        var temperatureEl = document.createElement("p");
        temperatureEl.textContent = "Temp: " + Math.round(data.daily[i].temp.day) + "\u00B0";

        var windSpeedEl = document.createElement("p");
        windSpeedEl.textContent = "Wind: " + Math.round(data.daily[i].wind_speed) + " MPH";

        var humidityEl = document.createElement("p");
        humidityEl.textContent = "Humidity: " + Math.round(data.daily[i].humidity) + "%";

        $(containerEl).append(dateEl, weatherImageEl, temperatureEl, windSpeedEl, humidityEl);
        $("#5-day-container").append(containerEl);
    }
}

var loadFromStorage = function (city) {
    var data = localStorage.getItem("cityData")
    return JSON.parse(data);
}

var saveToStorage = function (data) {
    localStorage.setItem("cityData", JSON.stringify(data));
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
    var localData = loadFromStorage(areaOfSearch[0]);
    if (localData) {
        $("#city-name").text(areaOfSearch[0]);
        $("#secondary-name").text(areaOfSearch[1] +", " + areaOfSearch[2]);
        updateWeatherInfo(localData);
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
                                saveToStorage(data);
                                updateWeatherInfo(data);
                            });
                        } else {
                            alert("Coordinates did not find a response");
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

getWeatherInfo(["London", "England", "GB"]);