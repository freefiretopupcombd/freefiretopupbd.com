export default function PrivacyPolicyPage() {
  return (
  <div className="container mx-auto px-2 md:px-4 py-6 md:py-10 max-w-6xl bg-[#070c18] text-white">

    {/* Header */}
    <div className="text-center mb-10">
      <h1 className="text-4xl font-bold mb-3">
        Privacy Policy
      </h1>
      <p className="text-gray-400">
        Your privacy is important to us
      </p>
    </div>

    {/* Content */}
    <div className="space-y-8 leading-relaxed">

      <section className="bg-[#0b1224] border border-white/10 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-2 text-white">
          1. Information We Collect
        </h2>
        <p className="text-gray-300">
          We only collect necessary information required to process your order, such as Player ID,
          transaction details, and basic contact information. We do not collect sensitive personal data.
        </p>
      </section>

      <section className="bg-[#0b1224] border border-white/10 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-2 text-white">
          2. How We Use Your Information
        </h2>
        <p className="text-gray-300">
          Your information is used only for processing Free Fire diamond top-up orders,
          providing customer support, and improving our service quality.
        </p>
      </section>

      <section className="bg-[#0b1224] border border-white/10 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-2 text-white">
          3. Data Protection
        </h2>
        <p className="text-gray-300">
          We take proper security measures to protect your data. Your information is stored securely
          and is never sold, shared, or misused for any third-party marketing.
        </p>
      </section>

      <section className="bg-[#0b1224] border border-white/10 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-2 text-white">
          4. Payment Information
        </h2>
        <p className="text-gray-300">
          We do not store your payment credentials. All payments are processed through secure
          third-party payment gateways like bKash, Nagad, or Rocket.
        </p>
      </section>

      <section className="bg-[#0b1224] border border-white/10 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-2 text-white">
          5. Cookies
        </h2>
        <p className="text-gray-300">
          We may use cookies to improve user experience and website functionality.
          You can disable cookies from your browser settings if you prefer.
        </p>
      </section>

      <section className="bg-[#0b1224] border border-white/10 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-2 text-white">
          6. Third-Party Services
        </h2>
        <p className="text-gray-300">
          We may use third-party services for payment processing and analytics.
          These services have their own privacy policies.
        </p>
      </section>

      <section className="bg-[#0b1224] border border-white/10 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-2 text-white">
          7. Account Safety
        </h2>
        <p className="text-gray-300">
          We never ask for your Free Fire password or login credentials.
          Always keep your account information secure.
        </p>
      </section>

      <section className="bg-red-500/10 border border-red-500/30 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-2 text-red-400">
          Important Notice
        </h2>
        <p className="text-gray-300">
          By using our website, you agree to this Privacy Policy.
          We may update this policy anytime without prior notice.
        </p>
      </section>

    </div>

    {/* Footer */}
    <div className="text-center mt-10 text-sm text-gray-500">
      © {new Date().getFullYear()} All rights reserved.
    </div>

  </div>
);
}