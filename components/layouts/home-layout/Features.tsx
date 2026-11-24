import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

const features = [
  {
    icon: GppGoodOutlinedIcon,
    title: "Trusted Purohit",
    subtitle: "Verified & Experienced",
  },
  {
    icon: LockOutlinedIcon,
    title: "Secure Booking",
    subtitle: "Safe & Reliable",
  },
  {
    icon: HeadsetMicOutlinedIcon,
    title: "24/7 Support",
    subtitle: "Here For You",
  },
];

export default function Features() {
  return (
    <section className="bg-gradient-to-b from-[#FFE1C3]/95 to-white py-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-around md:justify-between items-start gap-2 md:gap-4">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center gap-1 md:gap-3 text-center md:text-left"
              >
                <div className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 flex-shrink-0">
                  <IconComponent
                    sx={{
                      fontSize: { xs: 26, sm: 30, md: 34 },
                      color: COLORS.BRAND_ORANGE,
                    }}
                  />
                </div>
                <div>
                  <p
                    style={{ fontFamily: FONTS.OUTFIT }}
                    className="font-semibold text-[#1A1A1A] leading-tight text-xs sm:text-sm md:text-base"
                  >
                    {feature.title}
                  </p>
                  <p
                    style={{ fontFamily: FONTS.OUTFIT }}
                    className="text-[#666] text-[11px] sm:text-xs md:text-sm mt-0.5"
                  >
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
