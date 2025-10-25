import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Download, Settings, Moon, Sun, Code, BookOpen, Database, Cpu, Network, Lock, ArrowRight, Sparkles } from 'lucide-react';

const CS_TOPICS = [
  { id: 'algorithms', name: 'Algorithms & Data Structures', icon: '🔢' },
  { id: 'databases', name: 'Databases', icon: '💾' },
  { id: 'networking', name: 'Computer Networks', icon: '🌐' },
  { id: 'os', name: 'Operating Systems', icon: '⚙️' },
  { id: 'security', name: 'Cybersecurity', icon: '🔒' },
  { id: 'ai', name: 'Artificial Intelligence', icon: '🤖' },
  { id: 'web', name: 'Web Development', icon: '🌍' },
  { id: 'mobile', name: 'Mobile Development', icon: '📱' },
  { id: 'software', name: 'Software Engineering', icon: '💻' },
  { id: 'theory', name: 'Theory of Computation', icon: '📐' },
  { id: 'graphics', name: 'Computer Graphics', icon: '🎨' },
  { id: 'cloud', name: 'Cloud Computing', icon: '☁️' }
];

// Prism Component for 3D Background
const Prism = ({ 
  height = 3.5, 
  baseWidth = 5.5, 
  glow = 1.5, 
  scale = 3.6,
  hueShift = 3.14,
  colorFrequency = 1,
  bloom = 1.2,
  timeScale = 0.3
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const H = Math.max(0.001, height);
    const BW = Math.max(0.001, baseWidth);
    const BASE_HALF = BW * 0.5;
    const GLOW = Math.max(0.0, glow);
    const SCALE = Math.max(0.001, scale);
    const HUE = hueShift || 0;
    const CFREQ = Math.max(0.0, colorFrequency || 1);
    const BLOOM = Math.max(0.0, bloom || 1);
    const TS = Math.max(0, timeScale || 1);

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const renderer = new Renderer({ dpr, alpha: true, antialias: false });
    const gl = renderer.gl;
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    Object.assign(gl.canvas.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      display: 'block'
    });
    container.appendChild(gl.canvas);

    const vertex = `
      attribute vec2 position;
      void main() { gl_Position = vec4(position, 0.0, 1.0); }
    `;

    const fragment = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uHeight;
      uniform float uBaseHalf;
      uniform mat3 uRot;
      uniform float uGlow;
      uniform float uScale;
      uniform float uHueShift;
      uniform float uColorFreq;
      uniform float uBloom;
      uniform float uCenterShift;
      uniform float uInvBaseHalf;
      uniform float uInvHeight;
      uniform float uMinAxis;
      uniform float uPxScale;
      uniform float uTimeScale;

      vec4 tanh4(vec4 x){
        vec4 e2x = exp(2.0*x);
        return (e2x - 1.0) / (e2x + 1.0);
      }

      float sdOctaAnisoInv(vec3 p){
        vec3 q = vec3(abs(p.x) * uInvBaseHalf, abs(p.y) * uInvHeight, abs(p.z) * uInvBaseHalf);
        float m = q.x + q.y + q.z - 1.0;
        return m * uMinAxis * 0.5773502691896258;
      }

      float sdPyramidUpInv(vec3 p){
        return max(sdOctaAnisoInv(p), -p.y);
      }

      mat3 hueRotation(float a){
        float c = cos(a), s = sin(a);
        mat3 W = mat3(0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114);
        mat3 U = mat3(0.701, -0.587, -0.114, -0.299, 0.413, -0.114, -0.300, -0.588, 0.886);
        mat3 V = mat3(0.168, -0.331, 0.500, 0.328, 0.035, -0.500, -0.497, 0.296, 0.201);
        return W + U * c + V * s;
      }

      void main(){
        vec2 f = (gl_FragCoord.xy - 0.5 * iResolution.xy) * uPxScale;
        float z = 5.0;
        float d = 0.0;
        vec3 p;
        vec4 o = vec4(0.0);

        for (int i = 0; i < 100; i++) {
          p = uRot * vec3(f, z);
          vec3 q = p;
          q.y += uCenterShift;
          d = 0.1 + 0.2 * abs(sdPyramidUpInv(q));
          z -= d;
          o += (sin((p.y + z) * uColorFreq + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0) / d;
        }

        o = tanh4(o * o * (uGlow * uBloom) / 1e5);
        vec3 col = clamp(hueRotation(uHueShift) * o.rgb, 0.0, 1.0);
        gl_FragColor = vec4(col, o.a * 0.3);
      }
    `;

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iResolution: { value: new Float32Array(2) },
        iTime: { value: 0 },
        uHeight: { value: H },
        uBaseHalf: { value: BASE_HALF },
        uRot: { value: new Float32Array([1,0,0,0,1,0,0,0,1]) },
        uGlow: { value: GLOW },
        uScale: { value: SCALE },
        uHueShift: { value: HUE },
        uColorFreq: { value: CFREQ },
        uBloom: { value: BLOOM },
        uCenterShift: { value: H * 0.25 },
        uInvBaseHalf: { value: 1 / BASE_HALF },
        uInvHeight: { value: 1 / H },
        uMinAxis: { value: Math.min(BASE_HALF, H) },
        uPxScale: { value: 1 / ((gl.drawingBufferHeight || 1) * 0.1 * SCALE) },
        uTimeScale: { value: TS }
      }
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      renderer.setSize(container.clientWidth || 1, container.clientHeight || 1);
      program.uniforms.iResolution.value[0] = gl.drawingBufferWidth;
      program.uniforms.iResolution.value[1] = gl.drawingBufferHeight;
      program.uniforms.uPxScale.value = 1 / ((gl.drawingBufferHeight || 1) * 0.1 * SCALE);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    const rotBuf = new Float32Array(9);
    const setMat3 = (yaw, pitch, roll, out) => {
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const cx = Math.cos(pitch), sx = Math.sin(pitch);
      const cz = Math.cos(roll), sz = Math.sin(roll);
      out[0] = cy*cz + sy*sx*sz; out[1] = cx*sz; out[2] = -sy*cz + cy*sx*sz;
      out[3] = -cy*sz + sy*sx*cz; out[4] = cx*cz; out[5] = sy*sz + cy*sx*cz;
      out[6] = sy*cx; out[7] = -sx; out[8] = cy*cx;
      return out;
    };

    const t0 = performance.now();
    const render = t => {
      const time = (t - t0) * 0.001 * TS;
      program.uniforms.iTime.value = time;
      const yaw = time * 0.3;
      const pitch = Math.sin(time * 0.4) * 0.6;
      const roll = Math.sin(time * 0.2) * 0.5;
      program.uniforms.uRot.value = setMat3(yaw, pitch, roll, rotBuf);
      renderer.render({ scene: mesh });
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    return () => {
      ro.disconnect();
      if (gl.canvas.parentElement === container) container.removeChild(gl.canvas);
    };
  }, [height, baseWidth, glow, scale, hueShift, colorFrequency, bloom, timeScale]);

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
};

// Letter Glitch Background Component
const LetterGlitch = ({
  glitchColors = ['#00d4ff', '#0066ff', '#004d99'],
  glitchSpeed = 50,
  smooth = true,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01'
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const letters = useRef([]);
  const grid = useRef({ columns: 0, rows: 0 });
  const context = useRef(null);
  const lastGlitchTime = useRef(Date.now());

  const lettersAndSymbols = Array.from(characters);
  const fontSize = 16;
  const charWidth = 10;
  const charHeight = 20;

  const getRandomChar = () => lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
  const getRandomColor = () => glitchColors[Math.floor(Math.random() * glitchColors.length)];

  const hexToRgb = hex => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const interpolateColor = (start, end, factor) => {
    const result = {
      r: Math.round(start.r + (end.r - start.r) * factor),
      g: Math.round(start.g + (end.g - start.g) * factor),
      b: Math.round(start.b + (end.b - start.b) * factor)
    };
    return `rgb(${result.r}, ${result.g}, ${result.b})`;
  };

  const calculateGrid = (width, height) => ({
    columns: Math.ceil(width / charWidth),
    rows: Math.ceil(height / charHeight)
  });

  const initializeLetters = (columns, rows) => {
    grid.current = { columns, rows };
    const totalLetters = columns * rows;
    letters.current = Array.from({ length: totalLetters }, () => ({
      char: getRandomChar(),
      color: getRandomColor(),
      targetColor: getRandomColor(),
      colorProgress: 1
    }));
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    if (context.current) {
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const { columns, rows } = calculateGrid(rect.width, rect.height);
    initializeLetters(columns, rows);
    drawLetters();
  };

  const drawLetters = () => {
    if (!context.current || letters.current.length === 0) return;
    const ctx = context.current;
    const { width, height } = canvasRef.current.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = 'top';

    letters.current.forEach((letter, index) => {
      const x = (index % grid.current.columns) * charWidth;
      const y = Math.floor(index / grid.current.columns) * charHeight;
      ctx.fillStyle = letter.color;
      ctx.fillText(letter.char, x, y);
    });
  };

  const updateLetters = () => {
    if (!letters.current || letters.current.length === 0) return;
    const updateCount = Math.max(1, Math.floor(letters.current.length * 0.05));

    for (let i = 0; i < updateCount; i++) {
      const index = Math.floor(Math.random() * letters.current.length);
      if (!letters.current[index]) continue;

      letters.current[index].char = getRandomChar();
      letters.current[index].targetColor = getRandomColor();

      if (!smooth) {
        letters.current[index].color = letters.current[index].targetColor;
        letters.current[index].colorProgress = 1;
      } else {
        letters.current[index].colorProgress = 0;
      }
    }
  };

  const handleSmoothTransitions = () => {
    let needsRedraw = false;
    letters.current.forEach(letter => {
      if (letter.colorProgress < 1) {
        letter.colorProgress += 0.05;
        if (letter.colorProgress > 1) letter.colorProgress = 1;

        const startRgb = hexToRgb(letter.color);
        const endRgb = hexToRgb(letter.targetColor);
        if (startRgb && endRgb) {
          letter.color = interpolateColor(startRgb, endRgb, letter.colorProgress);
          needsRedraw = true;
        }
      }
    });

    if (needsRedraw) drawLetters();
  };

  const animate = () => {
    const now = Date.now();
    if (now - lastGlitchTime.current >= glitchSpeed) {
      updateLetters();
      drawLetters();
      lastGlitchTime.current = now;
    }

    if (smooth) handleSmoothTransitions();
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    context.current = canvas.getContext('2d');
    resizeCanvas();
    animate();

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        cancelAnimationFrame(animationRef.current);
        resizeCanvas();
        animate();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [glitchSpeed, smooth]);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#000000',
      overflow: 'hidden'
    }}>
      <canvas ref={canvasRef} style={{
        display: 'block',
        width: '100%',
        height: '100%',
        opacity: 0.25
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)'
      }} />
    </div>
  );
};

// Decrypted Text Animation Component
const DecryptedText = ({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  animateOn = 'view'
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let interval;
    let currentIteration = 0;

    const getNextIndex = revealedSet => {
      const textLength = text.length;
      switch (revealDirection) {
        case 'start':
          return revealedSet.size;
        case 'end':
          return textLength - 1 - revealedSet.size;
        case 'center': {
          const middle = Math.floor(textLength / 2);
          const offset = Math.floor(revealedSet.size / 2);
          const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;
          if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
            return nextIndex;
          }
          for (let i = 0; i < textLength; i++) {
            if (!revealedSet.has(i)) return i;
          }
          return 0;
        }
        default:
          return revealedSet.size;
      }
    };

    const availableChars = useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter(char => char !== ' ')
      : characters.split('');

    const shuffleText = (originalText, currentRevealed) => {
      if (useOriginalCharsOnly) {
        const positions = originalText.split('').map((char, i) => ({
          char,
          isSpace: char === ' ',
          index: i,
          isRevealed: currentRevealed.has(i)
        }));

        const nonSpaceChars = positions.filter(p => !p.isSpace && !p.isRevealed).map(p => p.char);

        for (let i = nonSpaceChars.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]];
        }

        let charIndex = 0;
        return positions
          .map(p => {
            if (p.isSpace) return ' ';
            if (p.isRevealed) return originalText[p.index];
            return nonSpaceChars[charIndex++];
          })
          .join('');
      } else {
        return originalText
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (currentRevealed.has(i)) return originalText[i];
            return availableChars[Math.floor(Math.random() * availableChars.length)];
          })
          .join('');
      }
    };

    if (isHovering) {
      setIsScrambling(true);
      interval = setInterval(() => {
        setRevealedIndices(prevRevealed => {
          if (sequential) {
            if (prevRevealed.size < text.length) {
              const nextIndex = getNextIndex(prevRevealed);
              const newRevealed = new Set(prevRevealed);
              newRevealed.add(nextIndex);
              setDisplayText(shuffleText(text, newRevealed));
              return newRevealed;
            } else {
              clearInterval(interval);
              setIsScrambling(false);
              return prevRevealed;
            }
          } else {
            setDisplayText(shuffleText(text, prevRevealed));
            currentIteration++;
            if (currentIteration >= maxIterations) {
              clearInterval(interval);
              setIsScrambling(false);
              setDisplayText(text);
            }
            return prevRevealed;
          }
        });
      }, speed);
    } else {
      setDisplayText(text);
      setRevealedIndices(new Set());
      setIsScrambling(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovering, text, speed, maxIterations, sequential, revealDirection, characters, useOriginalCharsOnly]);

  useEffect(() => {
    if (animateOn !== 'view' && animateOn !== 'both') return;

    const observerCallback = entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsHovering(true);
          setHasAnimated(true);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });
    
    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [animateOn, hasAnimated]);

  return (
    <span 
      ref={containerRef} 
      className={className}
      style={{ display: 'inline-block', whiteSpace: 'pre-wrap' }}
    >
      <span aria-hidden="true">
        {displayText.split('').map((char, index) => {
          const isRevealedOrDone = revealedIndices.has(index) || !isScrambling || !isHovering;
          return (
            <span key={index} style={{ opacity: isRevealedOrDone ? 1 : 0.7 }}>
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
};

// Typing Animation Component
const TypingText = ({ text, speed = 50, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span>
      {displayedText}
      <span style={{ opacity: showCursor ? 1 : 0 }}>|</span>
    </span>
  );
};

// Welcome Screen Component
const WelcomeScreen = ({ onStart, theme }) => {
  const [showButton, setShowButton] = useState(false);
  const accentColor = '#00ff88';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Letter Glitch Background */}
      <LetterGlitch 
        glitchColors={['#00ff88', '#00ff41', '#39ff14']}
        glitchSpeed={50}
        smooth={true}
        characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]();:."
      />

      {/* Main Content */}
      <div style={{
        textAlign: 'center',
        zIndex: 1,
        padding: '20px'
      }}>
        {/* Logo */}
        <div style={{
          marginBottom: '30px',
          animation: 'scaleIn 0.5s ease-out'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            margin: '0 auto',
            borderRadius: '30px',
            background: `linear-gradient(135deg, ${accentColor} 0%, #0066ff 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 20px 60px ${accentColor}40`,
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            <Code size={60} color="#fff" strokeWidth={2.5} />
          </div>
        </div>

        {/* Welcome Text */}
        <h1 style={{
          fontSize: 'clamp(32px, 6vw, 56px)',
          fontWeight: '800',
          margin: '0 0 20px 0',
          color: '#fff',
          textShadow: `0 0 20px ${accentColor}, 0 0 40px ${accentColor}`,
          letterSpacing: '-1px'
        }}>
          <TypingText 
            text="Welcome To CS Assistant" 
            speed={80}
            onComplete={() => setShowButton(true)}
          />
        </h1>

        <p style={{
          fontSize: 'clamp(16px, 2.5vw, 20px)',
          color: '#aaa',
          margin: '0 0 50px 0',
          maxWidth: '600px',
          lineHeight: '1.6',
          opacity: showButton ? 1 : 0,
          transition: 'opacity 0.5s ease',
          textAlign: 'center',
          zIndex: 1
        }}>
          <DecryptedText 
            text="Your intelligent Computer Science companion for all topics - from algorithms to cloud computing"
            speed={40}
            maxIterations={12}
            sequential={true}
            revealDirection="start"
            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=<>/?[]{}|~"
            animateOn="view"
          />
        </p>

        {/* Features */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          marginBottom: '50px',
          flexWrap: 'wrap',
          opacity: showButton ? 1 : 0,
          transition: 'opacity 0.5s ease 0.2s'
        }}>
          {[
            { icon: <Sparkles size={24} />, text: 'AI-Powered' },
            { icon: <BookOpen size={24} />, text: '12+ Topics' },
            { icon: <Cpu size={24} />, text: 'Instant Answers' }
          ].map((feature, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#fff',
              fontSize: '16px'
            }}>
              <div style={{ color: accentColor }}>
                {feature.icon}
              </div>
              <span>{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Start Button */}
        {showButton && (
          <button
            onClick={onStart}
            style={{
              padding: '18px 50px',
              fontSize: '18px',
              fontWeight: '700',
              color: '#000',
              background: `linear-gradient(135deg, ${accentColor} 0%, #39ff14 100%)`,
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: `0 10px 40px rgba(0,255,136,0.4)`,
              transition: 'all 0.3s ease',
              animation: 'slideUp 0.5s ease-out'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = `0 15px 50px rgba(0,255,136,0.6)`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = `0 10px 40px rgba(0,255,136,0.4)`;
            }}
          >
            Get Started
            <ArrowRight size={22} />
          </button>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes scaleIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes slideUp {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// Main Chatbot Component
export default function CSChatbot() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! I\'m your Computer Science Assistant. I can help you with any CS topic including algorithms, databases, networking, AI, and much more. What would you like to learn about today?', timestamp: new Date(), topic: null }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [quickQuestions] = useState([
    "What is Big O notation?",
    "Explain SQL vs NoSQL",
    "How does TCP/IP work?",
    "What are design patterns?",
    "Explain binary search trees"
  ]);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: input,
      timestamp: new Date(),
      topic: selectedTopic
    };

    setMessages(prev => [...prev, userMessage]);
    setSearchHistory(prev => [input, ...prev.slice(0, 9)]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: generateCSResponse(input),
        timestamp: new Date(),
        topic: detectTopic(input)
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const detectTopic = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('algorithm') || lowerText.includes('sort') || lowerText.includes('search')) return 'algorithms';
    if (lowerText.includes('database') || lowerText.includes('sql')) return 'databases';
    if (lowerText.includes('network') || lowerText.includes('tcp') || lowerText.includes('http')) return 'networking';
    if (lowerText.includes('security') || lowerText.includes('encryption')) return 'security';
    if (lowerText.includes('ai') || lowerText.includes('machine learning')) return 'ai';
    return null;
  };

  const generateCSResponse = (userInput) => {
    return `Great question about "${userInput}"! 

Based on my Computer Science knowledge base, here's what I can tell you:

This is a placeholder response. Once you connect your dataset, I'll provide detailed, accurate answers from your trained model.

🔗 **To integrate your model:**
1. Replace this function with an API call to your ML backend
2. Pass the user input to your model
3. Return the model's response

📚 Would you like to know more about this topic?`;
  };

  const clearChat = () => {
    setMessages([
      { id: 1, type: 'bot', text: 'Chat cleared! Ready to help with any Computer Science topic. What would you like to learn?', timestamp: new Date() }
    ]);
  };

  const exportChat = () => {
    const chatText = messages.map(m => 
      `[${m.timestamp.toLocaleTimeString()}] ${m.type.toUpperCase()}: ${m.text}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cs-chat-${Date.now()}.txt`;
    a.click();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    inputRef.current?.focus();
  };

  const bgColor = theme === 'dark' ? '#000000' : '#f5f7fa';
  const cardBg = theme === 'dark' ? '#0a0a0a' : '#ffffff';
  const textColor = theme === 'dark' ? '#e0e0e0' : '#1a1a1a';
  const borderColor = theme === 'dark' ? '#1a1a1a' : '#e0e0e0';
  const accentColor = '#00ff88';

  // Show welcome screen first
  if (!showChat) {
    return <WelcomeScreen onStart={() => setShowChat(true)} theme={theme} />;
  }

  // Show chatbot after welcome
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: bgColor,
      color: textColor,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 24px)',
        backgroundColor: cardBg,
        borderBottom: `2px solid ${accentColor}`,
        boxShadow: '0 4px 12px rgba(0,212,255,0.1)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.5vw, 12px)' }}>
          <div style={{
            width: 'clamp(40px, 6vw, 48px)',
            height: 'clamp(40px, 6vw, 48px)',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${accentColor} 0%, #39ff14 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,255,136,0.3)'
          }}>
            <Code size={window.innerWidth < 768 ? 24 : 28} color="#fff" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: '700', letterSpacing: '-0.5px' }}>
              CS Assistant
            </h1>
            <p style={{ margin: 0, fontSize: 'clamp(11px, 1.5vw, 13px)', color: '#888' }}>
              Your Computer Science Knowledge Hub
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 'clamp(6px, 1vw, 8px)' }}>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{
              padding: 'clamp(8px, 1.2vw, 10px)',
              backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f0f0f0',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              color: textColor,
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.2s'
            }}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={window.innerWidth < 768 ? 18 : 20} /> : <Moon size={window.innerWidth < 768 ? 18 : 20} />}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              padding: 'clamp(8px, 1.2vw, 10px)',
              backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f0f0f0',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              color: textColor,
              display: 'flex',
              alignItems: 'center'
            }}
            title="Settings"
          >
            <Settings size={window.innerWidth < 768 ? 18 : 20} />
          </button>
          <button
            onClick={exportChat}
            style={{
              padding: 'clamp(8px, 1.2vw, 10px)',
              backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f0f0f0',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              color: textColor,
              display: 'flex',
              alignItems: 'center'
            }}
            title="Export Chat"
          >
            <Download size={window.innerWidth < 768 ? 18 : 20} />
          </button>
          <button
            onClick={clearChat}
            style={{
              padding: 'clamp(8px, 1.2vw, 10px)',
              backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f0f0f0',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              color: '#ff4444',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Clear Chat"
          >
            <Trash2 size={window.innerWidth < 768 ? 18 : 20} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar - Settings */}
        {showSettings && (
          <div style={{
            width: 'clamp(280px, 30vw, 320px)',
            backgroundColor: cardBg,
            borderRight: `1px solid ${borderColor}`,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
          }}>
            <div style={{ padding: '24px' }}>
              <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                📊 Statistics
              </h3>
              <div style={{
                padding: '16px',
                backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
                borderRadius: '10px',
                fontSize: '13px'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Total Messages:</strong> {messages.length}
                </div>
                <div>
                  <strong>Status:</strong> <span style={{ color: '#4CAF50' }}>● Online</span>
                </div>
              </div>

              {searchHistory.length > 0 && (
                <>
                  <h3 style={{ marginTop: '24px', marginBottom: '12px', fontSize: '16px' }}>
                    🕐 Recent Questions
                  </h3>
                  <div style={{ fontSize: '13px' }}>
                    {searchHistory.slice(0, 5).map((q, i) => (
                      <div
                        key={i}
                        onClick={() => handleQuickQuestion(q)}
                        style={{
                          padding: '8px',
                          marginBottom: '4px',
                          backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {q}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Quick Questions */}
          {messages.length === 1 && (
            <div style={{
              padding: 'clamp(16px, 2.5vw, 20px) clamp(20px, 3vw, 24px)',
              backgroundColor: theme === 'dark' ? '#0a0a0a' : '#ffffff',
              borderBottom: `1px solid ${borderColor}`
            }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: 'clamp(13px, 1.8vw, 14px)', fontWeight: '600', color: '#888' }}>
                💡 Quick Questions
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(6px, 1vw, 8px)' }}>
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(q)}
                    style={{
                      padding: 'clamp(6px, 1vw, 8px) clamp(10px, 1.5vw, 14px)',
                      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f0f0f0',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '20px',
                      cursor: 'pointer',
                      color: textColor,
                      fontSize: 'clamp(12px, 1.5vw, 13px)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'clamp(16px, 3vw, 24px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(12px, 2vw, 20px)'
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                {message.type === 'bot' && (
                  <div style={{
                    width: 'clamp(36px, 5vw, 40px)',
                    height: 'clamp(36px, 5vw, 40px)',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${accentColor} 0%, #39ff14 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(0,255,136,0.3)'
                  }}>
                    <Code size={window.innerWidth < 768 ? 18 : 22} color="#fff" />
                  </div>
                )}
                
                <div style={{
                  maxWidth: '70%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  {message.topic && (
                    <span style={{
                      fontSize: 'clamp(10px, 1.2vw, 11px)',
                      color: accentColor,
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {CS_TOPICS.find(t => t.id === message.topic)?.icon} {CS_TOPICS.find(t => t.id === message.topic)?.name}
                    </span>
                  )}
                  <div style={{
                    padding: 'clamp(12px, 1.5vw, 14px) clamp(14px, 2vw, 18px)',
                    borderRadius: '16px',
                    backgroundColor: message.type === 'user' 
                      ? accentColor
                      : cardBg,
                    color: message.type === 'user' ? '#000' : textColor,
                    border: message.type === 'bot' ? `1px solid ${borderColor}` : 'none',
                    boxShadow: message.type === 'user' 
                      ? '0 4px 12px rgba(0,212,255,0.3)' 
                      : '0 2px 8px rgba(0,0,0,0.1)',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.6',
                    fontSize: 'clamp(13px, 1.8vw, 14px)'
                  }}>
                    {message.text}
                  </div>
                  <span style={{ 
                    fontSize: 'clamp(10px, 1.2vw, 11px)', 
                    color: '#888',
                    paddingLeft: message.type === 'user' ? '0' : '4px',
                    textAlign: message.type === 'user' ? 'right' : 'left'
                  }}>
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>

                {message.type === 'user' && (
                  <div style={{
                    width: 'clamp(36px, 5vw, 40px)',
                    height: 'clamp(36px, 5vw, 40px)',
                    borderRadius: '12px',
                    backgroundColor: '#4CAF50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(76,175,80,0.3)'
                  }}>
                    <User size={window.innerWidth < 768 ? 18 : 22} color="#fff" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: 'clamp(36px, 5vw, 40px)',
                  height: 'clamp(36px, 5vw, 40px)',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${accentColor} 0%, #39ff14 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,255,136,0.3)'
                }}>
                  <Code size={window.innerWidth < 768 ? 18 : 22} color="#fff" />
                </div>
                <div style={{
                  padding: '14px 18px',
                  borderRadius: '16px',
                  backgroundColor: cardBg,
                  border: `1px solid ${borderColor}`,
                  display: 'flex',
                  gap: '6px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: accentColor,
                    animation: 'typing 1.4s infinite'
                  }} />
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: accentColor,
                    animation: 'typing 1.4s infinite 0.2s'
                  }} />
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: accentColor,
                    animation: 'typing 1.4s infinite 0.4s'
                  }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: 'clamp(16px, 2.5vw, 20px) clamp(20px, 3vw, 24px)',
            backgroundColor: cardBg,
            borderTop: `1px solid ${borderColor}`,
            boxShadow: '0 -4px 12px rgba(0,0,0,0.05)',
            flexShrink: 0
          }}>
            <div style={{
              display: 'flex',
              gap: 'clamp(8px, 1.5vw, 12px)',
              alignItems: 'flex-end'
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about Computer Science..."
                style={{
                  flex: 1,
                  padding: 'clamp(12px, 1.5vw, 14px) clamp(14px, 2vw, 18px)',
                  backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
                  color: textColor,
                  border: `2px solid ${borderColor}`,
                  borderRadius: '14px',
                  resize: 'none',
                  fontFamily: 'inherit',
                  fontSize: 'clamp(13px, 1.8vw, 14px)',
                  minHeight: 'clamp(48px, 7vw, 52px)',
                  maxHeight: '150px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = accentColor}
                onBlur={(e) => e.target.style.borderColor = borderColor}
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                style={{
                  padding: 'clamp(12px, 1.5vw, 14px) clamp(20px, 3vw, 28px)',
                  background: input.trim() 
                    ? `linear-gradient(135deg, ${accentColor} 0%, #0066ff 100%)` 
                    : '#666',
                  color: input.trim() ? '#000' : '#fff',
                  border: 'none',
                  borderRadius: '14px',
                  cursor: input.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(6px, 1vw, 8px)',
                  fontWeight: '700',
                  fontSize: 'clamp(13px, 1.8vw, 14px)',
                  transition: 'all 0.2s',
                  boxShadow: input.trim() ? '0 4px 12px rgba(0,212,255,0.3)' : 'none',
                  transform: input.trim() ? 'scale(1)' : 'scale(0.95)'
                }}
              >
                <Send size={window.innerWidth < 768 ? 16 : 18} />
                Send
              </button>
            </div>
            <p style={{ 
              fontSize: 'clamp(11px, 1.5vw, 12px)', 
              color: '#888', 
              margin: 'clamp(8px, 1.2vw, 10px) 0 0 0',
              textAlign: 'center'
            }}>
              💡 Press Enter to send • Shift + Enter for new line • Connect your dataset for accurate responses
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.7; }
          30% { transform: translateY(-10px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}