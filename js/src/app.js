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
            return {
                title: 'Pagu'
            };
        }
    });

    App.EventsIndexRoute = Ember.Route.extend({
        model: function (params) {
            //Listar eventos
            console.log('EventsIndexRoute');
            var model = this.modelFor('calendar');
            model.events = ['event1', 'event2'];
            return model;
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
            submitAction : function() {
                console.log("now we can add the model:" + this.get("model"));
            }
        }
    });
}



