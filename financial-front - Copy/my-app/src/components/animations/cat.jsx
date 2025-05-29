import { useEffect, useState } from "react";

const AnimatedCat = () => {
  const [pos, setPos] = useState({ x: null, y: null });

  useEffect(() => {
    const catWrapper = document.querySelector(".cat_wrapper");
    const cat = document.querySelector(".cat");
    const head = document.querySelector(".cat_head");
    const legs = document.querySelectorAll(".leg");
    const wrapper = document.querySelector(".wrapper");

    const walk = () => {
      cat.classList.remove("first_pose");
      legs.forEach((leg) => leg.classList.add("walk"));
    };

    const handleMouseMotion = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      walk();
    };

    const turnRight = () => {
      cat.style.left = `${pos.x - 90}px`;
      cat.classList.remove("face_left");
      cat.classList.add("face_right");
    };

    const turnLeft = () => {
      cat.style.left = `${pos.x + 10}px`;
      cat.classList.remove("face_right");
      cat.classList.add("face_left");
    };

    const decideTurnDirection = () => {
      if (cat.getBoundingClientRect().x < pos.x) {
        turnRight();
      } else {
        turnLeft();
      }
    };

    const headMotion = () => {
       const wrapper = document.querySelector('.wrapper');
  if (!wrapper) return; 
      head.style.top = pos.y > wrapper.clientHeight - 100 ? "-15px" : "-30px";
    };

    const jump = () => {
      const catWrapper = document.querySelector('.cat_wrapper');
  const wrapper = document.querySelector('.wrapper'); 
  if (!catWrapper || !wrapper) return; 
      catWrapper.classList.remove("jump");
      if (pos.y < wrapper.clientHeight - 250) {
        setTimeout(() => {
          catWrapper.classList.add("jump");
        }, 100);
      }
    };

    const decideStop = () => {
      if (
        (cat.classList.contains("face_right") && pos.x - 90 === cat.offsetLeft) ||
        (cat.classList.contains("face_left") && pos.x + 10 === cat.offsetLeft)
      ) {
        legs.forEach((leg) => leg.classList.remove("walk"));
      }
    };

    document.addEventListener("mousemove", handleMouseMotion);
    const interval1 = setInterval(() => {
      if (!pos.x || !pos.y) return;
      decideTurnDirection();
      headMotion();
      decideStop();
    }, 100);

    const interval2 = setInterval(() => {
      if (!pos.x || !pos.y) return;
      jump();
    }, 1000);

    return () => {
      document.removeEventListener("mousemove", handleMouseMotion);
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, [pos]);

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#63ec85",
      }}
    >
      <div style={{ position: "absolute", height: "calc(100vh - 100px)", width: "100%", top: 0 }}>
        <div style={{ position: "absolute", bottom: 0 }} className="cat_wrapper">
          <div style={{ position: "absolute", bottom: "65px", left: "100px", height: "30px", width: "60px" }} className="cat first_pose">
            <div style={{ position: "absolute", height: "40px", width: "48px", right: "-10px", top: "-30px" }} className="cat_head"></div>
            <div style={{ position: "absolute", height: "30px", width: "60px" }} className="body"></div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, width: "100%", height: "150px", backgroundColor: "rgb(1, 143, 96)" }}></div>
    </div>
  );
};

export default AnimatedCat;
