export function Loader() {
  return (
    <>
      <div className=".loader" />
      <style>{`        
        .loader {
          width: 80px;
          aspect-ratio: 1;
          border: 10px solid #0000;
          padding: 5px;
          box-sizing: border-box;
          background:
            radial-gradient(farthest-side, #fff 98%, #0000) 0 0/20px 20px
              no-repeat,
            conic-gradient(from 90deg at 10px 10px, #0000 90deg, #fff 0)
              content-box,
            conic-gradient(from -90deg at 40px 40px, #0000 90deg, #fff 0)
              content-box,
            #000;
          filter: blur(4px) contrast(10);
          animation: l11 2s infinite;
        }
        @keyframes l11 {
          0% {
            background-position: 0 0;
          }
          25% {
            background-position: 100% 0;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 0% 100%;
          }
          100% {
            background-position: 0% 0;
          }
        }
      `}</style>
    </>
  );
}
