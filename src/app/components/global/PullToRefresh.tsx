'use client';

import { useEffect, useRef, useState } from 'react';

// Distancia real (px) que hay que arrastrar para gatillar la recarga.
const TRIGGER = 90;
// Tope del desplazamiento visual del indicador.
const MAX_PULL = 110;
// Factor de seguimiento del indicador respecto al dedo.
const DAMPING = 0.6;

/**
 * Pull-to-refresh para el WebView nativo (Capacitor iOS/Android).
 *
 * Activo cuando: corre en Capacitor (ios/android), o en un host de desarrollo
 * (localhost / IP LAN), o si la URL trae `?ptr`. En la web pública normal no se
 * activa (el navegador ya trae su propio gesto de recarga).
 *
 * Soporta gesto táctil (móvil) y arrastre con ratón (para probar en escritorio).
 * Añade `?ptr=debug` para ver el recuadro de métricas en pantalla; en consola
 * siempre imprime `[PTR] …` cuando está activo.
 */
export default function PullToRefresh() {
  const [pull, setPull] = useState(0); // distancia cruda arrastrada (px)
  const [refreshing, setRefreshing] = useState(false);
  const [dbg, setDbg] = useState('');
  const [debug, setDebug] = useState(false);

  const pullRef = useRef(0);
  const peakRef = useRef(0); // pico máximo del gesto: en base a esto se decide el disparo
  const refreshingRef = useRef(false);
  const startY = useRef<number | null>(null);
  const pulling = useRef(false);
  const scrollerEl = useRef<HTMLElement | null>(null); // contenedor scrolleable (null = documento)
  const mouseDown = useRef(false);

  useEffect(() => {
    const platform = (window as any).Capacitor?.getPlatform?.();
    const isNative = platform === 'ios' || platform === 'android';
    const params = new URLSearchParams(window.location.search);
    const forced = params.has('ptr');
    const isDebug = params.get('ptr') === 'debug';
    const host = window.location.hostname;
    const isDevHost =
      host === 'localhost' ||
      host === '127.0.0.1' ||
      /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host);

    const active = isNative || forced || isDevHost;
    const verbose = active && (isDebug || isDevHost || forced);
    const log = (...a: any[]) => verbose && console.log('[PTR]', ...a);

    setDebug(isDebug);
    log('init', { platform, isNative, forced, isDevHost, active });
    if (!active) return;

    // Desactiva el pull-to-refresh / rebote nativo del navegador para que no compita.
    const prevOverscroll = document.documentElement.style.overscrollBehaviorY;
    document.documentElement.style.overscrollBehaviorY = 'contain';
    document.body.style.overscrollBehaviorY = 'contain';

    // Ancestro scrolleable real bajo el puntero (contenedor bajo el header, modal…).
    // Si no hay ninguno, el scroll es el del documento.
    const findScroller = (target: EventTarget | null): HTMLElement | null => {
      let el = target as HTMLElement | null;
      while (el && el !== document.body && el !== document.documentElement) {
        const oy = getComputedStyle(el).overflowY;
        if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 1) {
          return el;
        }
        el = el.parentElement;
      }
      return null;
    };
    const scrollTopOf = (el: HTMLElement | null) =>
      el ? el.scrollTop : window.scrollY || document.documentElement.scrollTop || 0;

    const setDist = (d: number) => {
      pullRef.current = d;
      setPull(d);
    };

    // --- núcleo compartido entre toque y ratón ---
    const begin = (clientY: number, target: EventTarget | null) => {
      if (refreshingRef.current) return;
      const scroller = findScroller(target);
      scrollerEl.current = scroller;
      const top = scrollTopOf(scroller);
      startY.current = top <= 0 ? clientY : null;
      pulling.current = false;
      peakRef.current = 0;
      log('begin', { clientY, scrollTop: Math.round(top), atTop: top <= 0, scroller: scroller?.className || 'document' });
    };

    const move = (clientY: number, preventDefault: () => void) => {
      if (startY.current === null || refreshingRef.current) return;

      const top = scrollTopOf(scrollerEl.current);
      if (top > 0) {
        if (pulling.current) {
          pulling.current = false;
          peakRef.current = 0;
          setDist(0);
        }
        startY.current = null;
        log('cancelado: el contenedor empezó a scrollear', { scrollTop: Math.round(top) });
        return;
      }

      const dy = clientY - startY.current;
      if (dy > 0) {
        pulling.current = true;
        const d = Math.min(TRIGGER * 1.8, dy);
        if (d > peakRef.current) peakRef.current = d;
        setDist(d);
        preventDefault(); // frena el scroll/rebote nativo durante el gesto (solo táctil)
        if (isDebug) setDbg(`pull=${Math.round(d)} peak=${Math.round(peakRef.current)}`);
      } else {
        setDist(0);
      }
    };

    const finish = () => {
      if (startY.current === null) {
        log('finish: sin gesto (no estaba en el tope)');
        return;
      }
      startY.current = null;
      const reached = peakRef.current;
      peakRef.current = 0;
      if (!pulling.current) {
        log('finish: sin pull');
        return;
      }
      pulling.current = false;

      const willReload = reached >= TRIGGER;
      log(`finish: peak=${Math.round(reached)} umbral=${TRIGGER} ->`, willReload ? 'RECARGAR' : 'cancelar');
      if (isDebug) setDbg(`END peak=${Math.round(reached)} -> ${willReload ? 'RELOAD' : 'cancel'}`);

      if (willReload) {
        refreshingRef.current = true;
        setRefreshing(true);
        setDist(TRIGGER);
        setTimeout(() => {
          log('window.location.reload()');
          window.location.reload();
        }, 400);
      } else {
        setDist(0);
      }
    };

    // --- táctil (móvil / WebView) ---
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        startY.current = null;
        return;
      }
      begin(e.touches[0].clientY, e.target);
    };
    const onTouchMove = (e: TouchEvent) => move(e.touches[0].clientY, () => e.preventDefault());
    const onTouchEnd = () => finish();

    // --- ratón (para probar en escritorio) ---
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      mouseDown.current = true;
      begin(e.clientY, e.target);
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!mouseDown.current) return;
      move(e.clientY, () => {});
    };
    const onMouseUp = () => {
      if (!mouseDown.current) return;
      mouseDown.current = false;
      finish();
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    document.addEventListener('touchcancel', onTouchEnd, { passive: true });
    document.addEventListener('mousedown', onMouseDown, { passive: true });
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseup', onMouseUp, { passive: true });

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchcancel', onTouchEnd);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.documentElement.style.overscrollBehaviorY = prevOverscroll;
      document.body.style.overscrollBehaviorY = '';
    };
  }, []);

  const progress = Math.min(1, pull / TRIGGER);
  const armed = progress >= 1;
  const hidden = pull === 0 && !refreshing;
  const offset = Math.min(MAX_PULL, pull * DAMPING);

  return (
    <>
      <div
        aria-hidden={hidden}
        style={{
          position: 'fixed',
          top: 'env(safe-area-inset-top, 0px)',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 60,
          transform: `translateY(${offset - 44}px)`,
          // Transición corta siempre activa para suavizar el seguimiento del dedo;
          // un poco más larga al soltar o volver al reposo.
          transition:
            refreshing || pull === 0
              ? 'transform 0.25s ease, opacity 0.2s ease'
              : 'transform 0.1s ease-out',
          opacity: hidden ? 0 : 1,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            style={{
              transformOrigin: 'center',
              transform: refreshing ? undefined : `rotate(${progress * 270}deg)`,
              animation: refreshing ? 'ptr-spin 0.7s linear infinite' : undefined,
            }}
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke={armed || refreshing ? '#6CB409' : '#9CA3AF'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={refreshing ? '40 60' : `${progress * 56} 60`}
            />
          </svg>
        </div>
        <style>{`@keyframes ptr-spin { to { transform: rotate(360deg); } }`}</style>
      </div>

      {debug && (
        <div
          style={{
            position: 'fixed',
            bottom: 8,
            left: 8,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.8)',
            color: '#0f0',
            font: '12px/1.4 monospace',
            padding: '6px 8px',
            borderRadius: 6,
            pointerEvents: 'none',
            maxWidth: '90vw',
          }}
        >
          PTR · {dbg || 'esperando gesto…'}
        </div>
      )}
    </>
  );
}
