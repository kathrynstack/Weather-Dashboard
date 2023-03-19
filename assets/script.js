const api_key = '9e4aed65578f69d21ef1ac69129d0933'
var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=Charlotte&appid=' + api_key + '&units=Imperial';
const icon_url = 'https://openweathermap.org/img/wn/'


function getWeather(requestUrl) {
  return fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data
    })
}


function showWeather(weatherData) {
  let fiveDayReport = $("#five-day-report");
  //Clear the data first so it doesnt keep appending if button is clicked multiple times
  fiveDayReport.empty();

  if (weatherData.cod != 200) {
    let singleDayReport = $('#single-day-report');
    singleDayReport.empty();
    
    let errorMsg = $('<h3>');
    errorMsg.text(`City not Found`);
    singleDayReport.append(errorMsg);
    return -1;
}

  let prevDay = -1;
  let currentDate = new Date();
  for (let i = 0; i < weatherData.list.length; i++) {
    let weatherDate = new Date(weatherData.list[i].dt * 1000);

    //Add check to make sure we dont get multiple weather info for same day
    if (weatherDate.getHours() > currentDate.getHours() & prevDay != weatherDate.getDate()) {
      prevDay = weatherDate.getDate();
      let weatherDay = $('<div>').attr("id", "weatherDay").addClass('col');

      //Add date
      let date = $('<h5>').attr("id", "dateField");
      date.text(`${weatherDate.getMonth() + 1}/${weatherDate.getDate()}/${weatherDate.getFullYear()}`);
      weatherDay.append(date);

      //Add weather icon
      let icon = $('<img>').attr("id", "iconField");
      icon.attr('src', icon_url + weatherData.list[i].weather[0].icon + '.png');
      weatherDay.append(icon);

      //Add temp data
      let temp = $('<div>').attr("id", "tempField");
      temp.text(`Temp: ${weatherData.list[i].main.temp} °F`);
      weatherDay.append(temp);

      //Add wind data
      let wind = $('<div>').attr("id", "windField");
      wind.text(`Wind: ${weatherData.list[i].wind.speed} MPH`);
      weatherDay.append(wind);

      //Add humidity data
      let humidity = $('<div>').attr("id", "humidityField");
      humidity.text(`Humidity: ${weatherData.list[i].main.humidity}%`);
      weatherDay.append(humidity);

      fiveDayReport.append(weatherDay);

      if (weatherDate.getDate() == currentDate.getDate()) {
        singleDayReport = $('#single-day-report');
        singleDayReport.empty();

        //Add city info
        let cityInfo = $('<h3>');
        cityInfo.text(`${weatherData.city.name} (${weatherDate.getMonth() + 1}/${weatherDate.getDate()}/${weatherDate.getFullYear()})`);

        let icon = $('<img>').attr("id", "iconField");
        icon.attr('src', icon_url + weatherData.list[i].weather[0].icon + '.png');
        cityInfo.append(icon);

        singleDayReport.append(cityInfo);

        let temp = $('<div>').attr("id", "tempField");
        temp.text(`Temp: ${weatherData.list[i].main.temp} °F`);
        singleDayReport.append(temp);

        //Add wind data
        let wind = $('<div>').attr("id", "windField");
        wind.text(`Wind: ${weatherData.list[i].wind.speed} MPH`);
        singleDayReport.append(wind);

        //Add humidity data
        let humidity = $('<div>').attr("id", "humidityField");
        humidity.text(`Humidity: ${weatherData.list[i].main.humidity}%`);
        singleDayReport.append(humidity);
      }
    }
  }

}


function addCityButtons(cityName) {
  let cityData = [];
  if (localStorage.getItem("cityData") != undefined) {
    cityData = JSON.parse(localStorage.getItem("cityData")).cityData;
  }

  //Remove new city name from list and put it at front of list
  cityData = cityData.filter(function (searchCity) {
    if (searchCity.toUpperCase() == cityName.toUpperCase()) {
      return false;
    }
    else {
      return true;
    }
  });
  cityData.unshift(cityName);

  //Remove elements from list if it is longer then 8 elements
  cityData = cityData.slice(0, 7);

  let histCityButtons = $("#hist-city-buttons");
  histCityButtons.empty();
  for (let i = 0; i < cityData.length; i++) {
    let cityButton = $("<button>").attr("id", "city-btn").attr("type", "button").attr("onclick", `getCity('${cityData[i]}')`).text(cityData[i]);
    histCityButtons.append(cityButton);
  }

  localStorage.setItem("cityData", JSON.stringify({ "cityData": cityData }));

}


function clearHistory() {
  if (localStorage.getItem("cityData") != undefined) {
    localStorage.setItem("cityData", JSON.stringify({ "cityData": [] }));
  }
  $("#hist-city-buttons").empty();
}


function getCity(cityName) {
  if (cityName == undefined) {
    cityName = $("#search-input").val();
  }

  if (cityName != undefined & cityName != '') {
    addCityButtons(cityName);
  }

  requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${api_key}&units=Imperial`;
  getWeather(requestUrl).then(showWeather);
}
