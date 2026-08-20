import { Mail, Phone, MessageCircle } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl">

        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-blue-400 font-semibold uppercase tracking-widest text-sm mb-3">
            Get in Touch
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact ProcureHub
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Have a question, need assistance, or want to know more about
            ProcureHub? We're here to help.
          </p>
        </div>

        {/* Contact Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 md:p-10">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Email */}
            <div className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition duration-300">
              <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center mb-5">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>

              <h3 className="text-xl font-semibold mb-2">
                Email Us
              </h3>

              <p className="text-gray-400 text-sm mb-3">
                For general enquiries and support
              </p>

              <a
                href="mailto:support@procurehub.com"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                support@procurehub.com
              </a>
            </div>

            {/* Phone */}
            <div className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition duration-300">
              <div className="w-12 h-12 rounded-lg bg-green-600/20 flex items-center justify-center mb-5">
                <Phone className="w-6 h-6 text-green-400" />
              </div>

              <h3 className="text-xl font-semibold mb-2">
                Call Us
              </h3>

              <p className="text-gray-400 text-sm mb-3">
                For direct assistance
              </p>

              <a
                href="tel:+918109777232"
                className="text-green-400 hover:text-green-300 transition"
              >
                +91 8109777232
              </a>
            </div>

          </div>

          {/* Bottom Message */}
          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-center gap-3 text-center">
            <MessageCircle className="w-5 h-5 text-blue-400" />

            <p className="text-gray-400">
              We're happy to assist you with any questions about ProcureHub.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;