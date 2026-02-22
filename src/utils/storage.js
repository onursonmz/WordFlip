const STORAGE_KEY = 'wordflip_data';

export const saveWords = (words) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
};

export const getWords = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};
