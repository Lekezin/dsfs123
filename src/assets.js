// Respeita também builds hospedados em um subdiretório, como GitHub Pages.
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
export const heroCutout = asset('photos/hero-cutout.webp');
