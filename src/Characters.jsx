import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowLeftIcon, ArrowRightIcon, HeartIcon, SparkleIcon } from '@phosphor-icons/react';
import { characters } from './content';
import './characters.css';

export default function Characters() {
  const [selected, setSelected] = useState(0);
  const active = characters[selected];
  const stage = useRef(null);
  const tabs = useRef([]);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from('.cast-portrait', { opacity: 0, scale: 1.045, duration: 0.75, ease: 'power3.out' });
      gsap.from('.cast-facts > *, .cast-comment > *', { y: 16, opacity: 0, stagger: 0.065, duration: 0.65, ease: 'power3.out' });
    }, stage);
    return () => ctx.revert();
  }, [selected]);

  function select(index, focus = false) {
    const next = (index + characters.length) % characters.length;
    setSelected(next);
    if (focus) tabs.current[next]?.focus({ preventScroll: true });
    const tab = tabs.current[next];
    const strip = tab?.parentElement;
    if (tab && strip) {
      const rect = tab.getBoundingClientRect();
      const stripRect = strip.getBoundingClientRect();
      strip.scrollBy({ left: rect.left - stripRect.left - (strip.clientWidth - rect.width) / 2, behavior: 'auto' });
    }
  }

  function keys(event, index) {
    const next = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: characters.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next, true);
  }

  return <section id="personagens" className="cast-section section-pad" aria-labelledby="cast-title" style={{ '--cast-accent': active.accent }}>
    <div className="cast-topline reveal"><span className="eyebrow">03 — UM ELENCO QUE EU PRECISAVA CONHECER</span><span className="cast-count"><HeartIcon size={13}/> 09 FAVORITOS DELA</span></div>
    <div className="cast-heading reveal"><h2 id="cast-title">Meus concorrentes<br/><em>em 2D.</em><SparkleIcon size={39} weight="thin" aria-hidden="true"/></h2><p>As esposas, os maridos e os personagens favoritos.<br/>E eu aqui, fazendo um site pra você.<span className="handwritten">o gosto é seu. os comentários são meus.</span></p></div>

    <div className="cast-picker reveal"><span className="eyebrow cast-picker-label">TOQUE PRA CONHECER O ELENCO</span><div className="cast-tabs" role="tablist" aria-label="Personagens favoritos da Emanuelle">{characters.map((character, index) => <button key={character.id} id={`cast-tab-${character.id}`} ref={(el) => tabs.current[index] = el} role="tab" aria-selected={selected === index} aria-label={character.name} aria-controls="cast-panel" tabIndex={selected === index ? 0 : -1} className={`cast-tab ${selected === index ? 'active' : ''}`} onClick={() => select(index)} onKeyDown={(event) => keys(event, index)}><span className="cast-tab-art"><img src={character.thumbnail} alt="" style={{ objectPosition: character.position }} loading="lazy"/><span>{String(index + 1).padStart(2, '0')}</span></span><span className="cast-tab-name">{character.name}</span></button>)}</div></div>

    <div className="cast-stage reveal" ref={stage}>
      <div id="cast-panel" className="cast-panel" role="tabpanel" aria-labelledby={`cast-tab-${active.id}`} tabIndex={0}>
        <div className="cast-image-wrap"><img className="cast-portrait" src={active.image} alt={active.name} style={{ objectPosition: active.position }} loading="lazy" decoding="async"/><span className="cast-image-caption">ESCOLHIDO PELA EMANUELLE</span><span className="cast-image-index">{String(selected + 1).padStart(2, '0')}<small>/ 09</small></span></div>
        <div className="cast-copy"><div className="cast-facts"><span className="eyebrow">NA LISTA DA MANU</span><span className="cast-series">{active.series}</span><h3>{active.name}</h3></div><div className="cast-comment" aria-live="polite" aria-atomic="true"><span className="eyebrow">PARECER DO GUSTAVO</span><p className="handwritten">“{active.line}”</p><span className="cast-verdict"><HeartIcon size={13} weight="fill"/> GOSTO DELA DEVIDAMENTE REGISTRADO</span></div><div className="cast-controls"><span>Tem mais gente nessa lista…</span><button className="icon-button" onClick={() => select(selected - 1)} aria-label="Personagem anterior"><ArrowLeftIcon size={20}/></button><button className="icon-button" onClick={() => select(selected + 1)} aria-label="Próximo personagem"><ArrowRightIcon size={20}/></button></div></div>
      </div>
    </div>

    <div className="cast-footer reveal"><span className="eyebrow">SEM RANKING. SEM DISCUSSÃO.</span><p className="handwritten">eu sigo aqui, fazendo site e ganhando apelido.</p><HeartIcon size={20} weight="thin" aria-hidden="true"/></div>
  </section>;
}
