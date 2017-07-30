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
  $window,
  mapService,
  versionService) {
  const vm = this;
  const cardContainer = $('.ww-cards');
  const uploadUrl = 'https://commons.wikimedia.org/w/index.php?title=Special:UploadWizard&campaign=';

  vm.highlight = null;
  vm.map = mapService.getMap();
  vm.version = versionService.getVersion();

  vm.uploadExtra = uploadExtra;

  // init

  vm.$onInit = () => {
    $scope.$watch(() => vm.map.highlight, (id) => {
      if (!id) { return; }
      vm.highlight = vm.map.highlight;
      scrollToId(id);
    });
    const changeVersionListener = $rootScope.$on('changeVersion', () => {
      vm.version = versionService.getVersion();
    });
    $scope.$on('$destroy', () => changeVersionListener());
  };

  // functions

  function scrollToId(id) {
    const myElement = $window.document.querySelector(`ww-card[data-id="${id}"]`);
    cardContainer.animate({ scrollTop: myElement.offsetTop - 6 }, 'quick');
  }

  function uploadExtra() {
    const campaigns = {
      monuments: 'wikiwakacje-z',
      nature: 'wikiwakacje-n',
      art: 'wikiwakacje-s',
    };
    const url = `${uploadUrl}${campaigns[vm.version]}`;
    $window.open(url, '_blank');
  }
}

export default () => {
  angular
    .module('app')
    .component('wwSidebar', SidebarComponent);
};
