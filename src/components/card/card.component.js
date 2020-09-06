import './card.scss';
import template from './card.html';

const CardComponent = {
  bindings: {
    data: '=',
    text: '=',
  },
  controller,
  template,
};

function controller($timeout, $window, mapService, versionService, dataService) {
  const vm = this;
  const uploadUrl =
    'https://commons.wikimedia.org/w/index.php?title=Special:UploadWizard&campaign=';

  vm.map = mapService.getMap();

  vm.showNatureDetails = showNatureDetails;
  vm.showOnMap = showOnMap;
  vm.upload = upload;
  vm.version = () => versionService.getVersion();

  vm.artTypes = {
    wayside_shrine: 'CARD_WAYSIDE_SHRINE',
    memorial: 'CARD_MEMORIAL',
    monument: 'CARD_MONUMENT',
    cross: 'CARD_WAYSIDE_CROSS',
    artwork: 'CARD_ARTWORK',
  };

  vm.natureTypes = {
    Rezerwaty: 'CARD_NATURE_RESERVE',
    ParkiKrajobrazowe: 'CARD_LANDSCAPE_PARK',
    ObszarySpecjalnejOchrony: 'CARD_1',
    SpecjalneObszaryOchrony: 'CARD_2',
    ParkiNarodowe: 'CARD_NATIONAL_PARK',
    ZespolyPrzyrodniczoKrajobrazowe: 'CARD_3',
    PomnikiPrzyrody: 'CARD_NATURE_MONUMENT',
  };

  // init

  vm.artType = () => {
    // fix for art
    if (vm.data.tags) {
      const tag = vm.data.tags.historic || vm.data.tags.man_made || vm.data.tags.tourism;
      return tag ? vm.artTypes[tag] : '?';
    }
    return '';
  };

  // functions

  function getArtCategory() {
    const names = {
      CARD_WAYSIDE_SHRINE: 'Wayside shrines in Poland',
      CARD_MEMORIAL: 'Monuments and memorials in Poland',
      CARD_MONUMENT: 'Monuments and memorials in Poland',
      CARD_WAYSIDE_CROSS: 'Wayside crosses in Poland',
      CARD_ARTWORK: 'Sculptures in Poland',
    };
    return names[vm.artType()] || '';
  }

  function getNatureCategory() {
    const names = {
      Rezerwaty: `Nature reserve ${vm.data.name}`, // eg. Łażyn
      ParkiKrajobrazowe: vm.data.name, // eg. Nadwiślański Park Krajobrazowy
      ObszarySpecjalnejOchrony: vm.data.name, // eg. Dolina Dolnej Wisły
      SpecjalneObszaryOchrony: vm.data.name, // eg. Dolina Dolnej Wisły
      ParkiNarodowe: vm.data.name, // eg. Babiogórski Park Narodowy
      ZespolyPrzyrodniczoKrajobrazowe: vm.data.name, // eg. Zakole Wawerskie
      PomnikiPrzyrody: 'Natural monuments in Poland',
    };
    return names[vm.data.type];
  }

  function getArtUploadUrl() {
    const description = vm.data.tags.name || '';
    const category = getArtCategory();

    let url = uploadUrl;
    url += 'wikiwakacje-s&descriptionlang=pl';
    url += `&description=${description}&categories=${category}&id=${vm.data.id}`;
    url += `&lat=${vm.data.lat}&lon=${vm.data.lon}`;
    return url;
  }

  function getMonumentUploadUrl() {
    const description = [vm.data.town, vm.data.name].join(', ');
    const category =
      vm.data.category ||
      `${vm.data.category2 || vm.data.category3 || 'Cultural heritage monuments in Poland'}`;

    let url = uploadUrl;
    url += 'wlm-pl&descriptionlang=pl';
    url += `&description=${description}&categories=${category}&id=Q${vm.data.id}`;
    url += `&lat=${vm.data.lat}&lon=${vm.data.lon}`;
    return url;
  }

  function getNatureUploadUrl() {
    const type = vm.text[vm.natureTypes[vm.data.type]];
    const description = `${type[0].toUpperCase()}${type.substring(1)}: ${vm.data.name}`;
    const category = getNatureCategory();

    let url = uploadUrl;
    url += 'wikiwakacje-n&descriptionlang=pl';
    url += `&description=${description}&categories=${category}&id=${vm.data.id}`;
    url += `&lat=${dataService.getLastCoord().lat}&lon=${dataService.getLastCoord().lng}`;
    return url;
  }

  function showOnMap() {
    vm.map.highlight = angular.extend({}, vm.data, { stopScroll: true });
    vm.map.forceMapState = true;

    $timeout(() => {
      vm.map.center = {
        lat: vm.data.lat,
        lng: vm.data.lon,
        zoom: vm.map.center.zoom < 17 ? 17 : vm.map.center.zoom,
      };
    });
  }

  function upload() {
    let url = null;
    if (vm.version() === 'monuments') {
      url = getMonumentUploadUrl();
    } else if (vm.version() === 'nature') {
      url = getNatureUploadUrl();
    } else if (vm.version() === 'art') {
      url = getArtUploadUrl();
    }
    $window.open(url, '_blank');
  }

  function showNatureDetails(data) {
    $window.open(`http://crfop.gdos.gov.pl/CRFOP/widok/viewfop.jsf?fop=${data.id}`, '_blank');
  }
}

export default () => {
  angular.module('app').component('wwCard', CardComponent);
};
