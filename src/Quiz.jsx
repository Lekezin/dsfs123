import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRightIcon } from '@phosphor-icons/react';
import Kuromi from './Kuromi';

const answers = ['Nenhuma vez', '2 vezes', 'Mais de 10', 'Mais de 99999'];
const reactions = [
  'Só isso? O Gustavo discorda dessa contagem.',
  'Essa resposta foi passear. Os apelidos continuam aumentando.',
  'Quase, Manu… mas o Gustavo já perdeu a conta faz tempo.',
  'Clicou nela de novo? Ela também não acredita nesse número.',
  'Essa aqui fugiu, mas os apelidos não param de chegar.',
  'Vai aumentando esse número que uma hora a gente chega lá.',
];

function flightPositions(width, height) {
  const compact = width < 1100;
  const buttonWidth = compact ? Math.min(156, Math.floor((width - 56) / 2)) : 200;
  const padding = compact ? 20 : Math.max(30, Math.round(width * 0.035));
  const left = padding;
  const right = width - padding - buttonWidth;
  const top = compact ? (height < 640 ? 54 : height < 760 ? 62 : 77) : Math.max(108, Math.round(height * 0.13));
  const bottom = height - (compact ? 96 : 105);
  const positions = [
    { x: left, y: top, angle: -5 },
    { x: right, y: top + (compact ? 0 : 30), angle: 5 },
    { x: right, y: bottom, angle: -4 },
    { x: left, y: bottom - (compact ? 0 : 20), angle: 5 },
  ];
  if (!compact) positions.push({ x: left, y: Math.round(height * 0.53), angle: -6 }, { x: right, y: Math.round(height * 0.5), angle: 6 });
  return { positions, buttonWidth };
}

export default function Quiz({ onCorrect }) {
  const [escaped, setEscaped] = useState({});
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
  const root = useRef(null);
  const previousRects = useRef(null);
  const { positions, buttonWidth } = flightPositions(viewport.width, viewport.height);
  const remaining = answers.length - Object.keys(escaped).length;

  const capture = useCallback(() => {
    previousRects.current = new Map([...root.current.querySelectorAll('.answer')].map((button) => [button.dataset.answer, button.getBoundingClientRect()]));
  }, []);

  useEffect(() => {
    const resize = () => {
      capture();
      const width = window.innerWidth;
      const height = window.innerHeight;
      const count = flightPositions(width, height).positions.length;
      setEscaped((current) => {
        const used = new Set();
        return Object.fromEntries(Object.entries(current).map(([answer, slot]) => {
          let next = slot % count;
          while (used.has(next)) next = (next + 1) % count;
          used.add(next);
          return [answer, next];
        }));
      });
      setViewport({ width, height });
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [capture]);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from('.quiz-reveal', { y: 20, opacity: 0, duration: 0.75, stagger: 0.07, ease: 'power3.out', clearProps: 'transform' });
      gsap.from('.answer', { opacity: 0, duration: 0.65, stagger: 0.06, ease: 'power2.out', delay: 0.25 });
    }, root);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!previousRects.current) return;
    const before = previousRects.current;
    previousRects.current = null;
    const buttons = [...root.current.querySelectorAll('.answer')];
    gsap.killTweensOf(buttons);
    gsap.set(buttons, { clearProps: 'transform' });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tweens = buttons.map((button) => {
      const previous = before.get(button.dataset.answer);
      const after = button.getBoundingClientRect();
      if (!previous) return null;
      return gsap.fromTo(button, { x: previous.left - after.left, y: previous.top - after.top, scaleX: previous.width / after.width, scaleY: previous.height / after.height }, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.85, ease: 'power3.out', clearProps: 'transform' });
    });
    return () => tweens.forEach((tween) => tween?.kill());
  }, [escaped, round, viewport]);

  function choose(index) {
    if (index === 3) { onCorrect(); return; }
    capture();
    const occupied = new Set(Object.entries(escaped).filter(([key]) => Number(key) !== index).map(([, slot]) => slot));
    const previousSlot = escaped[index];
    const choices = positions.map((_, slot) => slot).filter((slot) => !occupied.has(slot) && slot !== previousSlot);
    const nextSlot = choices[(round + index) % choices.length];
    setEscaped((current) => ({ ...current, [index]: nextSlot }));
    setFeedback(reactions[round % reactions.length]);
    setRound((value) => value + 1);
  }

  return <div className="quiz-content" ref={root}>
    <div className="quiz-reveal gate-label"><span className="tiny-dot"/> UM CANTINHO FEITO PELO GUSTAVO</div>
    <div className="gate-mascot quiz-reveal"><Kuromi variant="classica"/><span className="handwritten">só entra quem sabe!</span></div>
    <h1 className="quiz-reveal">Primeiro,<br/><em>uma pergunta.</em></h1>
    <p className="quiz-question quiz-reveal">Quantas vezes a Emanuelle<br className="desktop-break"/> colocou apelido no Gustavo?</p>
    <div className="quiz-options"><div className={`answer-grid remaining-${remaining}`} aria-label="Alternativas da pergunta">{answers.map((text, index) => {
      const isEscaped = escaped[index] !== undefined;
      const position = isEscaped ? positions[escaped[index] % positions.length] : null;
      return <button key={text} data-answer={index} className={`answer ${isEscaped ? 'is-escaped' : ''}`} style={position ? { left: position.x, top: position.y, width: buttonWidth, '--escape-angle': `${position.angle}deg` } : undefined} onClick={() => choose(index)} aria-label={text} aria-describedby="quiz-feedback"><span className="answer-index">0{index + 1}</span>{text}<ArrowUpRightIcon size={18}/></button>;
    })}</div></div>
    <p id="quiz-feedback" className={`quiz-feedback ${feedback ? 'has-feedback' : ''}`} role="status" aria-live="polite">{feedback || 'Dica: o número de apelidos só aumenta.'}</p>
  </div>;
}
