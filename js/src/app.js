function initApp() {

    App = Ember.Application.create({
        LOG_TRANSITIONS: true
    });

    App.Router.map(function () {
        this.resource('calendar', { path: '/calendars/:calendar_id' });
        this.resource('event', { path: '/events/:event_id' })
    });

    App.ApplicationAdapter = DS.Adapter.extend({
        find: function(store, type, id) {
            return new Ember.RSVP.Promise(function (resolve, reject) {
                type.sync.find(id, resolve, reject);
            });
        },

        findAll: function(store, type, sinceToken) {
            console.log("AppAdapter.findAll");
            return new Ember.RSVP.Promise(function (resolve, reject) {
                type.sync.findAll(id, resolve, reject);
            });
        }
    });

    var attr = DS.attr, hasMany = DS.hasMany, belongsTo = DS.belongsTo;

    App.Calendar = DS.Model.extend({
        summary: attr('string'),
        timeZone: attr('string'),

        events: hasMany('event', {async: true})
    });

    App.Event = DS.Model.extend({
        summary: attr('string'),
        description: attr('string'),
        location: attr('string'),
        start: attr('dateTime'),
        end: attr('dateTime'),

        calendar: belongsTo('calendar', {async: true})
    });

    App.RoomRoute = Ember.Route.extend({
        model: function (params) {
            console.log('NAO PODE');
            return new Ember.RSVP.Promise(function (resolve, reject) {
                gapi.client.load('calendar', 'v3', function () {
                    var request = gapi.client.calendar.events.list({
                        'calendarId': params.room_id,
                        'timeMin': new Date(),
                        'timeMax': (function () {
                            var dt = new Date();
                            dt.setDate(dt.getDate() + 7);
                            return dt;
                        })(),
                        'singleEvents': true,
                        'orderBy': 'startTime'
                    });

                    request.execute(function (resp) {
                        if (!resp || resp.error) {
                            Ember.run(null, reject, resp.error);
                        } else {
                            Ember.run(null, resolve, resp);
                        }
                    });
                });
            });
        },
        setupController: function (controller, model) {
            console.log('NAO PODE MESMO');
            model.items.forEach(function (item) {
                var startDate = item.start.date || item.start.dateTime;
                var endDate = item.end.date || item.end.dateTime;
                //TODO: format startDate
                item.startDate = new Date(startDate).toString('dddd, MMMM d');
                item.endDate = new Date(endDate).toString('MMMM d');
                item.startTime = new Date(startDate).toString('HH:mm');
                item.endTime = new Date(endDate).toString('HH:mm');
            });

            var days = model.items.reduce(function (days, event) {
                if (days[days.length - 1] && event.startDate === days[days.length - 1].events[0].startDate) {
                    days[days.length - 1].events.push(event);
                } else {
                    days.push({description: event.startDate, events: [event]})
                }
                if (event.summary === undefined) {
                    event.summary = '(no title)'
                }
                return days;
            }, []);

            controller.set('model', {
                summary: model.summary,
                days: days
            });
        }
    });

    App.Calendar.sync = {
        find: function(id, resolve, reject) {
            gapi.client.load('calendar', 'v3', function () {
                var request = gapi.client.calendar.calendars.get({
                    'calendarId': id
                });

                request.execute(function (resp) {
                    if (!resp || resp.error) {
                        console.log("App.Calendar.sync.find.error");
                        console.log(resp.error);
                        Ember.run(null, reject, resp.error);
                    } else {
                        console.log("App.Calendar.sync.find.success");
                        console.log(resp);
                        Ember.run(null, resolve, resp);
                    }
                });
            })
        }
    };

    App.Event.sync = {
        findAll: function(resolve, reject) {
            gapi.client.load('calendar', 'v3', function () {
                var request = gapi.client.calendar.event.list({
                    'calendarId': id
                });

                request.execute(function (resp) {
                    if (!resp || resp.error) {
                        console.log("App.Event.sync.find.error");
                        console.log(resp.error);
                        Ember.run(null, reject, resp.error);
                    } else {
                        console.log("App.Event.sync.find.success");
                        console.log(resp);
                        Ember.run(null, resolve, resp);
                    }
                });
            })
        }
    };

    App.EventNewRoute = Ember.Route.extend({
        model: function (params) {
            console.log('laksjdlajsd');
            console.log(params);
            return new Ember.RSVP.Promise(function (resolve, reject) {
//                gapi.client.load('calendar', 'v3', function () {
//                    var request = gapi.client.calendar.events.insert({
//                        'calendarId': params.room_id,
//                        'resource': {
//                            'end': {
//                                dateTime: '2014-02-03T20:30:00-03:00'
//                            },
//                            'start': {
//                                dateTime: '2014-02-03T19:30:00-03:00'
//                            }
//                        }
//                    });
//
//                    request.execute(function (resp) {
//                        if (!resp || resp.error) {
//                            Ember.run(null, reject, resp.error);
//                        } else {
//                            Ember.run(null, resolve, resp);
//                        }
//                    });
//                });
            });
        }
    });


//    App.CalendarRoute = Ember.Route.extend({
//        model: function (params) {
//            console.log('CalendarRoute');
//            console.log(params);
//            return this.store.find('calendar', params.calendar_id);
//        }
//    });

    App.EventRoute = Ember.Route.extend({
        model: function (params) {
            console.log('CalendarEventsRoute');
            console.log(params);
            return this.store.find('event');
//            return this.store.find('calendar', params.calendar_id);
        }
    });
}



