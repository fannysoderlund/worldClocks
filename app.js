const selectCity = document.getElementById('select-city');
const cityListElement = document.getElementsByName('select-city-list')[0];
const cityHeader = document.getElementById('current-city');

let timeZoneHour = 0;
let timeZoneMinutes = 0;
let citiesList = [];

let countries;

function setTime() {

  setInterval(() => {
    date = new Date();
    hr = date.getUTCHours() + parseInt(timeZoneHour);
    hr = hr % 12;
    hr = hr ? hr : 12;
    min = date.getUTCMinutes() + parseInt(timeZoneMinutes);
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
setTime();

cityListElement.addEventListener('click', () => {
  cityListElement.value = '';
})

cityListElement.addEventListener('input', () => {
  let city;
  if (city = citiesList.find(x => x.name === cityListElement.value)) {
    cityHeader.innerHTML = cityListElement.value;
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
  }
});

async function fillDatalist() {
  let rawData = await fetch('timezones.json');
  countries = await rawData.json();

  for (let i = 0; i < countries.length; i++) {
    let nameAndTimeZone = countries[i].WindowsTimeZones[0].Name;
    let name = nameAndTimeZone.split(') ')[1];
    let timeZone = nameAndTimeZone.split(')')[0].split('UTC')[1];
    let city = {
      name: name,
      timeZone: timeZone
    }
    citiesList.push(city);
  }

  citiesList = Array.from(citiesList.reduce((a, o) => a.set(o.name, o), new Map()).values());

  for (city of citiesList) {
    let tempArrayNames = new Array
    let tempArray = new Array
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

  let html = '';

  for (city of citiesList) {
    html += '<option>' + city.name + '</option>'
  }

  selectCity.innerHTML = html;
}
