import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, Heart } from "lucide-react"; // ✅ Added Heart

export default function Footer() {
  const whatsappNumber = "917842096520";
  const whatsappMessage = encodeURIComponent(
    "Hi StatureVogue!! I’m interested in your clothing collection. Can you help me?"
  );

  return (
    <footer className="bg-[#1F2B5B] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 border-b border-blue-800 pb-12">

          {/* --- BRANDING / ABOUT --- */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
<img 
  src="/logo2.png" 
  alt="Stature Vogue" 
  className="h-10 w-auto object-contain"
/>

               <span className="text-xl font-bold tracking-tighter text-white uppercase whitespace-nowrap">
                 STATURE VOGUE
               </span>
            </Link>
            
            <p className="text-sm text-gray-300 leading-relaxed mb-4 pr-4">
              Staturevogue defines modern comfort. Premium athleisure designed for the global traveler.
            </p>
          </div>

          {/* --- SHOP --- */}
          <div>
            <h3 className="font-bold text-[#F4C430] mb-4 uppercase tracking-wider text-sm">
              Shop
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/products?gender=Men" className="hover:text-white transition-colors">Men's Collection</Link></li>
              <li><Link to="/products?gender=Women" className="hover:text-white transition-colors">Women's Collection</Link></li>
              <li><Link to="/products?badge=NEW" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/products?badge=BESTSELLER" className="hover:text-white transition-colors">Bestsellers</Link></li>
            </ul>
          </div>

          {/* --- HELP --- */}
          <div>
            <h3 className="font-bold text-[#F4C430] mb-4 uppercase tracking-wider text-sm">
              Help
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
            </ul>
          </div>

          {/* --- CONTACT & SOCIAL --- */}
          <div>
            <h3 className="font-bold text-[#F4C430] mb-4 uppercase tracking-wider text-sm">
              Contact
            </h3>

            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F4C430]" />
                <span>+91 78420 96520</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F4C430]" />
                <span>staturevogue@gmail.com</span>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.instagram.com/stature_vogue?igsh=MW1va21renNjdXl4bw%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 hover:text-[#F4C430] transition" />
              </a>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                  alt="WhatsApp"
                  className="w-5 h-5 hover:opacity-80 transition"
                />
              </a>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION --- */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">

          <div>
            © 2026 STATUREVOGUE. All rights reserved.
          </div>

          {/* StaffArc Branding */}
          <div className="flex justify-center items-center gap-1">
            Made with <Heart className="inline h-4 w-4 text-red-500 mx-1 fill-current" /> by
            <a
              href="https://staffarc.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#F4C430] hover:underline hover:text-white transition-colors"
            >
              <img
                src="https://www.staffarc.in/images/Staffarc-logo.png"
                alt="StaffArc logo"
                className="h-5 w-5 object-contain"
              />
              StaffArc
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}