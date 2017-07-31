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
  const uploadUrl = 'https://commons.wikimedia.org/w/index.php?title=Special:UploadWizard&campaign=';

  vm.highlight = null;
  vm.map = mapService.getMap();
  vm.version = versionService.getVersion();

  vm.uploadExtra = uploadExtra;

  // init

  vm.$onInit = () => {
    $scope.$watch(() => vm.map.highlight, (item) => {
      if (!item) { return; }
      const selectedItem = vm.cards.filter(card => card.id === item.id)[0];
      vm.highlight = selectedItem.id;
      scrollToId(selectedItem);
    });
    const changeVersionListener = $rootScope.$on('changeVersion', () => {
      vm.version = versionService.getVersion();
    });
    $scope.$on('$destroy', () => changeVersionListener());
  };

  // functions

  function scrollToId(item) {
    vm.topIndex = vm.cards.indexOf(item);
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
