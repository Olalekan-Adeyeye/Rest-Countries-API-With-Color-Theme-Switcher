const filterByRegion = document.querySelector(".filter-by-region")
const regions = document.querySelector(".regions")
const countriesSection = document.querySelector(".countries-section")
const allRegion = document.getElementsByClassName("region")
const input = document.getElementById("search-country")
const countries = document.getElementsByClassName("country")
const countryName = document.getElementsByClassName("country-name")
const modeSwitch = document.getElementById('mode-switch')
const modeSwitchName = document.querySelector(".change-to-mode")
const body = document.getElementById("body")
const errorSection = document.querySelector(".error-container")
const smallImg = document.getElementsByClassName("small-img")
const spinner = document.querySelector(".spinner")
const loader = document.querySelector('.loader')
let getFromSaved = JSON.parse(localStorage.getItem("CountriesData"))
body.style.pointerEvents = "none"

const mapFrom = data => {
    data.map(country => {
        let content = `<div class="country" onclick="clickFunc(this)">
        <img src=${country.flags.svg} alt="" class="country-flag" />
        <div class="country-details">
          <p class="country-name"><span>${country.name.common}</span></p>
          <p class="country-population"><span>Population: </span>${country.population}</p>
          <p class="country-region"><span>Region: </span>${country.region}</p>
          <p class="country-capital"><span>Capital: </span>${country.capital}</p>
        </div>
      </div>`
      body.style.pointerEvents = "all"
        spinner.classList.add("hidden")
        countriesSection.innerHTML += content;
    })
}

if(getFromSaved) mapFrom(getFromSaved)
else fetchCountries()

function fetchCountries(){  
    fetch("https://restcountries.com/v3.1/all")
    .then(res => res.json())
    .then(data => {
        localStorage.setItem("CountriesData", JSON.stringify(data))
        mapFrom(data)
        getFromSaved = JSON.parse(localStorage.getItem("CountriesData"))
    }).catch(error => {
        console.log(error)
        spinner.classList.add("hidden")
        countriesSection.style.gridTemplateColumns = "100%"
        countriesSection.innerHTML = `${error}. Please refresh page`;
    })
}

for (let i = 0; i < allRegion.length; i++) {
    allRegion[i].addEventListener('click', () => {
        let selectedRegion = allRegion[i].textContent
        let regionalSearch = getFromSaved.filter(country => country.region == selectedRegion)
        countriesSection.innerHTML = "";
        mapFrom(regionalSearch)
        toggleHidden()
    })
}

let modeChecker = localStorage.getItem("mode")
if(modeChecker == "night"){  
    modeSwitch.src = ".//images//night-mode.png"
    modeSwitchName.textContent = "Dark"
    body.classList.add("reset")
    loader.classList.add("small-img-invert")
    for (let i = 0; i < smallImg.length; i++){
        smallImg[i].classList.add("small-img-invert")
    }
    
}
else{
    modeSwitch.src=".//images//light-mode.png"
    modeSwitchName.textContent = "Light"
    body.classList.remove("reset")
    loader.classList.remove("small-img-invert")
    for (let i = 0; i < smallImg.length; i++){
        smallImg[i].classList.remove("small-img-invert")
    }
}

modeSwitch.addEventListener('click', () => {
    if(modeSwitch.src.includes("night")) {
        localStorage.setItem("mode", "light")
        modeSwitch.src=".//images//light-mode.png"
        modeSwitchName.textContent = "Light"
        body.classList.remove("reset")
        for (let i = 0; i < smallImg.length; i++){
            smallImg[i].classList.remove("small-img-invert")
        }
    }
    else {
        localStorage.setItem("mode", "night")
        modeSwitch.src = ".//images//night-mode.png"
        modeSwitchName.textContent = "Dark"
        body.classList.add("reset")
        for (let i = 0; i < smallImg.length; i++){
            smallImg[i].classList.add("small-img-invert")
        }
    }
})

const clickFunc = (element) => {
    let currentCountryName = element.innerText.slice(0, element.innerText.indexOf("P"))
    let clickedCountryInfo = getFromSaved.filter(country => country.name.common.toLowerCase() == currentCountryName.toLowerCase().trim())
    console.log(clickedCountryInfo)
}

input.addEventListener("change", () => {
    errorSection.classList.add('hidden')
    if(input.value){
        let selectedRegion = input.value.toLowerCase()
        let regionalSearch = getFromSaved.filter(country => country.name.common.toLowerCase() == selectedRegion)
        
        if(regionalSearch.length) {
            countriesSection.innerHTML = "";
            mapFrom(regionalSearch)
        }
        else {
        countriesSection.innerHTML = ""
        errorSection.classList.remove("hidden")
        errorSection.classList.add("error-section")
        errorSection.innerHTML = `<div class="error-msg"><span>${input.value}</span> cannot be found</div>`;
        }
    }
    else if(input.value == ""){
        countriesSection.innerHTML = "";
        mapFrom(getFromSaved)
    }
})

const toggleHidden = () => {
    if(regions.classList.contains("hidden")) regions.classList.remove("hidden")
    else regions.classList.add('hidden')
}

filterByRegion.addEventListener("click", () => {
    toggleHidden()
})