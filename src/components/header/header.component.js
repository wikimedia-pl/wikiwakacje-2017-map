import '../../images/logo.png';

import './header.scss';
import template from './header.html';

const HeaderComponent = {
  bindings: {},
  controller,
  template,
};

function controller(
  $rootScope,
  versionService) {
  const vm = this;

  vm.changeVersion = changeVersion;

  // functions

  function changeVersion(version) {
    versionService.setVersion(version);
    $rootScope.$emit('changeVersion');
  }
}

export default () => {
  angular
    .module('app')
    .component('wwHeader', HeaderComponent);
};
