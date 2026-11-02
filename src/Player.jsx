import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { asset } from './assets';
import { PlayIcon, PauseIcon, SkipBackIcon, ArrowCounterClockwiseIcon, SpeakerHighIcon, SpeakerSlashIcon, HeartIcon } from '@phosphor-icons/react';

const clock = (value) => `${Math.floor((value || 0) / 60)}:${String(Math.floor((value || 0) % 60)).padStart(2, '0')}`;

export function useAudio(audioRef) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.12);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.12;
    const play = () => setPlaying(true);
    const pause = () => setPlaying(false);
    const failed = () => setError(true);
    const listeners = { play, pause, error: failed };
    Object.entries(listeners).forEach(([event, fn]) => audio.addEventListener(event, fn));
    return () => Object.entries(listeners).forEach(([event, fn]) => audio.removeEventListener(event, fn));
  }, [audioRef]);
  const start = useCallback(() => {
    setError(false);
    const promise = audioRef.current.play();
    if (promise) promise.catch(() => setPlaying(false));
  }, [audioRef]);
  const toggle = useCallback(() => audioRef.current.paused ? start() : audioRef.current.pause(), [audioRef, start]);
  const seek = useCallback((time) => {
    const value = Number(time);
    if (!Number.isFinite(value)) return;
    const audio = audioRef.current;
    audio.currentTime = Math.max(0, Number.isFinite(audio.duration) ? Math.min(value, audio.duration) : value);
  }, [audioRef]);
  const changeVolume = useCallback((value) => {
    const n = Math.max(0, Math.min(1, Number(value)));
    if (!Number.isFinite(n)) return;
    audioRef.current.volume = n;
    setVolume(n);
    if (n > 0) { audioRef.current.muted = false; setMuted(false); }
  }, [audioRef]);
  const mute = useCallback(() => {
    const next = !audioRef.current.muted;
    audioRef.current.muted = next;
    setMuted(next);
  }, [audioRef]);
  return useMemo(() => ({ playing, volume, muted, error, start, toggle, seek, changeVolume, mute, ref: audioRef }), [playing, volume, muted, error, start, toggle, seek, changeVolume, mute, audioRef]);
}

// Só o player acompanha o relógio: a página e o retrato não renderizam a cada tick.
function usePlaybackProgress(audio) {
  const read = useCallback(() => ({ current: audio.ref.current?.currentTime || 0, duration: Number.isFinite(audio.ref.current?.duration) ? audio.ref.current.duration : 0 }), [audio.ref]);
  const [progress, setProgress] = useState(read);
  useEffect(() => {
    const element = audio.ref.current;
    const update = () => setProgress((previous) => {
      const next = read();
      return next.current === previous.current && next.duration === previous.duration ? previous : next;
    });
    const events = ['timeupdate', 'loadedmetadata', 'durationchange', 'seeked'];
    events.forEach((event) => element.addEventListener(event, update));
    update();
    return () => events.forEach((event) => element.removeEventListener(event, update));
  }, [audio.ref, read]);
  const seek = (value) => { audio.seek(value); setProgress(read()); };
  return { ...progress, seek };
}

export default function Player({ audio }) {
  const progress = usePlaybackProgress(audio);
  return <div className={`music-player glass ${audio.playing ? 'is-playing' : ''}`} aria-label="Player de Dynamite, BTS">
    <div className="player-top"><span className="eyebrow">A TRILHA DESSE CANTINHO</span><span className="equalizer" aria-hidden="true"><i/><i/><i/><i/></span></div>
    <div className="track-row">
      <div className="album-art"><img src={asset('artwork/dynamite.webp')} alt="Capa de Dynamite, do BTS" width="256" height="256"/></div>
      <div className="track-details"><strong>Dynamite</strong><span>BTS · uma música pra você</span></div>
      <HeartIcon size={20} weight="fill" className="track-heart" aria-hidden="true"/>
    </div>
    <div className="track-progress"><input aria-label="Posição da música" type="range" min="0" max={progress.duration || 1} value={progress.current} step="0.1" onChange={(e) => progress.seek(e.target.value)} style={{ '--range-fill': `${progress.duration ? progress.current / progress.duration * 100 : 0}%` }}/><div><span>{clock(progress.current)}</span><span>{clock(progress.duration)}</span></div></div>
    <div className="player-controls">
      <button className="icon-button" aria-label="Recomeçar música" onClick={() => audio.seek(0)}><SkipBackIcon size={21} weight="fill"/></button>
      <button className="play-button" aria-label={audio.playing ? 'Pausar música' : 'Tocar música'} onClick={audio.toggle}>{audio.playing ? <PauseIcon size={22} weight="fill"/> : <PlayIcon size={22} weight="fill"/>}</button>
      <button className="icon-button" aria-label="Voltar dez segundos" onClick={() => audio.seek(Math.max(0, progress.current - 10))}><ArrowCounterClockwiseIcon size={21}/></button>
      <div className="volume-control"><button className="icon-button" onClick={audio.mute} aria-label={audio.muted ? 'Ativar som' : 'Silenciar música'}>{audio.muted || audio.volume === 0 ? <SpeakerSlashIcon size={18}/> : <SpeakerHighIcon size={18}/>}</button><input type="range" min="0" max="1" step="0.01" value={audio.muted ? 0 : audio.volume} onChange={(e) => audio.changeVolume(e.target.value)} aria-label="Volume"/></div>
    </div>
    {audio.error && <p className="audio-error" role="status">A música não carregou. Toque no play para tentar novamente.</p>}
  </div>;
}

export const MiniPlayer = memo(function MiniPlayer({ audio }) {
  return <button className={`mini-player glass ${audio.playing ? 'is-playing' : ''}`} onClick={audio.toggle} aria-label={audio.playing ? 'Pausar música' : 'Tocar música'}><span className="equalizer" aria-hidden="true"><i/><i/><i/><i/></span><span>Dynamite <small>· BTS</small></span>{audio.playing ? <PauseIcon size={15} weight="fill"/> : <PlayIcon size={15} weight="fill"/>}</button>;
});
