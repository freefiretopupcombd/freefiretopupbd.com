export default function RefundPolicyPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">
          Refund Policy
        </h1>
        <p className="text-gray-500">
          Please read our refund terms carefully before placing an order
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8 text-gray-700 leading-relaxed">

        <section className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">1. General Policy</h2>
          <p>
            Refunds are only applicable under specific conditions mentioned below.
            By placing an order, you agree to our refund policy.
          </p>
        </section>

        <section className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">2. Eligible Refund Cases</h2>
          <p>
            A refund will only be provided if:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>The order fails to deliver successfully</li>
            <li>Technical issue from our system prevents processing</li>
            <li>Payment received but service not delivered</li>
          </ul>
        </section>

        <section className="bg-red-50 border border-red-200 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-2 text-red-600">
            3. Important Refund Rule
          </h2>
          <p>
            ❗ All approved refunds will be credited to your in-app wallet only.  
            We do not provide cash refunds under any circumstances.
          </p>
        </section>

        <section className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">4. Refund Processing Time</h2>
          <p>
            Refunds are usually processed within <b>1–2 working hours</b> after verification.  
            In rare cases, it may take up to 24 hours depending on system status.
          </p>
        </section>

        <section className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">5. Non-Refundable Cases</h2>
          <ul className="list-disc pl-6">
            <li>Wrong Player ID provided by customer</li>
            <li>Completed and successfully delivered orders</li>
            <li>Delayed orders due to game server issues</li>
          </ul>
        </section>

        <section className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">6. Fraud Protection</h2>
          <p>
            Any fraudulent refund request or misuse of the system may result in account restriction
            or permanent ban from our platform.
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