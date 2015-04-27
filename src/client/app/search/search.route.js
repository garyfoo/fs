/**
 * Created by Garie on 26/4/2015.
 */
(function() {
    'use strict';

    angular
        .module('app.search')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'search',
                config: {
                    url: '/',
                    templateUrl: 'app/search/search.html',
                    controller: 'SearchController',
                    controllerAs: 'vm',
                    title: 'Search',
                    resolve: {
                        maps: ['uiGmapGoogleMapApi', function(uiGmapGoogleMapApi){
                            return uiGmapGoogleMapApi;
                        }],
                        currentPosition: ['$q', function($q){
                            var deferred = $q.defer();
                            navigator.geolocation.getCurrentPosition(function(position){
                                deferred.resolve(position);
                            });
                            return deferred.promise;
                        }]
                    },
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-search"></i> Search'
                    }
                }
            }
        ];
    }
})();
