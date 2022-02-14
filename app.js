const selectCity = document.getElementById('select-city');
const cityListElement = document.getElementsByName('select-city-list')[0];
const cityHeader = document.getElementById('current-city');
const inputCity = document.getElementById('input-city');
const inputTimezone = document.getElementById('input-timezone');
const addButton = document.getElementById('add-button');

let timeZoneHour = 0;
let timeZoneMinutes = 0;
let citiesList = [];

let countries;
let addedCity = null;

function fillInputTimezone() {
  let html = '';

  for (let i = -24; i <= 24; i++) {
    let hour = i.toString();
    //if hour is singel digit and negative
    if (i < 0) {
      if (hour.length !== 3) {
        hour = hour.slice(0, 1) + '0' + hour.slice(1);
      }
    } else {
      //if hour is single digit and positive
      hour = hour.padStart(2, '0');
    }

    let min;

    if (i < 0) {
      if (i !== -24) { //dont add minutes if hour is -24
        min = '30';
        html += `<option>${hour}:${min}</option>`;
      }
      min = '00';
      html += `<option>${hour}:${min}</option>`;
    } else {
      min = '00';
      html += `<option>+${hour}:${min}</option>`;
      if (i !== 24) { //dont add minutes if hour is 24
        min = '30';
        html += `<option>+${hour}:${min}</option>`;
      }
    }
  }
  inputTimezone.innerHTML = html;
}

function setTime() {
  //update the current time every second
  setInterval(() => {
    date = new Date();
    hr = date.getUTCHours() + parseInt(timeZoneHour);
    hr = hr % 24;
    min = date.getUTCMinutes() + parseInt(timeZoneMinutes);
    if (min >= 60) hr++;
    if (hr === 24) hr = 0;
    min = min % 60;
    sec = date.getUTCSeconds();
    hr_rotation = 30 * hr + min / 2;
    min_rotation = 6 * min;
    sec_rotation = 6 * sec;

    hour.style.transform = `rotate(${hr_rotation}deg)`;
    minute.style.transform = `rotate(${min_rotation}deg)`;
    second.style.transform = `rotate(${sec_rotation}deg)`;

    let digHour = hr.toString().padStart(2, '0');
    let digMin = min.toString().padStart(2, '0');
    let digSec = sec.toString().padStart(2, '0');

    digitalTime.textContent = `${digHour}:${digMin}:${digSec}`

  }, 1000);
}

fillDatalist();
fillInputTimezone();
setTime();

addButton.addEventListener('click', () => {
  let newCityName = inputCity.value;
  let newCityTimezone = inputTimezone.value;

  addedCity = {
    name: newCityName,
    timeZone: newCityTimezone
  };

  fillDatalist();
})
//clear input tag on user press
cityListElement.addEventListener('click', () => {
  cityListElement.value = '';
})

cityListElement.addEventListener('input', () => {
  let city;
  if (city = citiesList.find(x => x.name === cityListElement.value)) {
    cityHeader.innerHTML = cityListElement.value;
    //shave timezone to a nice number for the global variable
    let hTimeZone = city.timeZone.split(':')[0];
    if (hTimeZone.charAt(1) === '0') {
      hTimeZone = hTimeZone.replace('0', '')
    }
    if (hTimeZone.charAt(0) === '+') {
      hTimeZone = hTimeZone.replace('+', '')
    }
    let mTimeZone = city.timeZone.split(':')[1];
    timeZoneHour = hTimeZone;
    timeZoneMinutes = mTimeZone;

    document.body.style.backgroundImage = `url('images/${city.name}.jpeg')`;
  }

});

async function fillDatalist() {
  let rawData = await fetch('timezones.json');
  countries = await rawData.json();

  for (let i = 0; i < countries.length; i++) {
    let nameAndTimeZone = countries[i].WindowsTimeZones[0].Name;
    //sort out name and timezones of citites
    let name = nameAndTimeZone.split(') ')[1];
    let timeZone = nameAndTimeZone.split(')')[0].split('UTC')[1];
    let city = {
      name: name,
      timeZone: timeZone
    }
    citiesList.push(city);

    if (addedCity !== null) {
      citiesList.push(addedCity);
    }
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
}
