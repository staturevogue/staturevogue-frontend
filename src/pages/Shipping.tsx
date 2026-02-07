import React from 'react';
import { Truck, Clock, MapPin, PackageCheck } from 'lucide-react';

export default function Shipping() {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1F2B5B] mb-4">Shipping Policy</h1>
          <div className="h-1 w-20 bg-[#F4C430] mx-auto rounded-full"></div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          
          {/* Rates */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#1F2B5B] p-2 rounded-full">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Shipping Rates</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We offer standard shipping charges across India for all prepaid orders. 
              For COD orders, a nominal charge is applicable depending on the location.
            </p>
          </div>

          {/* Processing */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#1F2B5B] p-2 rounded-full">
                <PackageCheck className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Order Processing</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Your order will be expected to be dispatched within <strong>1-2 business days</strong>. 
              Our business days are Monday-Saturday.
            </p>
          </div>

        </div>

        {/* Shipping Time */}
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-[#1F2B5B]" />
            <h2 className="text-xl font-bold text-gray-900">Shipping Time</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">
            For most serviceable pin codes, we deliver within <strong>5 days</strong>. There could be a possible delay of 2-3 business days in delivery due to unforeseen circumstances.
          </p>
          <p className="text-gray-600 leading-relaxed">
            However, you will be able to track your package using a unique tracking link that we will email/SMS you after your order is sent to our delivery partner.
          </p>
        </div>

        {/* Order Tracking */}
        <div className="mt-10 border-t border-gray-100 pt-8">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-[#1F2B5B]" />
            <h2 className="text-xl font-bold text-gray-900">Order Tracking</h2>
          </div>
          <p className="text-gray-600 mb-4">
            You'll receive a tracking number from us in your inbox as soon as it ships! 
            Orders can be tracked in real-time via the tracking link provided in your email/SMS or in your My Orders section.
          </p>
        </div>

      </div>
    </div>
  );
}