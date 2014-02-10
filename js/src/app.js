function initApp() {

    App = Ember.Application.create({
        LOG_TRANSITIONS: true
    });

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
            return new Ember.RSVP.Promise(function (resolve, reject) {
                gapi.client.load('calendar', 'v3', function () {
                    var request = gapi.client.calendar.calendars.get({
                        'calendarId': params.calendar_id
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
        }
    });

    App.EventsIndexRoute = Ember.Route.extend({
        model: function (params) {
            //Listar eventos
            console.log('EventsIndexRoute');
            var calendarModel = this.modelFor('calendar');

            return new Ember.RSVP.Promise(function (resolve, reject) {
                gapi.client.load('calendar', 'v3', function () {
                    var request = gapi.client.calendar.events.list({
                        'calendarId': calendarModel.id,
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
                            resp.calendar_id = calendarModel.id;
                            Ember.run(null, resolve, resp);
                        }
                    });
                });
            });
        }
    });

    App.EventEditRoute = Ember.Route.extend({
        model: function (params) {
            //Abre formulário para editar evento
            console.log('EventEditRoute');
            this.modelFor('calendar').is_editing = true;
            return this.modelFor('event');
        }
    });

    App.EventsNewRoute = Ember.Route.extend({
        model: function (params) {
            //Abre formulário para criar o evento
            console.log('EventsNewRoute');
            var startDateTime = new Date();
            var endDateTime = new Date();
            endDateTime.setMinutes(endDateTime.getMinutes() + 30);
            return {
                summary: "Default summary",
                description: "Default description",
                startDate: startDateTime,
                endDate: endDateTime,
                startTime: startDateTime.getTime(),
                endTime: endDateTime.getTime()
            };
        },
        actions: {
            submitAction : function(event) {
                var calendarId = this.controllerFor('calendar').get('model').id;
                var newEvent = this.get('model');
                newEvent.endDate = '2014-02-10T20:30:00-03:00';
                newEvent.startDate = '2014-02-10T19:30:00-03:00';
                return new Ember.RSVP.Promise(function (resolve, reject) {
                    gapi.client.load('calendar', 'v3', function () {
                        var request = gapi.client.calendar.events.insert({
                            'calendarId': calendarId,
                            'resource': {
                                'summary': newEvent.summary,
                                'description': newEvent.description,
                                'end': {
                                    dateTime: newEvent.endDate
                                },
                                'start': {
                                    dateTime: newEvent.startDate
                                }
                            }
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
            }
        }
    });

    App.EventEditController = Ember.Controller.extend({
        actions: {
            submitAction : function() {
                console.log("now we can edit the model:" + this.get("model"));
            }
        }
    });

    Ember.Handlebars.registerBoundHelper('format-date', function(format, date) {
        return moment(date).format(format);
    });
}



