/**
 * Created by Garie on 26/4/2015.
 */
(function() {
    'use strict';

    angular
        .module('app.search')
        .filter("placeNameCategoryFilter", placesNameCategoryFilter);

    function placesNameCategoryFilter(){
        return function (places, filterValue) {
            if (!filterValue) return places;

            var matches = [];
            filterValue = filterValue.toLowerCase();
            for (var i = 0; i < places.length; i++) {
                var place = places[i];

                if (place.venue.name.toLowerCase().indexOf(filterValue) > -1 ||
                    place.venue.categories[0].shortName.toLowerCase().indexOf(filterValue) > -1) {
                    matches.push(place);
                }
            }
            return matches;
        };
    }
})();
