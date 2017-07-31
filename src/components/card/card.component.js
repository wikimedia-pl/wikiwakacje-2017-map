import './card.scss';
import template from './card.html';

const CardComponent = {
  bindings: { data: '=' },
  controller,
  template,
};

function controller(
  $timeout,
  $window,
  mapService,
  versionService,
  dataService) {
  const vm = this;
  const uploadUrl = 'https://commons.wikimedia.org/w/index.php?title=Special:UploadWizard&campaign=';

  vm.map = mapService.getMap();
  vm.version = versionService.getVersion();

  vm.showNatureDetails = showNatureDetails;
  vm.showOnMap = showOnMap;
  vm.upload = upload;

  vm.artTypes = {
    wayside_shrine: 'kapliczka',
    memorial: 'pomnik',
    monument: 'pomnik',
    cross: 'krzyż przydrożny',
    artwork: 'dzieło sztuki',
  };

  vm.natureTypes = {
    Rezerwaty: 'rezerwat przyrody',
    ParkiKrajobrazowe: 'park krajobrazowy',
    ObszarySpecjalnejOchrony: 'obszar specjalnej ochrony ptaków',
    SpecjalneObszaryOchrony: 'specjalny obszar ochrony siedlisk',
    ParkiNarodowe: 'park narodowy',
    ZespolyPrzyrodniczoKrajobrazowe: 'zespół przyrodniczo-krajobrazowy',
    PomnikiPrzyrody: 'pomnik przyrody',
  };

  // init

  vm.$onInit = () => {
    // fix for monuments
    // vm.data.name_ = dewikify(vm.data.name);
    // vm.data.address_ = dewikify(vm.data.address);

    // fix for art
    if (vm.data.tags) {
      const tag = vm.data.tags.historic || vm.data.tags.man_made || vm.data.tags.tourism;
      vm.data.type = tag ? vm.artTypes[tag] : '?';
    }
  };

  // functions

  function getArtCategory() {
    const names = {
      kapliczka: 'Wayside shrines in Poland',
      pomnik: 'Monuments and memorials in Poland',
      'krzyż przydrożny': 'Wayside crosses in Poland',
      'dzieło sztuki': 'Sculptures in Poland',
    };
    return names[vm.data.type];
  }

  function getNatureCategory() {
    const names = {
      Rezerwaty: `Nature reserve ${vm.data.name}`,  // eg. Łażyn
      ParkiKrajobrazowe: vm.data.name,              // eg. Nadwiślański Park Krajobrazowy
      ObszarySpecjalnejOchrony: vm.data.name,       // eg. Dolina Dolnej Wisły
      SpecjalneObszaryOchrony: vm.data.name,        // eg. Dolina Dolnej Wisły
      ParkiNarodowe: vm.data.name,                  // eg. Babiogórski Park Narodowy
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
    const category = vm.data.category || `${vm.data.category2 || vm.data.category3 || 'Cultural heritage monuments in Poland'}`;

    let url = uploadUrl;
    url += 'wikiwakacje-z&descriptionlang=pl';
    url += `&description=${description}&categories=${category}&id=${vm.data.id}`;
    url += `&lat=${vm.data.lat}&lon=${vm.data.lon}`;
    return url;
  }

  function getNatureUploadUrl() {
    const type = vm.natureTypes[vm.data.type];
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
    if (vm.version === 'monuments') {
      url = getMonumentUploadUrl();
    } else if (vm.version === 'nature') {
      url = getNatureUploadUrl();
    } else if (vm.version === 'art') {
      url = getArtUploadUrl();
    }
    $window.open(url, '_blank');
  }

  function showNatureDetails(data) {
    $window.open(`http://crfop.gdos.gov.pl/CRFOP/widok/viewfop.jsf?fop=${data.id}`, '_blank');
  }
}

export default () => {
  angular
    .module('app')
    .component('wwCard', CardComponent);
};
