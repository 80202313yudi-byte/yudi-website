export const projectReturnStateKey = "portfolio-return-state";
export const projectReturnStateMaxAge = 2 * 60 * 60 * 1000;

export type ProjectListViewState = {
  category?: string;
  query?: string;
  sort?: string;
};

export type ProjectReturnState = {
  slug: string;
  scrollY: number;
  fromWorks: true;
  timestamp: number;
  sourcePath: string;
  sourceHash: string;
  detailPath: string;
  returnRequested?: boolean;
  viewState?: ProjectListViewState;
};

export function getProjectCardId(slug: string) {
  return `project-${slug}`;
}

export function isValidProjectReturnState(
  state: ProjectReturnState | null,
  slug?: string,
): state is ProjectReturnState {
  return Boolean(
    state?.fromWorks === true &&
      state.sourcePath === "/" &&
      state.slug &&
      (!slug || state.slug === slug) &&
      Number.isFinite(state.scrollY) &&
      state.scrollY >= 0 &&
      Number.isFinite(state.timestamp) &&
      Date.now() - state.timestamp < projectReturnStateMaxAge,
  );
}
