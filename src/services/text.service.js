const TextService = $location => {
  const texts = {
    pl: {
      INIT: "Wczytywanie mapy",
      SEARCH_PLACEHOLDER: "Wpisz miejscowość, np. Wrocław",
      HEADER_NATURE: "Przyroda",
      HEADER_MONUMENTS: "Zabytki",
      HEADER_ART: "Sztuka",
      SIDEBAR_ZOOM_IN: "Przybliż mapę, aby pobrać obiekty",
      SIDEBAR_DRAG_SEARCH: "Szukaj podczas przesuwania mapy",
      SIDEBAR_CLICK_MAP_TO_GET: "Kliknij na mapę aby pobrać obiekty",
      SIDEBAR_NO_OBJECTS: "Brak obiektów na tym obszarze",
      SIDEBAR_IMAGE_OUT_OF_LIST: "Prześlij zdjęcie obiektu spoza listy",
      CARD_NO_NAME: "brak nazwy",
      CARD_WAYSIDE_SHRINE: "kapliczka",
      CARD_MEMORIAL: "pomnik",
      CARD_MONUMENT: "pomnik",
      CARD_WAYSIDE_CROSS: "krzyż przydrożny",
      CARD_ARTWORK: "dzieło sztuki",
      CARD_NATURE_RESERVE: "rezerwat przyrody",
      CARD_LANDSCAPE_PARK: "park krajobrazowy",
      CARD_1: "obszar specjalnej ochrony ptaków",
      CARD_2: "specjalny obszar ochrony siedlisk",
      CARD_NATIONAL_PARK: "park narodowy",
      CARD_3: "zespół przyrodniczo-krajobrazowy",
      CARD_NATURE_MONUMENT: "pomnik przyrody",
      CARD_MORE_INFO: "Więcej informacji",
      CARD_UPLOAD: "Prześlij"
    },
    en: {
      INIT: "Initializing map",
      SEARCH_PLACEHOLDER: "Type town or village name, eg. Wrocław",
      HEADER_NATURE: "Nature",
      HEADER_MONUMENTS: "Monuments",
      HEADER_ART: "Public art",
      SIDEBAR_ZOOM_IN: "Zoom in to get objects",
      SIDEBAR_DRAG_SEARCH: "Search after map dragging",
      SIDEBAR_CLICK_MAP_TO_GET: "Click on map to get objects",
      SIDEBAR_NO_OBJECTS: "No objects on this area",
      SIDEBAR_IMAGE_OUT_OF_LIST: "Send image of object not listed above",
      CARD_NO_NAME: "no name",
      CARD_WAYSIDE_SHRINE: "wayside shrine",
      CARD_MEMORIAL: "memorial",
      CARD_MONUMENT: "monument",
      CARD_WAYSIDE_CROSS: "wayside cross",
      CARD_ARTWORK: "public artwork",
      CARD_NATURE_RESERVE: "nature reserve",
      CARD_LANDSCAPE_PARK: "landscape park",
      CARD_1: "obszar specjalnej ochrony ptaków",
      CARD_2: "specjalny obszar ochrony siedlisk",
      CARD_NATIONAL_PARK: "national park",
      CARD_3: "zespół przyrodniczo-krajobrazowy",
      CARD_NATURE_MONUMENT: "natural monument",
      CARD_MORE_INFO: "More information",
      CARD_UPLOAD: "Upload"
    }
  };

  const service = {
    getText,
    getTexts
  };
  return service;

  // functions

  function getText(lang, text) {
    return texts[lang] ? texts[lang][text] : texts.en[text];
  }

  function getTexts(code) {
    const lang = code || $location.search().lang || "pl";
    return texts[lang];
  }
};

export default () => {
  angular.module("app").factory("textService", TextService);
};
