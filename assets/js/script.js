var updateWeatherInfo = function (data) {
	$("#current-temp").text(data.main.temp);
	$("#high-temp").text("HI: " + data.main.temp_max);
	$("#low-temp").text("LOW: " + data.main.temp_min);
}

var getWeatherInfo = function (city, country) {
	var appid = "c66c7201cb23e0dca6ae60ccc9c0c236";
	var geoLocationApi = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + country + "&appid=" + appid;
	fetch(geoLocationApi).then(function(response) {
		if (response.ok) {
			response.json().then(function(data) {
				$("#city-name").text(city);
				$("#secondary-name").text(country);
				var lat = data[0].lat;
				var lon = data[0].lon;
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
			});
		} else {
			alert("No city found!");
		}
	});	
}

$("#display-iframe").click(function () {  
    $("iframe").attr('src', './weather-content.html');
	getWeatherInfo("London", "GB");
});
