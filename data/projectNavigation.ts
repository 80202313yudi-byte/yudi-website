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

function normalizeReturnSourcePath(path?: string) {
  if (!path || path === "/") {
    return "/";
  }

  return path.endsWith("/") ? path.slice(0, -1) : path;
}

export function isValidProjectReturnState(
  state: ProjectReturnState | null,
  slug?: string,
): state is ProjectReturnState {
  const sourcePath = normalizeReturnSourcePath(state?.sourcePath);
  const validSourcePath = sourcePath === "/" || sourcePath === "/works";

  return Boolean(
    state?.fromWorks === true &&
      validSourcePath &&
      state.slug &&
      (!slug || state.slug === slug) &&
      Number.isFinite(state.scrollY) &&
      state.scrollY >= 0 &&
      Number.isFinite(state.timestamp) &&
      Date.now() - state.timestamp < projectReturnStateMaxAge,
  );
}
