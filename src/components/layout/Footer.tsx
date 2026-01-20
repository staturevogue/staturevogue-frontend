import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Mail } from "lucide-react";

export default function Footer() {
  const whatsappNumber = "919876543210"; // 👉 replace with client's WhatsApp number (with country code)
  const whatsappMessage = encodeURIComponent(
    "Hi StatureVogue 👋 I’m interested in your clothing collection. Can you help me?"
  );

  return (
    <footer className="bg-[#1F2B5B] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 border-b border-blue-800 pb-12">

          {/* About */}
          <div>
            <h3 className="font-bold text-[#F4C430] mb-4 uppercase tracking-wider text-sm">
              About
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              Staturevogue defines modern comfort. Premium athleisure designed for the global traveler.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-bold text-[#F4C430] mb-4 uppercase tracking-wider text-sm">
              Shop
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/products?gender=Men" className="hover:text-white">Men's Collection</Link></li>
              <li><Link to="/products?gender=Women" className="hover:text-white">Women's Collection</Link></li>
              <li><Link to="/products?collection=new" className="hover:text-white">New Arrivals</Link></li>
              <li><Link to="/products?collection=bestsellers" className="hover:text-white">Bestsellers</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-bold text-[#F4C430] mb-4 uppercase tracking-wider text-sm">
              Help
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link to="/returns" className="hover:text-white">Returns & Exchanges</Link></li>
              <li><Link to="/shipping" className="hover:text-white">Shipping Policy</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-bold text-[#F4C430] mb-4 uppercase tracking-wider text-sm">
              Contact
            </h3>

            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                staturevogue@gmail.com
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex gap-4 mt-6">

              {/* Instagram */}
              <a
                href="https://www.instagram.com/stature_vogue?igsh=MW1va21renNjdXl4bw%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 hover:text-[#F4C430] transition" />
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/1CvbfpGJCz/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 hover:text-[#F4C430] transition" />
              </a>

              {/* WhatsApp */}
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

        <div className="text-center text-sm text-gray-400">
          © 2026 STATUREVOGUE. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
