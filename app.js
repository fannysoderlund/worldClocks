const selectCity = document.getElementById('select-city');
const cityList = document.getElementsByName('select-city-list')[0];
const cityHeader = document.getElementById('current-city');

let citiesList = new Array;

function setTime(timeZone) {
  setInterval(() => {
    date = new Date();
    hr = date.getUTCHours() + timeZone;
    hr = hr % 12;
    hr = hr ? hr : 12;
    min = date.getUTCMinutes();
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

setTime(1);
fillDatalist();

cityList.addEventListener('input', () => {
  console.log(citiesList)
  if (citiesList.includes(cityList.value)) {
    cityHeader.innerHTML = cityList.value;
    console.log('match')
  } else {
    console.log('no match')
  }
});


async function fillDatalist() {
  let rawData = await fetch('timezones.json')
  let countries = await rawData.json()

  for (let i = 0; i < countries.length; i++) {
    citiesList.push(countries[i].WindowsTimeZones[0].Name.split(') ')[1]);
  }

  citiesList = citiesList.filter((c, index) => {
    return citiesList.indexOf(c) === index;
  });

  for (city of citiesList) {
    let tempArray = new Array
    if (city.includes(',')) {
      tempArray = city.split(', ');
      citiesList = citiesList.concat(tempArray);
      const index = citiesList.indexOf(city);
      citiesList.splice(index, 1);
    }
  }

  citiesList.sort()

  let html = '';

  for (city of citiesList) {
    html += '<option>' + city + '</option>'
  }

  selectCity.innerHTML = html;
}