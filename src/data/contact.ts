export const CONTACT_DETAILS = {
  headOffice: {
    address: "Shri Gajanan Maharaj Sansthan, Shegaon, Dist. Buldhana, Maharashtra - 444203",
    email: "shreegajananmaharajsansthan@gmail.com",
  },
  booking: {
    // Single contact number for site-wide call/WhatsApp links
    mobile: "+91XXXXXXXXXX",
    whatsapp: "+91XXXXXXXXXX",
  },
  social: {
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
    instagram: "https://instagram.com",
  }
};

export const WHATSAPP_LINK = `https://wa.me/${CONTACT_DETAILS.booking.whatsapp.replace(/[^0-9]/g, '')}`;
