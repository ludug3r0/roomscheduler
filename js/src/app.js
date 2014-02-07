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

    App.EventRoute = Ember.Route.extend({
        model: function (params) {
            //Retorna o evento para edit
            console.log('EventRoute');
            return 'edit_event';
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
            return 'new_event';
        }
    });

    App.EventEditController = Ember.ObjectController.extend({
        actions: {
            submitAction : function() {
                console.log("now we can edit the model:" + this.get("model"));
            }
        }
    });

    App.EventsNewController = Ember.ObjectController.extend({
        actions: {
            submitAction : function(event) {
//                var event = this.get("model");
//                var calendar = this.modelFor("calendar");
//                console.log(calendar);
                var event = {};
                event.calendar_id = 'primary'
                event.summary = 'Summary'
                event.description = 'Description Lorem ipsum'
                event.endDate = '2014-02-07T20:30:00-03:00'
                event.startDate = '2014-02-07T19:30:00-03:00'
                console.log("now we can add the model:");
                console.log(event);
                return new Ember.RSVP.Promise(function (resolve, reject) {
                    gapi.client.load('calendar', 'v3', function () {
                        var request = gapi.client.calendar.events.insert({
                            'calendarId': event.calendar_id,
                            'resource': {
                                'summary': event.summary,
                                'description': event.description,
                                'end': {
//                                    dateTime: '2014-02-03T20:30:00-03:00'
                                    dateTime: event.endDate
                                },
                                'start': {
//                                    dateTime: '2014-02-03T19:30:00-03:00'
                                    dateTime: event.startDate
                                }
                            }
                        });

                        request.execute(function (resp) {
                            if (!resp || resp.error) {
                                console.log('EventsNewController.submitAction.error');
                                console.log(resp);
                                Ember.run(null, reject, resp.error);
//                                this.transitionToRoute('new');
                            } else {
                                console.log('EventsNewController.submitAction.success');
                                console.log(resp);
                                Ember.run(null, resolve, resp);
                                return true;
//                                this.transitionToRoute('calendar');
                            }
                        });
                    });
                });
            }
        }
    });

    Ember.Handlebars.registerBoundHelper('format-date', function(format, date) {
        return moment(date).format(format);
    });
}



