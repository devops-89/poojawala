import Link from "next/link";
import { FONTS } from "@/utils/fonts";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden flex flex-col pt-8 sm:pt-10 md:pt-12 pb-10 sm:pb-12 md:pb-16 min-h-[380px] sm:min-h-[460px] md:h-[calc(100vh-80px)]">
      {/* Background Image: Native picture for instantaneous discovery and paint */}
      <picture className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <source
          media="(max-width: 599px)"
          srcSet="/images/homeHero-mobile.webp"
        />
        <source
          media="(min-width: 600px)"
          srcSet="/images/homeHero.webp"
        />
        <img
          src="/images/homeHero-mobile.webp"
          alt="Hero background"
          width={750}
          height={422}
          // @ts-ignore
          fetchPriority="high"
          loading="eager"
          decoding="sync"
          className="absolute inset-0 w-full h-full object-cover object-right-top md:object-center"
        />
      </picture>

      {/* Dark gradient overlay for text readability */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] bg-gradient-to-b from-[#0c0602]/80 via-[#0c0602]/50 to-transparent sm:bg-gradient-to-r sm:from-[#0c0602]/85 sm:via-[#0c0602]/55 sm:to-transparent"
      />

      <div className="relative z-[2] w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex flex-col justify-center">
        <div className="max-w-xl my-auto">
          <h1
            style={{ fontFamily: FONTS.DM_SANS }}
            className="font-extrabold text-white text-[1.85rem] sm:text-4xl md:text-5xl leading-[1.2] tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] mb-3 sm:mb-4"
          >
            Sacred Rituals,
            <span className="block">Trusted Pandits,</span>
            <span className="block text-[#FFB300] mt-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              One Booking Away
            </span>
          </h1>

          <p
            style={{ fontFamily: FONTS.DM_SANS }}
            className="text-[#F1F5F9] font-medium text-sm sm:text-[15px] md:text-base leading-relaxed max-w-md drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] mb-6 sm:mb-8"
          >
            Book verified Pandits for Puja, Astrology, and Vastu — at home, at a
            temple, or online — in under 5 minutes.
          </p>

          <div className="flex gap-3 sm:gap-4 flex-wrap">
            <Link
              href="/sign-up?from=book-now"
              prefetch={false}
              className="inline-flex items-center justify-center bg-[#FF6200] hover:bg-[#E05600] text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border-2 border-[#FF6200] shadow-[0_4px_14px_rgba(255,98,0,0.4)] transition-all duration-300"
            >
              Book Now
            </Link>
            <Link
              href="/astrologers"
              prefetch={false}
              className="inline-flex items-center justify-center bg-white/10 hover:bg-[#FF6200] hover:border-[#FF6200] text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border-2 border-white/85 backdrop-blur-md transition-all duration-300"
            >
              Talk to an Astrologer
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
