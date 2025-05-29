import React, { useEffect, useRef } from 'react';

const TreeAnimation = ({ progress }) => {
  const canvasRef = useRef(null);

  // Easing function
  const easeOutQuad = (t, b, c, d) => {
    t /= d;
    return -c * t * (t - 2) + b;
  };

  // Recursive drawing function
  const drawLine = (ctx, gen, t) => {
    const localTime = Math.min(t, 1);
    const length = easeOutQuad(localTime, 0, 65 * Math.pow(0.6, gen), 1);
    let thickness = easeOutQuad(localTime, 0, 12 * Math.pow(0.7, gen), 1);
    thickness = gen >= 7 ? Math.max(9.5, thickness) : Math.max(0.5, thickness);


    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.strokeStyle = gen < 7 ? '#502000' : '#0f0';
    ctx.lineWidth = thickness;
    ctx.lineTo(length, 0);
    ctx.stroke();

    const nextT = t - 0.1;
    if (gen < 10 && nextT >= 0) {
      ctx.save();
      ctx.translate(length, 0);
      ctx.rotate(Math.PI / 5);
      drawLine(ctx, gen + 1, nextT);
      ctx.restore();

      ctx.save();
      ctx.translate(length, 0);
      ctx.rotate(-Math.PI / 8);
      drawLine(ctx, gen + 1, nextT);
      ctx.restore();
    }
  };

  const drawTree = (percent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth;
    const h = canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w / 2, h);
    ctx.rotate(-Math.PI / 2);
    drawLine(ctx, 0, percent / 100);
    ctx.restore();
  };

  useEffect(() => {
    drawTree(progress);
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        width: '80%',
        height: '100%',
        display: 'block',
         pointerEvents: 'none',
        // backgroundImage: 'linear-gradient(0deg, #383e97, #120079)',
        zIndex: 0,
      }}
    />
  );
};

export default TreeAnimation;
