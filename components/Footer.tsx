import Link from "next/link";
import { Facebook, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#0d061e] border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-center md:text-left">
          <div className="col-span-1 md:col-span-1 flex flex-col items-center md:items-start">
            <Link href="/" className="mb-6 block">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span className="p-1.5 bg-primary/20 rounded-lg">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 10a5 5 0 1110 0 5 5 0 01-10 0z" />
                  </svg>
                </span>
                Career<span className="text-primary font-extrabold italic">Pulse</span>
              </h2>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Enhancing the hiring experience for both recruiters and applicants with modern tools and data-driven insights.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-6">Product</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Find Jobs</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Companies</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-6">Company</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-6">Social</h3>
            <div className="flex space-x-4">
              <Link href="#" className="p-2 bg-white/5 rounded-lg hover:bg-primary/20 hover:text-primary transition-all">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="p-2 bg-white/5 rounded-lg hover:bg-primary/20 hover:text-primary transition-all">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 CareerPulse. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
