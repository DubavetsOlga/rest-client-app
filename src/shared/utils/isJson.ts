export const isJSON = (str: string) => {
  try {
    const parsed = JSON.parse(str);
    return typeof parsed === 'object' && parsed !== null;
  } catch (error) {
    return false;
  }
};
