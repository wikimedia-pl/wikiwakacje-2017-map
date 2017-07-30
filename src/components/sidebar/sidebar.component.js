import $ from 'jquery';

import './sidebar.scss';
import template from './sidebar.html';

const SidebarComponent = {
  bindings: {
    cards: '=',
    loading: '=',
  },
  controller,
  template,
};

function controller(
  $rootScope,
  $scope,
  mapService,
  versionService) {
  const vm = this;
  const cardContainer = $('.ww-cards');
  const map = mapService.getMap();

  vm.highlight = null;
  vm.mapPosition = map.center;
  vm.version = versionService.getVersion();

  // init

  vm.$onInit = () => {
    $scope.$watch(() => map.highlight, (id) => {
      if (!id) { return; }
      vm.highlight = map.highlight;
      scrollToId(id);
    });
    const changeVersionListener = $rootScope.$on('changeVersion', () => {
      vm.version = versionService.getVersion();
    });
    $scope.$on('$destroy', () => changeVersionListener());
  };

  // functions

  function scrollToId(id) {
    const myElement = document.querySelector(`ww-card[data-id="${id}"]`);
    cardContainer.animate({ scrollTop: myElement.offsetTop - 6 }, 'quick');
  }
}

export default () => {
  angular
    .module('app')
    .component('wwSidebar', SidebarComponent);
};
