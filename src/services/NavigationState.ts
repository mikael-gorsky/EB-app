export const saveLastLocation = (path: string) => {
  // Store path without a leading slash for HashRouter compatibility
  const formattedPath = path.startsWith('/') ? path.substring(1) : path;
  localStorage.setItem('lastLocation', formattedPath);
};

export const getLastLocation = (): string => {
  const savedPath = localStorage.getItem('lastLocation') || '/';
  // Ensure path is in correct format
  return savedPath.startsWith('/') ? savedPath : `/${savedPath}`;
};