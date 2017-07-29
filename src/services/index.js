import dataService from './data.service';
import mapService from './map.service';
import versionService from './version.service';

export default () => {
  dataService();
  mapService();
  versionService();
};
