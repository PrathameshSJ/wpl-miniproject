import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Timer, Award, Star, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GameView() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('bakemaster_highscore') || '0', 10);
  });
  const [stars, setStars] = useState(0);

  // Target Customer Order
  const [targetOrder, setTargetOrder] = useState({
    base: 'Chocolate Sponge',
    frosting: 'Vanilla Buttercream',
    topping: 'Glazed Cherry',
  });

  // Current Player Built Cake
  const [currentCake, setCurrentCake] = useState({
    base: null,
    frosting: null,
    topping: null,
  });

  const [feedback, setFeedback] = useState(null);

  const bases = [
    { id: 'Chocolate Sponge', label: 'Chocolate', color: '#5B301A', icon: '🍫' },
    { id: 'Vanilla Sponge', label: 'Vanilla', color: '#F3E5AB', icon: '🍦' },
    { id: 'Red Velvet Sponge', label: 'Red Velvet', color: '#8B1E1E', icon: '❤️' },
  ];

  const frostings = [
    { id: 'Vanilla Buttercream', label: 'Vanilla Frosting', color: '#FFFDD0', icon: '🧁' },
    { id: 'Dark Ganache', label: 'Dark Ganache', color: '#3A1E0D', icon: '🟫' },
    { id: 'Strawberry Cream', label: 'Strawberry Frosting', color: '#FFB7C5', icon: '🍓' },
  ];

  const toppings = [
    { id: 'Glazed Cherry', label: 'Glazed Cherry', icon: '🍒' },
    { id: 'Rainbow Sprinkles', label: 'Rainbow Sprinkles', icon: '🎊' },
    { id: 'Chocolate Flakes', label: 'Choco Flakes', icon: '✨' },
  ];

  const generateNewOrder = () => {
    const randomBase = bases[Math.floor(Math.random() * bases.length)].id;
    const randomFrosting = frostings[Math.floor(Math.random() * frostings.length)].id;
    const randomTopping = toppings[Math.floor(Math.random() * toppings.length)].id;

    setTargetOrder({
      base: randomBase,
      frosting: randomFrosting,
      topping: randomTopping,
    });

    setCurrentCake({
      base: null,
      frosting: null,
      topping: null,
    });
  };

  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(60);
    setScore(0);
    setStars(0);
    setFeedback(null);
    generateNewOrder();
  };

  useEffect(() => {
    if (!isPlaying) return;

    if (timeLeft <= 0) {
      setIsPlaying(false);
      // Game over, calculate stars
      let finalStars = 1;
      if (score >= 500) finalStars = 3;
      else if (score >= 300) finalStars = 2;
      setStars(finalStars);

      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('bakemaster_highscore', score.toString());
        confetti({ particleCount: 120, spread: 90 });
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, score, highScore]);

  const handleSubmitCake = () => {
    if (!currentCake.base) {
      setFeedback({ type: 'warn', msg: 'Please add a cake base first!' });
      return;
    }

    const baseMatch = currentCake.base === targetOrder.base;
    const frostingMatch = currentCake.frosting === targetOrder.frosting;
    const toppingMatch = currentCake.topping === targetOrder.topping;

    if (baseMatch && frostingMatch && toppingMatch) {
      // Perfect match!
      setScore((prev) => prev + 100);
      setFeedback({ type: 'success', msg: 'Perfect Bake! +100 Points!' });
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      setTimeout(generateNewOrder, 700);
    } else {
      // Mistake
      setScore((prev) => Math.max(0, prev - 20));
      setFeedback({ type: 'error', msg: 'Recipe mismatch! -20 Points. Try again!' });
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center pt-4">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Purble Palace Inspired</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">
          BakeMaster Arcade Challenge
        </h1>
        <p className="text-xs text-ink-muted mt-1.5 max-w-md mx-auto">
          Fulfill rush orders on the bakery conveyor before time runs out. Match base, frosting, and topping perfectly!
        </p>
      </div>

      {/* Main Game Station */}
      <div className="rounded-3xl bg-[#2C1810] text-white p-6 sm:p-10 shadow-2xl border border-amber-900/60 relative overflow-hidden">
        {/* Game Ambient Highlights */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        {/* Status Bar */}
        <div className="flex items-center justify-between bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 mb-8">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Timer className="w-5 h-5" />
            <span className="text-lg font-mono">00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <span className="text-[10px] text-white/60 uppercase tracking-widest block">Score</span>
              <span className="font-serif font-bold text-2xl text-amber-300">{score}</span>
            </div>
            <div>
              <span className="text-[10px] text-white/60 uppercase tracking-widest block">Best</span>
              <span className="font-serif font-bold text-lg text-white/80">{highScore}</span>
            </div>
          </div>
        </div>

        {!isPlaying && timeLeft === 60 ? (
          /* Start Screen */
          <div className="text-center py-16 space-y-6">
            <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center mx-auto text-5xl shadow-lg shadow-primary/20 animate-bounce">
              🎂
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-bold text-white">Ready to Bake?</h2>
              <p className="text-white/70 text-sm max-w-md mx-auto">
                Customer cake orders will appear on the left. Tap the dispensers to assemble the matching cake, then hit "Send Cake"!
              </p>
            </div>
            <button
              onClick={startGame}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-primary text-white font-bold text-base shadow-lg shadow-orange-500/30 hover:scale-105 transition-all active:scale-95 flex items-center gap-2 mx-auto"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Start Game</span>
            </button>
          </div>
        ) : !isPlaying && timeLeft <= 0 ? (
          /* Game Over Screen */
          <div className="text-center py-12 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">Time's Up!</span>
              <h2 className="font-serif text-4xl font-bold text-white">Shift Completed</h2>
            </div>

            <div className="flex justify-center gap-2 text-amber-400 my-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-8 h-8 ${i < stars ? 'fill-amber-400 text-amber-400' : 'text-stone-600'}`}
                />
              ))}
            </div>

            <div className="bg-white/10 max-w-xs mx-auto p-4 rounded-2xl border border-white/10 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Final Score:</span>
                <span className="font-bold text-amber-300 text-lg">{score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Session Best:</span>
                <span className="font-bold text-white">{highScore}</span>
              </div>
            </div>

            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg hover:bg-primary-hover transition-all flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
          </div>
        ) : (
          /* Active Game Workspace */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Target Order Card */}
            <div className="md:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                  Order Ticket #101
                </span>
                <span className="text-xs bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  +100 pts
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-black/20">
                  <span className="text-white/60">Base:</span>
                  <span className="font-bold text-white">{targetOrder.base}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-black/20">
                  <span className="text-white/60">Frosting:</span>
                  <span className="font-bold text-white">{targetOrder.frosting}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-black/20">
                  <span className="text-white/60">Topping:</span>
                  <span className="font-bold text-white">{targetOrder.topping}</span>
                </div>
              </div>
            </div>

            {/* Cake Conveyor Stage */}
            <div className="md:col-span-8 flex flex-col items-center justify-center space-y-6">
              {/* Cake Assembly Visual */}
              <div className="w-56 h-56 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center justify-center p-4 relative shadow-inner">
                {currentCake.base ? (
                  <div className="flex flex-col items-center animate-in zoom-in-75 duration-200">
                    {/* Topping */}
                    {currentCake.topping && (
                      <span className="text-3xl animate-bounce -mb-2 z-20">
                        {toppings.find((t) => t.id === currentCake.topping)?.icon}
                      </span>
                    )}

                    {/* Frosting */}
                    {currentCake.frosting && (
                      <div
                        className="w-24 h-6 rounded-t-xl shadow-md border-b border-black/10 z-10 -mb-1"
                        style={{
                          backgroundColor:
                            frostings.find((f) => f.id === currentCake.frosting)?.color || '#FFFDD0',
                        }}
                      />
                    )}

                    {/* Base */}
                    <div
                      className="w-32 h-16 rounded-b-xl shadow-xl flex items-center justify-center border-t border-white/10"
                      style={{
                        backgroundColor:
                          bases.find((b) => b.id === currentCake.base)?.color || '#5B301A',
                      }}
                    >
                      <span className="text-xs font-bold text-white/80">{currentCake.base}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-white/40 text-xs italic">
                    [ Empty Conveyor Plate ]<br />Select a base below
                  </div>
                )}
              </div>

              {/* Feedback toast */}
              {feedback && (
                <div
                  className={`text-xs px-4 py-1.5 rounded-full font-bold ${
                    feedback.type === 'success'
                      ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}
                >
                  {feedback.msg}
                </div>
              )}

              {/* Assembly Buttons Controls */}
              <div className="w-full space-y-3">
                {/* 1. Base */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-white/60 w-16">Base:</span>
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    {bases.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setCurrentCake({ ...currentCake, base: b.id })}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                          currentCake.base === b.id
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'bg-white/10 border-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {b.icon} {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Frosting */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-white/60 w-16">Frosting:</span>
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    {frostings.map((fr) => (
                      <button
                        key={fr.id}
                        onClick={() => setCurrentCake({ ...currentCake, frosting: fr.id })}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                          currentCake.frosting === fr.id
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'bg-white/10 border-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {fr.icon} {fr.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Topping */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-white/60 w-16">Topping:</span>
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    {toppings.map((top) => (
                      <button
                        key={top.id}
                        onClick={() => setCurrentCake({ ...currentCake, topping: top.id })}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                          currentCake.topping === top.id
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'bg-white/10 border-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {top.icon} {top.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 w-full pt-2">
                <button
                  onClick={() =>
                    setCurrentCake({
                      base: null,
                      frosting: null,
                      topping: null,
                    })
                  }
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                >
                  Clear Plate
                </button>
                <button
                  onClick={handleSubmitCake}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-primary hover:opacity-95 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  🚀 Send Cake to Customer!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
