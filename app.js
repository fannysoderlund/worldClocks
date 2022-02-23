const selectCity = document.getElementById('select-city');
const cityListElement = document.getElementsByName('select-city-list')[0];
const cityHeader = document.getElementById('current-city');
const inputCity = document.getElementById('input-city');
const inputTimezone = document.getElementById('input-timezone');
const addButton = document.getElementById('add-button');

let citiesList = [];
let thisTimeZone = 'Europe/London';
let timeZones = [];

let countries;
let addedCity = null;

function fillInputTimezone() {
  let html = '';

  for (let timeZone of timeZones) {
    html += `<option>${timeZone}</option>`;
  }
  inputTimezone.innerHTML = html;
}

function setTime() {
  //update the current time every second
  setInterval(() => {
    let date = new Date();
    let options = {
      timeZone: `${thisTimeZone}`,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
    let currentTimeDigital = new Intl.DateTimeFormat('en-US', options).format(date);
    digitalTime.textContent = currentTimeDigital;

    options = {
      timeZone: `${thisTimeZone}`,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    }

    let currentTimeAnalog = new Intl.DateTimeFormat('en-US', options).format(date);

    let hr = currentTimeAnalog.split(':')[0];
    let min = currentTimeAnalog.split(':')[1];
    let sec = currentTimeAnalog.split(':')[2];

    hr_rotation = 30 * hr + min / 2;
    min_rotation = 6 * min;
    sec_rotation = 6 * sec;

    hour.style.transform = `rotate(${hr_rotation}deg)`;
    minute.style.transform = `rotate(${min_rotation}deg)`;
    second.style.transform = `rotate(${sec_rotation}deg)`;


  }, 1);
}

fillDatalist();
setTime();

addButton.addEventListener('click', () => {
  let newCityName = inputCity.value;
  let newCityTimezone = inputTimezone.value;

  addedCity = {
    name: newCityName,
    timeZone: newCityTimezone
  };

  saveCity(addedCity);
  fillDatalist();

  inputCity.value = '';
})

function saveCity(city) {
  let myCities = JSON.parse(localStorage.getItem("myCities")) || [];
  myCities.push(city);
  localStorage.setItem("myCities", JSON.stringify(myCities));
};

//clear input tag on user press
cityListElement.addEventListener('click', () => {
  cityListElement.value = '';
})

cityListElement.addEventListener('input', () => {
  let city;
  if (city = citiesList.find(x => x.name === cityListElement.value)) {
    cityHeader.innerHTML = cityListElement.value;
    thisTimeZone = city.timeZone;

    changeBackgroundImg(`images/${city.name}.jpeg`);
  }

});

async function changeBackgroundImg(url) {
  let imageExist = await fetch(url);

  if (imageExist.ok) {
    document.body.style.backgroundImage = `url('${url}')`;
  } else {
    document.body.style.backgroundImage = `url('City.jpeg')`;
  }
}

async function fillDatalist() {
  let rawData = await fetch('timezones.json');
  countries = await rawData.json();

  for (let i = 0; i < countries.length; i++) {
    let name = countries[i].WindowsTimeZones[0].Name.split(') ')[1];
    let timeZone = countries[i].TimeZones[0];
    timeZones.push(timeZone)
    let city = {
      name: name,
      timeZone: timeZone
    }
    citiesList.push(city);
  }

  for (city of citiesList) {
    let tempArrayNames = new Array
    let tempArray = new Array
    //if one entry contains several cities, split into several entries
    if (city.name.includes(',')) {
      tempArrayNames = city.name.split(', ');

      for (let i = 0; i < tempArrayNames.length; i++) {
        let thisCity = {
          name: tempArrayNames[i],
          timeZone: city.timeZone
        }
        tempArray.push(thisCity)
      }

      citiesList = citiesList.concat(tempArray);
      const index = citiesList.indexOf(city);
      citiesList.splice(index, 1);
    }
  }

  let myCities;
  if (JSON.parse(localStorage.getItem("myCities")) !== null) {
    myCities = JSON.parse(localStorage.getItem("myCities"));
    citiesList = citiesList.concat(myCities);
  }

  //sort cities alphabetically on their name
  citiesList.sort((a, b) => {
    let fa = a.name.toLowerCase(),
      fb = b.name.toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });

  //remove duplicates
  citiesList = Array.from(citiesList.reduce((a, o) => a.set(o.name, o), new Map()).values());

  let html = '';

  for (city of citiesList) {
    html += '<option>' + city.name + '</option>'
  }

  //fill datalist with cities
  selectCity.innerHTML = html;

  timeZones.sort()
  fillInputTimezone();
}
