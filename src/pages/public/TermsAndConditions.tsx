import React from 'react';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-8">Terms and Conditions</h1>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Agreement to Terms</h2>
              <p>By accessing or using our website, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, you may not use our services.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Use License</h2>
              <div className="space-y-3">
                <p>Permission is granted to temporarily access the materials on MiniU's website for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose</li>
                  <li>Remove any copyright or proprietary notations</li>
                  <li>Transfer the materials to another person</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Order Acceptance</h2>
              <div className="space-y-3">
                <p>We reserve the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Limit or refuse orders</li>
                  <li>Discontinue products</li>
                  <li>Modify prices</li>
                  <li>Limit sales to certain geographic regions</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Shipping and Delivery</h2>
              <div className="space-y-3">
                <p>We strive to deliver products within the estimated delivery times:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Greater Tunis Area: 1-2 business days</li>
                  <li>Other Governorates: 2-4 business days</li>
                  <li>Remote Areas: 3-5 business days</li>
                </ul>
                <p>Delivery times may vary due to unforeseen circumstances.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Payment Terms</h2>
              <div className="space-y-3">
                <p>We accept the following payment methods:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Flouci</li>
                  <li>Cash on Delivery (additional fee applies)</li>
                </ul>
                <p>All prices are in Tunisian Dinar (TND) and include applicable taxes.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Returns and Refunds</h2>
              <div className="space-y-3">
                <p>Our return policy allows for returns within 14 days of delivery if:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Item is unused and in original packaging</li>
                  <li>Item is not damaged</li>
                  <li>Proof of purchase is provided</li>
                </ul>
                <p>Refunds will be processed within 7-14 business days.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. User Account</h2>
              <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Disclaimer</h2>
              <p>The materials on MiniU's website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties of merchantability and fitness for a particular purpose.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
              <p>In no event shall MiniU or its suppliers be liable for any damages arising out of the use or inability to use the materials on our website.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">10. Governing Law</h2>
              <p>These terms and conditions are governed by and construed in accordance with the laws of Tunisia, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">11. Contact Information</h2>
              <div className="mt-2">
                <p>Email: contact@miniu.com</p>
                <p>Phone: +216 XX XXX XXX</p>
                <p>Address: [Your Business Address]</p>
              </div>
            </section>

            <div className="mt-8 text-sm text-gray-400">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
