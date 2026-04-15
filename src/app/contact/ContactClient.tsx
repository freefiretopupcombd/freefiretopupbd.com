"use client";

import React from 'react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { FaPhoneAlt, FaFacebookMessenger, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

export default function ContactClient() {
  const siteSettings = useSiteSettings();

  if (!siteSettings) {
    return <div className="min-h-[50vh] flex items-center justify-center">Loading...</div>;
  }

  const { contact_info } = siteSettings;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">

        {/* Decorative background */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-gradient-to-br from-pink-200 to-red-100 rounded-full opacity-50 blur-3xl z-0"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-gradient-to-tr from-blue-200 to-indigo-100 rounded-full opacity-50 blur-3xl z-0"></div>

        <div className="relative z-10 p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-4">
            Contact Us
          </h1>

          <p className="text-gray-500 mb-10 max-w-xl mx-auto">
            Need help or have any questions? We're here for you!
          </p>

          <div className="grid md:grid-cols-2 gap-6">

            {contact_info?.phone_number && (
              <a href={`tel:${contact_info.phone_number}`} className="group p-6 bg-blue-50 rounded-2xl">
                <FaPhoneAlt />
                <h3>Direct Call</h3>
              </a>
            )}

            {contact_info?.facebook && (
              <a href={contact_info.facebook} target="_blank" className="group p-6 bg-pink-50 rounded-2xl">
                <FaFacebookMessenger />
                <h3>Messenger</h3>
              </a>
            )}

            {contact_info?.whatsapp_number && (
              <a href={`https://wa.me/${contact_info.whatsapp_number}`} target="_blank" className="group p-6 bg-green-50 rounded-2xl">
                <FaWhatsapp />
                <h3>WhatsApp</h3>
              </a>
            )}

            {contact_info?.email && (
              <a href={`mailto:${contact_info.email}`} className="group p-6 bg-yellow-50 rounded-2xl">
                <FaEnvelope />
                <h3>Email</h3>
              </a>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}