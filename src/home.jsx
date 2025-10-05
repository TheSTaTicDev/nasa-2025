import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(TextPlugin);

const ExploreSelect = ({ cupolaImage, nblImage, ambienceSrc }) => {
  const navigate = useNavigate();
  const [activeTransition, setActiveTransition] = useState(null);

  const containerRef = useRef(null);
  const textContainerRef = useRef(null);
  const heyRef = useRef(null);
  const whatRef = useRef(null);
  const heyCursorRef = useRef(null);
  const whatCursorRef = useRef(null);
  const optionsRef = useRef(null);
  const ambienceRef = useRef(null);
  const cupolaCardRef = useRef(null);
  const nblCardRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    if (ambienceSrc) {
      const audio = new Audio(ambienceSrc);
      audio.loop = true;
      audio.volume = 0.2;
      audio.play().catch(() => {});
      ambienceRef.current = audio;
    }

    const tl = gsap.timeline();
    
    tl
      .set(heyCursorRef.current, { autoAlpha: 1 })
      .to(heyRef.current, {
        duration: 1.5,
        text: "Hey there...",
        ease: "none",
      })
      .set(heyCursorRef.current, { autoAlpha: 0 })
      .set(whatCursorRef.current, { autoAlpha: 1 })
      .to(whatRef.current, {
        duration: 2.5,
        text: "What do you want to explore today?",
        ease: "none",
      }, "+=0.5")
      .to(textContainerRef.current, {
        y: -120,
        duration: 1.5,
        ease: "power2.inOut",
      }, "+=1")
      .to(optionsRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 1.2, 
        ease: "power3.out" 
      }, "-=1.0");

    gsap.to([cupolaCardRef.current, nblCardRef.current], {
      y: -15, rotation: 0, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut"
    });

    return () => {
      ambienceRef.current?.pause();
      document.body.style.overflow = '';
    };
  }, [ambienceSrc]);

  useEffect(() => {
    if (!activeTransition) return;

    if (activeTransition === 'cupola') {
        const transitionDuration = 2.8;
        const tl = gsap.timeline({ onComplete: () => navigate('/cupola') });
        tl.to(containerRef.current, { keyframes: { x: [-4, 4, -3, 3, -5, 5, 0], y: [4, -4, 3, -3, 5, -5, 0], }, duration: transitionDuration * 0.8, ease: 'none', }, 0);
        tl.fromTo(".rocket-smoke", { opacity: 0, scale: 0.1 }, { opacity: 1, scale: 1, duration: transitionDuration, ease: "power1.out", }, 0);
        tl.to(".rocket-flame-intense", { scaleY: 1.5, duration: transitionDuration * 0.5, ease: "power1.out" }, 0);
        tl.to(".rocket", { y: -window.innerHeight, duration: transitionDuration, ease: 'power3.in', }, 0);
        tl.to(".rocket-smoke", { opacity: 0, duration: transitionDuration * 0.3, }, transitionDuration * 0.7);
    }

    if (activeTransition === 'nbl') {
        const tl = gsap.timeline({ onComplete: () => navigate('/nbl') });
        tl.to(".water-blob", { top: "-40%", rotation: 360, duration: 3, stagger: 0.2, ease: "power2.inOut", });
        gsap.fromTo(".bubble", { y: window.innerHeight, opacity: 1 }, { y: -200, duration: 'random(3, 5)', stagger: 0.15, ease: 'none' });
    }

  }, [activeTransition, navigate]);

  const handleSelect = (choice) => {
    ambienceRef.current?.pause();
    gsap.to([optionsRef.current, textContainerRef.current], {
      duration: 0.5, opacity: 0, ease: 'power2.in'
    });
    setActiveTransition(choice);
  };

  return (
    <div ref={containerRef} className="joyful-container w-full h-screen text-white flex flex-col items-center justify-center overflow-hidden relative">
      
      <div className="shapes-container">
          {[...Array(10)].map((_, i) => <div className="shape" key={i} />)}
      </div>

      {activeTransition === 'cupola' && ( <div className="transition-overlay"><div className="rocket-smoke"></div><div className="rocket"><div className="rocket-body"></div><div className="rocket-flame-intense"></div><div className="rocket-flame"></div></div></div> )}
      {activeTransition === 'nbl' && ( <div className="water-container">{[...Array(30)].map((_, i) => ( <div key={i} className="bubble" style={{ left: `${Math.random() * 100}%` }} /> ))}<div className="water-blob blob1"></div><div className="water-blob blob2"></div></div> )}

      <div ref={textContainerRef} className="select-none relative z-20 h-32 flex flex-col items-center justify-center">
        <div className="inline-flex items-baseline">
            <h1 ref={heyRef} className="text-5xl font-medium"></h1>
            <span ref={heyCursorRef} className="cursor text-5xl font-medium ml-2 opacity-0">|</span>
        </div>
        <div className="inline-flex items-baseline mt-2">
            <p ref={whatRef} className="text-2xl opacity-80 font-medium"></p>
            <span ref={whatCursorRef} className="cursor text-2xl ml-2 opacity-0">|</span>
        </div>
      </div>

      <div ref={optionsRef} className="absolute bottom-[15%] flex gap-16 opacity-0 translate-y-10 z-20">
        <div onClick={() => handleSelect("cupola")} ref={cupolaCardRef} className="joyful-card group relative w-48 h-48 rounded-2xl overflow-hidden flex items-center justify-center">
          {cupolaImage && <img src={cupolaImage} alt="Cupola" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-opacity duration-500" />}
          <span className="z-10 text-2xl tracking-wider font-bold">Cupola</span>
        </div>
        <div onClick={() => handleSelect("nbl")} ref={nblCardRef} className="joyful-card group relative w-48 h-48 rounded-2xl overflow-hidden flex items-center justify-center">
          {nblImage && <img src={nblImage} alt="NBL" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-opacity duration-500" />}
          <span className="z-10 text-2xl tracking-wider font-bold">NBL</span>
        </div>
      </div>

      <style>{`
        /* --- Joyful Theme Styles --- */
        .joyful-container {
            background: linear-gradient(-45deg, #1c0f8bff, #161314ff, #192327ff, #126d58ff);
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
        }
        @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .select-none h1, .select-none p {
            text-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }

        /* --- ENHANCED CARD STYLES --- */
        .joyful-card {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
            cursor: pointer;
            position: relative; /* Required for the glowing border */
            z-index: 10;
            transition: transform 0.4s ease-out, box-shadow 0.4s ease-out;
        }
        .joyful-card span {
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        /* The glowing border element */
        .joyful-card::before {
            content: "";
            position: absolute;
            z-index: -1;
            top: -3px; left: -3px;
            width: calc(100% + 6px);
            height: calc(100% + 6px);
            border-radius: inherit;
            background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
            background-size: 300% 300%;
            filter: blur(10px);
            animation: gradientBG 5s ease infinite alternate;
            opacity: 0;
            transition: opacity 0.4s ease-out;
        }
        
        /* Card Hover Effects */
        .joyful-card:hover {
            transform: perspective(1000px) translateY(-10px) scale(1.08);
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }
        .joyful-card:hover::before {
            opacity: 0.8;
        }

        /* --- Floating Shapes --- */
        .shapes-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 1; }
        .shape { position: absolute; display: block; list-style: none; width: 20px; height: 20px; background: rgba(255, 255, 255, 0.2); animation: rise 25s linear infinite; bottom: -150px; }
        .shape:nth-child(1) { left: 25%; width: 80px; height: 80px; animation-delay: 0s; }
        .shape:nth-child(2) { left: 10%; width: 20px; height: 20px; animation-delay: 2s; animation-duration: 12s; }
        .shape:nth-child(3) { left: 70%; width: 20px; height: 20px; animation-delay: 4s; }
        .shape:nth-child(4) { left: 40%; width: 60px; height: 60px; animation-delay: 0s; animation-duration: 18s; }
        .shape:nth-child(5) { left: 65%; width: 20px; height: 20px; animation-delay: 0s; }
        .shape:nth-child(6) { left: 75%; width: 110px; height: 110px; animation-delay: 3s; }
        .shape:nth-child(7) { left: 35%; width: 150px; height: 150px; animation-delay: 7s; }
        .shape:nth-child(8) { left: 50%; width: 25px; height: 25px; animation-delay: 15s; animation-duration: 45s; }
        .shape:nth-child(9) { left: 20%; width: 15px; height: 15px; animation-delay: 2s; animation-duration: 35s; }
        .shape:nth-child(10) { left: 85%; width: 150px; height: 150px; animation-delay: 0s; animation-duration: 11s; }
        @keyframes rise {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; border-radius: 0; }
            100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; border-radius: 50%; }
        }

        /* --- Base & Transition Styles --- */
        .cursor { color: #ffdd40; animation: blink 1s steps(1) infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        .transition-overlay { position: fixed; inset: 0; z-index: 999;}
        .rocket { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); width: 30px; height: 100px; filter: drop-shadow(0 0 15px rgba(255, 180, 50, 0.8)); z-index: 2; }
        .rocket-body { width: 100%; height: 80%; background: linear-gradient(180deg, #e0e0e0, #a0a0a0); border-radius: 50% 50% 0 0; }
        .rocket-flame-intense { position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 15px; height: 30px; background: radial-gradient(circle, #fff 0%, #ffeb3b 50%, #ff9800 100%); border-radius: 50% 50% 20% 20%; filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8)); z-index: 3; }
        .rocket-flame { position: absolute; bottom: -60px; left: 50%; width: 20px; height: 80px; background: linear-gradient(to top, #ff4800, #ffb347, transparent); border-radius: 50% 50% 20% 20%; animation: flame-flicker 0.1s infinite alternate; z-index: 1; }
        @keyframes flame-flicker { 0% { transform: translateX(-50%) scale(1, 1); } 100% { transform: translateX(-50%) scale(1.1, 0.9); } }
        .rocket-smoke { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 200px; height: 200px; background: radial-gradient(ellipse at center, rgba(180,180,180,0.8) 0%, rgba(100,100,100,0.6) 50%, rgba(50,50,50,0) 70%); border-radius: 50%; filter: blur(15px); opacity: 0; z-index: 0; transform-origin: 50% 100%; }
        .water-container { position: fixed; inset: 0; z-index: 999; overflow: hidden; background-color: #0c243c; }
        .water-blob { position: absolute; width: 200vw; height: 200vw; left: 50%; transform: translateX(-50%); border-radius: 45%; top: 100%; }
        .blob1 { background: #00acee; z-index: 2; }
        .blob2 { background: #086e9e; border-radius: 42%; z-index: 1; }
        .bubble { position: absolute; z-index: 3; width: 10px; height: 10px; background-color: rgba(255, 255, 255, 0.3); border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.4); }
      `}</style>
    </div>
  );
};

export default ExploreSelect;