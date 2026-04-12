// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { HeartFilled } from "@ant-design/icons";
// import "./likehearts.css";
// import { apiFetchTongQuat } from "../../services/apiTongQuat";

// export default function LikeHearts({ postId, initialCount }) {
//   // lấy giá trị đầu tiên một cách an toàn
//   const safeNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

//   const [count, setCount] = useState(() => safeNum(initialCount));
//   const [animPulse, setAnimPulse] = useState(false);
//   const wrapRef = useRef(null);
//   const [particles, setParticles] = useState([]);

//   // ✅ đồng bộ lại khi dữ liệu props cập nhật
//   useEffect(() => {
//     setCount(safeNum(initialCount));
//   }, [initialCount, postId]);

//   const likePost = async (id) => {
//     const res = await apiFetchTongQuat(`/bai-viet/${id}/like`, {
//       method: "POST",
//     });
//     // LƯU Ý: nếu backend trả { data: { likeCount } }, bạn cần lấy res?.data?.data?.likeCount
//     return res?.data; // tuỳ response của bạn
//   };

//   const spawnHearts = (x, y) => {
//     const howMany = 4 + Math.floor(Math.random() * 3);
//     const now = Date.now();
//     const rect = wrapRef.current?.getBoundingClientRect?.();
//     const originX = rect ? x - rect.left : 24;
//     const originY = rect ? y - rect.top : 24;
//     const arr = Array.from({ length: howMany }).map((_, i) => ({
//       id: `${now}-${i}`,
//       x: originX + (Math.random() * 20 - 10),
//       y: originY + (Math.random() * 10 - 5),
//       scale: 0.8 + Math.random() * 0.8,
//       dx: (Math.random() - 0.5) * 40,
//       dy: -(40 + Math.random() * 60),
//       dur: 600 + Math.random() * 400,
//       rot: (Math.random() - 0.5) * 80,
//     }));
//     setParticles((p) => [...p, ...arr]);
//     setTimeout(() => {
//       setParticles((p) => p.filter((it) => !arr.find((a) => a.id === it.id)));
//     }, 1000);
//   };

//   const onClick = useCallback(
//     async (e) => {
//       const clientX = e.clientX || (e.touches?.[0]?.clientX ?? 0);
//       const clientY = e.clientY || (e.touches?.[0]?.clientY ?? 0);

//       setCount((c) => c + 1); // optimistic
//       setAnimPulse(true);
//       spawnHearts(clientX, clientY);

//       try {
//         const res = await likePost(postId);
//         // ⚠️ kiểm tra đúng đường dẫn dữ liệu:
//         // const newCount = res?.data?.likeCount ?? res?.likeCount;
//         const newCount = res?.likeCount ?? res?.data?.likeCount;
//         if (newCount != null) setCount(safeNum(newCount));
//       } catch {
//         setCount((c) => Math.max(0, c - 1));
//       } finally {
//         setTimeout(() => setAnimPulse(false), 250);
//       }
//     },
//     [postId]
//   );

//   return (
//     <div ref={wrapRef} className="likeWrap">
//       <button
//         className={`likeBtn ${animPulse ? "pulse" : ""}`}
//         onClick={onClick}
//         aria-label="Yêu thích"
//       >
//         <HeartFilled className="heartIcon" />
//         <span className="likeCount">{count}</span>
//       </button>

//       {particles.map((p) => (
//         <span
//           key={p.id}
//           className="floatHeart"
//           style={{
//             left: p.x,
//             top: p.y,
//             "--tx": `${p.dx}px`,
//             "--ty": `${p.dy}px`,
//             "--rot": `${p.rot}deg`,
//             "--dur": `${p.dur}ms`,
//             transform: `translate(-50%, -50%) scale(${p.scale})`,
//           }}
//         >
//           ❤️
//         </span>
//       ))}
//     </div>
//   );
// }

// components/LikeHearts.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { HeartFilled } from "@ant-design/icons";
import "./likehearts.css";
import { apiFetchTongQuat } from "../../services/apiTongQuat";

export default function LikeHearts({
  postId,
  initialCount = 0,

  // 👇 props tùy biến kích thước
  size = "md", // 'sm' | 'md' | 'lg'
  iconSize, // px (ưu tiên nếu truyền)
  countSize, // px
  btnPadding, // số hoặc [py, px] (px)
  particleSize, // px (kích thước tim bay)

  className = "", // wrapper class
  style = {}, // wrapper style
}) {
  const safeNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

  // preset theo size
  const PRESET = {
    sm: { icon: 16, count: 12, py: 6, px: 10, particle: 14 },
    md: { icon: 20, count: 13, py: 10, px: 14, particle: 18 },
    lg: { icon: 28, count: 16, py: 12, px: 18, particle: 22 },
  };
  const base = PRESET[size] || PRESET.md;

  const py = Array.isArray(btnPadding) ? btnPadding[0] : btnPadding ?? base.py;
  const px = Array.isArray(btnPadding) ? btnPadding[1] : base.px;

  // CSS variables cho CSS tiêu thụ
  const cssVars = {
    "--lh-icon-size": `${iconSize ?? base.icon}px`,
    "--lh-count-size": `${countSize ?? base.count}px`,
    "--lh-btn-py": `${py}px`,
    "--lh-btn-px": `${px}px`,
    "--lh-particle-size": `${particleSize ?? base.particle}px`,
  };

  const [count, setCount] = useState(() => safeNum(initialCount));
  const [animPulse, setAnimPulse] = useState(false);
  const wrapRef = useRef(null);
  const [particles, setParticles] = useState([]);

  // đồng bộ khi initialCount/postId đổi
  useEffect(() => {
    setCount(safeNum(initialCount));
  }, [initialCount, postId]);

  const likePost = async (id) => {
    const res = await apiFetchTongQuat(`/bai-viet/${id}/like`, {
      method: "POST",
    });
    return res?.data; // { likeCount, _id } (điều chỉnh theo API thực tế của bạn)
  };

  const spawnHearts = (x, y) => {
    const howMany = 4 + Math.floor(Math.random() * 3);
    const now = Date.now();
    const rect = wrapRef.current?.getBoundingClientRect?.();
    const originX = rect ? x - rect.left : 24;
    const originY = rect ? y - rect.top : 24;

    const arr = Array.from({ length: howMany }).map((_, i) => ({
      id: `${now}-${i}`,
      x: originX + (Math.random() * 20 - 10),
      y: originY + (Math.random() * 10 - 5),
      scale: 0.8 + Math.random() * 0.8,
      dx: (Math.random() - 0.5) * 40,
      dy: -(40 + Math.random() * 60),
      dur: 600 + Math.random() * 400,
      rot: (Math.random() - 0.5) * 80,
    }));
    setParticles((p) => [...p, ...arr]);
    setTimeout(() => {
      setParticles((p) => p.filter((it) => !arr.find((a) => a.id === it.id)));
    }, 1000);
  };

  const onClick = useCallback(
    async (e) => {
      const clientX = e.clientX || (e.touches?.[0]?.clientX ?? 0);
      const clientY = e.clientY || (e.touches?.[0]?.clientY ?? 0);

      setCount((c) => c + 1); // optimistic
      setAnimPulse(true);
      spawnHearts(clientX, clientY);

      try {
        const res = await likePost(postId);
        const newCount = res?.likeCount ?? res?.data?.likeCount;
        if (newCount != null) setCount(safeNum(newCount));
      } catch {
        setCount((c) => Math.max(0, c - 1));
      } finally {
        setTimeout(() => setAnimPulse(false), 250);
      }
    },
    [postId]
  );

  return (
    <div
      ref={wrapRef}
      className={`likeWrap ${className}`}
      style={{ ...cssVars, ...style }}
    >
      <button
        className={`likeBtn ${animPulse ? "pulse" : ""}`}
        onClick={onClick}
        aria-label="Yêu thích"
      >
        <HeartFilled className="heartIcon" />
        <span className="likeCount">{count}</span>
      </button>

      {particles.map((p) => (
        <span
          key={p.id}
          className="floatHeart"
          style={{
            left: p.x,
            top: p.y,
            "--tx": `${p.dx}px`,
            "--ty": `${p.dy}px`,
            "--rot": `${p.rot}deg`,
            "--dur": `${p.dur}ms`,
            transform: `translate(-50%, -50%) scale(${p.scale})`,
          }}
        >
          ❤️
        </span>
      ))}
    </div>
  );
}
