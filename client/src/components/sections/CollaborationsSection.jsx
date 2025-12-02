import feature1 from "../../assets/illustrations/feature1.svg";
import feature2 from "../../assets/illustrations/feature2.svg";
import feature3 from "../../assets/illustrations/feature3.svg";
import feature4 from "../../assets/illustrations/feature4.svg";

export default function CollaborationsSection() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16 mt-6 md:mt-8">
      <h2 className="text-3xl md:text-4xl lg:text-[53px] font-bold text-center mb-8 md:mb-10 lg:mb-12">
        <span className="text-[#003F7D]">Our</span>{" "}
        <span className="text-[#FF8B36]">Collaborations</span>
      </h2>
      <div className="flex justify-center gap-6 md:gap-8 lg:gap-12 flex-wrap items-center">
        {[feature1, feature2, feature3, feature4].map((featureImg, idx) => (
          <div key={idx} className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32">
            <img
              src={featureImg}
              alt={`Collaboration ${idx + 1}`}
              loading="lazy"
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
