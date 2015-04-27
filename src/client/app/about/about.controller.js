/**
 * Created by Garie on 28/4/2015.
 */
(function () {
    'use strict';

    angular
        .module('app.about')
        .controller('AboutController', AboutController);

    AboutController.$inject = ['logger'];
    /* @ngInject */
    function AboutController(logger) {
        var vm = this;

        activate();

        function activate() {
                logger.info('Activated About View');
        }

    }
})();
