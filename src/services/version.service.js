const VersionService = () => {
  let version = "monuments";

  const service = {
    getVersion,
    setVersion
  };
  return service;

  // functions

  function getVersion() {
    return version;
  }

  function setVersion(newVersion) {
    version = newVersion;
  }
};

export default () => {
  angular.module("app").factory("versionService", VersionService);
};
