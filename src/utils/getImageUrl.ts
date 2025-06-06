export const getImageUrl = (url: string) => {
  if (url.startsWith("http")) {
    return url; // Already a full URL
  }
  return process.env.NEXT_PUBLIC_API_URL + url; // Relative URL
};
