export const getPurohitPayoutRange = (serviceObj: any): string => {
  if (!serviceObj) return "₹0";

  // Can be a purohitService object (containing .service) or a raw service object
  const service = serviceObj.service || serviceObj;
  const plans = service?.plans || {};
  const commission = Number(service?.commissionPercentage ?? 10);

  // Basic Plan Payout
  const basicPlan = plans?.basic || {};
  const basicPrice = Number(
    basicPlan.price ?? service?.priceWithoutSamagri ?? service?.minPrice ?? 0
  );
  let basicPayout =
    basicPlan.basicPurohitPayoutAmount ??
    basicPlan.purohitPayoutAmount;

  if (basicPayout == null || basicPayout === undefined) {
    basicPayout = basicPrice > 0 ? Math.round(basicPrice * (1 - commission / 100)) : 0;
  }

  // Standard Plan Payout
  const standardPlan = plans?.standard || {};
  const standardPrice = Number(
    standardPlan.price ?? service?.priceWithSamagri ?? service?.maxPrice ?? 0
  );
  let standardPayout =
    standardPlan.standardPurohitPayoutAmount ??
    standardPlan.purohitPayoutAmount;

  if (standardPayout == null || standardPayout === undefined) {
    standardPayout = standardPrice > 0 ? Math.round(standardPrice * (1 - commission / 100)) : 0;
  }

  const numBasic = Number(basicPayout || 0);
  const numStandard = Number(standardPayout || 0);

  // Direct override on purohitService if present and > 0
  if (serviceObj.purohitPayoutAmount && Number(serviceObj.purohitPayoutAmount) > 0) {
    return `₹${Number(serviceObj.purohitPayoutAmount).toLocaleString("en-IN")}`;
  }

  if (numBasic > 0 && numStandard > 0 && numBasic !== numStandard) {
    const minP = Math.min(numBasic, numStandard);
    const maxP = Math.max(numBasic, numStandard);
    return `₹${minP.toLocaleString("en-IN")} - ₹${maxP.toLocaleString("en-IN")}`;
  } else if (numBasic > 0) {
    return `₹${numBasic.toLocaleString("en-IN")}`;
  } else if (numStandard > 0) {
    return `₹${numStandard.toLocaleString("en-IN")}`;
  }

  return "₹0";
};

export const getBookingPurohitPayoutDisplay = (booking: any): string => {
  if (!booking) return "₹0";

  // 1. Direct payout override from backend on booking
  if (booking.purohitPayoutAmount && Number(booking.purohitPayoutAmount) > 0) {
    return `₹${Number(booking.purohitPayoutAmount).toLocaleString("en-IN")}`;
  }

  const service = booking.service || {};
  const plans = service.plans || {};
  const commission = Number(service.commissionPercentage ?? 10);

  // 2. Determine selected plan (e.g., "BASIC", "STANDARD", "WITHOUT_SAMAGRI", "WITH_SAMAGRI")
  const rawPlan = (
    booking.plan ||
    booking.selectedPlan ||
    booking.packageType ||
    booking.planName ||
    ""
  )
    .toString()
    .toLowerCase();

  if (rawPlan) {
    const isStandard =
      rawPlan.includes("standard") ||
      rawPlan.includes("with_samagri") ||
      rawPlan.includes("premium");
    const isBasic =
      rawPlan.includes("basic") ||
      rawPlan.includes("without_samagri") ||
      rawPlan.includes("essential");

    if (isStandard) {
      const standardPlan = plans.standard || {};
      const standardPrice = Number(
        standardPlan.price ??
          booking.priceWithSamagri ??
          service.priceWithSamagri ??
          service.maxPrice ??
          0
      );
      let standardPayout =
        standardPlan.standardPurohitPayoutAmount ??
        standardPlan.purohitPayoutAmount;
      if (standardPayout == null || standardPayout === undefined) {
        standardPayout =
          standardPrice > 0
            ? Math.round(standardPrice * (1 - commission / 100))
            : 0;
      }
      if (Number(standardPayout) > 0) {
        return `₹${Number(standardPayout).toLocaleString("en-IN")}`;
      }
    }

    if (isBasic) {
      const basicPlan = plans.basic || {};
      const basicPrice = Number(
        basicPlan.price ??
          booking.priceWithoutSamagri ??
          service.priceWithoutSamagri ??
          service.minPrice ??
          0
      );
      let basicPayout =
        basicPlan.basicPurohitPayoutAmount ??
        basicPlan.purohitPayoutAmount;
      if (basicPayout == null || basicPayout === undefined) {
        basicPayout =
          basicPrice > 0
            ? Math.round(basicPrice * (1 - commission / 100))
            : 0;
      }
      if (Number(basicPayout) > 0) {
        return `₹${Number(basicPayout).toLocaleString("en-IN")}`;
      }
    }
  }

  // 3. Fallback: If agreedPrice / totalAmount is present on booking, calculate payout using commission
  const bookingPrice = Number(
    booking.agreedPrice || booking.totalAmount || booking.finalPrice || 0
  );
  if (bookingPrice > 0) {
    const calculatedPayout = Math.round(bookingPrice * (1 - commission / 100));
    return `₹${calculatedPayout.toLocaleString("en-IN")}`;
  }

  // 4. Overall service payout range fallback
  return getPurohitPayoutRange(service);
};
