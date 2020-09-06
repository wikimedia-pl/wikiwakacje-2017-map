import card from "./card/card.component";
import header from "./header/header.component";
import main from "./main/main.component";
import map from "./map/map.component";
import sidebar from "./sidebar/sidebar.component";

export default () => {
  main();

  card();
  header();
  map();
  sidebar();
};
