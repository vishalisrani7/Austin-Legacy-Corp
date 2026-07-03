import emailjs from "emailjs-com";
import { useState } from "react";

const Footer = ({ theme, onBackToTop, embedded = false }) => {
  const [loading, setLoading] = useState(false);
  // Defaulting to Dark theme aesthetics as requested
  const isDark = true; 

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(
        "service_wq78eqo",
        "template_gqymy5e",
        e.target,
        "LRG5xJCiBSmlLrzWe"
      )
      .then(() => {
        alert("Message Sent Successfully 🎉");
        e.target.reset();
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to send! Try again.");
        setLoading(false);
      });
  };

  const scrollToTop = () => {
    if (onBackToTop) {
      onBackToTop();
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Define the input fields with their specific names and types
  const inputFields = [
    { placeholder: 'Full Name', name: 'from_name', type: 'text', required: true },
    { placeholder: 'Email Address', name: 'from_email', type: 'email', required: true },
    { placeholder: 'Company Name', name: 'company', type: 'text', required: false }
  ];

  return (
    <footer className="w-full font-sans transition-colors duration-500 bg-black text-white">
      <div
        className={`py-12 md:py-24 px-6 md:px-12 border-t border-white/10`}
        style={embedded ? { background: "rgba(6, 10, 18, 0.28)" } : undefined}
      >
        <div className="max-w-[1400px] mx-auto">
          <form
            onSubmit={sendEmail}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start"
          >

            <div className="flex flex-col h-full">
              <div className="mb-12">
                <h4 className="text-xl font-semibold uppercase tracking-widest mb-4 text-white/50">
                  CONTACT
                </h4>
                <h2 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none text-white">
                  SEND US<br />YOUR QUERY.
                </h2>
              </div>

              <div className="flex flex-col space-y-6">
                {/* Map over the new inputFields array */}
                {inputFields.map((field, i) => (
                   <input
                    key={i}
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full border-b border-white/20 py-4 text-xl focus:outline-none bg-transparent transition-colors placeholder-white/40 focus:border-white text-white"
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col h-full justify-between">
              
              <div className="mb-8 mt-2 lg:mt-32">
                <p className="text-xl md:text-2xl leading-relaxed font-light max-w-lg text-white/80">
                  If you are looking for a team to support you in the development of your project, don't hesitate to contact us.
                  <br /><br />
                  We are available to carry out your project.
                </p>
              </div>

              <textarea
                name="message"
                placeholder="Your Message..."
                required
                className="w-full border rounded-3xl border-white/20 p-8 text-xl focus:outline-none bg-white/5 backdrop-blur-sm min-h-[200px] resize-none mb-8 transition-colors placeholder-white/40 focus:border-white text-white"
              ></textarea>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto rounded-full px-16 py-5 text-sm font-bold uppercase tracking-widest transition-all bg-white text-black hover:bg-gray-200"
                >
                  {loading ? "Sending..." : "Submit"}
                </button>

                <button
                  type="button"
                  onClick={scrollToTop}
                  className="group flex items-center gap-4 text-sm font-bold uppercase tracking-widest hover:opacity-70 transition-opacity text-white"
                >
                  Back to top
                  <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center transition-colors group-hover:bg-white group-hover:text-black">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 15l-6-6-6 6" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>

      <div
        className="py-8 px-6 md:px-12 border-t border-white/10 bg-black text-white"
        style={embedded ? { background: "rgba(6, 10, 18, 0.28)" } : undefined}
      >
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm md:text-base font-semibold uppercase tracking-wider">
          <div className="flex gap-8">
            <a href="https://www.linkedin.com/company/austin-legacy-corp/" className="hover:text-gray-400 transition-colors">LinkedIn</a>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
            <a href="#" className="transition-colors hover:text-white/70 text-white/50">Privacy Policy</a>
            <span className="text-white/30">ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
