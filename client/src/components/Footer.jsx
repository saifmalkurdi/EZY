import { useState } from "react";
import { Link } from "react-router-dom";
import logoFooter from "../assets/images/logoFooter.png";
import address from "../assets/icons/address.svg";
import emailIcon from "../assets/icons/emailIcon.svg";
import phoneIcon from "../assets/icons/phoneIcon.svg";
import facebookIcon from "../assets/icons/facebookIcon.svg";
import instagramIcon from "../assets/icons/instagramIcon.svg";
import linkedinIcon from "../assets/icons/LinkedinIcon.svg";
import twitterIcon from "../assets/icons/twitterIcon.svg";
import youtubeIcon from "../assets/icons/youtubeIcon.svg";

function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="bg-[#003F7D] text-white pt-12">
      <div className="max-w-[1400px] mx-auto px-8 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1.5fr] gap-12">
        <div>
          <img src={logoFooter} alt="EZY Skills" className="h-[50px] mb-4" />
          <p className="w-[500px]  text-[#FFFFFF] leading-[100%] font-normal mb-8 tracking-[-0.3px]">
            Let Us build your career together Be the first person to transform
            yourself with our unique & world class corporate level trainings.
          </p>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              Subscribe Our Newsletter
            </h3>
            <form onSubmit={handleSubscribe} className="flex  w-[463px]">
              <input
                type="email"
                placeholder="Your Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 border-b border-[#ffffff] opacity-50 text-[#ffffff] text-sm"
              />
              <button
                type="submit"
                className="bg-[#F98149] px-4 py-3 rounded-md hover:bg-[#F98149] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 4l8 8-8 8" stroke="white" strokeWidth="2" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-6">
            Quick <span className="text-[#F98149]">Links</span>
          </h3>
          <ul className="space-y-3">
            <li>
              <Link
                to="/"
                className="text-white/80 hover:text-[#F98149] text-sm transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/our-story"
                className="text-white/80 hover:text-[#F98149] text-sm transition-colors"
              >
                Our Story
              </Link>
            </li>
            <li>
              <Link
                to="/best-courses"
                className="text-white/80 hover:text-[#F98149] text-sm transition-colors"
              >
                Best Courses
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className="text-white/80 hover:text-[#F98149] text-sm transition-colors"
              >
                Your FAQ's
              </Link>
            </li>
            <li>
              <Link
                to="/cancellation"
                className="text-white/80 hover:text-[#F98149] text-sm transition-colors"
              >
                Cancellation & Refunds
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-white/80 hover:text-[#F98149] text-sm transition-colors"
              >
                Contact US
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-6">
            Contact <span className="text-[#F98149]">Us</span>
          </h3>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <img
                src={address}
                alt=""
                className="shrink-0 mt-1 w-[18.08px] h-[26.67px]"
              />
              <p className="text-white/80 text-sm leading-relaxed">
                Navalkethan Complex, 6th Floor, 505, 606 A&P opp. CLock Tower,
                SD Road, Secunderabad, Telangana 500003
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <img
                src={emailIcon}
                alt=""
                className="shrink-0 w-[18.08px] h-[26.67px]"
              />
              <p className="text-white/80 text-sm">info@ezyskills.in</p>
            </div>
            <div className="flex gap-4 items-start">
              <img
                src={phoneIcon}
                alt=""
                className="shrink-0 mt-1 w-[18.08px] h-[26.67px]"
              />
              <div className="text-white/80 text-sm space-y-1">
                <p>+91 8428448903</p>
                <p>+91 9475484959</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6">
        <div className="max-w-[1400px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-8">
            <Link className="text-white/80 hover:text-white text-sm transition-colors">
              Terms & Conditions
            </Link>
            <Link className="text-white/80 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
          </div>
          <div className="flex gap-4">
            {["facebook", "twitter", "instagram", "linkedin", "youtube"].map(
              (social) => (
                <a
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8  flex items-center justify-center hover:bg-[#F98149] transition-colors"
                >
                  <span className="sr-only">{social}</span>

                  <img
                    src={
                      social === "facebook"
                        ? facebookIcon
                        : social === "twitter"
                        ? twitterIcon
                        : social === "instagram"
                        ? instagramIcon
                        : social === "linkedin"
                        ? linkedinIcon
                        : youtubeIcon
                    }
                    alt=""
                    className="w-4 h-4"
                  />
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
