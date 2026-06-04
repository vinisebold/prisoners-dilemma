import { useRef, useEffect } from 'react';

/**
 * LampLightCanvas — Lustre com corda flexível (Verlet) e cone de luz radial.
 * 
 * DESIGN REALISTA E MALEÁVEL:
 *   - Simula a corda como uma corrente física de 12 segmentos (nós) via Integração de Verlet.
 *   - A colisão afasta os nós próximos ao cursor, permitindo que a corda dobre, curve e balance
 *     de forma orgânica ao "esbarrar" ou mover o mouse por ela.
 *   - A cúpula da lâmpada e a luz são desenhadas no espaço local do último segmento da corda.
 *     Quando a corda se dobra, a lâmpada e o feixe de luz giram e apontam na direção real da física.
 *   - Partículas de poeira são geradas e renderizadas diretamente dentro do espaço local do cone
 *     de luz, fazendo-as oscilar e acompanhar o balanço do holofote de forma realista.
 */
export default function LampLightCanvas({ isSettingsOpen }) {
  const canvasRef = useRef(null);

  // Inicializa os nós da corda flexível (Verlet)
  const pointsRef = useRef([]);
  // Inicializa as partículas de poeira internas
  const particlesRef = useRef([]);
  // Rastreia o estado das configurações na animação
  const isSettingsOpenRef = useRef(isSettingsOpen);
  isSettingsOpenRef.current = isSettingsOpen;
  // Controla a abertura da boca da lâmpada de forma fluida
  const mouthHeightRef = useRef(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W  = 1200;
    const H  = 1000;
    const cx = W / 2; // Centro horizontal da corda

    const ctx = canvas.getContext('2d');
    
    // Inicializa nós da corda caso não existam
    const numPoints = 16;
    const segLength = 8.8; // 8.8px por segmento ~ 132px de altura total, mantendo a lâmpada na posição correta
    if (pointsRef.current.length === 0) {
      for (let i = 0; i < numPoints; i++) {
        pointsRef.current.push({
          x: cx,
          y: i * segLength,
          oldX: cx,
          oldY: i * segLength,
          prevX: cx,
          prevY: i * segLength
        });
      }
    }
    const points = pointsRef.current;

    // Inicializa partículas de poeira caso não existam (com coordenadas globais e Z depth para paralaxe)
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 38; i++) {
        particlesRef.current.push({
          gx: cx + (Math.random() * 800 - 400),
          gy: Math.random() * 850 + 100,
          r: Math.random() * 0.9 + 0.35,
          z: Math.random() * 0.8 + 0.6, // Fator Z (profundidade) entre 0.6 e 1.4
          speedY: Math.random() * 0.12 + 0.04,
          speedX: Math.random() * 0.04 - 0.02
        });
      }
    }
    const particles = particlesRef.current;

    let rafId;
    const t0 = performance.now();
    let tLast = performance.now();
    let accumulator = 0;
    let physTime = 0;

    // Posição do mouse mapeada no canvas
    let mouseX = null;
    let mouseY = null;

    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * W;
      mouseY = ((e.clientY - rect.top) / rect.height) * H;
    }

    function handleMouseLeave() {
      mouseX = null;
      mouseY = null;
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const fixedDt = 0.016; // Timestep fixo para evitar jitter/stutter devido a variações de frame time

    function render(now) {
      const t = (now - t0) * 0.001;
      const rawDt = Math.min(0.1, (now - tLast) * 0.001); // Evita pular passos se a aba ficar em segundo plano
      tLast = now;

      accumulator += rawDt;

      // Executa os passos físicos em intervalos constantes de tempo
      while (accumulator >= fixedDt) {
        // Salva posições do passo anterior para interpolação
        for (let i = 0; i < numPoints; i++) {
          points[i].prevX = points[i].x;
          points[i].prevY = points[i].y;
        }

        // ──────────────────────────────────────────
        // CÁLCULO FÍSICO DO MALEÁVEL (VERLET CHAIN) - FIXED STEP
        // ──────────────────────────────────────────
        const gravity = 1200;      // Força de gravidade
        const friction = 0.982;    // Damping balanceado
        
        physTime += fixedDt;
        const wind = 12 * Math.sin(physTime * 0.7);

        // 1. Atualização Verlet
        for (let i = 1; i < numPoints; i++) {
          const p = points[i];
          const vx = (p.x - p.oldX) * friction;
          const vy = (p.y - p.oldY) * friction;

          p.oldX = p.x;
          p.oldY = p.y;

          p.x += vx;
          p.y += vy + gravity * fixedDt * fixedDt;

          // Adiciona força do vento
          p.x += wind * fixedDt * fixedDt;
        }

        // 2. Colisão Física Simples com o Mouse
        if (mouseX !== null && mouseY !== null) {
          for (let i = 1; i < numPoints; i++) {
            const p = points[i];
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 0.1) {
              const minRadius = 6;
              const maxRadius = 30;
              const solidRadius = minRadius + (maxRadius - minRadius) * (i / (numPoints - 1));

              if (dist < solidRadius) {
                const penetration = solidRadius - dist;
                p.x += (dx / dist) * penetration;
                p.y += (dy / dist) * penetration;
              }
            }
          }
        }

        // 3. Aplica restrições de distância (Constraint Solver) - 32 iterações para estabilidade
        for (let k = 0; k < 32; k++) {
          points[0].x = cx;
          points[0].y = 0;

          for (let i = 0; i < numPoints - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 0.001) continue;
            
            const diff = segLength - dist;
            const percent = (diff / dist) * 0.5;
            const offsetX = dx * percent;
            const offsetY = dy * percent;

            if (i === 0) {
              p2.x += offsetX * 2;
              p2.y += offsetY * 2;
            } else {
              p1.x -= offsetX;
              p1.y -= offsetY;
              p2.x += offsetX;
              p2.y += offsetY;
            }
          }
        }

        accumulator -= fixedDt;
      }

      // ──────────────────────────────────────────
      // RENDERIZAÇÃO
      // ──────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);

      // Interpolação suave de física para evitar stutters/jitters de frame timing (aliasing)
      const alpha = Math.max(0, Math.min(1, accumulator / fixedDt));
      const renderPoints = points.map(p => ({
        x: p.prevX + (p.x - p.prevX) * alpha,
        y: p.prevY + (p.y - p.prevY) * alpha
      }));

      // 1. Desenha a corda (curva suave maleável) usando coordenadas interpoladas
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(renderPoints[0].x, renderPoints[0].y);
      for (let i = 1; i < numPoints; i++) {
        ctx.lineTo(renderPoints[i].x, renderPoints[i].y);
      }
      ctx.strokeStyle = '#0a0a0a';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();

      // Posição final da lâmpada (interpolada)
      const lx = renderPoints[numPoints - 1].x;
      const ly = renderPoints[numPoints - 1].y;

      // Ângulo de rotação da lâmpada com base nos últimos segmentos da corda para evitar jittering
      const smoothLookAhead = 4;
      const refNode = renderPoints[numPoints - 1 - smoothLookAhead] || renderPoints[0];
      const lastAngle = Math.atan2(
        renderPoints[numPoints - 1].x - refNode.x,
        renderPoints[numPoints - 1].y - refNode.y
      );

      // ──────────────────────────────────────────
      // CÁLCULO DE ILUMINAÇÃO ARTIFICIAL (RAYTRACING COMPOSITOR)
      // ──────────────────────────────────────────
      const beamDirX = Math.sin(-lastAngle);
      const beamDirY = Math.cos(-lastAngle);

      function getPointLightIntensity(ox, oy) {
        const dx = ox - lx;
        const dy = oy - ly;
        
        // Projeta o vetor do objeto no vetor do feixe de luz
        const projection = dx * beamDirX + dy * beamDirY;
        if (projection < 0) return 0;
        
        // Ponto projetado na linha do feixe de luz
        const closestX = lx + beamDirX * projection;
        const closestY = ly + beamDirY * projection;
        
        // Distância do ponto ao centro do feixe
        const distToBeam = Math.sqrt((ox - closestX) ** 2 + (oy - closestY) ** 2);
        
        // Largura do cone de luz a esta distância projetada (inicia maior com 55)
        const coneWidth = 55 + projection * 0.44;
        
        // Fator de proximidade ao centro do feixe
        const insideBeamFactor = Math.max(0, 1 - distToBeam / (coneWidth * 1.1));
        // Fator de atenuação com a distância (mais fraco ao fundo)
        const distAttenuation = Math.max(0, 1 - projection / 850);
        
        return insideBeamFactor * distAttenuation;
      }

      // Calcula as intensidades nos componentes da mesa
      const intensityClipboard = getPointLightIntensity(210, 600);
      const intensityCompLeft   = getPointLightIntensity(640, 580);
      const intensityCompTop    = getPointLightIntensity(720, 500);
      const intensityCompRight  = getPointLightIntensity(800, 580);
      const intensityPrinter   = getPointLightIntensity(1180, 650);

      // Desvios das sombras com base na posição horizontal da lâmpada
      const shadowClipDx = 210 - lx;
      const shadowCompDx = 720 - lx;
      const shadowPrintDx = 1180 - lx;

      // Posição da poça de luz na mesa em % do viewport
      const sweepX = lx + (750 - ly) * Math.sin(-lastAngle);
      const isSettings = isSettingsOpenRef.current;
      const basePercent = isSettings ? 22 : 25;
      const screenOffsetVw = ((sweepX - 600) / 1200) * 100;
      const lightDeskPercent = basePercent + screenOffsetVw;

      if (typeof document !== 'undefined') {
        const rootStyle = document.documentElement.style;
        rootStyle.setProperty('--light-intensity-clipboard', intensityClipboard.toFixed(3));
        rootStyle.setProperty('--light-intensity-comp-left', intensityCompLeft.toFixed(3));
        rootStyle.setProperty('--light-intensity-comp-top', intensityCompTop.toFixed(3));
        rootStyle.setProperty('--light-intensity-comp-right', intensityCompRight.toFixed(3));
        rootStyle.setProperty('--light-intensity-printer', intensityPrinter.toFixed(3));

        rootStyle.setProperty('--clip-shadow-dx', `${shadowClipDx.toFixed(1)}px`);
        rootStyle.setProperty('--comp-shadow-dx', `${shadowCompDx.toFixed(1)}px`);
        rootStyle.setProperty('--print-shadow-dx', `${shadowPrintDx.toFixed(1)}px`);
        rootStyle.setProperty('--light-desk-x', `${lightDeskPercent.toFixed(1)}%`);
      }

      // 2. Transforma contexto para o espaço local da lâmpada para desenhar o cone e lâmpada
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(-lastAngle); // Gira o holofote junto com o balanço

      const ly_base = 38; // Base da lâmpada onde começa o cone de luz (mais baixa e larga)

      // Flicker suave da luz
      const raw =
        0.88 +
        0.05 * Math.sin(t * 2.1) +
        0.04 * Math.sin(t * 5.9) +
        0.02 * Math.sin(t * 14.3) +
        0.01 * Math.sin(t * 31.7);
      const f = Math.max(0.76, Math.min(1.0, raw));
      const color = '235,235,240';

      // ══════════════════════════════════════════
      // CAMADAS DO CONE DE LUZ (GRADIENTE RADIAL LOCAL)
      // ══════════════════════════════════════════
      // Camada 1 — Cone nítido (Sharp)
      const g1 = ctx.createRadialGradient(0, ly_base, 0, 0, ly_base, 150);
      g1.addColorStop(0,    `rgba(${color},${(0.30 * f).toFixed(3)})`);
      g1.addColorStop(0.30, `rgba(${color},${(0.18 * f).toFixed(3)})`);
      g1.addColorStop(0.70, `rgba(${color},${(0.05 * f).toFixed(3)})`);
      g1.addColorStop(1.0,  `rgba(${color},0)`);
      ctx.fillStyle = g1;

      ctx.beginPath();
      ctx.moveTo(-55, ly_base);
      ctx.lineTo(55, ly_base);
      ctx.lineTo(400, H);
      ctx.lineTo(-400, H);
      ctx.closePath();
      ctx.fill();

      // Camada 2 — Blur macio (15px)
      const g2 = ctx.createRadialGradient(0, ly_base, 0, 0, ly_base, 350);
      g2.addColorStop(0,    `rgba(${color},0)`);
      g2.addColorStop(0.15, `rgba(${color},${(0.18 * f).toFixed(3)})`);
      g2.addColorStop(0.45, `rgba(${color},${(0.10 * f).toFixed(3)})`);
      g2.addColorStop(0.75, `rgba(${color},${(0.03 * f).toFixed(3)})`);
      g2.addColorStop(1.0,  `rgba(${color},0)`);
      ctx.fillStyle = g2;

      ctx.save();
      ctx.filter = 'blur(15px)';
      ctx.beginPath();
      ctx.moveTo(-55, ly_base);
      ctx.lineTo(55, ly_base);
      ctx.lineTo(420, H);
      ctx.lineTo(-420, H);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Camada 3 — Blur médio-forte (40px)
      const g3 = ctx.createRadialGradient(0, ly_base, 0, 0, ly_base, 620);
      g3.addColorStop(0,    `rgba(${color},0)`);
      g3.addColorStop(0.15, `rgba(${color},0)`);
      g3.addColorStop(0.45, `rgba(${color},${(0.14 * f).toFixed(3)})`);
      g3.addColorStop(0.75, `rgba(${color},${(0.07 * f).toFixed(3)})`);
      g3.addColorStop(1.0,  `rgba(${color},0)`);
      ctx.fillStyle = g3;

      ctx.save();
      ctx.filter = 'blur(40px)';
      ctx.beginPath();
      ctx.moveTo(-55, ly_base);
      ctx.lineTo(55, ly_base);
      ctx.lineTo(450, H);
      ctx.lineTo(-450, H);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Camada 4 — Blur forte / Dissipação (80px)
      const g4 = ctx.createRadialGradient(0, ly_base, 0, 0, ly_base, 800);
      g4.addColorStop(0,    `rgba(${color},0)`);
      g4.addColorStop(0.30, `rgba(${color},0)`);
      g4.addColorStop(0.60, `rgba(${color},${(0.10 * f).toFixed(3)})`);
      g4.addColorStop(0.85, `rgba(${color},${(0.04 * f).toFixed(3)})`);
      g4.addColorStop(1.0,  `rgba(${color},0)`);
      ctx.fillStyle = g4;

      ctx.save();
      ctx.filter = 'blur(80px)';
      ctx.beginPath();
      ctx.moveTo(-55, ly_base);
      ctx.lineTo(55, ly_base);
      ctx.lineTo(490, H);
      ctx.lineTo(-490, H);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // ──────────────────────────────────────────
      // PARTÍCULAS DE POEIRA INTERNAS (Efeito Volumétrico com Paralaxe Real)
      // ──────────────────────────────────────────
      ctx.fillStyle = `rgba(255, 255, 255, ${(0.26 * f).toFixed(3)})`;
      const theta = -lastAngle;
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);

      for (let p of particles) {
        // Atualiza a posição global da poeira (drift lento e independente)
        p.gy -= p.speedY;
        p.gx += p.speedX;
        if (p.gy < 0) {
          p.gy = 900;
          p.gx = cx + (Math.random() * 800 - 400);
        }

        // Transforma a coordenada global da partícula para o espaço local da luz rotacionada
        const dx = p.gx - lx;
        const dy = p.gy - (ly + ly_base);
        const localX = dx * cos + dy * sin;
        const localY = -dx * sin + dy * cos;

        // Calcula a largura da seção do cone de luz nesta altura local (maior com 55)
        const halfW = 55 + localY * 0.44;

        // Se estiver dentro da área iluminada pelo feixe de luz
        if (localY >= 0 && localY <= H) {
          // Aplica paralaxe secundário com base no fator de profundidade (Z) da poeira
          const parallaxShift = lastAngle * localY * (p.z - 1.0) * 0.3;
          const drawX = localX + parallaxShift;

          if (drawX >= -halfW && drawX <= halfW) {
            // Desenha a partícula no espaço transformado do canvas
            ctx.beginPath();
            ctx.arc(drawX, localY + ly_base, p.r, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      }

      ctx.restore(); // Restaura rotação para desenhar a cúpula da lâmpada de forma isolada

      // 3. Desenha a cúpula da lâmpada (Metal escuro + reflexo)
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(-lastAngle);

      const lampGrd = ctx.createRadialGradient(0, 8, 8, 0, 8, 52);
      lampGrd.addColorStop(0, '#3a3a3a');
      lampGrd.addColorStop(0.5, '#151515');
      lampGrd.addColorStop(1, '#050505');
      ctx.fillStyle = lampGrd;

      // Ajusta o aspecto de profundidade da lâmpada (boca da lâmpada) ao abrir configurações
      const targetMouthHeight = isSettingsOpenRef.current ? 18 : 9;
      mouthHeightRef.current += (targetMouthHeight - mouthHeightRef.current) * 0.08;
      const mouthHeight = mouthHeightRef.current;

      ctx.beginPath();
      ctx.ellipse(0, 16, 55, 36, 0, Math.PI, 0); // cúpula superior achatada
      // Conecta com a metade inferior da elipse (boca da lâmpada) para dar efeito de profundidade
      ctx.ellipse(0, 38, 55, mouthHeight, 0, 0, Math.PI, false);
      ctx.closePath();
      ctx.fill();

      // Abertura brilhante da lâmpada (glowing mouth)
      ctx.beginPath();
      ctx.ellipse(0, 38, 55, mouthHeight, 0, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(255, 255, 240, ${(0.95 * f).toFixed(3)})`;
      ctx.fill();
      ctx.strokeStyle = '#050505';
      ctx.lineWidth = 3.0; // borda mais espessa para a lâmpada maior
      ctx.stroke();

      ctx.restore();

      rafId = requestAnimationFrame(render);
    }

    rafId = requestAnimationFrame(render);
    
    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
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
