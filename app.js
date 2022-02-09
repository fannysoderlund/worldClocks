
function setTime(timeZone) {
  setInterval(() => {
    date = new Date();
    hr = date.getHours() + timeZone;
    min = date.getMinutes();
    sec = date.getSeconds();
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

setTime(3);