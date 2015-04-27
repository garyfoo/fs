/**
 * Created by Garie on 25/4/2015.
 */
(function () {
    'use strict';

    angular
        .module('app.navbar')
        .controller('NavBarController', NavBarController);

    NavBarController.$inject = ['logger'];
    /* @ngInject */
    function NavBarController(logger) {
        var vm = this;
        vm.randomText = 'This is random text from navbar controller';
        activate();

        function activate() {
            logger.info('Activated Admin View');
        }
    }
})();
