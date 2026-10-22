/** URL of an image in public/images (works with any Vite base path). */
export const imageUrl = (name: string) => `${import.meta.env.BASE_URL}images/${name}.webp`;
