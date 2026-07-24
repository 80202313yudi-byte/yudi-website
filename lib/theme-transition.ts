export const themeTransitionEvent = "fishdi:theme-transition";

export type ThemeTransitionDetail = {
  active: boolean;
};

export function setThemeTransitionActive(active: boolean): void {
  window.dispatchEvent(
    new CustomEvent<ThemeTransitionDetail>(themeTransitionEvent, {
      detail: { active },
    })
  );
}
