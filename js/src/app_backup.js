function initApp() {

    App = Ember.Application.create({
        LOG_TRANSITIONS: true
    });

//    App.Router.map(function () {
//        this.resource('calendar', { path: '/calendars/:calendar_id' });
//        this.route('events', { path: '/calendars/:calendar_id/events' })
//    });

    App.Router.map(function () {
        this.resource("calendar", { path: "/:calendar_id" }, function() {
            this.resource("events", { path: "/" }, function() {
                this.resource("event", { path: "/:event_id" }, function() {
                    this.route("edit", { path: "/edit" });
                });
            this.route("new", { path: "/new" });
            });
        });
    });

    App.CalendarRoute = Ember.Route.extend({
        model: function (params) {
            //Gerar menu
            console.log('CalendarRoute');
            return {
                title: 'Pagu'
            };
        }
    });

    App.EventsRoute = Ember.Route.extend({
        model: function (params) {
            //Listar eventos
            console.log('EventsRoute');
            var model = this.modelFor('calendar');
            model.events = ['event1', 'event2'];
            return model;
        }
    });

    App.EventRoute = Ember.Route.extend({
        model: function (params) {
            //Atualmente está inútil
            console.log('EventRoute')
        }
    });

    App.EventIndexRoute = Ember.Route.extend({
        model: function (params) {
            //Lista detalhes do evento event_id
            console.log('EventIndexRoute')
            //Transitioned into 'calendar.event.index'
        }
    });

    App.EventEditRoute = Ember.Route.extend({
        model: function (params) {
            //Abre formulário para editar evento
            console.log('EventEditRoute')
            //Transitioned into 'calendar.event.edit'
        }
    });

    App.EventsNewRoute = Ember.Route.extend({
        model: function (params) {
            //Abre formulário para criar o evento
            console.log('EventsNewRoute')
            //Transitioned into 'calendar.new'
        }
    });

//    App.ApplicationRoute = Ember.Route.extend({
//        renderTemplate: function() {
//            // Render default outlet
//            this.render();
//            // render extra outlets
//            this.render("menu", {
//                outlet: "menu",
//                into: "application", // important when using at root level
//                controller: "event"
//            });
//        }
//    });
//
//    App.ApplicationAdapter = DS.Adapter.extend({
//        find: function(store, type, id) {
//            return new Ember.RSVP.Promise(function (resolve, reject) {
//                type.sync.find(id, resolve, reject);
//            });
//        },
//
//        findQuery: function(store, type, query) {
//            return new Ember.RSVP.Promise(function (resolve, reject) {
//                type.sync.findQuery(query, resolve, reject);
//            });
//        }
//    });
//
//    App.Calendar = DS.Model.extend({
//        summary: DS.attr('string'),
//        timeZone: DS.attr('string'),
//
//        events: DS.hasMany('event', {async: true})
//    });
//
//    App.Event = DS.Model.extend({
//        summary: DS.attr('string'),
//        description: DS.attr('string'),
//        location: DS.attr('string'),
//        start: DS.attr('date'),
//        end: DS.attr('date')
//    });
//
//    App.EventSerializer = DS.RESTSerializer.extend({
//        extractArray: function(store, type, payload, id, requestType) {
//            payload = { events: payload.items };
//            return this._super(store, type, payload, id, requestType);
//        },
//        normalizeHash: {
//            events: function(hash) {
//                if (hash.start != undefined) {
//                    hash.start = hash.start.dateTime;
//                }
//                if (hash.end != undefined) {
//                    hash.end = hash.end.dateTime;
//                }
//                if (hash.summary === undefined) {
//                    hash.summary = '(no title)'
//                }
//                return hash;
//            }
//        }
//    });
//
//    App.Calendar.sync = {
//        find: function(id, resolve, reject) {
//            gapi.client.load('calendar', 'v3', function () {
//                var request = gapi.client.calendar.calendars.get({
//                    'calendarId': id
//                });
//
//                request.execute(function (resp) {
//                    if (!resp || resp.error) {
//                        Ember.run(null, reject, resp.error);
//                    } else {
//                        Ember.run(null, resolve, resp);
//                    }
//                });
//            })
//        }
//    };
//
//    App.Event.sync = {
//        findQuery: function(query, resolve, reject) {
//            gapi.client.load('calendar', 'v3', function () {
//                var request = gapi.client.calendar.events.list({
//                    'calendarId': query.calendar_id,
//                    'timeMin': new Date(),
//                    'timeMax': (function () {
//                        var dt = new Date();
//                        dt.setDate(dt.getDate() + 7);
//                        return dt;
//                    })(),
//                    'singleEvents': true,
//                    'orderBy': 'startTime'
//                });
//
//                request.execute(function (resp) {
//                    if (!resp || resp.error) {
//                        Ember.run(null, reject, resp.error);
//                    } else {
//                        Ember.run(null, resolve, resp);
//                    }
//                });
//            })
//        }
//    };
//
//    App.EventNewRoute = Ember.Route.extend({
//        model: function (params) {
//            console.log('laksjdlajsd');
//            console.log(params);
//            return new Ember.RSVP.Promise(function (resolve, reject) {
////                gapi.client.load('calendar', 'v3', function () {
////                    var request = gapi.client.calendar.events.insert({
////                        'calendarId': params.room_id,
////                        'resource': {
////                            'end': {
////                                dateTime: '2014-02-03T20:30:00-03:00'
////                            },
////                            'start': {
////                                dateTime: '2014-02-03T19:30:00-03:00'
////                            }
////                        }
////                    });
////
////                    request.execute(function (resp) {
////                        if (!resp || resp.error) {
////                            Ember.run(null, reject, resp.error);
////                        } else {
////                            Ember.run(null, resolve, resp);
////                        }
////                    });
////                });
//            });
//        }
//    });
//
//    App.EventsRoute = Ember.Route.extend({
//        model: function (params) {
//            return this.store.findQuery('event', params);
//        },
//
//        setupController: function (controller, model) {
//            var days = model.reduce(function (days, event) {
//                if (days[days.length - 1] && event.get('start').getDate() === days[days.length - 1].events[0].get('start').getDate()) {
//                    days[days.length - 1].events.push(event);
//                } else {
//                    days.push({description: event.get('start'), events: [event]})
//                }
//                return days;
//            }, []);
//
//            controller.set('days', { calendar_id: model.query.calendar_id, days: days });
//        }
//    });
//
//
//    Ember.Handlebars.registerBoundHelper('format-date', function(format, date) {
//        return moment(date).format(format);
//    });
}



