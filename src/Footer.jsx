import emailjs from "emailjs-com";
import { useState } from "react";

const Footer = () => {
  const [loading, setLoading] = useState(false);

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

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="w-full font-sans">
      <div className="bg-white text-black py-4 px-6 md:px-6 border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto">
          <form
            onSubmit={sendEmail}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-12 items-start"
          >

            <div className="flex flex-col h-full">
              <div className="mb-8">
                <h4 className="text-lg font-semibold uppercase tracking-widest text-black mb-4">
                  CONTACT
                </h4>
                <h2 className="text-5xl md:text-6xl font-light tracking-tight leading-tight">
                  SEND US YOUR QUERY.
                </h2>
              </div>

              <div className="flex flex-col space-y-4">
                <input
                  name="from_name"
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full border-2 border-gray-800 rounded-full py-3 px-6 text-lg placeholder-gray-700 focus:outline-none focus:border-black bg-transparent transition-colors"
                />
                <input
                  name="from_email"
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full border-2 border-gray-800 rounded-full py-3 px-6 text-lg placeholder-gray-700 focus:outline-none focus:border-black bg-transparent transition-colors"
                />
                <input
                  name="company"
                  type="text"
                  placeholder="Company Name"
                  className="w-full border-2 border-gray-800 rounded-full py-3 px-6 text-lg placeholder-gray-700 focus:outline-none focus:border-black bg-transparent transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col h-full justify-between">
              
              <div className="mb-4">
                <p className="text-black text-lg md:text-xl leading-relaxed font-light max-w-lg">
                  If you are looking for a team to support you in the development of
                  your project, don't hesitate to contact us. <br /><br />
                  We are available to carry out your project.
                </p>
              </div>

              <textarea
                name="message"
                placeholder="Message"
                required
                className="w-full border-2 border-gray-800 rounded-[30px] p-6 text-lg placeholder-gray-700 focus:outline-none focus:border-black bg-transparent min-h-[140px] resize-none mb-4"
              ></textarea>

              <div className="flex flex-col md:flex-row items-center justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto bg-black text-white rounded-full px-12 py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                  {loading ? "Sending..." : "Submit"}
                </button>

                <button
                  type="button"
                  onClick={scrollToTop}
                  className="group flex items-center gap-3 text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity"
                >
                  Back to top
                  <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                    <svg
                      width="12"
                      height="12"
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

      <div className="bg-black text-white py-6 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-md font-semibold uppercase tracking-wider">
          <div className="flex gap-8">
            <a href="https://www.linkedin.com/company/austin-legacy-corp/" className="hover:text-gray-400 transition-colors">LinkedIn</a>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
            <a href="" className="transition-colors">Privacy Policy</a>
            <span className="text-gray-500">ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
