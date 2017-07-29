import $ from 'jquery';

import './sidebar.scss';
import template from './sidebar.html';

const SidebarComponent = {
  bindings: {
    cards: '=',
    highlight: '=',
    loading: '=',
  },
  controller,
  template,
};

function controller($scope, mapService, versionService) {
  const vm = this;
  const cardContainer = $('.ww-cards');

  vm.mapPosition = mapService.center;
  vm.version = versionService.getVersion;

  // init

  vm.$onInit = () => {
    $scope.$watch(() => vm.highlight, (id) => {
      if (!id) { return; }
      scrollToId(id);
    });
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
