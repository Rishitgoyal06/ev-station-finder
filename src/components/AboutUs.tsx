export default function AboutSection() {
  return (
    <>
      <section className="w-full bg-gradient-to-br from-emerald-950 via-black to-gray-950 pt-32 pb-20 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="relative z-10 max-w-6xl mx-auto bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left Side – Animated Clip */}
          <div className="w-full h-65 md:h-[360px] rounded-xl overflow-hidden bg-emerald-900/20 border border-emerald-400/30">
            {/* Replace with your animation / lottie / video */}
            <video
              src="/ev-charging-animation.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Side – About Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              About <span className="bg-gradient-to-r from-green-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent">CHARGEIQ</span>
            </h2>

            <p className="text-gray-300 leading-relaxed mb-4">
              <span className="font-semibold text-green-400">CHARGEIQ</span> is a smart
              EV-tech startup redefining how electric vehicle owners find, access,
              and manage charging. Built for convenience and reliability, our
              platform enables users to locate nearby charging stations, check
              real-time availability, book preferred time slots, and make advance
              payments — all through a seamless digital experience.
            </p>

            <p className="text-gray-300 leading-relaxed mb-4">
              We understand that <span className="font-semibold text-emerald-400">range anxiety</span>{" "}
              and long waiting times are major barriers to EV adoption. CHARGEIQ
              eliminates uncertainty by bringing intelligent charging discovery
              and scheduling right to your fingertips — saving time and ensuring
              stress-free journeys.
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              Driven by innovation and sustainability, we are committed to
              accelerating India's electric mobility ecosystem. Our technology
              supports EV users, charging station operators, and partners with
              data-driven insights and automation.
            </p>
          </div>
        </div>

        {/* Scroll Down Arrow */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-50">
          <a href="#vision-section" className="flex flex-col items-center text-green-400 hover:text-green-300 transition-colors group">
            <span className="flex mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                className="w-6 h-6 animate-bounce group-hover:animate-pulse"
                fill="currentColor"
              >
                <path d="M374.6 310.6l-160 160c-28.4 28.4-74.5 28.4-102.9 0l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 370.8 338.8 224c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25z" />
              </svg>
            </span>
            <span className="text-sm font-medium">
              Scroll<br />Down
            </span>
          </a>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision-section" className="w-full bg-gradient-to-br from-gray-950 via-emerald-950 to-black py-20 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side – Vision Content */}
          <div className="bg-emerald-900/30 border-l-4 border-green-400 rounded-lg p-8 backdrop-blur-sm">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Our Vision
            </h3>
            <p className="text-green-400 font-semibold text-lg mb-4">
              The Future Is Electric. The Future Is Now.
            </p>
            <p className="text-gray-300 leading-relaxed text-lg">
              We envision an India where EV adoption is effortless, accessible,
              and environmentally responsible — where charging is planned,
              optimized, and intelligent.
            </p>
          </div>

          {/* Right Side – Vision Image */}
          <div className="w-full h-80 md:h-96 rounded-xl overflow-hidden bg-emerald-900/20 border border-emerald-400/30">
            <img
              src="/vision-image.jpg"
              alt="Electric Vehicle Future Vision"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}