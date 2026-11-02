import { useEffect, useRef, useState } from 'react';
import { ArrowCounterClockwiseIcon, FlowerIcon, HeartIcon, PlayIcon, SparkleIcon } from '@phosphor-icons/react';
import { littleExtras } from './content';
import './little-extras.css';

export default function LittleExtras() {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    let visible = false;
    let active = true;

    function syncPlayback() {
      video.autoplay = visible && !document.hidden;
      if (video.autoplay) {
        video.play().catch((reason) => {
          if (active && visible && !document.hidden && reason.name !== 'AbortError') setStatus('paused');
        });
      } else video.pause();
    }

    // Restart explicitly because mobile WebKit can pause after a native loop.
    function repeat() {
      video.currentTime = 0;
      syncPlayback();
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.2;
      syncPlayback();
    }, { threshold: 0.2 });
    observer.observe(video);
    video.addEventListener('ended', repeat);
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      active = false;
      observer.disconnect();
      video.removeEventListener('ended', repeat);
      document.removeEventListener('visibilitychange', syncPlayback);
      video.pause();
    };
  }, []);

  function play() {
    const video = videoRef.current;
    if (video.ended) video.currentTime = 0;
    setError(false);
    video.play().catch(() => { setError(true); setStatus('paused'); });
  }

  return <section className="extras-section section-pad" id="conversas" aria-labelledby="conversations-title">
    <div className="extras-heading reveal"><div><span className="eyebrow section-kicker">05 — NOSSO ASSUNTO RENDE</span><h2 id="conversations-title">Em 50×.<br/><em>E ainda tem assunto.</em></h2></div><div className="extras-heading-note"><p>{littleExtras.conversationText}</p><span className="handwritten">a gente é bem sucinto, né?</span></div></div>

    <figure className="conversation-film reveal">
      <div className="film-topline"><span><HeartIcon size={12} weight="fill"/> UM PEDACINHO DA GENTE</span><span className="speed-sticker">50× <SparkleIcon size={12}/></span></div>
      <div className="conversation-screen">
        <video ref={videoRef} controls muted playsInline preload="none" poster={littleExtras.videoPoster} aria-label="Vídeo de uma prévia da nossa conversa no WhatsApp" aria-describedby="conversation-caption" onPlaying={() => { setStatus('playing'); setError(false); }} onPause={() => setStatus(videoRef.current?.ended ? 'ended' : 'paused')} onError={() => setError(true)}>
          <source src={littleExtras.video} type="video/mp4"/>
          Seu navegador não conseguiu mostrar esse vídeo. <a href={littleExtras.video}>Abrir o vídeo da conversa</a>.
        </video>
        {status !== 'playing' && <button className="conversation-play" onClick={play} aria-label={status === 'ended' ? 'Rever nossa conversa' : status === 'paused' ? 'Continuar nossa conversa' : 'Dar play na nossa conversa'}>{status === 'ended' ? <ArrowCounterClockwiseIcon size={24}/> : <PlayIcon size={23} weight="fill"/>}<span>{status === 'ended' ? 'MAIS UMA VEZ?' : status === 'paused' ? 'CONTINUAR ASSISTINDO' : 'DAR PLAY NO NOSSO PAPO'}</span></button>}
      </div>
      <figcaption id="conversation-caption"><span>Esse é só um pedacinho. A conversa continua.</span><span className="handwritten">e eu ainda tenho coisa pra te contar.</span></figcaption>
      {error && <p className="conversation-error" role="status">O vídeo não abriu. Você pode <a href={littleExtras.video} target="_blank" rel="noreferrer">assistir por aqui</a> ou tentar o play de novo.</p>}
    </figure>

    <aside className="bouquet-card reveal" id="para-minha-sogra" aria-labelledby="mother-title">
      <span className="bouquet-tape" aria-hidden="true"/>
      <div className="bouquet-art"><picture><source media="(prefers-reduced-motion: reduce)" srcSet={littleExtras.bouquetStill}/><img src={littleExtras.bouquet} alt="Personagem de Jujutsu Kaisen oferecendo uma flor vermelha" width="480" height="480" loading="lazy" decoding="async"/></picture><span className="bouquet-dedication handwritten">esse aqui é pra senhora.</span></div>
      <div className="bouquet-note"><span className="eyebrow"><FlowerIcon size={13}/> UM P.S. PRA MINHA SOGRA</span><h3 id="mother-title">{littleExtras.motherTitle}<br/><em>Tome esse buquê.</em></h3><p>{littleExtras.motherNote}</p><span className="handwritten bouquet-signature">{littleExtras.motherSignature}</span><HeartIcon className="bouquet-heart" size={35} weight="thin" aria-hidden="true"/></div>
    </aside>
  </section>;
}
