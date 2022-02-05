$("#current-date").text(dayjs().format('dddd MMMM D, YYYY'));
var recentCities = [];

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
    // current weather in top card
    $("#current-weather").addClass("card");
	$("#current-temp").text(Math.round(data.current.temp) + "\u00B0");
	$("#hi-temp").text("HI: " + Math.round(data.daily[0].temp.max));
	$("#low-temp").text("LOW: " + Math.round(data.daily[0].temp.min));
    $("#uv-index-wordage").text("UV Index: ");
    $("#uv-index").text(getUvIndex(data.current.uvi));
    $("#humidity").text("Humidity: " + Math.round(data.current.humidity) + "%");
    $("#wind").text("Wind speed: " + Math.round(data.current.wind_speed) + " MPH");
    $("#conditions").text(data.current.weather[0].main);
    $("#weather-image").addClass(getWeatherImage(data.current.weather[0].main));

    // 5 day forecast
    // remove old container and create new div to house content
    $("#5-day-container").remove();
    if ($("#headerText").length) {
        $("#headerText").remove();
    }
    var containerEle = document.createElement("div");
    containerEle.className = "columns is-flex content";
    containerEle.id = "5-day-container";

    // create header for the card
    var headerEl = document.createElement("div");
    headerEl.classList = "content pt-3 pl-4";
    headerEl.id = "headerText";
    var textEl = document.createElement("h2");
    textEl.textContent = "Looking to the next 5 days:";
    headerEl.appendChild(textEl);

    $("#5-day").append(headerEl);
    $("#5-day").append(containerEle);

    // create each day for forecast
    for (var i = 0; i < 5; i++) {
        var containerEl = document.createElement("div");
        containerEl.className = "column ml-2 mr-2 five-day content is-flex-shrink-0";
        containerEl.id = "day-" + (i+1);

        var dateEl = document.createElement("h4");
        dateEl.textContent = dayjs().add(i+1,'day').format('MM/DD/YY');

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

var addRecentCity = function (index) {
    var textBtn = document.createElement("button");
    textBtn.classList = "px-3 recent-city-list";
    textBtn.id = recentCities[index].city;
    textBtn.textContent = recentCities[index].city + ", " + recentCities[index].state + " " + recentCities[index].country;

    if (index == 0) {
        document.querySelector(".recent-cities").append(textBtn);
    } else {
        document.querySelector(".recent-cities").appendChild(textBtn);
    }
}

var loadFromStorage = function () {
    recentCities = JSON.parse(localStorage.getItem("cities"));
    if (recentCities) {
        $(".recent-cities").text("");
        recentCities.forEach(function(element, index) {
            addRecentCity(index);
        });
    }
}

var saveToStorage = function (locationInfo) {
    if (recentCities) {
        // if there's 10 saved, delete oldest one
        if (recentCities.length > 9) {
            $("#" +recentCities[9].city).remove();
            recentCities.splice(9, 1);
        }

        var cityNeedsAdded = true;
        for (var i = 0; i < recentCities.length; i++) {
            if (locationInfo.city == recentCities[i].city) {
                cityNeedsAdded = false
                i = recentCities.length;
                return;
            }
        }
        if (cityNeedsAdded === true) {
            recentCities.unshift(locationInfo);
            addRecentCity(0);
        }
    // there are no cities saved to local storage yet
    } else {
        recentCities = [locationInfo];
        addRecentCity(0);
    }
    localStorage.setItem("cities", JSON.stringify(recentCities));
}

var getWeatherInfo = function (areaOfSearch) {
    // get location in lat and lon based on search results from browser
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
                    var locationInfo = {city: data[0].name, state: data[0].state, country: data[0].country};
                    
                    // get lat and lon from data supplied by user and first apit
                    // pass the location to the second api to get weather information
                    var lat = data[0].lat;
                    var lon = data[0].lon;
                    var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,alerts&appid=" + appid + "&units=imperial";
                    fetch(weatherApi).then(function(response) {
                        if (response.ok) {
                            response.json().then(function(data) {
                                saveToStorage(locationInfo);
                                updateWeatherInfo(data);
                            });
                        } else {
                            alert("Coordinates did not find a response");
                        }
                    });
                } else {
                    alert("No city found");
                }
			});
		} else {
			alert("No city found");
		}
	});
}

$("#search").on("click", function () {  
    var lookUp = $(".input").val().split(",");
    getWeatherInfo(lookUp);
});

$(".recent-cities").on("click", function (callback) {  
    var idOfButton = callback.target.id;
    for (var i = 0; i < recentCities.length; i++) {
        if (recentCities[i].city == idOfButton) {
            var translate = [recentCities[i].city, recentCities[i].state, recentCities[i].country];
            i = recentCities.length;
        }
    }
    getWeatherInfo(translate);
})

loadFromStorage();