import './main.scss';
import template from './main.html';

const MainComponent = {
  bindings: {},
  controller,
  template,
};

function controller(
  $location,
  $rootScope,
  $scope,
  $timeout,
  textService,
  versionService) {
  const vm = this;

  vm.cards = null;
  vm.loading = {};
  vm.text = textService.getTexts();

  // init

  vm.$onInit = () => {
    vm.loading = {
      active: 0,
      map: true,
      dragSearch: true,
    };

    versionService.setVersion('monuments');
    $timeout(() => { vm.loading.map = false; }, 2000);

    const changeVersionListener = $rootScope.$on('changeVersion', () => {
      vm.cards = null;
    });
    $scope.$on('$destroy', () => changeVersionListener());
  };
}

export default () => {
  angular
    .module('app')
    .component('wwMain', MainComponent);
};
