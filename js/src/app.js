function initApp () {

    App = Ember.Application.create();

    App.Router.map(function() {
        this.resource('calendar', { path: '/room/:room_id'});
    });

    App.CalendarRoute = Ember.Route.extend({
        model: function(params) {
            return new Ember.RSVP.Promise(function(resolve, reject) {
                gapi.client.load('calendar', 'v3', function() {
                    var request = gapi.client.calendar.events.list({
                        'calendarId': params.room_id,
                        'timeMin': new Date(),
                        'timeMax': (function() {
                            var dt = new Date();
                            dt.setDate(dt.getDate() + 7);
                            return dt;
                        })(),
                        'singleEvents': true,
                        'orderBy': 'startTime'
                    });

                    request.execute(function(resp) {
                        if (!resp || resp.error ) {
                            Ember.run(null, reject, resp.error);
                        } else {
                            Ember.run(null, resolve, resp);
                        }
                    });
                });
            });
        },
        setupController: function(controller, model) {
            model.items.forEach(function(item) {
                var startDate = item.start.date || item.start.dateTime;
                var endDate = item.end.date || item.end.dateTime;
                //TODO: format startDate
                item.startDate = new Date(startDate).toString('dddd, MMMM d');
                item.endDate = new Date(endDate).toString('MMMM d');
                item.startTime = new Date(startDate).toString('HH:mm');
                item.endTime = new Date(endDate).toString('HH:mm');
            });

            var days = model.items.reduce(function(days,event){
                if (days[days.length-1] && event.startDate === days[days.length-1].events[0].startDate) {
                    days[days.length-1].events.push(event);
                } else {
                    days.push({description: event.startDate, events: [event]})
                }
                return days;
            }, []);

            controller.set('model', {
                summary: model.summary,
                days: days
            });
        }
    });
}



