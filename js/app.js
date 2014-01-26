App = Ember.Application.create();

API_KEY = 'XXXXXXXXXXXXXXXXXX';

DS.RESTAdapter.reopen({
    host: 'https://www.googleapis.com/calendar/v3'
});

App.Calendar = DS.Model.extend({
    kind: DS.attr(),
    etag: DS.attr(),
    summary: DS.attr(),
    timeZone: DS.attr(),
    events: DS.hasMany('event')
});

App.Event = DS.Model.extend({

});

App.ApplicationSerializer = DS.RESTSerializer.extend({
    normalizePayload: function(type, payload) {
        var typeKey = type.typeKey;
        var ret = {};
        ret[typeKey] = payload;
        return ret;
    }
});

var ludug3r0 = "Bearer XXXXX";
var roliveir = "Bearer XXXXX";
var hrezend = "Bearer XXXXX";

App.ApplicationAdapter = DS.RESTAdapter.extend({

    headers: {
        authorization: roliveir
    },
    find: function(store, type, id) {
        var query = {key: API_KEY};
        return this.ajax(this.buildURL(type.typeKey, id), 'GET', {data: query});
    },
    findQuery: function(store, type, query) {
        query.key = API_KEY;
        return this.ajax(this.buildURL(type.typeKey), 'GET', { data: query });
    },
    findAll: function(store, type, sinceToken) {
        var query = {key: API_KEY};
        if (sinceToken) {
            query = { since: sinceToken };
        }
        return this.ajax(this.buildURL(type.typeKey), 'GET', { data: query });
    },
    createRecord: function(store, type, record) {
        var query = { key: API_KEY};
        var serializer = store.serializerFor(type.typeKey);

        serializer.serializeIntoHash(query, type, record, { includeId: true });

        return this.ajax(this.buildURL(type.typeKey), "POST", { data: query });
    },
    updateRecord: function(store, type, record) {
        var query = { key: API_KEY};
        var serializer = store.serializerFor(type.typeKey);

        serializer.serializeIntoHash(query, type, record);

        var id = get(record, 'id');

        return this.ajax(this.buildURL(type.typeKey, id), "PUT", { data: query });
    },
    deleteRecord: function(store, type, record) {
        var query = { key: API_KEY};
        var id = get(record, 'id');

        return this.ajax(this.buildURL(type.typeKey, id), "DELETE", { data: query });
    }
});

//App.ApplicationAdapter = DS.FixtureAdapter.extend();

App.Router.map(function() {
    this.resource('calendar', { path: '/room/:room_id'});
});

App.Calendar.FIXTURES = [

    {
        kind: "calendar#calendar",
        etag: '"XXXXXXXXXX"',
        id: "primary",
        summary: "summary",
        timeZone: "America/Recife"
    }
];

App.CalendarRoute = Ember.Route.extend({
    model: function(params) {
        return this.store.find('calendar', params.room_id);
    }
});



