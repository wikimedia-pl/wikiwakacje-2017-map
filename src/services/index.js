import dataService from "./data.service";
import mapService from "./map.service";
import textService from "./text.service";
import versionService from "./version.service";

export default () => {
  dataService();
  mapService();
  textService();
  versionService();
};
