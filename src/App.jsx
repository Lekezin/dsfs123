import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDownIcon, ArrowUpRightIcon, ArrowLeftIcon, ArrowRightIcon, HeartIcon, SparkleIcon, XIcon, CheckIcon, PlusIcon } from '@phosphor-icons/react';
import Kuromi, { kuromiArtwork } from './Kuromi';
import Characters from './Characters';
import Quiz from './Quiz';
import Letter from './Letter';
import LittleExtras from './LittleExtras';
import Player, { MiniPlayer, useAudio } from './Player';
import { gallery, photo, versions } from './content';
import { asset, heroCutout } from './assets';

gsap.registerPlugin(ScrollTrigger);
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Stars({ className = '' }) {
  return <div className={`stars ${className}`} aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <SparkleIcon key={i} weight={i % 3 === 0 ? 'fill' : 'regular'} style={{ '--i': i, left: `${(i * 29 + 7) % 96}%`, top: `${(i * 23 + 11) % 91}%`, width: `${i % 3 * 9 + 9}px` }}/>)}</div>;
}

function Gate({ onUnlock, audio }) {
  const [stage, setStage] = useState('intro');
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);
  const gateRef = useRef(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    const timer = setTimeout(() => setStage('quiz'), 1050);
    return () => { mounted.current = false; clearTimeout(timer); };
  }, []);
  async function unlock() {
    audio.start();
    setStage('loading');
    setFailed(false);
    setProgress(0);
    let completed = 0;
    // A entrada espera só o que é necessário para a primeira tela.
    const sources = [heroCutout, photo(versions[0].image), asset(kuromiArtwork.roxinha.src), asset('artwork/dynamite.webp')];
    const loads = sources.map((src) => new Promise((resolve) => {
      const image = new Image();
      const timeout = setTimeout(() => finish(false), 16000);
      let done = false;
      const finish = (ok) => {
        if (done) return;
        done = true;
        clearTimeout(timeout);
        completed += 1;
        if (mounted.current) setProgress(Math.round(completed / sources.length * 100));
        resolve(ok);
      };
      image.onload = () => finish(true);
      image.onerror = () => finish(false);
      image.src = src;
    }));
    const [results] = await Promise.all([Promise.all(loads), new Promise((r) => setTimeout(r, reducedMotion() ? 100 : 1300))]);
    if (!mounted.current) return;
    if (!results[0] || results.filter(Boolean).length < sources.length - 1) { setFailed(true); return; }
    if (reducedMotion()) { onUnlock(); return; }
    gsap.to(gateRef.current, { opacity: 0, y: -25, duration: 0.6, ease: 'power2.inOut', onComplete: onUnlock });
  }
  return <div className={`gate gate-${stage}`} ref={gateRef}>
    <Stars/>
    <img className="gate-photo gate-photo-one" src={photo('ela-sendo-ela', true)} alt=""/>
    <img className="gate-photo gate-photo-two" src={photo('platinada-retrato', true)} alt=""/>
    <span className="gate-edition">um presente, só seu.</span>
    <main className="gate-inner">
      {stage === 'intro' ? <div className="gate-intro"><Kuromi variant="bruxinha"/><p className="eyebrow">PREPARANDO UM POUQUINHO DE CARINHO</p><div className="intro-bar"><span/></div><span className="handwritten">pera aí, Manu…</span></div> : stage === 'quiz' ? <Quiz onCorrect={unlock}/> : <div className="gate-loading"><Kuromi variant="roxinha"/><span className="success-pill"><CheckIcon size={14}/> RESPOSTA CERTA</span><h1>Isso. E a contagem<br/><em>continua…</em></h1><p>Buscando as suas fotos e guardando cada detalhe.</p><div className="load-track" role="progressbar" aria-label="Carregando fotos" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ transform: `scaleX(${progress / 100})` }}/></div><div className="load-caption"><span>{failed ? 'Algumas fotos não carregaram.' : 'Abrindo o seu cantinho'}</span><span>{progress}%</span></div>{failed && <button className="dark-button" onClick={unlock}>Tentar carregar novamente <ArrowRightIcon/></button>}</div>}
    </main>
    <div className="gate-footer"><span>PARA EMANUELLE</span><HeartIcon size={13}/><span>COM AMOR, GUSTAVO</span></div>
  </div>;
}

function Callout({ className = '', children, path }) {
  return <div className={`callout ${className}`} aria-hidden="true"><span className="focus-square"/><svg viewBox="0 0 220 100" fill="none"><path d={path || 'M8 84H55L116 18H209'} stroke="currentColor" strokeWidth="1"/><circle cx="209" cy="18" r="2.5" fill="currentColor"/></svg><span className="handwritten">{children}</span></div>;
}

function Hero({ audio }) {
  const heroRef = useRef(null);
  useEffect(() => {
    if (reducedMotion() || !window.matchMedia('(pointer: fine)').matches) return;
    const root = heroRef.current;
    const items = [...root.querySelectorAll('[data-depth]')].map((el) => ({
      depth: Number(el.dataset.depth),
      x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3.out' }),
    }));
    const move = (e) => { const rect = root.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width - 0.5; const y = (e.clientY - rect.top) / rect.height - 0.5; items.forEach((item) => { item.x(x * item.depth); item.y(y * item.depth); }); };
    const reset = () => items.forEach((item) => { item.x(0); item.y(0); });
    root.addEventListener('pointermove', move); root.addEventListener('pointerleave', reset);
    return () => { root.removeEventListener('pointermove', move); root.removeEventListener('pointerleave', reset); items.forEach((item) => { item.x.tween.kill(); item.y.tween.kill(); }); };
  }, []);
  return <section className="hero" id="voce" ref={heroRef} aria-labelledby="hero-title">
    <div className="hero-backdrop" aria-hidden="true"/>
    <div className="hero-vignette" aria-hidden="true"/>
    <Stars className="hero-stars"/>
    <div className="hero-panel glass">
      <div className="hero-panel-top hero-enter"><span className="eyebrow"><span className="tiny-dot"/> UMA COLEÇÃO DOS SEUS JEITOS</span><span className="hero-number">01 <span>/ 07</span></span></div>
      <div className="hero-title-layer" data-depth="-17"><div className="hero-enter"><span className="hero-pretitle">minha pessoa favorita tem nome.</span><h1 id="hero-title">Emanuelle<span>.</span></h1><span className="hero-signature handwritten">e todos os seus jeitos.</span></div></div>
      <div className="hero-description hero-enter"><p>Você muda o cabelo.<br/>Eu continuo sem saber lidar<br/>com o quanto acho você linda.</p><a href="#versoes" className="text-link">Vem se ver pelos meus olhos <ArrowUpRightIcon size={18}/></a></div>
      <div className="hero-subject-layer" data-depth="32"><img className="hero-portrait" src={heroCutout} width="1254" height="1254" alt="Emanuelle de cabelo avermelhado, sentada e olhando para o lado" fetchPriority="high"/></div>
      <div className="hero-sticker hero-enter" data-depth="48"><Kuromi variant="roxinha"/><span className="sticker-caption">approved by kuromi</span></div>
      <div className="hero-callouts" data-depth="16"><Callout className="hair-callout">meu ponto fraco</Callout><Callout className="person-callout" path="M8 12H62L121 79H209">sim, é por ela.</Callout></div>
      <div className="hero-player hero-enter"><Player audio={audio}/></div>
      <span className="hero-dedication handwritten hero-enter">feita de muitas versões.<br/>favorita em todas.</span>
      <a href="#versoes" className="hero-scroll hero-enter"><span>TEM MAIS DE VOCÊ AQUI EMBAIXO</span><ArrowDownIcon size={22}/></a>
      <div className="hero-side-mark" aria-hidden="true">EMANUELLE THROUGH MY EYES</div>
    </div>
    <div className="hero-footnote"><span>UM PRESENTE DO GUSTAVO</span><span>FEITO COM CARINHO, E UM POUCO DE SAUDADE.</span><span>ROLE PARA DESCOBRIR <ArrowDownIcon size={12}/></span></div>
  </section>;
}

function Versions() {
  const [selected, setSelected] = useState(0);
  const version = versions[selected];
  const slide = useRef(null);
  const buttons = useRef([]);
  useLayoutEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => { gsap.from('.version-photo', { opacity: 0, scale: 1.055, x: 16, duration: 0.7, ease: 'power3.out' }); gsap.from('.version-caption > *', { opacity: 0, y: 14, duration: 0.6, stagger: 0.07, ease: 'power3.out' }); }, slide);
    return () => ctx.revert();
  }, [selected]);
  const selectWithKeys = (event, i) => {
    let next = i;
    if (event.key === 'ArrowRight') next = (i + 1) % versions.length;
    else if (event.key === 'ArrowLeft') next = (i - 1 + versions.length) % versions.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = versions.length - 1;
    else return;
    event.preventDefault(); setSelected(next); buttons.current[next]?.focus();
  };
  return <section className="versions section-pad" id="versoes" aria-labelledby="versions-title" style={{ '--version-bg': version.background, '--version-ink': version.ink, '--version-accent': version.color }}>
    <div className="section-heading reveal"><div><span className="eyebrow section-kicker">01 — TODOS OS SEUS JEITOS</span><h2 id="versions-title">Tantas versões.<br/><em>A mesma favorita.</em></h2></div><p>Uma coleção que eu nunca<br/>vou conseguir parar de olhar.</p><SparkleIcon className="heading-sparkle" size={55} weight="thin"/></div>
    <div className="version-layout reveal" ref={slide}>
      <div className="version-picker"><span className="eyebrow">ESCOLHE UMA VERSÃO SUA</span><div role="tablist" aria-label="Versões da Emanuelle" className="version-tabs">{versions.map((item, i) => <button key={item.name} id={`version-tab-${i}`} ref={(el) => buttons.current[i] = el} role="tab" aria-selected={selected === i} tabIndex={selected === i ? 0 : -1} aria-controls="version-panel" className={`version-tab ${selected === i ? 'active' : ''}`} onClick={() => setSelected(i)} onKeyDown={(event) => selectWithKeys(event, i)}><img src={photo(item.image, true)} alt="" loading="lazy"/><span><small>{item.number}</small>{item.name}</span><ArrowUpRightIcon size={21}/></button>)}</div><p className="handwritten picker-note">spoiler: gosto de todas.<svg viewBox="0 0 130 50" fill="none" aria-hidden="true"><path d="M3 7c60 2 103 2 109 29m-15-5 16 8 5-17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg></p></div>
      <div role="tabpanel" id="version-panel" aria-labelledby={`version-tab-${selected}`} tabIndex={0} className="version-display"><div className="version-photo-wrap"><span className="version-giant-number" aria-hidden="true">{version.number}</span><img className="version-photo" src={photo(version.image)} alt={`Emanuelle: ${version.name.toLowerCase()}`} loading="lazy"/><span className="photo-corner top-left"/><span className="photo-corner bottom-right"/><span className="version-stamp">A MINHA<br/><HeartIcon weight="fill" size={18}/><br/>FAVORITA</span></div><div className="version-caption" aria-live="polite"><span className="eyebrow">EMANUELLE, {version.name.toUpperCase()}</span><h3>{version.title}</h3><p>{version.note}</p></div></div>
    </div>
    <div className="version-footer reveal"><span>MUDA O CORTE. MUDA A COR.</span><span className="handwritten">O carinho fica.</span><HeartIcon size={20}/></div>
  </section>;
}

function PhotoDialog({ item, onClose, onChange }) {
  const dialog = useRef(null);
  useEffect(() => {
    const el = dialog.current;
    el.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const keys = (event) => { if (event.key === 'ArrowRight') onChange(1); if (event.key === 'ArrowLeft') onChange(-1); };
    el.addEventListener('keydown', keys);
    return () => { el.removeEventListener('keydown', keys); document.body.style.overflow = oldOverflow; };
  }, [onChange]);
  return <dialog className="photo-dialog" ref={dialog} onCancel={onClose} onClick={(e) => { if (e.target === dialog.current) onClose(); }} aria-label="Foto ampliada da Emanuelle"><button className="dialog-close icon-button" aria-label="Fechar foto" onClick={onClose} autoFocus><XIcon size={26}/></button><div className="dialog-inner"><button className="dialog-previous icon-button" aria-label="Foto anterior" onClick={() => onChange(-1)}><ArrowLeftIcon size={25}/></button><figure><img src={photo(item.image)} alt={item.caption}/><figcaption><span className="handwritten">{item.caption}</span><span className="eyebrow">{item.tag}</span></figcaption></figure><button className="dialog-next icon-button" aria-label="Próxima foto" onClick={() => onChange(1)}><ArrowRightIcon size={25}/></button></div></dialog>;
}

function Gallery() {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState(null);
  const opener = useRef(null);
  const grid = useRef(null);
  const visible = expanded ? gallery : gallery.slice(0, 8);
  useEffect(() => {
    if (!expanded || reducedMotion()) { ScrollTrigger.refresh(); return; }
    const ctx = gsap.context(() => gsap.from('.photo-card:nth-child(n+9)', { y: 45, opacity: 0, stagger: 0.045, duration: 0.7, ease: 'power3.out', onComplete: () => ScrollTrigger.refresh() }), grid);
    return () => ctx.revert();
  }, [expanded]);
  const close = useCallback(() => { setActive(null); requestAnimationFrame(() => opener.current?.focus()); }, []);
  const change = useCallback((direction) => { setActive((n) => (n + direction + gallery.length) % gallery.length); }, []);
  return <section className="gallery-section section-pad" id="mural" aria-labelledby="gallery-title">
    <div className="section-heading reveal"><div><span className="eyebrow section-kicker">02 — MINHA COLEÇÃO FAVORITA</span><h2 id="gallery-title">Eu guardaria<br/><em>todas essas.</em></h2></div><div className="gallery-heading-note"><span className="handwritten">e mais umas mil…</span><p>Um mural dos seus jeitos.<br/>Toque nas fotos pra olhar de perto.</p></div><span className="gallery-count">{gallery.length}<small>FOTOS.<br/>UMA SÓ VOCÊ.</small></span></div>
    <div className="scrapbook reveal" ref={grid}>{visible.map((item, i) => <button key={item.image} className={`photo-card photo-${item.shape} photo-card-${i % 4}`} style={{ '--photo-rotate': `${[ -4, 3, -2, 4, 2, -3, 3, -2 ][i % 8]}deg`, '--delay': `${i % 4 * 0.2}s` }} onClick={(event) => { opener.current = event.currentTarget; setActive(i); }} aria-label={`Ampliar foto: ${item.caption}`}><span className={`tape tape-${i % 3}`} aria-hidden="true"/><div className="polaroid-image"><img src={photo(item.image, true)} srcSet={`${photo(item.image, true)} 340w, ${photo(item.image)} 1080w`} sizes="(max-width: 700px) 45vw, (max-width: 1000px) 28vw, 22vw" alt={item.caption} loading="lazy" decoding="async"/><span className="photo-open"><PlusIcon size={21}/></span></div><span className="polaroid-caption handwritten">{item.caption}</span><span className="photo-index">{String(i + 1).padStart(2, '0')} / E.</span>{i === 1 && <span className="polaroid-heart"><HeartIcon size={30} weight="fill"/></span>}{i === 3 && <span className="photo-kuromi"><Kuromi variant="amigos"/></span>}</button>)}</div>
    {!expanded && <button className="outline-button gallery-more" onClick={() => setExpanded(true)}>Ainda tem mais dela <PlusIcon size={18}/><span>+{gallery.length - 8}</span></button>}
    <div className="gallery-bottom-note reveal"><svg viewBox="0 0 160 65" fill="none" aria-hidden="true"><path d="M5 4c69 1 122 0 130 46m-14-9 16 14 9-21" stroke="currentColor" strokeWidth="1.4"/></svg><span className="handwritten">meu rolo de câmera<br/>agradece sua existência.</span><SparkleIcon size={28}/></div>
    {active !== null && <PhotoDialog item={gallery[active]} onClose={close} onChange={change}/>}
  </section>;
}

function LittleThings() {
  return <section className="little-things section-pad" aria-labelledby="things-title"><Stars/><span className="eyebrow reveal">04 — E TEM OS DETALHES</span><h2 id="things-title" className="reveal">Tem coisa que<br/><em>é muito você.</em></h2><div className="things-layout"><div className="things-photo reveal"><img src={photo('ela-sendo-ela')} alt="Emanuelle fazendo uma careta e um sinal de paz" loading="lazy"/><span className="tape"/><span className="handwritten">essa aqui é a dona do site.</span></div><div className="things-notes"><article className="little-note reveal"><span className="note-number">01</span><div><h3>Os cabelos.</h3><p>Você troca o corte, muda a cor, inventa de novo. E eu ganho mais uma versão sua pra gostar.</p></div><svg className="draw-line" viewBox="0 0 220 20" fill="none" aria-hidden="true"><path d="M3 12c59-13 134-9 213-3M29 18c54-9 106-8 149-5" stroke="currentColor" strokeWidth="1.4"/></svg></article><article className="little-note reveal"><span className="note-number">02</span><div><h3>As caras e bocas.</h3><p>As fotos de modelo são lindas. Mas essa fazendo careta também tinha que ganhar um lugar especial.</p></div></article><article className="little-note reveal"><span className="note-number">03</span><div><h3>Os meus 99999 apelidos.</h3><p>Eu fiz um site inteiro pra você e ainda sei que vou ganhar outro apelido por causa disso.</p></div><HeartIcon className="note-heart" size={32} weight="thin"/></article></div></div><p className="things-signoff handwritten reveal">eu gosto de você até nos detalhes.</p></section>;
}

const MemoVersions = memo(Versions);
const MemoHero = memo(Hero);
const MemoGallery = memo(Gallery);
const MemoCharacters = memo(Characters);
const MemoLittleThings = memo(LittleThings);
const MemoLittleExtras = memo(LittleExtras);
const MemoLetter = memo(Letter);

export default function App() {
  const audioRef = useRef(null);
  const audio = useAudio(audioRef);
  const [unlocked, setUnlocked] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('voce');
  const mainRef = useRef(null);
  useEffect(() => { document.body.style.overflow = unlocked ? '' : 'hidden'; return () => { document.body.style.overflow = ''; }; }, [unlocked]);
  useLayoutEffect(() => {
    if (!unlocked) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro.from('.hero-panel', { opacity: 0, y: 40, duration: 1.3 }).from('.hero-portrait', { opacity: 0, y: 65, duration: 1.5 }, '-=1.05').from('.hero-enter', { opacity: 0, y: 24, stagger: 0.08, duration: 0.95 }, '-=1.15');
      intro.from('.hero-signature', { clipPath: 'inset(0 100% 0 0)', duration: 1.8, ease: 'power1.inOut' }, 0.9);
      gsap.utils.toArray('.reveal').forEach((el) => gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 94%', once: true } }));
      gsap.to('.hero-backdrop', { yPercent: 16, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.utils.toArray('.callout path, .draw-line path').forEach((path) => {
        const length = path.getTotalLength();
        gsap.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1.4, delay: path.closest('.hero') ? 1.5 : 0, scrollTrigger: { trigger: path.closest('.callout, .little-note'), start: 'top 90%', once: true } });
      });
    }, mainRef);
    const navTrigger = ScrollTrigger.create({ trigger: '.hero', start: 'top -80px', onEnter: () => setScrolled(true), onLeaveBack: () => setScrolled(false) });
    const sections = ['voce', 'versoes', 'mural', 'personagens', 'carta'];
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id); }), { rootMargin: '-10% 0px -65% 0px', threshold: 0 });
    sections.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    const motionObserver = new IntersectionObserver((entries) => entries.forEach((entry) => entry.target.classList.toggle('motion-paused', !entry.isIntersecting)), { rootMargin: '160px' });
    mainRef.current.querySelectorAll('section, .ticker').forEach((element) => motionObserver.observe(element));
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => { mm.revert(); navTrigger.kill(); observer.disconnect(); motionObserver.disconnect(); window.removeEventListener('load', refresh); };
  }, [unlocked]);
  return <><svg className="filter-defs" aria-hidden="true"><defs><filter id="liquid-refraction" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.009 0.014" numOctaves="1" seed="8" result="noise"/><feGaussianBlur in="noise" stdDeviation="4" result="softNoise"/><feDisplacementMap in="SourceGraphic" in2="softNoise" scale="9" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg><audio ref={audioRef} src={asset('audio/dynamite-bts.mp3')} preload="none" loop/>{!unlocked ? <Gate onUnlock={() => { setUnlocked(true); window.scrollTo(0, 0); }} audio={audio}/> : <>
    <a className="skip-link" href="#versoes">Pular para as fotos</a>
    <header className={`site-nav ${scrolled ? 'nav-scrolled' : ''}`}><nav aria-label="Seções da homenagem">{[['voce', 'Você'], ['versoes', 'Suas versões'], ['mural', 'O mural'], ['personagens', 'Em 2D'], ['carta', 'Uma carta']].map(([id, label]) => <a key={id} className={activeSection === id ? 'active' : ''} href={`#${id}`} aria-current={activeSection === id ? 'location' : undefined}>{label}</a>)}</nav><MiniPlayer audio={audio}/></header>
    <main ref={mainRef}><MemoHero audio={audio}/><div className="ticker" aria-hidden="true"><div>{Array.from({ length: 4 }, (_, i) => <span key={i}>TODAS AS SUAS VERSÕES <SparkleIcon weight="fill"/> MINHA PESSOA FAVORITA <HeartIcon weight="fill"/></span>)}</div></div><MemoVersions/><MemoGallery/><MemoCharacters/><MemoLittleThings/><MemoLittleExtras/><MemoLetter/></main>
    <footer className="site-footer"><a className="footer-wordmark handwritten" href="#voce">Emanuelle.</a><p>Um cantinho na internet.<br/>Um carinho inteiro pra você.</p><div><span>FEITO PELO GUSTAVO</span><HeartIcon size={14} weight="fill"/><span>COM AMOR, EM CADA DETALHE.</span></div><a className="back-to-top" href="#voce">Voltar pro começo <ArrowUpRightIcon size={17}/></a></footer>
  </>}</>;
}
