import { useRef, useEffect } from 'react';

/**
 * LampLightCanvas — Cone de luz com blur progressivo realista via Canvas 2D.
 * 
 * TRANSIÇÕES SUAVES ENTRE CAMADAS:
 *   - Os pontos de entrada (addColorStop) foram recalculados para permitir que a camada seguinte
 *     comece a se misturar gradualmente enquanto a anterior está se dissipando.
 *   - Isso suaviza a transição de tamanho do blur (0px -> 15px -> 40px -> 80px),
 *     eliminando degraus de nitidez/desfoque visíveis.
 */
export default function LampLightCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W  = 1200;
    const H  = 1000;
    const cx = W / 2; // Centro X do cone = 600

    const ctx = canvas.getContext('2d');
    let rafId;
    const t0 = performance.now();

    function render(now) {
      const t = (now - t0) * 0.001;

      // Flicker suave multi-frequência
      const raw =
        0.88 +
        0.05 * Math.sin(t * 2.1) +
        0.04 * Math.sin(t * 5.9) +
        0.02 * Math.sin(t * 14.3) +
        0.01 * Math.sin(t * 31.7);
      const f = Math.max(0.76, Math.min(1.0, raw));

      ctx.clearRect(0, 0, W, H);

      // Cor base desaturada
      const color = '235,235,240';

      // ══════════════════════════════════════════
      // CAMADA 1 — Cone nítido (Sharp)
      // R=150px. Desaparece em 150px de forma suave.
      // ══════════════════════════════════════════
      ctx.save();
      const g1 = ctx.createRadialGradient(cx, 0, 0, cx, 0, 150);
      g1.addColorStop(0,    `rgba(${color},${(0.30 * f).toFixed(3)})`);
      g1.addColorStop(0.30, `rgba(${color},${(0.18 * f).toFixed(3)})`);
      g1.addColorStop(0.70, `rgba(${color},${(0.05 * f).toFixed(3)})`);
      g1.addColorStop(1.0,  `rgba(${color},0)`);
      ctx.fillStyle = g1;

      ctx.beginPath();
      ctx.moveTo(cx - 32, 0);
      ctx.lineTo(cx + 32, 0);
      ctx.lineTo(cx + 400, H);
      ctx.lineTo(cx - 400, H);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // ══════════════════════════════════════════
      // CAMADA 2 — Blur macio (15px)
      // R=350px. Entra rápido e se estende suavemente.
      // ══════════════════════════════════════════
      ctx.save();
      ctx.filter = 'blur(15px)';
      const g2 = ctx.createRadialGradient(cx, 0, 0, cx, 0, 350);
      g2.addColorStop(0,    `rgba(${color},0)`);
      g2.addColorStop(0.15, `rgba(${color},${(0.18 * f).toFixed(3)})`);
      g2.addColorStop(0.45, `rgba(${color},${(0.10 * f).toFixed(3)})`);
      g2.addColorStop(0.75, `rgba(${color},${(0.03 * f).toFixed(3)})`);
      g2.addColorStop(1.0,  `rgba(${color},0)`);
      ctx.fillStyle = g2;

      ctx.beginPath();
      ctx.moveTo(cx - 32, 0);
      ctx.lineTo(cx + 32, 0);
      ctx.lineTo(cx + 420, H);
      ctx.lineTo(cx - 420, H);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // ══════════════════════════════════════════
      // CAMADA 3 — Blur médio-forte (40px)
      // R=620px. Começa a entrar aos 15% (y = 93px), sobrepondo-se suavemente.
      // ══════════════════════════════════════════
      ctx.save();
      ctx.filter = 'blur(40px)';
      const g3 = ctx.createRadialGradient(cx, 0, 0, cx, 0, 620);
      g3.addColorStop(0,    `rgba(${color},0)`);
      g3.addColorStop(0.15, `rgba(${color},0)`);
      g3.addColorStop(0.45, `rgba(${color},${(0.14 * f).toFixed(3)})`);
      g3.addColorStop(0.75, `rgba(${color},${(0.07 * f).toFixed(3)})`);
      g3.addColorStop(1.0,  `rgba(${color},0)`);
      ctx.fillStyle = g3;

      ctx.beginPath();
      ctx.moveTo(cx - 32, 0);
      ctx.lineTo(cx + 32, 0);
      ctx.lineTo(cx + 450, H);
      ctx.lineTo(cx - 450, H);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // ══════════════════════════════════════════
      // CAMADA 4 — Blur forte / Dissipação (80px)
      // R=800px. Começa a entrar aos 30% (y = 240px), suavizando o final.
      // ══════════════════════════════════════════
      ctx.save();
      ctx.filter = 'blur(80px)';
      const g4 = ctx.createRadialGradient(cx, 0, 0, cx, 0, 800);
      g4.addColorStop(0,    `rgba(${color},0)`);
      g4.addColorStop(0.30, `rgba(${color},0)`);
      g4.addColorStop(0.60, `rgba(${color},${(0.10 * f).toFixed(3)})`);
      g4.addColorStop(0.85, `rgba(${color},${(0.04 * f).toFixed(3)})`);
      g4.addColorStop(1.0,  `rgba(${color},0)`);
      ctx.fillStyle = g4;

      ctx.beginPath();
      ctx.moveTo(cx - 32, 0);
      ctx.lineTo(cx + 32, 0);
      ctx.lineTo(cx + 490, H);
      ctx.lineTo(cx - 490, H);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      rafId = requestAnimationFrame(render);
    }

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hanging-lamp-light-canvas"
      width={1200}
      height={1000}
    />
  );
}
