import React, { useEffect, useRef } from 'react';
import ViewportDecryptedText from './ViewportDecryptedText';

const BackgroundVideo = ({ src }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(error => {
        if (isCancelled || error?.name === "AbortError") return;
        console.warn("Autoplay blocked, user interaction needed:", error);
      });
    }

    return () => {
      isCancelled = true;
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-cover absolute inset-0 opacity-90"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
};

const servicesData = [
  {
    id: 1, number: '1', category: 'Software Engineering',
    title: "We engineer scalable software solutions that drive real business growth.",
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4', 
    paras: ["Full-stack development tailored to your unique business requirements.", "Robust architecture ensuring high performance, security, and scale.", "Agile methodologies for rapid, iterative, and transparent delivery."]
  },
  {
    id: 2, number: '2', category: 'Cloud & DevOps',
    title: "We modernize your infrastructure for seamless, secure digital operations.",
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    paras: ["Strategic cloud migrations across AWS, Azure, and Google Cloud.", "Automated CI/CD pipelines to massively accelerate your release cycles.", "24/7 infrastructure monitoring and resilient, zero-downtime setups."]
  },
  {
    id: 3, number: '3', category: 'Data & AI',
    title: "We unlock the power of your data to drive intelligent, automated decisions.",
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    paras: ["Implementing predictive analytics and advanced machine learning models.", "Custom enterprise dashboards turning complex data into clear insights.", "Secure, high-performance data warehousing and pipeline engineering."]
  },
  {
    id: 4, number: '4', category: 'Product Design',
    title: "We design intuitive, enterprise-grade digital experiences that users love.",
    videoUrl: 'https://media.w3.org/2010/05/video/movie_300.mp4',
    paras: ["User-centric research and deep wireframing for complex workflows.", "Pixel-perfect, accessible interfaces that elevate your brand identity.", "Interactive, high-fidelity prototypes to validate ideas before coding."]
  }
];

const ITServices = ({ embedded = false }) => {
  const sectionBackground = embedded ? "rgba(6, 10, 18, 0.28)" : "#ffffff";

  return (
    <div
      className="relative font-sans w-full h-full how-we-do-strip"
      style={{
        background: sectionBackground,
        color: embedded ? "#f8fafc" : "#000000",
      }}
    >
      {servicesData.map((service) => (
        <section 
          key={service.id} 
          className="absolute inset-0 w-full h-full flex flex-col justify-center px-6 md:px-16 border-r how-we-do-item"
          style={{
            borderColor: embedded ? "rgba(255,255,255,0.16)" : "#e5e7eb",
          }}
        >
          <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_1.5fr_7fr] gap-8 md:gap-12 items-start">
            <div className="font-['Rajdhani'] font-bold text-[100px] lg:text-[14vw] leading-[0.75] tracking-tighter -mt-4">
              {service.number}
            </div>
            <div className={`hidden md:block font-['Rajdhani'] font-semibold text-lg lg:text-2xl pt-3 uppercase tracking-wide ${embedded ? "text-white/80" : "text-gray-800"}`}>
              <ViewportDecryptedText text={service.category} className="font-['Rajdhani']" />
            </div>
            <div className="flex flex-col w-full">
              <h2 className="font-['Rajdhani'] font-bold text-3xl md:text-5xl lg:text-[3vw] tracking-tight mb-8 leading-[1.05] max-w-[95%]">
                {service.title}
              </h2>
              <div className="w-full h-[30vh] min-h-[220px] max-h-[380px] rounded-2xl overflow-hidden bg-gray-900 mb-8 relative shadow-sm">
                <BackgroundVideo src={service.videoUrl} />
              </div>
              <div className="border-t border-gray-300 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                {service.paras.map((para, i) => (
                  <p key={i} className={`${embedded ? "text-white/68" : "text-gray-600"} text-sm lg:text-base leading-relaxed font-medium`}>
                    <ViewportDecryptedText text={para} />
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default ITServices;