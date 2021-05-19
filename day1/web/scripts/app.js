function showError (err) {
    document.querySelector('#loadingMessage').style.display = "block";
    document.querySelector('#loadingMessage').innerText = err;
}

function updateEventDetails(data) {
    console.log(data);
    if (!data) return;
    document.querySelector('#loadingMessage').style.display = "none";
    document.querySelector('.eventDetails').style.display = "block";
    var d = moment(data.EventDateAndTime);
    const partyDate = document.querySelector('#partyDate');
    partyDate.textContent = d.format('LL');
    const partyTime = document.querySelector('#partyTime');
    partyTime.textContent = d.format('LT');
    const partyLocation = document.querySelector('#partyLocation');
    partyLocation.textContent = data.location;
    var joining = 0;
    var notJoining = 0;
    var maybeJoining = 0;
    var notResponded = 0;
    Array.from(document.querySelectorAll('.participants')).forEach(el => el.innerText = "");

    document.querySelector('.joining').querySelector('.participants').innerText = "";
    document.querySelector('.notJoining').querySelector('.participants').innerText = "";
    document.querySelector('.notJoining').querySelector('.participants').innerText = "";
    data.responses.forEach(function(resp) {
        let targetDiv = "notResponded";
        if (resp.joining === "yes") {
            targetDiv = "joining";
            joining++;
        }
        else if (resp.joining === "no") {
            targetDiv = "notJoining";
            notJoining++;
        }
        else if (resp.Joining === "maybe") {
            targetDiv = "maybe";
            maybeJoining++;
        }
        else {
            targetDiv = "notResponded";
            notResponded++;
        }
        const participantsDiv = document.querySelector('.' + targetDiv).querySelector('.participants');
        participantsDiv.innerText += ((participantsDiv.innerText ? ", " : "") + resp.name);
    });
    document.querySelector('#joiningCount').innerText = joining;
    document.querySelector('#maybeCount').innerText = maybeJoining;
    document.querySelector('#notJoiningCount').innerText = notJoining;
    document.querySelector('#notRespondedCount').innerText = notResponded;


    var selectedResponse = document.querySelector('button[data-response=' + data.MyResponse + ' ]');
    if (selectedResponse) {
        selectedResponse.classList.add('selected');
    }
}

function loadEventDetails(eventId, responseCode) {
    var getEventDetailsUrl = 'https://serverlessstorageaccpoc.blob.core.windows.net/spa/web/scripts/data.js';
    fetch(getEventDetailsUrl)
    .then(function(resp) {
        if (resp.status === 200)
        {
            return resp.json();
        }
        else
        {
            document.querySelector('#loadingMessage').innerText = resp;
            console.warn(resp.status, resp);
        }
    })
    .then(updateEventDetails)
    .catch(err => showError(err.message));
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var eventId = getParameterByName('event');
var responseCode = getParameterByName('code');
loadEventDetails(eventId, responseCode);

var responseButtons = Array.from(document.querySelectorAll('button[data-response]'));

function respond(e) {
    responseButtons.forEach(r => r.classList.remove('selected'));
    e.target.classList.add('selected');
    var selectedResponse = e.target.dataset.response;
    var updateResponseUrl = 'https://serverless.azurewebsites.net/api/events/'
                                + eventId + '/response/' + responseCode;
    var body = JSON.stringify({ isJoining: selectedResponse});
    console.log(`responding to ${updateResponseUrl} with ${body}`);
    fetch(updateResponseUrl, {
            method: 'put',
            body: body,
    	headers: new Headers({'Content-Type': 'text/json'})
     })
        .then(function(resp) {
            if (resp.status != 200) {
                showError("failed to update response");
                console.error(resp);
            }
            else {
                console.log("updated response OK");
                loadEventDetails(eventId, responseCode);
            }
        })
        .catch(err => showError(err.message));

}

responseButtons.forEach(r => r.addEventListener('click', respond));
