import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Send, Bot, User, Download, Code, ArrowRight, Github, Linkedin, 
  Menu, X, Mic, MicOff, ThumbsUp, ThumbsDown, Clock, Zap, 
  Cpu, Database, Cloud, Shield, Trash2 
} from 'lucide-react';

// Modern Black & White Beige Color Palette
const modernColors = {
  primary: '#2A2A2A',
  secondary: '#8B7355',
  accent: '#666666',
  background: '#0A0A0A',
  surface: '#1A1A1A',
  text: '#F5F5F5',
  textSecondary: '#B0B0B0',
  gradient: 'linear-gradient(135deg, #2A2A2A 0%, #8B7355 50%, #666666 100%)',
  particleLight: '#8B7355',
  particleDark: '#2A2A2A',
};

// Simplified PixelBlast-like Background Component
const PixelBackground = ({ theme }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 100;
    const colors = theme === 'dark' 
      ? [modernColors.particleLight, modernColors.primary, modernColors.secondary, modernColors.accent]
      : ['#D4C4B2', '#8B7355', '#666666', '#2A2A2A'];

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const animate = () => {
      ctx.fillStyle = theme === 'dark' ? 'rgba(10, 10, 10, 0.1)' : 'rgba(245, 245, 245, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x <= 0 || particle.x >= canvas.width) particle.speedX *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.speedY *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}
    />
  );
};

// Circular Social Button Component
const CircularSocialButton = ({ theme }) => {
  const [expanded, setExpanded] = useState(false);

  const socialLinks = [
    { 
      icon: <Github size={24} />, 
      label: 'GitHub', 
      href: 'https://github.com/the-lazyguy',
      id: 'github'
    },
    { 
      icon: <Linkedin size={24} />, 
      label: 'LinkedIn', 
      href: 'https://www.linkedin.com/in/zain-nadeem-917524177/',
      id: 'linkedin'
    }
  ];

  return (
    <div className="button-box" style={{
      position: 'relative',
      width: '10rem',
      height: '5rem',
      display: 'flex'
    }}>
      <div 
        className="touch left"
        style={{
          position: 'relative',
          zIndex: 60,
          height: '100%',
          flex: 1,
          cursor: 'pointer'
        }}
      />
      <div 
        className="touch right"
        style={{
          position: 'relative',
          zIndex: 60,
          height: '100%',
          flex: 1,
          cursor: 'pointer'
        }}
      />

      {/* GitHub Button */}
      <a
        href={socialLinks[0].href}
        target="_blank"
        rel="noopener noreferrer"
        className="social-btn"
        id="github"
        style={{
          width: '3.2rem',
          height: '3.2rem',
          position: 'absolute',
          left: '50%',
          top: '50%',
          cursor: 'pointer',
          border: `3px solid ${modernColors.primary}`,
          borderRadius: '5px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: '0.3s',
          opacity: expanded ? 1 : 0.85,
          boxShadow: 'inset 0 0 4px rgba(42, 42, 42, 0.4)',
          background: modernColors.gradient,
          transform: expanded ? 'translate(-120%, -50%) rotate(0deg)' : 'translate(-50%, -50%) rotate(90deg)',
          zIndex: 30,
          textDecoration: 'none'
        }}
      >
        <div className="icon" style={{
          width: '24px',
          height: '24px',
          opacity: 0.9,
          transition: '0.25s',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {socialLinks[0].icon}
        </div>
        <span style={{
          width: '0px',
          overflow: 'hidden',
          transition: '0.3s',
          textAlign: 'center',
          marginLeft: '5px',
          color: '#FFFFFF',
          fontWeight: '600',
          whiteSpace: 'nowrap'
        }}>
          {socialLinks[0].label}
        </span>
      </a>

      {/* LinkedIn Button */}
      <a
        href={socialLinks[1].href}
        target="_blank"
        rel="noopener noreferrer"
        className="social-btn"
        id="linkedin"
        style={{
          width: '3.2rem',
          height: '3.2rem',
          position: 'absolute',
          left: '50%',
          top: '50%',
          cursor: 'pointer',
          border: `3px solid ${modernColors.accent}`,
          borderRadius: '5px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: '0.3s',
          opacity: expanded ? 1 : 0.85,
          boxShadow: 'inset 0 0 4px rgba(102, 102, 102, 0.4)',
          background: modernColors.gradient,
          transform: expanded ? 'translate(20%, -50%) rotate(0deg)' : 'translate(-50%, -50%) rotate(-90deg)',
          zIndex: 40,
          textDecoration: 'none'
        }}
      >
        <div className="icon" style={{
          width: '24px',
          height: '24px',
          opacity: 0.9,
          transition: '0.25s',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {socialLinks[1].icon}
        </div>
        <span style={{
          width: '0px',
          overflow: 'hidden',
          transition: '0.3s',
          textAlign: 'center',
          marginLeft: '5px',
          color: '#FFFFFF',
          fontWeight: '600',
          whiteSpace: 'nowrap'
        }}>
          {socialLinks[1].label}
        </span>
      </a>

      {/* Main Toggle Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '3.2rem',
          height: '3.2rem',
          position: 'absolute',
          left: '50%',
          top: '50%',
          cursor: 'pointer',
          border: `3px solid ${modernColors.secondary}`,
          borderRadius: '5px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: '0.3s',
          opacity: 0.85,
          boxShadow: 'inset 0 0 4px rgba(139, 115, 85, 0.4)',
          background: modernColors.gradient,
          transform: 'translate(-50%, -50%)',
          zIndex: 60,
          color: '#FFFFFF'
        }}
      >
        {expanded ? <X size={20} /> : <Menu size={20} />}
      </button>

      <style>{`
        .button-box:not(:hover) .social-btn:nth-child(3) .icon {
          animation: floatLeft 3s ease-in-out infinite;
        }

        .button-box:not(:hover) .social-btn:nth-child(4) .icon {
          animation: floatRight 3s ease-in-out infinite;
        }

        .button-box:not(:hover) .social-btn:nth-child(3) {
          animation: pulseModern 2s ease-in-out infinite, rotateSlow 8s linear infinite;
        }

        .button-box:not(:hover) .social-btn:nth-child(4) {
          animation: pulseModern 2s ease-in-out infinite, rotateSlowReverse 8s linear infinite;
        }

        .button-box:not(:hover) button:nth-child(5) {
          animation: mainPulseModern 2s ease-in-out infinite;
        }

        .button-box:hover .social-btn {
          width: 150px !important;
          border-radius: 5px !important;
          background: ${modernColors.gradient} !important;
          box-shadow: 0px 10px 20px rgba(42, 42, 42, 0.3) !important;
          animation: none !important;
        }

        .button-box:hover .social-btn span {
          width: 80px !important;
          padding: 2px;
        }

        .button-box:hover .social-btn .icon {
          opacity: 1 !important;
          animation: none !important;
        }

        .button-box:hover button:nth-child(5) {
          animation: none !important;
        }

        .button-box:hover .social-btn:nth-child(3) {
          transform: translate(-120%, -50%) rotate(0deg) !important;
        }

        .button-box:hover .social-btn:nth-child(4) {
          transform: translate(20%, -50%) rotate(0deg) !important;
        }

        .touch.left:hover ~ .social-btn:nth-child(3) {
          opacity: 1 !important;
          transform: translate(-120%, -50%) rotate(0deg) scale(1.05) !important;
          width: 150px !important;
          border-radius: 5px !important;
          background: ${modernColors.gradient} !important;
          box-shadow: 0px 10px 20px rgba(42, 42, 42, 0.4) !important;
          animation: none !important;
        }

        .touch.left:hover ~ .social-btn:nth-child(3) span {
          width: 80px !important;
          padding: 2px;
        }

        .touch.left:hover ~ .social-btn:nth-child(3) .icon {
          width: 25px !important;
          opacity: 0.9 !important;
          animation: none !important;
        }

        .touch.left:active ~ .social-btn:nth-child(3) {
          transform: translate(-120%, -50%) rotate(0deg) scale(0.9) !important;
        }

        .touch.right:hover ~ .social-btn:nth-child(4) {
          opacity: 1 !important;
          transform: translate(20%, -50%) rotate(0deg) scale(1.05) !important;
          width: 150px !important;
          border-radius: 5px !important;
          background: ${modernColors.gradient} !important;
          box-shadow: 0px 10px 20px rgba(42, 42, 42, 0.4) !important;
          animation: none !important;
        }

        .touch.right:hover ~ .social-btn:nth-child(4) span {
          width: 80px !important;
          padding: 2px;
        }

        .touch.right:hover ~ .social-btn:nth-child(4) .icon {
          width: 25px !important;
          opacity: 0.9 !important;
          animation: none !important;
        }

        .touch.right:active ~ .social-btn:nth-child(4) {
          transform: translate(20%, -50%) rotate(0deg) scale(0.9) !important;
        }

        @keyframes floatLeft {
          0%, 100% {
            transform: translateY(0px) rotate(5deg);
          }
          50% {
            transform: translateY(-5px) rotate(-5deg);
          }
        }

        @keyframes floatRight {
          0%, 100% {
            transform: translateY(0px) rotate(-5deg);
          }
          50% {
            transform: translateY(-5px) rotate(5deg);
          }
        }

        @keyframes pulseModern {
          0%, 100% {
            box-shadow: 
              inset 0 0 4px rgba(42, 42, 42, 0.4),
              0 0 0 rgba(42, 42, 42, 0.4);
          }
          50% {
            box-shadow: 
              inset 0 0 4px rgba(42, 42, 42, 0.4),
              0 0 20px rgba(42, 42, 42, 0.8);
          }
        }

        @keyframes mainPulseModern {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 
              inset 0 0 4px rgba(42, 42, 42, 0.4),
              0 0 0 rgba(42, 42, 42, 0.4);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
            box-shadow: 
              inset 0 0 4px rgba(42, 42, 42, 0.4),
              0 0 25px rgba(42, 42, 42, 0.8);
          }
        }

        @keyframes rotateSlow {
          from {
            transform: translate(-50%, -50%) rotate(90deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(450deg);
          }
        }

        @keyframes rotateSlowReverse {
          from {
            transform: translate(-50%, -50%) rotate(-90deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(-450deg);
          }
        }
      `}</style>
    </div>
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

// Download Button Component
const DownloadButton = ({ onClick, isSaved, theme }) => {
  const isDark = theme === 'dark';
  
  return (
    <button 
      className={`Btn ${isDark ? 'dark' : 'light'}`} 
      onClick={onClick} 
      title="Download Chat"
      style={{
        width: '50px',
        height: '50px',
        borderRadius: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        transitionDuration: '0.3s',
        boxShadow: '2px 2px 10px rgba(42, 42, 42, 0.11)',
        border: 'none'
      }}
    >
      <svg className="svgIcon" viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg" style={{
        fill: isDark ? modernColors.text : modernColors.primary,
        transition: 'fill 0.3s ease'
      }}>
        <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
      </svg>
      <div className="icon2" style={{
        width: '18px',
        height: '5px',
        borderBottom: `2px solid ${isDark ? modernColors.text : modernColors.primary}`,
        borderLeft: `2px solid ${isDark ? modernColors.text : modernColors.primary}`,
        borderRight: `2px solid ${isDark ? modernColors.text : modernColors.primary}`,
        transition: 'all 0.3s ease'
      }}></div>
      
      <style>{`
        .Btn.light {
          border: 2px solid ${modernColors.accent};
          background-color: #ffffff;
        }

        .Btn.dark {
          border: 2px solid ${modernColors.primary};
          background-color: ${modernColors.surface};
        }

        .Btn.light:hover {
          background-color: ${modernColors.primary};
        }

        .Btn.dark:hover {
          background-color: ${modernColors.primary};
        }

        .Btn.light:hover .icon2 {
          border-bottom: 2px solid #ffffff;
          border-left: 2px solid #ffffff;
          border-right: 2px solid #ffffff;
        }

        .Btn.dark:hover .icon2 {
          border-bottom: 2px solid #ffffff;
          border-left: 2px solid #ffffff;
          border-right: 2px solid #ffffff;
        }

        .Btn:hover .svgIcon {
          animation: slide-in-top 1s linear infinite;
          fill: #ffffff !important;
        }

        @keyframes slide-in-top {
          0% {
            transform: translateY(-10px);
            opacity: 0;
          }
          100% {
            transform: translateY(0px);
            opacity: 1;
          }
        }
      `}</style>
    </button>
  );
};

// Enhanced Theme Switch Component
const ThemeSwitch = ({ theme, onThemeChange }) => {
  return (
    <label className="switch" title="Toggle Theme" style={{
      fontSize: '17px',
      position: 'relative',
      display: 'inline-block',
      width: '3.5em',
      height: '2em'
    }}>
      <input 
        type="checkbox" 
        checked={theme === 'dark'}
        onChange={onThemeChange}
        style={{ opacity: 0, width: 0, height: 0 }}
      />
      <span className="slider" style={{
        background: modernColors.gradient,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        cursor: 'pointer',
        transition: '0.4s',
        borderRadius: '30px',
        boxShadow: '0 0 0 rgba(42, 42, 42, 0)',
        transition: 'all 0.4s ease'
      }}>
        <span className={`clouds_stars ${theme === 'dark' ? 'stars' : 'clouds'}`}></span>
      </span>
      
      <style>{`
        .slider:hover {
          box-shadow: 0 0 15px rgba(42, 42, 42, 0.5);
        }

        .slider::before {
          position: absolute;
          content: "";
          height: 1.5em;
          width: 1.5em;
          border-radius: 50%;
          left: 0.25em;
          bottom: 0.25em;
          background: linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%);
          transition: all 0.4s ease;
          transform-origin: center;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          z-index: 2;
        }

        .clouds_stars.clouds {
          position: absolute;
          width: 18px;
          height: 10px;
          left: 60%;
          top: 50%;
          transform: translateY(-50%);
          background: #ffffff;
          border-radius: 50%;
          box-shadow: 
            -6px 0 0 3px #ffffff,
            6px 0 0 3px #ffffff;
          filter: drop-shadow(0 1px 2px rgba(255, 255, 255, 0.3));
          opacity: 0.95;
        }

        .clouds_stars.clouds::before {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          background: #ffffff;
          border-radius: 50%;
          top: -3px;
          left: -2px;
          box-shadow: 
            8px 0 0 2px #ffffff,
            16px 0 0 1px #ffffff;
        }

        .clouds_stars.stars {
          position: absolute;
          height: 2px;
          width: 2px;
          border-radius: 50%;
          left: 25%;
          top: 35%;
          background-color: #fff;
          transition: all 0.3s;
          box-shadow:
            6px 4px 0 0 #fff,
            -4px 8px 0 0 #fff,
            12px 8px 0 0 #fff;
          filter: none;
          animation: twinkle 2s infinite;
          opacity: 0.9;
        }

        .switch input:checked + .slider {
          background: linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%);
        }

        .switch input:checked + .slider::before {
          transform: translateX(1.5em);
          background: linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%);
          box-shadow: 
            0 0 15px rgba(245, 245, 245, 0.8),
            inset -3px -2px 5px rgba(0, 0, 0, 0.2);
        }

        .switch input:checked + .slider::after {
          content: "";
          position: absolute;
          width: 0.3em;
          height: 0.3em;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.1);
          top: 0.4em;
          left: 2.2em;
          box-shadow:
            0.2em 0.5em 0 0.1em rgba(0, 0, 0, 0.1),
            -0.1em 0.8em 0 0.1em rgba(0, 0, 0, 0.1);
          transition: all 0.4s ease;
        }

        .switch input:checked + .slider:hover::before {
          transform: translateX(1.5em) rotate(-15deg);
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.9;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.9);
          }
        }

        .switch input:checked + .slider .clouds_stars.clouds {
          opacity: 0;
          transform: translateY(-50%) scale(0);
        }

        .switch input:checked + .slider .clouds_stars.stars {
          opacity: 0.9;
          transform: scale(1);
        }
      `}</style>
    </label>
  );
};

// Modern Delete Button Component
const DeleteButton = ({ onClick, theme }) => {
  const isDark = theme === 'dark';
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button 
      className={`delete-btn-modern ${isDark ? 'dark' : 'light'}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Clear Chat"
      style={{
        width: '50px',
        height: '50px',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        background: isDark 
          ? modernColors.gradient
          : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        boxShadow: isDark
          ? '0 4px 15px rgba(42, 42, 42, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          : '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        border: `1px solid ${isDark ? 'rgba(42, 42, 42, 0.3)' : '#e5e7eb'}`
      }}
    >
      <div style={{
        position: 'absolute',
        top: '0',
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
        transition: 'left 0.5s ease',
        ...(isHovered && { left: '100%' })
      }} />
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)'
      }}>
        <Trash2 
          size={22} 
          color={isHovered ? '#FFFFFF' : (isDark ? '#F5F5F5' : modernColors.primary)}
          style={{
            transition: 'all 0.3s ease',
            filter: isHovered ? 'drop-shadow(0 2px 8px rgba(255, 255, 255, 0.6))' : 'none'
          }}
        />
      </div>

      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '0',
        height: '0',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.2)',
        transform: 'translate(-50%, -50%)',
        transition: 'all 0.3s ease',
        ...(isHovered && {
          width: '60px',
          height: '60px'
        })
      }} />

      <style>{`
        .delete-btn-modern:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(42, 42, 42, 0.4) !important;
        }

        .delete-btn-modern:active {
          transform: translateY(0) scale(0.98);
        }
      `}</style>
    </button>
  );
};

// Quick Actions Component
const QuickActions = ({ onActionClick, theme }) => {
  const actions = [
    { icon: <Cpu size={18} />, label: 'Algorithms', prompt: 'Explain time complexity and space complexity with examples' },
    { icon: <Database size={18} />, label: 'Data Structures', prompt: 'Compare arrays vs linked lists and their use cases' },
    { icon: <Cloud size={18} />, label: 'Cloud Computing', prompt: 'What are the benefits of cloud computing for developers?' },
    { icon: <Shield size={18} />, label: 'Cybersecurity', prompt: 'Explain common web security vulnerabilities and prevention' },
    { icon: <Zap size={18} />, label: 'AI/ML', prompt: 'What is machine learning and how does it differ from traditional programming?' },
    { icon: <Code size={18} />, label: 'Web Dev', prompt: 'Explain the difference between frontend and backend development' }
  ];

  const isDark = theme === 'dark';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '12px',
      padding: '20px 0',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => onActionClick(action.prompt)}
          style={{
            padding: '16px 12px',
            backgroundColor: isDark ? modernColors.surface : '#ffffff',
            border: `1px solid ${isDark ? modernColors.primary : modernColors.accent}`,
            borderRadius: '12px',
            color: isDark ? modernColors.text : modernColors.background,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            boxShadow: `0 2px 8px ${isDark ? 'rgba(42, 42, 42, 0.2)' : 'rgba(102, 102, 102, 0.2)'}`,
            border: 'none'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(42, 42, 42, 0.3)';
            e.target.style.background = modernColors.gradient;
            e.target.style.color = '#FFFFFF';
            e.target.style.borderColor = 'transparent';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = `0 2px 8px ${isDark ? 'rgba(42, 42, 42, 0.2)' : 'rgba(102, 102, 102, 0.2)'}`;
            e.target.style.background = isDark ? modernColors.surface : '#ffffff';
            e.target.style.color = isDark ? modernColors.text : modernColors.background;
            e.target.style.borderColor = isDark ? modernColors.primary : modernColors.accent;
          }}
        >
          <div style={{
            color: 'inherit',
            transition: 'all 0.2s ease'
          }}>
            {action.icon}
          </div>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

// Message Component
const Message = ({ message, onFeedback, theme }) => {
  const [feedback, setFeedback] = useState(null);
  const isDark = theme === 'dark';
  const isUser = message.type === 'user';

  const handleFeedback = (type) => {
    setFeedback(type);
    onFeedback?.(message.id, type);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      gap: '8px',
      marginBottom: '24px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        maxWidth: '85%',
        flexDirection: isUser ? 'row-reverse' : 'row'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: isUser ? modernColors.gradient : (isDark ? modernColors.surface : modernColors.gradient),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: '#FFFFFF',
          fontWeight: 'bold',
          fontSize: '14px',
          boxShadow: `0 2px 8px ${isDark ? 'rgba(42, 42, 42, 0.3)' : 'rgba(102, 102, 102, 0.3)'}`
        }}>
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>
        
        <div style={{
          backgroundColor: isUser ? modernColors.gradient : (isDark ? modernColors.surface : '#ffffff'),
          padding: '16px 20px',
          borderRadius: '18px',
          border: `1px solid ${isUser ? 'transparent' : (isDark ? modernColors.primary : modernColors.accent)}`,
          boxShadow: `0 2px 12px ${isDark ? 'rgba(42, 42, 42, 0.2)' : 'rgba(102, 102, 102, 0.2)'}`,
          color: isUser ? '#FFFFFF' : (isDark ? modernColors.text : modernColors.background),
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          position: 'relative',
          background: isUser ? modernColors.gradient : (isDark ? modernColors.surface : '#ffffff')
        }}>
          {message.text}
          
          {!isUser && (
            <div style={{
              display: 'flex',
              gap: '8px',
              marginTop: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => handleFeedback('like')}
                style={{
                  padding: '6px 12px',
                  backgroundColor: feedback === 'like' ? modernColors.primary : 'transparent',
                  border: `1px solid ${isDark ? modernColors.primary : modernColors.accent}`,
                  borderRadius: '8px',
                  color: feedback === 'like' ? '#FFFFFF' : (isDark ? modernColors.text : modernColors.primary),
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s ease',
                  border: 'none'
                }}
              >
                <ThumbsUp size={14} />
                Helpful
              </button>
              <button
                onClick={() => handleFeedback('dislike')}
                style={{
                  padding: '6px 12px',
                  backgroundColor: feedback === 'dislike' ? modernColors.secondary : 'transparent',
                  border: `1px solid ${isDark ? modernColors.secondary : modernColors.secondary}`,
                  borderRadius: '8px',
                  color: feedback === 'dislike' ? '#FFFFFF' : (isDark ? modernColors.text : modernColors.secondary),
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s ease',
                  border: 'none'
                }}
              >
                <ThumbsDown size={14} />
                Not Helpful
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div style={{
        fontSize: '0.75rem',
        opacity: 0.6,
        padding: isUser ? '0 52px 0 0' : '0 0 0 52px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        color: isDark ? modernColors.textSecondary : modernColors.primary
      }}>
        <Clock size={12} />
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

// Welcome Screen Component
const WelcomeScreen = ({ onStart, theme }) => {
  const [showButton, setShowButton] = useState(false);

  const bgGradient = theme === 'dark' 
    ? `linear-gradient(135deg, ${modernColors.background} 0%, #1A1A1A 100%)`
    : `linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)`;
  
  const overlayBg = theme === 'dark'
    ? `radial-gradient(circle at center, ${modernColors.background}99 0%, ${modernColors.background} 100%)`
    : `radial-gradient(circle at center, #F5F5F599 0%, #F5F5F5 100%)`;
  
  const titleColor = theme === 'dark' ? '#FFFFFF' : modernColors.primary;
  const textColor = theme === 'dark' ? modernColors.textSecondary : modernColors.primary;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      position: 'relative',
      overflow: 'hidden',
      background: bgGradient
    }}>
      <PixelBackground theme={theme} />
      
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: overlayBg,
        zIndex: 2
      }} />
      
      <div style={{
        textAlign: 'center',
        zIndex: 3,
        padding: '40px 20px',
        maxWidth: '800px',
        position: 'relative'
      }}>
        
        <div style={{
          marginBottom: '40px',
          animation: 'scaleIn 0.5s ease-out'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 20px',
            borderRadius: '25px',
            background: modernColors.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 60px rgba(42, 42, 42, 0.4)',
            animation: 'pulse 2s ease-in-out infinite',
            border: `2px solid ${theme === 'dark' ? modernColors.background : '#FFFFFF'}`
          }}>
            <Code size={48} color="#FFFFFF" strokeWidth={2} />
          </div>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: '800',
          margin: '0 0 24px 0',
          background: modernColors.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.5px',
          lineHeight: '1.1',
        }}>
          <TypingText 
            text="CS Assistant" 
            speed={80}
            onComplete={() => setShowButton(true)}
          />
        </h1>

        <p style={{
          fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
          color: textColor,
          margin: '0 0 50px 0',
          lineHeight: '1.6',
          opacity: showButton ? 1 : 0,
          transition: 'opacity 0.5s ease',
          textAlign: 'center'
        }}>
          Your intelligent Computer Science companion with a clean, minimalist design
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '60px',
          opacity: showButton ? 1 : 0,
          transition: 'opacity 0.5s ease 0.2s',
          position: 'relative',
          minHeight: '120px',
          alignItems: 'center'
        }}>
          <CircularSocialButton theme={theme} />
        </div>

        {showButton && (
          <button
            onClick={onStart}
            className="cta"
            style={{
              opacity: showButton ? 1 : 0,
              transition: 'opacity 0.5s ease 0.2s',
              position: 'relative',
              margin: 'auto',
              padding: '12px 18px',
              transition: 'all 0.2s ease',
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            <span style={{
              position: 'relative',
              fontFamily: '"Ubuntu", sans-serif',
              fontSize: '18px',
              fontWeight: '700',
              letterSpacing: '0.05em',
              color: '#FFFFFF'
            }}>Begin Journey</span>
            <svg style={{
              position: 'relative',
              top: '0',
              marginLeft: '10px',
              fill: 'none',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              stroke: '#FFFFFF',
              strokeWidth: '2',
              transform: 'translateX(-5px)',
              transition: 'all 0.3s ease'
            }} width="15px" height="10px" viewBox="0 0 13 10">
              <path d="M1,5 L11,5"></path>
              <polyline points="8 1 12 5 8 9"></polyline>
            </svg>
          </button>
        )}
      </div>

      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .cta:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          display: block;
          border-radius: 50px;
          background: ${modernColors.gradient};
          width: 45px;
          height: 45px;
          transition: all 0.3s ease;
        }

        .cta:hover:before {
          width: 100%;
          background: ${modernColors.gradient};
        }

        .cta:hover svg {
          transform: translateX(0);
        }

        .cta:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
};

// Main Chatbot Component
export default function CSChatbot() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'bot', 
      text: 'Hello! I\'m your CS Assistant. I can help you navigate through:\n\n• Algorithms & Data Structures\n• Programming Languages & Concepts\n• System Design & Architecture\n• Cloud Computing & DevOps\n• AI/ML & Data Science\n• Cybersecurity & Best Practices\n\nWhat topic would you like to explore today?', 
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isChatSaved, setIsChatSaved] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('cs-chatbot-theme');
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('cs-chatbot-theme', theme);
  }, [theme]);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem('cs-chatbot-history', JSON.stringify(messages));
    }
  }, [messages]);

  // Load chat history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('cs-chatbot-history');
    if (savedHistory && JSON.parse(savedHistory).length > 1) {
      setMessages(JSON.parse(savedHistory).map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // AI Knowledge Base
  const knowledgeBase = useMemo(() => ({
    algorithms: {
      response: `**Algorithms** are step-by-step procedures for solving problems. Key concepts:

• **Time Complexity**: Measures how runtime grows with input size
  - O(1): Constant time
  - O(log n): Logarithmic time
  - O(n): Linear time
  - O(n²): Quadratic time

• **Space Complexity**: Measures memory usage growth

• **Common Algorithms**:
  - Sorting: QuickSort, MergeSort, BubbleSort
  - Searching: Binary Search, Linear Search
  - Graph: Dijkstra, BFS, DFS

Would you like me to explain any specific algorithm in detail?`,
      examples: ['binary search', 'quick sort', 'dynamic programming']
    },
    'data structures': {
      response: `**Data Structures** organize and store data efficiently:

• **Arrays**: Contiguous memory, fast access, fixed size
• **Linked Lists**: Dynamic size, sequential access
• **Stacks**: LIFO (Last In First Out)
• **Queues**: FIFO (First In First Out)
• **Trees**: Hierarchical data (Binary Trees, BST, AVL)
• **Graphs**: Nodes and edges relationships
• **Hash Tables**: Key-value pairs with fast lookup

**When to use which?**
- Arrays: When size is known and random access needed
- Linked Lists: When frequent insertions/deletions
- Hash Tables: Fast lookups by key
- Trees: Hierarchical or sorted data`,
      examples: ['arrays vs linked lists', 'hash table implementation', 'tree traversal']
    },
    'machine learning': {
      response: `**Machine Learning** enables computers to learn without explicit programming:

• **Supervised Learning**: Labeled data (Classification, Regression)
• **Unsupervised Learning**: Unlabeled data (Clustering, Dimensionality Reduction)
• **Reinforcement Learning**: Learning through rewards/punishments

**Common Algorithms**:
- Linear Regression
- Decision Trees
- Neural Networks
- K-Means Clustering

**Applications**: Image recognition, NLP, recommendation systems`,
      examples: ['neural networks', 'linear regression', 'clustering algorithms']
    },
    'cloud computing': {
      response: `**Cloud Computing** delivers computing services over the internet:

• **Service Models**:
  - IaaS (Infrastructure as a Service): Virtual machines, storage
  - PaaS (Platform as a Service): Development platforms
  - SaaS (Software as a Service): Ready-to-use applications

• **Deployment Models**:
  - Public Cloud: AWS, Azure, Google Cloud
  - Private Cloud: On-premises infrastructure
  - Hybrid Cloud: Combination of both

• **Benefits**: Scalability, cost-efficiency, reliability`,
      examples: ['aws services', 'cloud deployment', 'serverless computing']
    },
    cybersecurity: {
      response: `**Cybersecurity** protects systems and data from digital attacks:

• **Common Threats**:
  - Malware: Viruses, ransomware, trojans
  - Phishing: Social engineering attacks
  - DDoS: Distributed Denial of Service
  - SQL Injection: Database attacks

• **Protection Measures**:
  - Firewalls and antivirus software
  - Encryption and secure protocols
  - Regular updates and patches
  - User education and awareness

• **Best Practices**: Least privilege, defense in depth, regular audits`,
      examples: ['encryption', 'network security', 'vulnerability assessment']
    }
  }), []);

  const findBestResponse = useCallback((userInput) => {
    const input = userInput.toLowerCase();
    
    // Check for specific topics
    for (const [topic, data] of Object.entries(knowledgeBase)) {
      if (input.includes(topic) || data.examples.some(example => input.includes(example))) {
        return data.response;
      }
    }

    // Default responses based on keywords
    if (input.includes('time complexity') || input.includes('big o')) {
      return `**Time Complexity** analysis helps understand algorithm efficiency:

• **O(1)**: Constant time - operation takes same time regardless of input size
• **O(n)**: Linear time - time grows proportionally with input size
• **O(n²)**: Quadratic time - time grows with square of input size
• **O(log n)**: Logarithmic time - time grows logarithmically

Example: Binary Search is O(log n) while Linear Search is O(n).`;
    }

    if (input.includes('python') || input.includes('javascript') || input.includes('java')) {
      return `Great question about **programming languages**! Each has strengths:

• **Python**: Easy syntax, great for data science and web development
• **JavaScript**: Essential for web development, runs in browsers
• **Java**: Platform-independent, strong typing, enterprise applications

Would you like to compare specific languages or learn about a particular concept?`;
    }

    // Generic intelligent response
    return `I understand you're asking about "${userInput}". This is an important topic in computer science that bridges theoretical concepts with practical applications. 

Let me break this down:
• **Core Concepts**: Fundamental principles involved
• **Real-world Applications**: How this is used in industry
• **Best Practices**: Recommended approaches and patterns
• **Common Challenges**: What to watch out for

Would you like me to focus on any specific aspect, or shall I provide a comprehensive overview?`;
  }, [knowledgeBase]);

  const handleSend = useCallback(async (customInput = null) => {
    const messageText = customInput || input.trim();
    if (!messageText) return;

    try {
      setError(null);
      const userMessage = {
        id: Date.now(),
        type: 'user',
        text: messageText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      if (!customInput) setInput('');
      setIsTyping(true);

      // Simulate AI processing
      setTimeout(() => {
        const aiResponse = findBestResponse(messageText);
        
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          text: aiResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000 + Math.random() * 500);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      setIsTyping(false);
    }
  }, [input, findBestResponse]);

  const handleQuickAction = useCallback((prompt) => {
    handleSend(prompt);
  }, [handleSend]);

  const handleFeedback = useCallback((messageId, type) => {
    console.log(`Feedback ${type} for message ${messageId}`);
    // In a real app, you would send this to your analytics service
  }, []);

  const clearChat = useCallback(() => {
    setMessages([
      { 
        id: 1, 
        type: 'bot', 
        text: 'Chat cleared! Ready to explore new CS topics. What would you like to learn about?', 
        timestamp: new Date() 
      }
    ]);
    setIsChatSaved(false);
    localStorage.removeItem('cs-chatbot-history');
  }, []);

  const saveChat = useCallback(() => {
    setIsChatSaved(true);
    const chatText = messages.map(m => 
      `[${m.timestamp.toLocaleTimeString()}] ${m.type.toUpperCase()}: ${m.text}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cs-chat-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setTimeout(() => setIsChatSaved(false), 2000);
  }, [messages]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleThemeChange = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme]);

  const toggleVoiceInput = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition not supported in this browser. Try Chrome or Edge.');
      return;
    }

    if (!isListening) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => {
        setIsListening(false);
        setError('Voice recognition failed. Please try again.');
      };
      
      recognition.start();
    } else {
      setIsListening(false);
    }
  }, [isListening]);

  // Theme-based colors
  const bgColor = theme === 'dark' ? modernColors.background : '#F8F8F8';
  const cardBg = theme === 'dark' ? modernColors.surface : '#FFFFFF';
  const textColor = theme === 'dark' ? modernColors.text : modernColors.background;
  const borderColor = theme === 'dark' ? modernColors.primary : modernColors.accent;
  const secondaryBg = theme === 'dark' ? '#2A2A2A' : '#F0F0F0';

  // Show welcome screen first
  if (!showChat) {
    return <WelcomeScreen onStart={() => setShowChat(true)} theme={theme} />;
  }

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
      fontFamily: '"Inter", sans-serif',
      overflow: 'hidden',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      {/* Pixel Background for Chat */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: theme === 'dark' ? 0.3 : 0.1
      }}>
        <PixelBackground theme={theme} />
      </div>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        backgroundColor: cardBg,
        borderBottom: `1px solid ${borderColor}`,
        boxShadow: `0 2px 20px ${theme === 'dark' ? 'rgba(42, 42, 42, 0.2)' : 'rgba(102, 102, 102, 0.2)'}`,
        flexShrink: 0,
        position: 'relative',
        zIndex: 2,
        transition: 'background-color 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: modernColors.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(42, 42, 42, 0.3)'
          }}>
            <Code size={22} color="#FFFFFF" strokeWidth={2} />
          </div>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '1.4rem',
              fontWeight: '700',
              background: modernColors.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              CS Assistant
            </h1>
            <div style={{
              fontSize: '0.8rem',
              opacity: 0.7,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: modernColors.textSecondary
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: modernColors.accent,
                animation: 'pulse 2s infinite'
              }}></div>
              Online • Ready to explore
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeSwitch theme={theme} onThemeChange={handleThemeChange} />
          <DownloadButton onClick={saveChat} isSaved={isChatSaved} theme={theme} />
          <DeleteButton onClick={clearChat} theme={theme} />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          padding: '12px 24px',
          backgroundColor: '#fee',
          color: '#c33',
          borderBottom: `1px solid #fcc`,
          position: 'relative',
          zIndex: 2
        }}>
          {error}
          <button
            onClick={() => setError(null)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#c33',
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Chat Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        maxWidth: '900px',
        margin: '0 auto',
        width: '100%',
        padding: '0 20px',
        overflow: 'hidden'
      }}>
        {/* Messages Container */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 0',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0
        }}>
          {messages.map((message) => (
            <Message 
              key={message.id} 
              message={message} 
              onFeedback={handleFeedback}
              theme={theme}
            />
          ))}
          
          {isTyping && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              maxWidth: '85%',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: secondaryBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `0 2px 8px ${theme === 'dark' ? 'rgba(42, 42, 42, 0.2)' : 'rgba(102, 102, 102, 0.2)'}`
              }}>
                <Bot size={20} color={textColor} />
              </div>
              <div style={{
                backgroundColor: cardBg,
                padding: '16px 20px',
                borderRadius: '18px',
                border: `1px solid ${borderColor}`,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: `0 2px 12px ${theme === 'dark' ? 'rgba(42, 42, 42, 0.2)' : 'rgba(102, 102, 102, 0.2)'}`
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: modernColors.primary,
                  animation: 'typing 1.4s infinite ease-in-out'
                }}></div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: modernColors.secondary,
                  animation: 'typing 1.4s infinite ease-in-out 0.2s'
                }}></div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: modernColors.accent,
                  animation: 'typing 1.4s infinite ease-in-out 0.4s'
                }}></div>
              </div>
            </div>
          )}
          
          {/* Quick Actions - Show only when no user messages */}
          {messages.length === 1 && (
            <div style={{ marginTop: '20px' }}>
              <div style={{
                textAlign: 'center',
                color: theme === 'dark' ? modernColors.textSecondary : modernColors.primary,
                marginBottom: '16px',
                fontSize: '0.9rem'
              }}>
                Quick Topics
              </div>
              <QuickActions onActionClick={handleQuickAction} theme={theme} />
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: '20px 0 30px 0',
          backgroundColor: 'transparent',
          position: 'relative',
          zIndex: 2,
          flexShrink: 0
        }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-end'
          }}>
            <div style={{
              flex: 1,
              position: 'relative'
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about Computer Science... (e.g., 'Explain binary search time complexity')"
                style={{
                  width: '100%',
                  minHeight: '60px',
                  maxHeight: '120px',
                  padding: '16px 120px 16px 20px',
                  backgroundColor: cardBg,
                  border: `2px solid ${borderColor}`,
                  borderRadius: '16px',
                  color: textColor,
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'none',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 4px 20px ${theme === 'dark' ? 'rgba(42, 42, 42, 0.1)' : 'rgba(102, 102, 102, 0.1)'}`
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = modernColors.primary;
                  e.target.style.boxShadow = `0 4px 25px rgba(42, 42, 42, 0.2)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = borderColor;
                  e.target.style.boxShadow = `0 4px 20px ${theme === 'dark' ? 'rgba(42, 42, 42, 0.1)' : 'rgba(102, 102, 102, 0.1)'}`;
                }}
              />
              
              {/* Voice Input Button */}
              <button
                onClick={toggleVoiceInput}
                style={{
                  position: 'absolute',
                  right: '60px',
                  bottom: '12px',
                  width: '36px',
                  height: '36px',
                  backgroundColor: isListening ? modernColors.secondary : secondaryBg,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  color: isListening ? '#FFFFFF' : textColor
                }}
                title="Voice Input"
                aria-label={isListening ? "Stop voice input" : "Start voice input"}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>

              {/* Modern Send Button */}
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="send-button"
                style={{
                  position: 'absolute',
                  right: '12px',
                  bottom: '12px',
                  width: '50px',
                  height: '50px',
                  backgroundColor: input.trim() ? modernColors.gradient : secondaryBg,
                  border: 'none',
                  borderRadius: '12px',
                  cursor: input.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.5s ease-in-out',
                  color: '#FFFFFF',
                  boxShadow: input.trim() ? '0 4px 15px rgba(42, 42, 42, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
                  opacity: input.trim() ? 1 : 0.6
                }}
                title="Send Message"
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Send size={18} color="#FFFFFF" />
                </div>
              </button>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '12px',
            fontSize: '0.8rem',
            opacity: 0.6,
            gap: '16px',
            color: theme === 'dark' ? modernColors.textSecondary : modernColors.primary,
            flexWrap: 'wrap'
          }}>
            <span>Press Enter to send</span>
            <span>•</span>
            <span>Shift+Enter for new line</span>
            <span>•</span>
            <span>Try: "time complexity" or "data structures"</span>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style>{`
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .send-button {
          background: ${modernColors.gradient};
          color: #FFFFFF;
          display: flex;
          justify-content: center;
          align-items: center;
          border: none;
          transition: all .5s ease-in-out;
          position: relative;
          overflow: hidden;
        }

        .send-button:hover {
          border-radius: 50%;
          transition: all .5s ease-in-out;
          transform: scale(1.05);
          box-shadow: 0 8px 25px rgba(42, 42, 42, 0.4) !important;
        }

        .send-button:hover::before {
          margin-left: 0%;
          transform: rotate(24deg);
        }

        .send-button::before {
          content: "";
          background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNzUycHQiIGhlaWdodD0iNzUycHQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDc1MiA3NTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8cGF0aCBkPSJtNTczLjE4IDE5OC42MnYwbC0zOTYuMDkgNjMuNzE5Yy03Ljc1IDAuODU5MzgtOS40NzI3IDExLjE5NS0zLjQ0NTMgMTUuNWw5Ny4zMDEgNjguODgzLTE1LjUgMTEyLjhjLTAuODU5MzggNy43NSA3Ljc1IDEyLjkxNCAxMy43NzcgNy43NWw1NS4xMDktNDQuNzczIDI2LjY5MSAxMjQuODVjMS43MjI3IDcuNzUgMTEuMTk1IDkuNDcyNyAxNS41IDIuNTgybDIxNS4yNy0zMzguMzljMy40NDE0LTYuMDI3My0xLjcyNjYtMTMuNzc3LTguNjEzMy0xMi45MTR6bS0zNzIuODQgNzYuNjMzIDMxMy40Mi00OS45NDEtMjMzLjM0IDEwNy42M3ptNzQuMDUxIDE2NS4zMiAxMi45MTQtOTIuMTMzYzgwLjkzOC0zNy4wMjcgMTM5LjQ5LTY0LjU3OCAyMjkuMDQtMTA1LjkxLTEuNzE4OCAxLjcyMjctMC44NTkzNyAwLjg1OTM4LTI0MS45NSAxOTguMDR6bTg4LjY4OCA4Mi42Ni0yNC4xMDktMTEyLjggMTk5Ljc3LTE2Mi43NHoiIGZpbGw9IiNmZmYiLz4KPC9zdmc+Cg==");
          height: 50px;
          background-repeat: no-repeat;
          position: absolute;
          width: 50px;
          transition: all .9s ease-in-out;
          background-size: 100%;
          opacity: 0;
        }

        .send-button:hover::before {
          opacity: 1;
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: ${theme === 'dark' ? modernColors.surface : '#f0f0f0'};
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: ${modernColors.gradient};
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${modernColors.primary};
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .chat-area {
            padding: 0 12px;
          }
          
          .header {
            padding: 12px 16px;
          }
          
          .message {
            max-width: 95%;
          }
          
          .quick-actions {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .quick-actions {
            grid-template-columns: 1fr;
          }
          
          .input-hints {
            flex-direction: column;
            gap: 4px;
          }
        }
      `}</style>
    </div>
  );
}