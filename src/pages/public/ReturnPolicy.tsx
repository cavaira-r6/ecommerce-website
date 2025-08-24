import React from 'react';

const ReturnPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-8">Return & Refund Policy</h1>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Return Period</h2>
              <div className="space-y-3">
                <p>You have 14 days from the date of delivery to return your item(s) for a refund.</p>
                <p>To be eligible for a return, your item must be:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Unused and in its original condition</li>
                  <li>In the original packaging</li>
                  <li>Accompanied by the original receipt or proof of purchase</li>
                  <li>Not damaged or altered</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Non-Returnable Items</h2>
              <p>The following items cannot be returned:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personalized or custom-made items</li>
                <li>Hygiene products once opened or used</li>
                <li>Downloadable software products</li>
                <li>Gift cards</li>
                <li>Sale items marked as "final sale"</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Return Process</h2>
              <div className="space-y-3">
                <p>To return an item, follow these steps:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Contact our customer service team to initiate the return</li>
                  <li>Receive a Return Merchandise Authorization (RMA) number</li>
                  <li>Pack the item securely with all original packaging</li>
                  <li>Include the RMA number on the return package</li>
                  <li>Ship the item to the provided return address</li>
                </ol>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Return Shipping</h2>
              <div className="space-y-3">
                <p>Return shipping costs are handled as follows:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Defective/wrong items: We cover shipping costs</li>
                  <li>Change of mind: Customer pays return shipping</li>
                  <li>Size exchanges: We cover shipping for the replacement item</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Refund Process</h2>
              <div className="space-y-3">
                <p>Once we receive your return:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We will inspect the item within 48 hours</li>
                  <li>You will be notified of the refund status</li>
                  <li>If approved, refund will be processed within 3-5 business days</li>
                  <li>Original payment method will be refunded</li>
                </ul>
                <p>For cash on delivery orders, refunds will be processed to your bank account.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Damaged Items</h2>
              <div className="space-y-3">
                <p>If you receive a damaged item:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Document the damage with photos</li>
                  <li>Contact us within 24 hours of delivery</li>
                  <li>We will arrange return shipping at our cost</li>
                  <li>A replacement will be sent or full refund issued</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Exchanges</h2>
              <p>If you need a different size or color, we recommend returning the item for a refund and placing a new order to ensure the desired item remains in stock.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Contact Information</h2>
              <div className="mt-2">
                <p>For return-related queries:</p>
                <p>Email: returns@miniu.com</p>
                <p>Phone: +216 XX XXX XXX</p>
                <p>Hours: Monday-Friday, 9:00-17:00 TUN</p>
              </div>
            </section>

            <div className="mt-8 text-sm text-gray-400">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              <p>This return policy may be updated from time to time without prior notice.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
