import emailjs from "@emailjs/browser";

// Set these in your .env file to enable real email sending:
// VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
// VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxx
// VITE_EMAILJS_TEMPLATE_APPLIED=template_xxxxxxx   (application received)
// VITE_EMAILJS_TEMPLATE_APPROVED=template_xxxxxxx  (account approved)

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
const TEMPLATE_APPLIED = import.meta.env.VITE_EMAILJS_TEMPLATE_APPLIED as string | undefined;
const TEMPLATE_APPROVED = import.meta.env.VITE_EMAILJS_TEMPLATE_APPROVED as string | undefined;

const configured = !!(SERVICE_ID && PUBLIC_KEY && TEMPLATE_APPLIED && TEMPLATE_APPROVED);

if (configured) {
  emailjs.init({ publicKey: PUBLIC_KEY! });
}

export async function sendApplicationReceived(params: {
  to_email: string;
  to_name: string;
  role: string;
}) {
  if (!configured) {
    console.info("[VeriFarm Email] Application received →", params.to_email, "(EmailJS not configured — set VITE_EMAILJS_* env vars)");
    return;
  }
  await emailjs.send(SERVICE_ID!, TEMPLATE_APPLIED!, {
    to_email: params.to_email,
    to_name: params.to_name,
    role_label: params.role === "lender" ? "Lender / Bank" : "Field Agent",
    subject: "VeriFarm — Application received",
    message: params.role === "lender"
      ? "Your lender registration has been received. Our team will verify your regulatory licence number against the national banking registry. This typically takes 1–2 business days. You'll receive a second email once your account is activated."
      : "Your field agent application has been received. A VeriFarm administrator will review your credentials and regional assignment. You'll receive a second email once your account is activated.",
  });
}

export async function sendAccountApproved(params: {
  to_email: string;
  to_name: string;
  role: string;
}) {
  if (!configured) {
    console.info("[VeriFarm Email] Account approved →", params.to_email, "(EmailJS not configured — set VITE_EMAILJS_* env vars)");
    return;
  }
  await emailjs.send(SERVICE_ID!, TEMPLATE_APPROVED!, {
    to_email: params.to_email,
    to_name: params.to_name,
    role_label: params.role === "lender" ? "Lender / Bank" : "Field Agent",
    subject: "VeriFarm — Account activated",
    message: params.role === "lender"
      ? "Your VeriFarm lender account has been approved and activated. You can now sign in to access your institution's loan portfolio and farmer profiles."
      : "Your VeriFarm field agent account has been approved. You can now sign in to access your verification queue and submit farm assessments.",
    login_url: `${window.location.origin}/login`,
  });
}
