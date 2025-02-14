export const getJSON = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Something went wrong! (${res.status})`);
  return await res.json();
};
