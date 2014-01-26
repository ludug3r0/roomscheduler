var hardCodedCalendarId = 'primary';

var clientId = 'aaaaaaa';

var apiKey = 'XXXXXX';

var scopes = 'https://www.googleapis.com/auth/calendar';

function handleClientLoad() {
    gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth,1);
}

function checkAuth() {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}

function handleAuthResult(authResult) {
    console.log(authResult);
    var authorizeButton = document.getElementById('authorize-button');
    if (authResult && !authResult.error) {
        authorizeButton.style.visibility = 'hidden';
        makeApiCall();
    } else {
        authorizeButton.style.visibility = '';
        authorizeButton.onclick = handleAuthClick;
    }
}

function handleAuthClick(event) {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
    return false;
}

function makeApiCall() {
    gapi.client.load('calendar', 'v3', function() {
        var request = gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': new Date(),
            'singleEvents': true,
            'orderBy': 'startTime'
        });
        console.log(request);

        request.execute(function(resp) {
            console.log(resp);
            for (var i = 0; i < resp.items.length; i++) {
                var li = document.createElement('li');
                var eventDate = resp.items[i].start.dateTime;
                var eventSummary = resp.items[i].summary;
                var eventText = [eventDate, eventSummary].join(' - ');
                li.appendChild(document.createTextNode(eventText));
                document.getElementById('events').appendChild(li);
            }
        });
    });
}