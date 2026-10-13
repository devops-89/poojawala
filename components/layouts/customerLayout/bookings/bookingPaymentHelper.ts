export interface BookingPaymentDetails {
  payments: any[];
  tokenPayment: any | undefined;
  settlementPayment: any | undefined;
  fullPayment: any | undefined;
  finalAmount: number;
  tokenAmount: number;
  paidAmount: number;
  remainingAmount: number;
  tokenPercentage: number | null;
  isCancelled: boolean;
  isFullyPaid: boolean;
  isTokenPaid: boolean;
  canMakePayment: boolean;
  paymentStatusUpper: string;
  paymentTypeUpper: string;
}

export const formatInr = (amt: number | string | undefined | null): string => {
  if (amt === undefined || amt === null || amt === '') return '0.00';
  const num = Number(amt);
  if (isNaN(num)) return String(amt);
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const getBookingPaymentDetails = (booking: any): BookingPaymentDetails => {
  if (!booking) {
    return {
      payments: [],
      tokenPayment: undefined,
      settlementPayment: undefined,
      fullPayment: undefined,
      finalAmount: 0,
      tokenAmount: 0,
      paidAmount: 0,
      remainingAmount: 0,
      tokenPercentage: null,
      isCancelled: false,
      isFullyPaid: false,
      isTokenPaid: false,
      canMakePayment: false,
      paymentStatusUpper: '',
      paymentTypeUpper: '',
    };
  }

  const payments = Array.isArray(booking.payments) ? booking.payments : [];
  const tokenPayment = payments.find(
    (p: any) => p.remark === "BOOKING_TOKEN_PAYMENT" && p.status === "SUCCESS"
  );
  const settlementPayment = payments.find(
    (p: any) => p.remark === "BOOKING_SETTLEMENT" && p.status === "SUCCESS"
  );
  const fullPayment = payments.find(
    (p: any) => p.remark === "BOOKING_FULL_PAYMENT" && p.status === "SUCCESS"
  );

  const finalAmount = Number(
    booking.finalAmount ?? booking.servicePrice ?? booking.finalamount ?? 0
  );

  const tokenAmount = Number(
    booking.tokenAmount !== undefined && booking.tokenAmount !== null
      ? booking.tokenAmount
      : tokenPayment
      ? (tokenPayment.customerPaidAmount || tokenPayment.amount)
      : 0
  );

  const paidAmount = Number(
    booking.paidAmount !== undefined && booking.paidAmount !== null
      ? booking.paidAmount
      : tokenPayment
      ? (tokenPayment.customerPaidAmount || tokenPayment.amount)
      : 0
  );

  const remainingAmount = Number(
    booking.remainingAmount !== undefined &&
      booking.remainingAmount !== null &&
      booking.remainingAmount !== ""
      ? booking.remainingAmount
      : paidAmount > 0
      ? Math.max(0, finalAmount - paidAmount)
      : finalAmount
  );

  const paymentStatusUpper = (booking.paymentStatus || "").toUpperCase();
  const paymentTypeUpper = (booking.paymentType || "").toUpperCase();
  const statusUpper = (booking.status || "").toUpperCase();

  const isCancelled = statusUpper === "CANCELLED";

  const isFullyPaid =
    paymentStatusUpper === "PAID" ||
    paymentStatusUpper === "COMPLETED" ||
    paymentStatusUpper === "SUCCESS" ||
    Boolean(settlementPayment) ||
    Boolean(fullPayment) ||
    (remainingAmount <= 0 && paidAmount > 0 && paidAmount >= finalAmount);

  const isTokenPaid =
    !isFullyPaid &&
    (paymentStatusUpper === "PARTIAL" ||
      paymentStatusUpper === "PARTIALLY_PAID" ||
      Boolean(tokenPayment) ||
      (paidAmount > 0 && remainingAmount > 0));

  const canMakePayment =
    !isCancelled &&
    !isFullyPaid &&
    (finalAmount > 0 || remainingAmount > 0);

  return {
    payments,
    tokenPayment,
    settlementPayment,
    fullPayment,
    finalAmount,
    tokenAmount,
    paidAmount,
    remainingAmount,
    tokenPercentage: booking.tokenPercentage ? Number(booking.tokenPercentage) : null,
    isCancelled,
    isFullyPaid,
    isTokenPaid,
    canMakePayment,
    paymentStatusUpper,
    paymentTypeUpper,
  };
};
