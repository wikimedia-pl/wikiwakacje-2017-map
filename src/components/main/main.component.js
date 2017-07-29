import './main.scss';
import template from './main.html';

const MainComponent = {
  bindings: {},
  controller,
  template,
};

function controller(
  $scope,
  $mdTheming,
  $timeout,
  dataService,
  versionService) {
  const vm = this;

  vm.cards = [];
  vm.highlight = '';
  vm.loading = {};

  initialize();

  // functions

  function initialize() {
    vm.loading = {
      active: false,
      map: true,
      dragSearch: true,
    };

    versionService.setVersion('monuments');
    $timeout(() => { vm.loading.map = false; }, 2000);
  }
}

export default () => {
  angular
    .module('app')
    .component('wwMain', MainComponent);
};
