const API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY;

export const getCuratedPhotos = async (page) => {
  const res = await fetch(
    `https://api.pexels.com/v1/curated?page=${page}&per_page=16`,
    {
      headers: {
        Authorization: API_KEY,
      },
    }
  );
  const responseJson = await res.json();
  return responseJson.photos;
};