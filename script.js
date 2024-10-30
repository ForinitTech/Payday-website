function generatePromoMessage(event) {
  return `Join the Future of ${event.sportsName} DFS. Catch ${event.matchName} on ${event.dateTime} with Payday Fantasybook!`;
}

function updatePromoMessage(nearestEvent) {
  const promoMessageElement = document.querySelector('.sub_title');
  
  // Clear previous message and remove animation class
  promoMessageElement.classList.remove('animated');
  promoMessageElement.innerHTML = ''; // Clear the previous text

  // Set the new promo message
  if (nearestEvent) {
      const promoMessage = generatePromoMessage(nearestEvent);
      promoMessageElement.innerHTML = promoMessage;
  } else {
      promoMessageElement.innerHTML = 'Get a Head Start on Huge Wins!';
  }

  // Trigger the animation
  setTimeout(() => {
      promoMessageElement.classList.add('animated');
  }, 50); // Short delay to ensure animation triggers correctly
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
    updatePromoMessage(nearestEvent);
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
function findNearestEvent(events, sportName) {
  const now = new Date();
  let nearestEvent = null;
  let minDiff = Infinity;

  events.forEach(event => {
    if (event.SPORTS_NAME === sportName) {
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
    }
  });

  return nearestEvent;
}

function updateCategoryLinks(events) {
  const nearestMMAEvent = findNearestEvent(events, "MMA");
  const nearestNBAEvent = findNearestEvent(events, "Basketball");
  const nearestNFLEvent = findNearestEvent(events, "Football");

  const mmaElement = document.getElementById('mmaLink');
  if (nearestMMAEvent) {
    updateEventLink(mmaElement, nearestMMAEvent);
  } else {
    updateEventLink(mmaElement, null);
  }
  const nbaElement = document.getElementById('nbaLink');
  if (nearestNBAEvent) {
    updateEventLink(nbaElement, nearestNBAEvent);
  } else {
    updateEventLink(nbaElement, null);
  }

  const nflElement = document.getElementById('nflLink');
  if (nearestNFLEvent) {
    updateEventLink(nflElement, nearestNFLEvent);
  } else {
    updateEventLink(nflElement, null);
  }
}
function updateEventLink(element, event) {
  if (element) {
    if (event) {
      element.textContent = `NEXT UP - ${event.matchName}`;
      element.href = '#';  
    } else {
      element.textContent = 'Will update soon.';
      element.href = '#'; 
    }
  }
}
function convertToLocalTime(dateString) {
  const eventDate = new Date(dateString);
  return eventDate.toLocaleString(); 
}
fetch("https://us-central1-payday-8ab25.cloudfunctions.net/getMatchesWeb")
  .then(response => response.json())
  .then(data => {
    if (Array.isArray(data.documents) && data.documents.length > 0) {
      updateCategoryLinks(data.documents);
    } else {
      updateCategoryLinks([]);
    }
  })
  .catch(error => {
    console.error('Error fetching match data:', error);
    updateCategoryLinks([]);
  });
  
  document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('fetch-button');
    const locationMessage = document.getElementById('location-message');
    let isProcessing = false; 

    function showLocationMessage(message) {
        locationMessage.textContent = message;
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
    async function fetchLocation() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            if (!response.ok) {
                throw new Error('Error fetching location.');
            }
            const data = await response.json();
            return data.country_code === 'US';
        } catch (error) {
            console.error('Error fetching location:', error);
            return false;
        }
    }
    async function updateCount(isInUSA) {
        const apiPayload = { updateCount: isInUSA };
        try {
            const updateResponse = await fetch('https://us-central1-payday-8ab25.cloudfunctions.net/appLinkCaller', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(apiPayload)
            });
            if (!updateResponse.ok) {
                throw new Error('Error updating the count.');
            }
            const responseData = await updateResponse.json();
        } catch (error) {
            console.error('Error updating the count:', error);
        }
    }
    button.addEventListener('click', async function (event) {
        event.preventDefault();

        if (isProcessing) {
            return;
        }
        isProcessing = true; 

        try {
            const isInUSA = await fetchLocation();
            const linkResponse = await fetch('https://us-central1-payday-8ab25.cloudfunctions.net/appLinkCaller');
            if (!linkResponse.ok) {
                throw new Error('Error fetching the download link.');
            }
            const linkData = await linkResponse.json();
            const appUrl = linkData.APP_URL;
            await updateCount(isInUSA);

            if (appUrl) {
                window.location.href = appUrl;
                setTimeout(() => {
                    window.location.href = 'thank_you.html';
                }, 3000);
            } else {
                console.error('No valid URL received.');
                showLocationMessage('Unable to get download link.');
            }
        } catch (error) {
            console.error('Error processing request:', error);
            showLocationMessage('An error occurred while processing your request.');
        } finally {
            isProcessing = false;
        }
    });
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
