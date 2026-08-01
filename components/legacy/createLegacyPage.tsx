import DogstudioPage from "./DogstudioPage";

export type LegacyMarkupModule = {
  BODY_CLASS: string;
  DATA_THEME: string;
  DATA_PAGE: string;
  MARKUP: string;
  PAGE_TITLE: string;
};

/**
 * Thin server component factory: one markup module → Next page.
 */
export function createLegacyPage(mod: LegacyMarkupModule) {
  return function LegacyRoutePage() {
    return (
      <DogstudioPage
        bodyClass={mod.BODY_CLASS}
        dataTheme={mod.DATA_THEME}
        dataPage={mod.DATA_PAGE}
        markup={mod.MARKUP}
      />
    );
  };
}
