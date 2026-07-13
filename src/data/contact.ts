export const CONTACT_DETAILS = {
  headOffice: {
    address: "Shri Gajanan Maharaj Sansthan, Shegaon, Dist. Buldhana, Maharashtra - 444203",
    email: "shreegajananmaharajsansthan@gmail.com",
  },
  booking: {
    // Single contact number for site-wide call/WhatsApp links
    mobile: "+918053190691",
    whatsapp: "+918053190691",
    // When true, all "Call" buttons across the site open a booking request dialog
    // instead of initiating a phone call. The dialog fills the form and redirects
    // to WhatsApp with the booking enquiry.
    whatsappBookingOnly: true,
  },
  social: {
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
    instagram: "https://instagram.com",
  }
};

export const WHATSAPP_LINK = `https://wa.me/${CONTACT_DETAILS.booking.whatsapp.replace(/[^0-9]/g, '')}`;
