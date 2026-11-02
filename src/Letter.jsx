import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EnvelopeSimpleIcon, EyeIcon, EyeSlashIcon, HeartIcon, LockKeyIcon, SparkleIcon } from '@phosphor-icons/react';
import Kuromi from './Kuromi';
import { dedication } from './content';

export default function Letter() {
  const [opened, setOpened] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [error, setError] = useState('');
  const root = useRef(null);
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const paperRef = useRef(null);

  useEffect(() => {
    if (!promptVisible) return;
    ScrollTrigger.refresh();
    const frame = requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      inputRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [promptVisible]);

  useLayoutEffect(() => {
    ScrollTrigger.refresh();
    if (!opened) return;
    paperRef.current?.focus({ preventScroll: true });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => gsap.from('.letter-paper > *', { opacity: 0, y: 22, stagger: 0.07, duration: 0.9, ease: 'power3.out', onComplete: () => ScrollTrigger.refresh() }), root);
    return () => ctx.revert();
  }, [opened]);

  function envelope() {
    if (opened) { setOpened(false); return; }
    if (unlocked) { setOpened(true); return; }
    setPromptVisible((value) => !value);
    setError('');
  }

  function unlock(event) {
    event.preventDefault();
    if (passphrase.trim().toLocaleLowerCase('pt-BR') !== dedication.letterPassphrase.toLocaleLowerCase('pt-BR')) {
      setError('Quase, Manu… lembra da palavra do jeitinho que você escreveu?');
      inputRef.current?.focus({ preventScroll: true });
      return;
    }
    setError('');
    setPassphrase('');
    setUnlocked(true);
    setPromptVisible(false);
    setOpened(true);
  }

  return <section className="letter-section section-pad" id="carta" aria-labelledby="letter-title" ref={root}>
    <div className="stars" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <SparkleIcon key={i} style={{ '--i': i, left: `${(i * 29 + 7) % 96}%`, top: `${(i * 23 + 11) % 91}%`, width: `${i % 3 * 9 + 9}px` }}/>)}</div>
    <div className="letter-heading reveal"><span className="eyebrow">06 — SÓ MAIS UMA COISINHA</span><h2 id="letter-title">Esse cantinho é seu.<br/><em>Essa carta também.</em></h2><p>Algumas coisas eu quis deixar por escrito.</p></div>
    <div className={`envelope-area reveal ${opened ? 'opened' : ''}`}>
      <Kuromi className="letter-kuromi" variant="bruxinha"/>
      <button className="envelope-button" onClick={envelope} aria-expanded={opened || promptVisible} aria-controls="love-letter"><span className="envelope-back"/><span className="envelope-paper"><span className="handwritten">pra minha Manu,</span><HeartIcon size={26}/></span><span className="envelope-front"/><span className="envelope-flap"/><span className="envelope-seal">{promptVisible ? <LockKeyIcon size={24}/> : <HeartIcon size={24} weight="fill"/>}</span><span className="envelope-label">{opened ? 'GUARDAR A CARTA' : promptVisible ? 'CANCELAR' : unlocked ? 'LER DE NOVO' : 'TOQUE PARA ABRIR'} <EnvelopeSimpleIcon size={15}/></span></button>
      <span className="letter-side-note handwritten">tem um pouquinho<br/>de mim aqui dentro.</span>
    </div>
    <div id="love-letter" hidden={!opened && !promptVisible}>
      {promptVisible && !unlocked && <form className="letter-lock" ref={formRef} onSubmit={unlock} aria-label="Desbloquear a carta" noValidate>
        <span className="lock-medallion" aria-hidden="true"><LockKeyIcon size={23}/></span><span className="eyebrow">ESSA PARTE É SÓ SUA</span><h3>Uma palavrinha<br/><em>abre esse envelope.</em></h3><p id="letter-passphrase-hint">Aquela palavra que você mandou pro Gustavo.<br/>Do seu jeitinho, lembra?</p>
        <label htmlFor="letter-passphrase">Senha da carta</label><div className="letter-passphrase-field"><input ref={inputRef} id="letter-passphrase" type={showPassphrase ? 'text' : 'password'} value={passphrase} onChange={(event) => { setPassphrase(event.target.value); setError(''); }} placeholder="A nossa palavrinha…" autoComplete="off" autoCapitalize="none" spellCheck={false} maxLength={48} required aria-invalid={Boolean(error)} aria-describedby={`letter-passphrase-hint${error ? ' letter-passphrase-error' : ''}`}/><button type="button" className="icon-button" onClick={() => setShowPassphrase((value) => !value)} aria-label={showPassphrase ? 'Esconder senha' : 'Mostrar senha'}>{showPassphrase ? <EyeSlashIcon size={20}/> : <EyeIcon size={20}/>}</button></div>
        <p className="letter-passphrase-error" id="letter-passphrase-error" role="status" aria-live="polite">{error || 'Tem carinho até no errinho.'}</p><button className="dark-button" type="submit">Desbloquear minha carta <HeartIcon size={17}/></button>
      </form>}
      {opened && <article className="letter-paper" ref={paperRef} tabIndex={-1} aria-label="Carta do Gustavo para Emanuelle"><div className="letter-paper-top"><span className="eyebrow">DE GUSTAVO, PARA EMANUELLE</span><HeartIcon size={18}/></div>{dedication.letter.map((paragraph, i) => i === 0 ? <h3 key={paragraph} className="handwritten">{paragraph}</h3> : <p key={paragraph}>{paragraph}</p>)}<span className="letter-signature handwritten">{dedication.signature}</span><span className="letter-ps">P.S.: a resposta da pergunta continua aumentando.</span></article>}
    </div>
  </section>;
}
