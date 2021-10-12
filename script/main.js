let inputIP = document.querySelector('.information input');
let sendIP = document.querySelector('.information button');
let myIPAddress = document.querySelector('.show-info span:first-of-type');
let myLocation = document.querySelector('.show-info span:nth-of-type(2)');
let myTimezone = document.querySelector('.show-info span:nth-of-type(3)');
let myISP = document.querySelector('.show-info span:last-of-type');
let myEmptySpan = document.querySelectorAll('.show-info span');
inputIP.oninput = function(e) {
  e.target.setCustomValidity('');
  if (e.target.validity.patternMismatch) {
    e.target.setCustomValidity("It doesn't look like an IP address");
  }
  if (e.target.validity.valueMissing) {
    e.target.setCustomValidity("It can't be empty");
  }
};
sendIP.onclick = function(e) {
  if (inputIP.validity.valueMissing) {
    inputIP.setCustomValidity("It can't be empty");
  } else if (inputIP.validity.patternMismatch) {
    inputIP.setCustomValidity("It doesn't look like an IP address");
  } else {
    myIPAddress.textContent = '';
    myLocation.innerHTML = '';
    myTimezone.textContent = '';
    myISP.textContent = '';
    myEmptySpan.forEach((elm) => {
      if (elm.textContent == '') {
        elm.classList.add('sp-load');
      } else {
        elm.classList.remove('sp-load');
      }
    });
    let myIP = inputIP.value ;
    let responseFetch = fetch(`https://geo.ipify.org/api/v1?apiKey=at_eucQ01cCaNTRMcKhqNK89tS8bR2yZ&ipAddress=${myIP}`);
    responseFetch.then(response => response.json())
      .then(data => {
        myIPAddress.textContent = data.ip ;
        myLocation.innerHTML = `${data.location.city}<br/>${data.location.region}` ;
        myTimezone.textContent = `UTC ${data.location.timezone}` ;
        myISP.textContent = data.isp ;
        if (data.isp == '') {
          myLocation.innerHTML = '-' ;
          myISP.textContent = '-' ;
        }
        myMapToShow('map',data) ;
        myEmptySpan.forEach((elm) => {
          if (elm.textContent == '') {
            elm.classList.add('sp-load');
          } else {
            elm.classList.remove('sp-load');
          }
        });
      });
      inputIP.value = '' ;
      e.preventDefault();
  }
}; 
function myMapToShow(str, data) {
  mapboxgl.accessToken = 'pk.eyJ1IjoibXltYXAyMDIxc3NzIiwiYSI6ImNrdTcxd3o4cTUzeHgydW5xN2cwMmRkemwifQ.n21_GqmnobFKXxab5_Zz2g' ;
  let map = new mapboxgl.Map({container: str ,style: 'mapbox://styles/mapbox/streets-v11',zoom:13,center: [data.location.lng, data.location.lat]});
  const customMarker = document.createElement('div');
  customMarker.style.backgroundImage = `url('./images/icon-location.svg')`;
  customMarker.style.width = `46px`;
  customMarker.style.height = `56px`;
  customMarker.style.backgroundRepeat = 'no-repeat';
  customMarker.style.backgroundPosition = 'center';
  customMarker.style.backgroundSize = '90%';
  const popup = new mapboxgl.Popup({closeButton: false ,offset: 25 }).setHTML(`<b>Approximate Location</b><br>${data.location.city}`);
  let marker = new mapboxgl.Marker(customMarker).setLngLat([data.location.lng, data.location.lat]).setPopup(popup).addTo(map);
}
