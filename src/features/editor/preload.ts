// Loads the editor's code-split chunk ahead of navigation (e.g. on hover of
// an Edit button) so opening the editor never waits on the network/disk.
export const loadEditorScreen = () => import("./EditorScreen");

export const preloadEditor = () => {
  loadEditorScreen();
};
