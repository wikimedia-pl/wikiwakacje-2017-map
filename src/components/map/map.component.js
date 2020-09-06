import "./map.scss";
import template from "./map.html";

const MapComponent = {
  bindings: {
    loading: "=",
    cards: "="
  },
  controller,
  template
};

function controller(
  $scope,
  $http,
  $location,
  $q,
  $rootScope,
  $timeout,
  dataService,
  leafletData,
  mapService,
  versionService
) {
  const vm = this;
  let canceler = $q.defer();
  let version = "monuments";

  vm.dragSearch = true;
  vm.events = {};
  vm.map = mapService.getMap();
  vm.mapBounds = null;

  vm.changeVersion = changeVersion;

  // init

  vm.$onInit = () => {
    vm.loading.active += 1;

    $timeout(() => {
      vm.loading.active -= 1;
      leafletData.getMap().then(map => {
        map.invalidateSize();
        map.on("moveend", () => {
          if (vm.loading.dragSearch) {
            $timeout(() => {
              getObjects();
            }, 100);
          }
        });
        map.on("dragstart zoomstart", () => {
          canceler.resolve();
        });
        map.on("click", event => {
          if (version === "nature") {
            const coords = event.latlng;
            $timeout(() => {
              getNature(coords);
            });
          }
        });
      });
      getObjects();
    }, 100);

    $scope.$on("leafletDirectiveMarker.click", (event, args) => {
      vm.map.highlight = args.model.data;
    });

    $scope.$on("centerUrlHash", (event, centerHash) => {
      const old = $location.search();
      $location.search(angular.extend(old, { c: centerHash }));
    });

    const changeVersionListener = $rootScope.$on("changeVersion", () => {
      version = versionService.getVersion();
      changeVersion();
    });
    $scope.$on("$destroy", () => changeVersionListener());
  };

  // functions

  function changeVersion() {
    vm.cards = [];
    const isNature = version === "nature";
    mapService.clearMarkers();
    mapService.showNature(isNature);
    getObjects();
  }

  function getObjects() {
    if (vm.map.center.zoom < 12 || !vm.map.center) {
      vm.cards = [];
      mapService.clearMarkers();
      vm.map.highlight = "";
      return;
    }

    if (version === "monuments") {
      getMonuments();
    } else if (version === "art") {
      getArt();
    }
  }

  function getNature(coords) {
    vm.loading.active += 1;
    dataService.getNature(coords).then(data => {
      const cards = data.data.map(element => ({
        name: element.info.name || element.info.obiekt,
        id: element.info.kodinspire,
        type: element.layer
      }));

      vm.cards = cards;
      vm.loading.active -= 1;
      vm.map.highlight = "";
    });
  }

  function getArt() {
    if (vm.map.forceMapState) {
      vm.map.forceMapState = false;
      return;
    }

    vm.loading.active += 1;
    canceler.resolve();
    canceler = $q.defer();

    dataService
      .getArt(vm.mapBounds, {
        //  timeout: canceler.promise,
      })
      .then(
        data => {
          vm.loading.active -= 1;
          vm.cards = data.data.elements;
          mapService.clearMarkers();
          vm.map.highlight = "";

          data.data.elements.forEach(element => {
            vm.map.markers[element.id] = setMarker(element);
          });
        },
        () => {
          vm.loading.active -= 1;
          vm.cards = [];
        }
      );
  }

  function getMonuments() {
    if (vm.map.forceMapState) {
      vm.map.forceMapState = false;
      return;
    }

    vm.loading.active += 1;
    canceler.resolve();
    canceler = $q.defer();

    dataService
      .getMonuments(vm.mapBounds, {
        //  timeout: canceler.promise,
      })
      .then(
        data => {
          vm.loading.active -= 1;

          const cards = data.data.results.bindings
            .map(object => {
              const coord = object.coord.value
                .replace("Point(", "")
                .replace(")", "")
                .split(" ");

              return {
                id: object.item.value.substring(32),
                name: object.itemLabel ? object.itemLabel.value : undefined,
                lat: +coord[1],
                lon: +coord[0],
                image: object.image
                  ? object.image.value.substring(51)
                  : undefined,
                town: object.townLabel ? object.townLabel.value : undefined,
                category: object.category ? object.category.value : undefined,
                category2: object.townCategory
                  ? object.townCategory.value
                  : undefined,
                category3: object.adminCategory
                  ? object.adminCategory.value
                  : undefined
              };
            })
            .filter(
              (element, index, array) =>
                array.findIndex(t => t.id === element.id) === index
            );

          vm.cards = cards || [];
          mapService.clearMarkers();
          vm.map.highlight = "";

          if (!data) {
            return;
          }
          cards.forEach(element => {
            vm.map.markers[element.id] = setMarker(element);
          });
        },
        () => {
          vm.loading.active -= 1;
          vm.cards = [];
        }
      );
  }

  function setMarker(element) {
    const data = {
      data: element,
      lat: element.lat,
      lng: element.lon,
      layer: "pins",
      icon: mapService.getMapIcon(element)
    };
    return data;
  }
}

export default () => {
  angular.module("app").component("wwMap", MapComponent);
};
