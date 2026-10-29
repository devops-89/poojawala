import headphone from "@/public/images/home/hero/headphone.webp";
import lock from "@/public/images/home/hero/lock.webp";
import righttick from "@/public/images/home/hero/righttick.webp";
import Image from "next/image";

const features = [
  {
    icon: righttick,
    title: "Trusted Purohit",
    subtitle: "Verified & Experienced",
  },
  {
    icon: lock,
    title: "Secure Booking",
    subtitle: "Safe & Reliable",
  },
  {
    icon: headphone,
    title: "24/7 Support",
    subtitle: "Here For You",
  },
];

export default function Features() {
  return (
    <section className="bg-gradient-to-b from-[#FFE1C3]/95 to-white py-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-around md:justify-between items-start gap-2 md:gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center gap-1 md:gap-3 text-center md:text-left"
            >
              <Image
                src={feature.icon}
                alt={feature.title}
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
              />
              <div>
                <p className="font-semibold text-[#1A1A1A] leading-tight text-xs sm:text-sm md:text-base">
                  {feature.title}
                </p>
                <p className="text-[#666] text-[11px] sm:text-xs md:text-sm">
                  {feature.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
