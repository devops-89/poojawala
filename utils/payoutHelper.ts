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
