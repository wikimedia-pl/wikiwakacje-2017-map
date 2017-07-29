import $ from 'jquery';

const SidebarComponent = {
  bindings: {
    cards: '=',
    highlight: '=',
    loading: '=',
  },
  controller,
  template: () => template,
};

function controller($scope, mapService, versionService) {
  const vm = this;
  const cardContainer = $('.ww-cards');

  vm.mapPosition = mapService.center;
  vm.version = versionService.getVersion;

  // WATCH

  $scope.$watch(() => vm.highlight, (id) => {
    if (!id) { return; }
    scrollToId(id);
  });

  // FUNCTIONS

  function scrollToId(id) {
    const myElement = document.querySelector(`card[data-id="${id}"]`);
    cardContainer.animate({ scrollTop: myElement.offsetTop - 6 }, 'quick');
  }
}

const template = `<div class="ww-sidebar"
                   layout="column"
                   layout-align="start center">
       <div class="ww-cards-loading"
            layout="column"
            layout-align="center center"
            ng-show="$ctrl.loading.active">
          <md-progress-circular md-mode="indeterminate"
                             md-diameter="60"></md-progress-circular>
       </div>
      <div class="ww-cards">
        <div class="ww-sidebar-info"
             layout="column" layout-align="center center"
             ng-show="$ctrl.mapPosition.zoom < 12">
          <md-icon>info_outline</md-icon>
          <span class="md-headline">Przybliż mapę, aby pobrać obiekty</span>
        </div>
        <div class="ww-sidebar-info"
             layout="column" layout-align="center center"
             ng-show="$ctrl.version() === 'nature' && $ctrl.mapPosition.zoom >= 12">
          <md-icon>warning</md-icon>
          <span class="md-headline">Kliknij na mapę aby pobrać obiekty</span>
        </div>
        <div class="ww-sidebar-info"
             layout="column" layout-align="center center"
             ng-show="(!$ctrl.cards || !$ctrl.cards.length) && $ctrl.mapPosition.zoom >= 12">
          <md-icon>warning</md-icon>
          <span class="md-headline">Brak obiektów na tym obszarze</span>
        </div>
        <ww-card class="ww-card-container"
              ng-repeat="card in $ctrl.cards"
              ng-class="$ctrl.highlight == card.id ? 'ww-card-active' : 'ww-card-inactive'"
              data-id="{{card.id}}"
              data="card"></ww-card>
      </div>
      <md-list class="ww-sidebar-options">
        <md-list-item>
          <p>Szukaj podczas przesuwania mapy</p>
          <md-switch ng-model="$ctrl.loading.dragSearch" aria-label="Switch"></md-switch>
        </md-list-item>
      </md-list>
    </div>`;

export default () => {
  angular
    .module('app')
    .component('wwSidebar', SidebarComponent);
};
