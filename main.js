let cityInput  = document.getElementById("city-input"),
seatchBtn    = document.getElementById('searchBtn'),
api_key = '3afd4977adc22ca910dc667a7499c45f' ,
currentWeatherCard = document.querySelectorAll('.weather-left .card')[0],
fiveDaysForecastCard = document.getElementById('dayForecast');
aqiCard = document.querySelectorAll('.highlights .card')[0],
sunriseCard = document.querySelectorAll('.highlights .card')[1],
humidityVal = document.getElementById( "humidityVal" ),
pressureVal = document.getElementById( "pressureVal" ),
visibilityVal = document.getElementById( "visibilityVal" ),
windSpeedVal = document.getElementById( "windSpeedVal" ),
feelsVal = document.getElementById( "feelsVal" ),
hourlyForecastCard = document.querySelector('.hourly-forcast') ;
aqiList = ['Good', 'Fair', 'Moderate','Poor','Very Poor'];

function getWeatherDetails(name , lat , lon , country , state){
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
    WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
    AIR_POLLUTION_API_URL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`,
    days = [
       "Sunday" , 
       "Monday" ,   
       "Tuesday" ,
        "Wednesday" ,
        "Thursday" ,  
        "Friday" ,        
        "Saturday"
    ],
    months = [
        'jan' ,
        'feb' ,
        'mar' ,
        'apr' ,
        'may' ,
        'jun' ,
        'jul' ,
        'aug' ,
        'sep' ,
        'oct' ,
        'nov' ,
        'dec'
    ];
      
     fetch(AIR_POLLUTION_API_URL).then(res=> res.json()).then(data => {
        let {co, no, no2, o3, so2, pm2_5, pm10, nh3} = data.list[0].components;
          aqiCard.innerHTML = `
          <div class="card">
              <div class="card-head">
              <p>Air Quality Index</p>
              <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
              </div>
         <div class="air-indices">
              <i class="fa-regular fa-wind fa-3x"></i>
              <div class="item">
                  <p>PM2.5</p>
                  <h2>${pm2_5}</h2>
              </div>
              <div class="item">
                  <p>PM10</p>
                  <h2>${pm10}</h2>
              </div>
              <div class="item">
                  <p>SO2</p>
                  <h2>${so2}</h2>
              </div>
              <div class="item">
                  <p>CO</p>
                  <h2>${co}</h2>
              </div>
              <div class="item">
                  <p>NO</p>
                  <h2>${no}</h2>
              </div>
              <div class="item">
                  <p>NO2</p>
                  <h2>${no2}</h2>
              </div>
              <div class="item">
                  <p>NH3</p>
                  <h2>${nh3}</h2>
              </div>
              <div class="item">
                  <p>O3</p>
                  <h2>${o3}</h2>
              </div>
          </div>
          `;

     }).catch(() => { 
        alert('Failed to fetch Air  Quality data!') ;
     });


    fetch(WEATHER_API_URL).then((res) => res.json()).then(data=>{
       let date = new Date();
        currentWeatherCard.innerHTML = `
        <div class="current-weather">
        <div class="details">
            <p>Now</p>
            <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
            <p>${data.weather[0].description}</p>
        </div>
        <div class="weather-icon">
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt=""/>
        </div>
    </div>
    <hr>
    <div class="card-footer">
    <p><i class="fa-light fa-calendar"></i> ${days[date.getDay]}, ${date.getDate()}, ${months[date.getMonth()]} ${date.getFullYear()}</p>
    <p><i class="fa-light fa-location-dot"></i>${name}, ${country}</p>
</div>
        `;
// console.log(data);
let { sunrise, sunset } = data.sys,
 { timezone , visibility } = data,
 {humidity , pressure , feels_like} = data.main,
 {speed} = data.wind,
 sRiseTime = moment.unix(sunrise).utcOffset(timezone / 60).format('hh:mm A'),
 sSetTime = moment.unix(sunset).utcOffset(timezone / 60).format('hh:mm A');

sunriseCard.innerHTML = `
    <div class="card-head">
        <p>Sunrise & sunset</p>
    </div>
    <div class="sunrise-sunset">
        <div class="item">
            <div class="icon">
                <i class="fa-light fa-sunrise fa-4x"></i>
            </div>
            <div>
                <p>Sunrise</p>
                <h2>${sRiseTime}</h2>
            </div>
        </div>
        <div class="item">
            <div class="icon">
                <i class="fa-light fa-sunset fa-4x"></i>
            </div>
            <div>
                <p>Sunset</p>
                <h2>${sSetTime}</h2>
            </div>
        </div>
    </div>`;
      humidityVal.innerHTML = `${humidity}%`;
      pressureVal.innerHTML = `${pressure}hpa`;
      visibilityVal.innerHTML = `${visibility / 1000}km`;
      windSpeedVal.innerHTML = `${speed}m/s`;
      feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;
      

}).catch(()=> {
    alert('Failed to  load weather data');
});
    fetch(FORECAST_API_URL).then(res => res.json()).then(data =>{
        let hourlyForecast = data.list;
        hourlyForecastCard.innerHTML = '';
        for(i = 0 ; i <=7 ; i++){
            let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
            let hr = hrForecastDate.getHours();
            let a = 'PM';
            if(hr < 0) a =  'AM';
            if(hr == 0) hr =  12;
            if(hr > 12) hr =  hr - 12;
            hourlyForecastCard.innerHTML += `
        <div class="card">
            <p>${hr} ${a}</p>
            <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" >
            <p>${(hourlyForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
        </div>
            `;
        }
        let uniqueForecastDays =[];
        let fiveDaysForecast = data.list.filter(forecast =>{
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });
        // console.log(fiveDaysForecast.lenght);
        fiveDaysForecastCard.innerHTML = '';
        // for( i = 1 ; i < fiveDaysForecast.lenght; i++){
        //     let date = new Date(fiveDaysForecast[i].dt_txt);
        //     fiveDaysForecastCard.innerHTML = `
        //     <div class="forecast-item">
        //     <div class="icon-wrapper">
        //         <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png">
        //         <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
        //     </div>
        //     <p>${date.getDate()} ${months[date.getMonth()]}</p>
        //     <p>${days[date.getDay()]}:</p>
        //     </div> `;
       
            // console.log(fiveDaysForecast); 
        // }
        fiveDaysForecast.forEach((forecast, i) => {
            if (i !== 0) {
                let date = new Date(forecast.dt_txt);
                let forecastItem = document.createElement('div');
                forecastItem.classList.add('forecast-item');
                forecastItem.innerHTML = `
                    <div class="icon-wrapper">
                        <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png">
                        <span>${(forecast.main.temp - 273.15).toFixed(2)}&deg;C</span>
                    </div>
                    <p>${date.getDate()} ${months[date.getMonth()]}</p>
                    <p>${days[date.getDay()]}:</p>
                `;
                fiveDaysForecastCard.appendChild(forecastItem);
            }
        });
    }).catch(()=> {
        alert('Failed to  load forecast data');
    });
}


function getCityCoordinates(){
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if(!cityName) return;
    let GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    fetch(GEOCODING_API_URL).then(res => res.json( )).then(data =>{
     let {name , lat , lon , country , state} = data[0];
     getWeatherDetails(name , lat , lon , country , state);
    }).catch(() =>{
      alert(`Failed to fetch coordinates of ${{cityName}}`);
    });
}
let metric = "units=metric";
function displayForCast(cityName){

const forcastUrl ='https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${ApiKey}&${metric}';

fetch(forcastUrl)
.then(response => response.json())
.then(data =>{
 
   console.log(data);
   const forecastByDate=[];
   const fiveForecastDay=data.list.filter(responseLigne=>{
       const date = new Date(responseLigne.dt_txt).getDate()
       if(!forecastByDate.includes(date)){
         return  forecastByDate.push(date)
       }
   })
   // filtrer les dates
   const forecastsDays = fiveForecastDay.map(el => {
       const date = new Date(el.dt_txt).toLocaleString('fr-FR',{weekday:'long'});
       return date;
   });
   // console.log(forecastsDays)
   forecastsDays.forEach(el => {
       console.log("Date:", el.date);
   })
   //filtrer par température
   const forecastsTemp = fiveForecastDay.map(el => {
       const temperature = el.main.temp;
       return temperature;
   })
   forecastsTemp.forEach(el => {
       console.log("Température:", el.temperature);
   })

 // Récupérer l'élément canvas

const ctx = document.getElementById('myChart');

// Vérifier si l'élément canvas existe
if (ctx) {
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }

    // Créer un nouveau graphique
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: forecastsDays,
            datasets: [{
                label: 'Température',
                data: forecastsTemp,
                borderWidth: 1,
                borderColor: 'black',
                backgroundColor: 'blue dark'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
} else {
    console.error("L'élément canvas avec l'ID 'myChart' n'a pas été trouvé.");
}



})
.catch(error => {
    console.error('Error fetching weather data:', error);
    alert('City not found. Please try again.');
});

}
seatchBtn.addEventListener( 'click', getCityCoordinates) ;