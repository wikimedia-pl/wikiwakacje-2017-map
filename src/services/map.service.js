import L from 'leaflet';

import '../images/marker-red.png';
import '../images/marker-shadow.png';

const gdosApiUrl = 'http://sdi.gdos.gov.pl/wms';

const MapService = () => {
  const map = {
    forceMapState: false,
    center: {
      lat: 52.093,
      lng: 19.468,
      zoom: 5,
    },
    icons: {
      normal: {
        iconUrl: 'assets/images/marker-red.png',
        shadowUrl: 'assets/images/marker-shadow.png',
        iconSize: [29, 41],
        shadowSize: [41, 41],
        iconAnchor: [15, 41],
        shadowAnchor: [12, 41],
      },
    },
    tiles: {
      gdos: L.tileLayer.wms(gdosApiUrl, {
        layers: [
          'ObszarySpecjalnejOchrony',
          'ParkiKrajobrazowe',
          'ParkiNarodowe',
          'PomnikiPrzyrody',
          'Rezerwaty',
          'SpecjalneObszaryOchrony',
          'ZespolyPrzyrodniczoKrajobrazowe',
        ].join(','),
        format: 'image/png',
        styles: 'soo$1$3,oso$1$3,zespoly$1$3,pn$1$3,pk$1$3,rez$1$3,pp$1$3',
        transparent: true,
        attribution: 'Generalna Dyrekcja Ochrony Środowiska',
      }),
    },
  };
  return map;
};

export default () => {
  angular
    .module('app')
    .factory('mapService', MapService);
};
