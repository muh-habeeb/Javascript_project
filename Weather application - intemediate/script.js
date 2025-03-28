// api key  of openweather
const API_KEY = "01e438eb6e55f82d558ef1fac2a8fd32";

//let get the dom elements
const cityInput = document.getElementById("city_input");
const searchBtn = document.querySelector(".search-btn");
const locationBtn = document.querySelector(".location-btn");
const currentCardDiv = document.querySelector(".current-weather");
const weatherCardDiv = document.querySelector(".weather-cards");

//function ot manage btn clicking

const toggleButtons = (disabled, text1, text2) => {
    searchBtn.disabled = disabled;
    locationBtn.disabled = disabled;
    searchBtn.textContent = text1;
    locationBtn.textContent = text2;
}
//function for creating the cards and render
const createCards = (city, weatherItem, index) => {
    if (index === 0) {
        //html structure fore creating current weather card
        return `
         <div class="details">
            <h2>${city}</h2>
            <h4>${weatherItem.dt_txt.split(" ")[0]}</h4>
            <h4>Temperature: ${weatherItem.main.temp}c°</h4>
            <h4>Wind : ${weatherItem.wind.speed} M/S</h4>
            <h4>Humidity: ${weatherItem.main.humidity}%</h4>
          </div>
          <div class="icon">
            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon
            }@4x.png" alt="" />
            <h4>${weatherItem.weather[0].description}</h4>
          </div>
        `;
    } else {
        //html structure fore creating fiveDays weather card
        return ` <li class="card">
                  <h2>${weatherItem.dt_txt.split(" ")[0]}</h2>
                  <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon
            }@2x.png" alt="" />
                  <h4>Climate: ${weatherItem.weather[0].description}</h4>
                  <h4>Temp: ${weatherItem.main.temp}c°</h4>
                  <h4>Wind : ${weatherItem.wind.speed} M/S</h4>
                  <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </li>
        `;
    }
};
//get weather details from coordinates
const getWeatherDetails = (city, lat, lon) => {
    const WEATHER_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    toggleButtons(true, 'Searching...', 'Searching...')
    fetch(WEATHER_API)
        .then((res) => res.json())
        .then((data) => {
            if (!data || !data.list) throw new Error("Invalid data received"); //throw error if response is null
            const uniqueForeCastDays = [];
            const fiveDaysForeCast = data.list.filter((forecast) => {
                const foreCastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForeCastDays.includes(foreCastDate)) {
                    return uniqueForeCastDays.push(foreCastDate);
                }
            });
            cityInput.value = "";
            currentCardDiv.innerHTML = "";
            weatherCardDiv.innerHTML = "";
            fiveDaysForeCast.forEach((weatherItem, index) => {
                if (index === 0) {
                    currentCardDiv.insertAdjacentHTML(
                        "beforeend",
                        createCards(city, weatherItem, index)
                    );
                } else {
                    weatherCardDiv.insertAdjacentHTML(
                        "beforeend",
                        createCards(city, weatherItem, index)
                    );
                }
            });
            console.log(data);
        })
        .catch((e) => {
            alert("An error occurred while fetching the weather forecast");
            console.log(e);
        })
        .finally(() => { toggleButtons(false, 'Search', 'Use Current Location') });
};
//get the coordinates of the user city
const getCoordinates = () => {
    const city = cityInput.value.trim().toLowerCase();
    toggleButtons(true, 'Searching...', 'Searching...')
    if (!city) {
        toggleButtons(false, 'Search', 'Use Current Location')
        return;

    };
    if (!navigator.onLine) alert("Please connect to internet!!");
    const GEO_CORDING_API = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
    fetch(GEO_CORDING_API)
        .then((res) => res.json())
        .then((data) => {
            if (!data.length) return alert(`No coordinates found for ${city} !`); //checking for null
            cityInput.value = "";
            const { name, lat, lon } = data[0];
            getWeatherDetails(name, lat, lon); //passing the values to weather function
        })
        .catch(() => {
            alert(
                "An error occurred while fetching the coordinates! check your internet connection!"
            );
        })
        .finally(() => { toggleButtons(false, 'Search', 'Use Current Location') });
};

const getLocationCoordinates = () => {
    toggleButtons(true, 'Searching...', 'Searching...')
    navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        const REVERSE_GEO_CORDING_API = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=${1}&appid=${API_KEY}`;
        if (!navigator.onLine) alert("Please connect to internet!!");

        fetch(REVERSE_GEO_CORDING_API)
            .then((res) => res.json())
            .then((data) => {
                if (!data.length)
                    return alert("Error occurred while connecting to api");

                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
            })
            .catch(() => {
                alert(
                    "An error occurred while fetching the location! check your internet connection!"
                );
            })
            .finally(() => {
                toggleButtons(false, 'Search', 'Use Current Location')
            });
    }, error => {
        //custom errors fore geolocation errors
        let erMsg = 'An error occurred!'
        if (error.code === 1) erMsg = 'Geolocation request denied . please reset the location permission !'
        else if (error.code === 2) erMsg = 'your position is currently unavailable right now,please try again later'
        else if (error.code === 3) erMsg = 'Geolocation request time out!, please try again! '
        alert(erMsg);
        toggleButtons(false, 'Search', 'Use Current Location')
    }
    );
};

//event listeners
searchBtn.addEventListener("click", getCoordinates);
locationBtn.addEventListener("click", getLocationCoordinates);
//search when enter btn is clicked
document.addEventListener("keyup", (e) => {
    if (e.key === 'Enter') {
        getCoordinates()
    }
})
