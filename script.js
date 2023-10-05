let yourWeather=document.querySelector("[your-weather]");
let searchWeather=document.querySelector("[search-weather]");
let weatherCont=document.querySelector(".weather-container")
let grantCont=document.querySelector("[grant]");
let searchCont=document.querySelector("[searching]");
let loader=document.querySelector("[loader]");
let output=document.querySelector("[output]");
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
let currTab=yourWeather;

currTab.classList.add("current-tab");
getFromSessionStorage();
yourWeather.addEventListener('click',()=>{
    changeTab(yourWeather);
})

searchWeather.addEventListener('click',()=>{
    changeTab(searchWeather);
})

function changeTab(newTab)
{
    if(currTab!=newTab)
    {
        currTab.classList.remove("current-tab");
        currTab=newTab;
        currTab.classList.add("current-tab");

        if(!searchCont.classList.contains("active"))
        {
            output.classList.remove("active");
            grantCont.classList.remove("active");
            searchCont.classList.add("active");
        }
        else{
            output.classList.remove("active");
            // grantCont.classList.add("active");
            searchCont.classList.remove("active");
            // sea
            getFromSessionStorage();
        }
    }


}

function getFromSessionStorage()
{
    const localCordinates=sessionStorage.getItem("user-coordinates");
    if(!localCordinates)
    {
        grantCont.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCordinates);
        fetchUserWeather(coordinates);
    }
}

async function fetchUserWeather(coordinates){
    const {long, lat}=coordinates;
    grantCont.classList.remove("active");
    loader.classList.add("active");
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();
        loader.classList.remove("active");
        output.classList.add("active"); 
        // console.log(data);
        renderWeather(data);
    }
    catch(err){
        loader.classList.remove("active");
    }
}

function renderWeather(weatherInfo)
{
    let citty=document.querySelector("[citty]");
    let flag=document.querySelector("[flag]");
    let desc=document.querySelector("[weather-desc]");
    let descIcon=document.querySelector("[desc-icon]");

    let temperature=document.querySelector("[temperature]");
    let windVal=document.querySelector("[wind-measure]");
    let humidityVal=document.querySelector("[humidity-measure]");
    let cloudVal=document.querySelector("[cloud-measure]");
    console.log(weatherInfo);

    citty.innerText = weatherInfo?.name;
    // city.innerText = weatherInfo?.name;
    console.log(weatherInfo?.name);
    console.log(citty);
    
    flag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    descIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temperature.innerText = `${weatherInfo?.main?.temp} °C`;
    windVal.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidityVal.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudVal.innerText = `${weatherInfo?.clouds?.all}%`;
}


let grantbtn=document.querySelector("[grantBtn]");
grantbtn.addEventListener('click',getLocation);
async function getLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {
        alert("No geolocation support");
    }
}
function showPosition(position)
{
    const userPos={
        lat:position.coords.latitude,
        long:position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userPos));
    fetchUserWeather(userPos);
}
let searchInp=document.querySelector("[city]");
// let searchBtn=document.querySelector("[search-btn]");
searchCont.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityName=searchInp.value;
    if(cityName==="")
        return;
    else{
        getCityWeather(cityName);
    }
});

async function getCityWeather(city)
{
    loader.classList.add("active");
    weatherCont.classList.remove("active");
    grantCont.classList.remove("active");
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data= await response.json();
        console.log(data);
        loader.classList.remove("active");
        output.classList.add("active");
        renderWeather(data);
    }
    catch(err){
        console.log("error ojdsas");
    }
    // let response=await fetchUserWeather()
}