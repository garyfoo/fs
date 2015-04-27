/**
 * Created by Garie on 22/4/2015.
 */
/* Help configure the google map */
(function() {
    'use strict';

    angular
        .module('app.gmap')
        .config(gmapConfig);

    gmapConfig.$inject = ['uiGmapGoogleMapApiProvider'];
    /* @ngInject */
    function gmapConfig(uiGmapGoogleMapApiProvider) {
        /* jshint validthis:true */
        configureGmapHelper();

        //////////////

        function configureGmapHelper(){
            uiGmapGoogleMapApiProvider.configure({
                //    key: 'your api key',
                v: '3.17',
                libraries: 'weather,geometry,visualization'
            });
        }
    }
})();

