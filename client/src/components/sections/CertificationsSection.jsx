import Group01 from "../../assets/illustrations/Group01.svg";
import Group02 from "../../assets/illustrations/Group02.svg";
import Group03 from "../../assets/illustrations/Group03.svg";
import Group04 from "../../assets/illustrations/Group04.svg";

export default function CertificationsSection() {
  return (
    <section className="py-8 md:py-12 lg:py-16 mt-6 md:mt-8">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-[53px] font-bold mb-8 md:mb-10 lg:mb-12">
          <span className="text-[#003F7D]">Our</span>{" "}
          <span className="text-[#FF8B36]">Certifications</span>
        </h2>
        <div className="flex justify-center gap-4 md:gap-6 lg:gap-8 flex-wrap">
          {[Group01, Group02, Group03, Group04].map((groupImg, idx) => (
            <div
              key={idx}
              className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40"
            >
              <img
                src={groupImg}
                alt={`Certification ${idx + 1}`}
                loading="lazy"
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
