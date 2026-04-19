export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">

      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          About Our Platform
        </h1>
        <p className="text-gray-500 text-lg">
          Fast, Secure & Reliable Free Fire Diamond Top-Up Service
        </p>
      </div>

      {/* Intro */}
      <div className="bg-gray-50 p-6 rounded-xl mb-8">
        <p className="text-gray-700 leading-relaxed">
          We are a trusted online platform providing instant Free Fire diamond top-up services.
          Our goal is to deliver fast, secure, and hassle-free gaming currency to players
          across Bangladesh and beyond. We ensure smooth transactions with reliable support
          and instant delivery in most cases.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">

        <div className="border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-3 text-red-500">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to provide gamers with a fast, safe, and affordable way
            to purchase Free Fire diamonds without any complexity or risk.
          </p>
        </div>

        <div className="border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-3 text-red-500">
            Our Vision
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We aim to become one of the most trusted gaming top-up platforms,
            ensuring smooth service and customer satisfaction for every user.
          </p>
        </div>

      </div>

      {/* Why Choose Us */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Why Choose Us?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="p-5 border rounded-lg">
            <h3 className="font-semibold mb-2">⚡ Instant Delivery</h3>
            <p className="text-gray-600 text-sm">
              Most orders are processed instantly within minutes.
            </p>
          </div>

          <div className="p-5 border rounded-lg">
            <h3 className="font-semibold mb-2">🔒 Secure Payment</h3>
            <p className="text-gray-600 text-sm">
              We support trusted local payment methods like bKash & Nagad.
            </p>
          </div>

          <div className="p-5 border rounded-lg">
            <h3 className="font-semibold mb-2">💬 24/7 Support</h3>
            <p className="text-gray-600 text-sm">
              Our support team is always ready to assist you anytime.
            </p>
          </div>

        </div>
      </div>

      {/* Warning / Trust Note */}
      <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-center">
        <h3 className="text-lg font-semibold text-red-600 mb-2">
          Important Notice
        </h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          We never ask for your Free Fire password or sensitive account details.
          Always provide only your Player ID during top-up.
        </p>
      </div>

    </div>
  );
}