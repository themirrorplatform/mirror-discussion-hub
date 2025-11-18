interface FooterProps {
  /**
   * Main marketing site / landing page.
   * Used for "Return to Website" link.
   */
  websiteUrl?: string;
}

export function Footer({ websiteUrl = "https://mirrorplatform.online" }: FooterProps) {
  return (
    <footer className="border-t border-[#232323] bg-[#0E0E0E] mt-20">
      {/* Gold Divider with Reflection Effect */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#D6AF36] to-transparent opacity-30" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D6AF36] to-[#FFD700] flex items-center justify-center">
                <span className="text-black font-extrabold">M</span>
              </div>
              <span className="font-extrabold text-lg text-white">The Mirror</span>
            </div>
            <p className="text-[#BDBDBD] text-sm italic font-serif">
              &quot;Every post is a mirror; every response, a reflection.&quot;
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#about"
                  className="text-[#BDBDBD] hover:text-[#D6AF36] text-sm transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="text-[#BDBDBD] hover:text-[#D6AF36] text-sm transition-colors"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="text-[#BDBDBD] hover:text-[#D6AF36] text-sm transition-colors"
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#BDBDBD] hover:text-[#D6AF36] text-sm transition-colors"
                >
                  Return to Website
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-white mb-4">Community</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#guidelines"
                  className="text-[#BDBDBD] hover:text-[#D6AF36] text-sm transition-colors"
                >
                  Community Guidelines
                </a>
              </li>
              <li>
                <a
                  href="#help"
                  className="text-[#BDBDBD] hover:text-[#D6AF36] text-sm transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-[#BDBDBD] hover:text-[#D6AF36] text-sm transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-[#232323] text-center">
          <p className="text-[#BDBDBD] text-sm">
            © {new Date().getFullYear()} The Mirror Discussion Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
