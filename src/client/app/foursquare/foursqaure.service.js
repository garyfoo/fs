/**
 * Created by Garie on 26/4/2015.
 */
(function() {
    'use strict';

    angular
        .module('app.foursquare')
        .factory('placesExploreService', placesExploreService);

    placesExploreService.$inject = ['$resource'];

    var requestParms = {
        clientId: "412L42IOXJRPP5AIG1V3E1FDQISRMTF1WYKBBAU0KH51Z03W",
        clientSecret: "MVSSPOGA2J2AVEQJP1EWL4GIOLWNVQXZIIST1YEDHI2BUVUD",
        version: "20150426"
    }

    /* @ngInject */
    function placesExploreService($resource) {
        var requestUri = 'https://api.foursquare.com/v2/venues/:action'

        return $resource(requestUri,
            {
                action: 'explore',
                client_id: requestParms.clientId,
                client_secret: requestParms.clientSecret,
                v: requestParms.version,
                venuePhotos: '1',
                callback: 'JSON_CALLBACK'
            },
            {
                get: {
                    method: 'JSONP'
                 }
            });
    }
}());
