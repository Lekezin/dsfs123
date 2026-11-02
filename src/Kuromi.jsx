// Recortes transparentes preparados a partir das quatro artes do Gustavo.
import { asset } from './assets';
export const kuromiArtwork = {
  classica: { src: '/decor/kuromi-classica-sem-fundo.webp', alt: 'Kuromi clássica piscando', width: 600, height: 706 },
  amigos: { src: '/decor/kuromi-amigos-sem-fundo.webp', alt: 'Kuromi sorrindo com as mãos na cintura', width: 600, height: 653 },
  bruxinha: { src: '/decor/kuromi-bruxinha-sem-fundo.webp', alt: 'Kuromi de bruxinha, com chapéu e roupa roxa', width: 600, height: 630 },
  roxinha: { src: '/decor/kuromi-roxinha-sem-fundo.webp', alt: 'Kuromi roxinha com laços, renda e botas', width: 600, height: 600 },
};

export default function Kuromi({ className = '', variant = 'classica' }) {
  const artwork = kuromiArtwork[variant] || kuromiArtwork.classica;
  return <img className={`kuromi kuromi-${variant} ${className}`} src={asset(artwork.src)} alt={artwork.alt} width={artwork.width} height={artwork.height} decoding="async" draggable="false"/>;
}
