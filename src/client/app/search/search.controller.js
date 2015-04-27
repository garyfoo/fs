/**
 * Created by Garie on 26/4/2015.
 */
(function () {
    'use strict';

    angular
        .module('app.search')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$scope', 'placesExploreService', '$filter', 'currentPosition', 'maps', 'logger'];
    /* @ngInject */
    function SearchController($scope, placesExploreService, $filter, currentPosition, maps, logger) {
        var vm = this;
        vm.options = {
            scrollwheel: false
        };

        vm.restaurantMarkers = [];
        vm.exploreNearby = "Brisbane";
        vm.exploreQuery = "";
        vm.filterValue = "";

        vm.places = [];
        vm.filteredPlaces = [];
        vm.filteredPlacesCount = 0;

        //paging
        vm.totalRecordsCount = 0;
        vm.pageSize = 10;
        vm.currentPage = 1;

        var lat = currentPosition.coords.latitude;
        console.log("this is lat" + lat)
        var lng = currentPosition.coords.longitude;
        console.log("this is lng" + lng)
        var latlng = new google.maps.LatLng(lat, lng);
        console.log("this is latlng" + latlng)

        //gmaps
        vm.map = {
        };

        vm.marker = {
            id: 1,
            coords: {
                latitude: currentPosition.coords.latitude,
                longitude: currentPosition.coords.longitude
            }
        };

        vm.location = [
            {
                "id": "b4ad712f-9054-4d46-997a-aec2cacb34ca",
                "name": "Meadowbrook Ct. 1",
                "locationUrl": "http://goo.gl/rHw5Rj",
                "address": "5001 Meadowbrook Lane, Ellicott City, MD"
            },
            {
                "id": "53c1f096-4c57-475c-92b6-754276839356",
                "name": "Meadowbrook Ct. 2",
                "locationUrl": "http://goo.gl/rHw5Rj",
                "address": "5001 Meadowbrook Lane, Ellicott City, MD"
            },
            {
                "id": "692d0e83-66b9-43b7-8d81-4ad370e23550",
                "name": "Meadowbrook Ct. 3",
                "locationUrl": "http://goo.gl/rHw5Rj",
                "address": "5001 Meadowbrook Lane, Ellicott City, MD"
            },
            {
                "id": "f2fdcaf2-bc75-4c30-ac25-004fe38617cb",
                "name": "Meadowbrook Ct. 4",
                "locationUrl": "http://goo.gl/rHw5Rj",
                "address": "5001 Meadowbrook Lane, Ellicott City, MD"
            }
        ]

        //Functions
        //Refresh GMap
        vm.refreshMap = refreshMap;
        vm.getUserAddress = getUserAddress;
        vm.getPlaces = getPlaces;
        vm.createRestaurantMarker = createRestaurantMarker();
        vm.performSearch = performSearch;
        vm.createWatchers = createWatchers;
        vm.buildCategoryIcon = buildCategoryIcon;
        vm.buildVenueThumbnail = buildVenueThumbnail;

        activate();


        function activate() {
            logger.info("FoodSquare App Loaded");
            if (vm.location.address){
                refreshMap();
            }
            createWatchers();
            performSearch();
        }

        function getUserAddress(){
            var geocoder = new maps.Geocoder();
            var lat = currentPosition.coords.latitude;
            var lng = currentPosition.coords.longitude;
            var latlng = new google.maps.LatLng(lat, lng);
            geocoder.geocode({ latLng: latlng }, function(result){
                if (result[1]){
                    vm.exploreNearby = result[4].formatted_address;
                }
                else{
                }
            });
        }

        function getPlaces(){
            var offset = (vm.pageSize) * (vm.currentPage - 1);
            getUserAddress();
            placesExploreService.get(
                {
                    near: vm.exploreNearby,
                    query: vm.exploreQuery,
                    limit: vm.pageSize,
                    offset: offset
                },
                function (placesResult) {
                if (placesResult.response.groups) {
                    vm.places = placesResult.response.groups[0].items;
                    vm.totalRecordsCount = placesResult.response.totalResults;
                    filterPlaces('');
                    console.log(vm.places[0]);
                    var markers = [];
                    for (var i = 0; i < vm.places.length; i++) {
                        markers.push(createRestaurantMarker(i, vm.places[i].venue.name, vm.places[i].venue.location.formattedAddress[0],
                        vm.places[i].venue.location.lat, vm.places[i].venue.location.lng))
                    }
                    vm.restaurantMarkers = markers;
                    vm.map = {
                        center: {
                            latitude: vm.places[0].venue.location.lat,
                            longitude: vm.places[0].venue.location.lng
                        },
                        zoom: 14
                    };
                }
                else {
                    vm.places = [];
                    vm.totalRecordsCount = 0;
                }
            });
        }

        /**
        $scope.randomMarkers = [];
        // Get the bounds from the map once it's loaded
        $scope.$watch(function() {
            return $scope.map.bounds;
        }, function(nv, ov) {
            // Only need to regenerate once
            if (!ov.southwest && nv.southwest) {
                var markers = [];
                for (var i = 0; i < 50; i++) {
                    markers.push(createRandomMarker(i, $scope.map.bounds))
                }
                $scope.randomMarkers = markers;
            }
        }, true);
        **/

        function performSearch(){
            getPlaces();
        }


        function filterPlaces(filterInput) {
            vm.filteredPlaces = $filter("placeNameCategoryFilter")(vm.places, filterInput);
            vm.filteredPlacesCount = vm.filteredPlaces.length;
        }

        function createWatchers() {

            $scope.$watch("vm.filterValue", function (filterInput) {
                filterPlaces(filterInput);
            });
        }

        function createRestaurantMarker(i, name, add, lati, longi, idKey){

            if (idKey == null) {
                idKey = "id";
            }

            var ret = {
                latitude: lati,
                longitude: longi,
                title: 'm' + i,
                templateUrl: 'app/search/gmapWindow.html',
                name: name,
                add: add

            };
            ret.onClick = function() {
                ret.show = !ret.show;
            };
            ret[idKey] = i;
            return ret;

        }

        function buildCategoryIcon(icon){
            return icon.prefix + '44' + icon.suffix;
        }

        function buildVenueThumbnail(photo){
            return photo.items[0].prefix + '128x128' + photo.items[0].suffix;
        }

        function refreshMap(){
            var geocoder = new maps.Geocoder();
            geocoder.geocode({ address: vm.location.address }, function(result){
                if (result.length > 0){
                    var addrLocation = result[0].geometry.location;

                    $timeout(function(){
                        vm.map.center = {
                            latitude: addrLocation.lat(),
                            longitude: addrLocation.lng()
                        };

                        vm.marker = {
                            id: 1,
                            coords: {
                                latitude: vm.map.center.latitude,
                                longitude: vm.map.center.longitude
                            },
                            options: {
                                title : "My location"
                            }
                        };
                    }, 0);
                }
            });
        }
    }
})();
