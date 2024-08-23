function generatePromoMessage(event) {
  return `Join the Future of ${event.sportsName} DFS. Catch ${event.matchName} on ${event.dateTime} with Payday Fantasybook!`;
}

function updatePromoMessage(nearestEvent) {
  const promoMessageElement = document.querySelector('.sub_title');
  
  if (nearestEvent) {
    const promoMessage = generatePromoMessage(nearestEvent);
    promoMessageElement.innerHTML = promoMessage;
  } else {
    promoMessageElement.innerHTML = 'Play Daily Fantasy Sports and Win Big!';
  }
}
function togglePopup(popupToShow, popupToHide) {
  if (popupToHide) {
      document.getElementById(popupToHide).style.display = 'none';
  }
  var popup = document.getElementById(popupToShow);
  if (popup.style.display === 'block') {
      popup.style.display = 'none';
  } else {
      popup.style.display = 'block';
  }
}

function closePopup(popupId) {
  document.getElementById(popupId).style.display = 'none';
}

fetch("https://us-central1-payday-8ab25.cloudfunctions.net/getMatchesWeb")
  .then(response => response.json())
  .then(data => {
    if (!Array.isArray(data.documents) || data.documents.length === 0) {
      console.error('No event data found in response.');
      updatePromoMessage(null);

      // Display message when no events are available
      document.getElementById('ufcTableRows').innerHTML = "Will update you soon.";
      document.getElementById('nbaTableRows').innerHTML = "Will update you soon.";
      document.getElementById('nflTableRows').innerHTML = "Will update you soon.";
      return;
    }

    const ufcEvents = data.documents.filter(document => document.SPORTS_NAME === "MMA");
    const nbaEvents = data.documents.filter(document => document.SPORTS_NAME === "Basketball");
    const nflEvents = data.documents.filter(document => document.SPORTS_NAME === "Football");

    let allEvents = [...ufcEvents, ...nbaEvents, ...nflEvents];
    let nearestEvent = findNearestEvent(allEvents);

    console.log("All Events:", allEvents);
    console.log("Nearest Event:", nearestEvent);

    updatePromoMessage(nearestEvent);

    // UFC Events
    if (ufcEvents.length > 0) {
      let ufcRows = '';
      ufcEvents.forEach((document, index) => {
        if (index !== 0) {
          ufcRows += `<hr style="opacity:50%;">`;
        }
        ufcRows += `<div class="card1">`;
        ufcRows += `<h5>${document.MATCH_NAME || document.MATCH_NAME}</h5>`;
        ufcRows += `<h6>${document.CARD_DESCRIPTION || ""}</h6>`;
        ufcRows += `<p>${convertToLocalTime(document.DATE_TIME)}</p></div>`;
      });
      document.getElementById('ufcTableRows').innerHTML = ufcRows;
    } else {
      document.getElementById('ufcTableRows').innerHTML = "Will update you soon.";
    }

    // NBA Events
    if (nbaEvents.length > 0) {
      let nbaRows = '';
      nbaEvents.forEach((document, index) => {
        if (index !== 0) {
          nbaRows += `<hr style="opacity:50%;">`;
        }
        nbaRows += `<div class="card1">`;
        nbaRows += `<h5>${document.MATCH_NAME || document.MATCH_NAME}</h5>`;
        nbaRows += `<h6>${document.CARD_DESCRIPTION || ""}</h6>`;
        nbaRows += `<p>${convertToLocalTime(document.DATE_TIME)}</p></div>`;
      });
      document.getElementById('nbaTableRows').innerHTML = nbaRows;
    } else {
      document.getElementById('nbaTableRows').innerHTML = "Will update you soon.";
    }

    // NFL Events
    if (nflEvents.length > 0) {
      let nflRows = '';
      nflEvents.forEach((document, index) => {
        if (index !== 0) {
          nflRows += `<hr style="opacity:50%;">`;
        }
        nflRows += `<div class="card1">`;
        nflRows += `<h5>${document.MATCH_NAME || document.MATCH_NAME}</h5>`;
        nflRows += `<h6>${document.CARD_DESCRIPTION || ""}</h6>`;
        nflRows += `<p>${convertToLocalTime(document.DATE_TIME)}</p></div>`;
      });
      document.getElementById('nflTableRows').innerHTML = nflRows;
    } else {
      document.getElementById('nflTableRows').innerHTML = "Will update you soon.";
    }

  })
  .catch(error => {
    console.error('Error fetching match data:', error);

    // Display message when an error occurs
    document.getElementById('ufcTableRows').innerHTML = "Will update you soon.";
    document.getElementById('nbaTableRows').innerHTML = "Will update you soon.";
    document.getElementById('nflTableRows').innerHTML = "Will update you soon.";
  });

function convertToLocalTime(gmtTimeString) {
  const localTime = new Date(gmtTimeString);
  const now = new Date();
  
  if (
    localTime.getFullYear() === now.getFullYear() &&
    localTime.getMonth() === now.getMonth() &&
    localTime.getDate() === now.getDate()
  ) {
    return 'Today at ' + localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  return localTime.toLocaleString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true 
  });
}
function findNearestEvent(events) {
  const now = new Date();
  let nearestEvent = null;
  let minDiff = Infinity;
  events.forEach(event => {
    try {
      const eventDate = new Date(event.DATE_TIME);
      const timeDiff = eventDate - now;

      if (timeDiff > 0 && timeDiff < minDiff) { 
        minDiff = timeDiff;
        nearestEvent = {
          sportsName: event.SPORTS_NAME || "N/A",
          matchName: event.MATCH_NAME || "N/A",
          dateTime: convertToLocalTime(event.DATE_TIME)
        };
      }
    } catch (error) {
      console.error('Error processing event date:', error);
    }
  });
  return nearestEvent;
}
document.addEventListener('DOMContentLoaded', async function () {
  const legalCountries = ["USA"];
  const button = document.getElementById('fetch-button');
  const locationMessage = document.getElementById('location-message');

  function showLocationMessage() {
      locationMessage.style.display = 'block';
      setTimeout(() => {
          locationMessage.style.opacity = '1';
      }, 7); 
      setTimeout(() => {
          locationMessage.style.opacity = '0';
          setTimeout(() => {
              locationMessage.style.display = 'none';
          }, 1000); 
      }, 5000);
  }

  function disableButton() {
      button.addEventListener('click', function (event) {
          event.preventDefault(); 
          showLocationMessage(); 
      });
  }

  try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) {
          throw new Error('Error fetching location data.');
      }
      const data = await response.json();
      const userCountry = data.country_code ? data.country_code.trim().toUpperCase() : '';
      console.log("User country detected:", userCountry);

      if (legalCountries.includes(userCountry)) {
          console.log("Country is legal. Proceeding with app download setup.");
          try {
              const linkResponse = await fetch('https://us-central1-payday-8ab25.cloudfunctions.net/appLinkCaller');
              if (!linkResponse.ok) {
                  throw new Error('Error fetching the download link.');
              }
              const linkData = await linkResponse.json();
              const appUrl = linkData.APP_URL;
              console.log("App URL received:", appUrl);

              if (appUrl) {
                  button.addEventListener('click', function (event) {
                      event.preventDefault();
                      window.location.href = appUrl;
                      setTimeout(() => {
                          window.location.href = 'thank_you.html';
                      }, 3000);
                  });
              } else {
                  console.error('No valid URL received.');
                  disableButton();
              }
          } catch (error) {
              console.error('Error fetching the download link:', error);
              disableButton();
          }
      } else {
          console.log("Country is not legal. Disabling the download button.");
          disableButton();
      }
  } catch (error) {
      console.error('Error fetching location data:', error);
      disableButton();
  }
});


document.addEventListener('DOMContentLoaded', function() {
  let countdown = 10;
  const countdownElement = document.getElementById('countdown');
  const downloadMessage = document.getElementById('download-message');

  const timer = setInterval(function() {
      countdown--;
      countdownElement.textContent = countdown;

      if (countdown <= 0) {
          clearInterval(timer);
          downloadMessage.classList.remove('hidden');
          document.getElementById('timer-message').classList.add('hidden');
      }
  }, 1000);
});
