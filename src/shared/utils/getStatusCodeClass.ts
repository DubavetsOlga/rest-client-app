export const getStatusCodeClass = (status: number): string => {
  if (status >= 100 && status < 200) return 'infoCode';
  if (status >= 200 && status < 300) return 'successCode';
  if (status >= 300 && status < 400) return 'redirectCode';
  if (status >= 400 && status < 600) return 'errorCode';
  return '';
};
