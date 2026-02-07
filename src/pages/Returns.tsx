import React from 'react';
import { RefreshCw, Truck, CreditCard, AlertCircle } from 'lucide-react';

export default function Returns() {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1F2B5B] mb-4">Returns & Exchange Policy</h1>
          <div className="h-1 w-20 bg-[#F4C430] mx-auto rounded-full"></div>
        </div>

        {/* 7-Days Policy */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCw className="w-6 h-6 text-[#1F2B5B]" />
            <h2 className="text-xl font-bold text-gray-900">7-Days Free Return & Exchanges</h2>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 leading-relaxed">
            <li>Stature Vogue products are eligible for return / exchange within <strong>7 days</strong> of delivery.</li>
            <li>Shipping amount will be deducted in case of return.</li>
            <li>
              To initiate Return / Exchange, please contact our support team via the 
              <a href="/contact" className="text-[#1F2B5B] font-bold hover:underline mx-1">Contact Us</a> 
              page or WhatsApp.
            </li>
          </ul>
        </div>

        {/* Process */}
        <div className="mb-10 bg-blue-50 p-6 rounded-xl border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <Truck className="w-6 h-6 text-[#1F2B5B]" />
            <h2 className="text-xl font-bold text-gray-900">Same-Day Refund / Exchange Process</h2>
          </div>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="font-bold text-[#1F2B5B]">1.</span>
              Once the return/exchange request is verified by our support team, reverse pickup will be initiated within 24 hours.
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-[#1F2B5B]">2.</span>
              The product will be picked up by our courier partner within the next 1-2 days.
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-[#1F2B5B]">3.</span>
              As soon as the product is picked up, the refund/exchange will be initiated on the same day.
            </li>
          </ul>
          <div className="mt-4 flex gap-2 items-start text-sm text-red-600 bg-white p-3 rounded-lg border border-red-100">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p><strong>Note:</strong> The courier can refuse the pickup if the original tags are not intact OR where it's obvious that the item has been worn, washed, or soiled.</p>
          </div>
        </div>

        {/* Self Ship */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Self-Ship Process</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>If the reverse pick-up service to your pin code is not available, we would ask you to self-ship the product back to Stature Vogue.</p>
            <p>Please pack the items securely to prevent any loss or damage during transit. All items must be in unused condition with all original tags attached.</p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 font-medium text-gray-800">
              <p className="uppercase text-xs text-gray-500 mb-1">Return Address:</p>
              <p>Stature Vogue</p>
              <p>Flat No: 103, Pristine Alpine,</p>
              <p>Raghavendra Shelters, Kondapur,</p>
              <p>Hyderabad - 500084</p>
            </div>
            <p className="text-sm italic">Within 48 hours of receiving the product(s), the amount will be refunded to your bank account.</p>
          </div>
        </div>

        {/* Refunds */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-6 h-6 text-[#1F2B5B]" />
            <h2 className="text-xl font-bold text-gray-900">Refunds</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-bold text-[#1F2B5B] mb-2">Prepaid Returns</h3>
              <p className="text-sm text-gray-600">The amount will be refunded back to your original payment mode.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-bold text-[#1F2B5B] mb-2">Cash On Delivery</h3>
              <p className="text-sm text-gray-600">The refund will be initiated to the bank account that is provided by you at the time of raising the request.</p>
            </div>
          </div>
        </div>

        {/* FAQ Style Section */}
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">What should I do if I do not receive my refund?</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>We will update you via email / SMS once the refund is initiated.</li>
            <li>Bank refunds for prepaid orders will take 7-10 business days.</li>
            <li>If you face any issues, please contact our support team.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}