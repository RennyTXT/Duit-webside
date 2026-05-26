'use client';

import { useEffect, useRef } from 'react';

interface Product3DViewerProps {
  modelUrl: string;
  altText?: string;
  posterUrl?: string;
}

const Product3DViewer = ({ modelUrl, altText, posterUrl }: Product3DViewerProps) => {
  const modelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Import model-viewer only on client side
    import('@google/model-viewer');
  }, []);

  return (
    <div className="w-full h-full bg-transparent overflow-hidden relative group">
      {/* @ts-expect-error - model-viewer is a web component */}
      <model-viewer
        ref={modelRef}
        src={modelUrl}
        alt={altText || "Duit Product 3D Model"}
        poster={posterUrl}
        auto-rotate
        auto-rotate-delay="2000"
        camera-controls
        touch-action="pan-y"
        shadow-intensity="1.5"
        shadow-softness="1"
        environment-image="neutral"
        exposure="1.2"
        bounds="tight"
        min-camera-orbit="auto auto 5%"
        camera-orbit="0deg 75deg 105%"
        interpolation-decay="200"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent', '--poster-color': 'transparent' } as any}
        ar
        ar-modes="webxr scene-viewer quick-look"
      >
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-4 px-6 w-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-20">
          <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-luxury border border-neutral-100 flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-primary">
            <span>Hold to Rotate</span>
            <div className="w-px h-3 bg-neutral-200"></div>
            <span>Scroll to Zoom</span>
          </div>
          
          <button 
            slot="ar-button" 
            className="bg-accent-gold text-white px-8 py-3 rounded-full shadow-luxury text-[9px] font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95"
          >
            Launch AR
          </button>
        </div>
      {/* @ts-expect-error - model-viewer is a web component */}
      </model-viewer>
      
      <div className="absolute top-6 left-6 z-20">
        <span className="bg-primary text-white text-[9px] font-black uppercase tracking-ultra px-4 py-1.5 shadow-xl rounded-sm">
          Interactive 3D
        </span>
      </div>
    </div>
  );
};

export default Product3DViewer;
