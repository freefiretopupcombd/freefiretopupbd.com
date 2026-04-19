"use client";

import React from 'react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import {
  FaPhoneAlt,
  FaFacebookMessenger,
  FaWhatsapp,
  FaEnvelope,
  FaClock
} from 'react-icons/fa';

export default function ContactClient() {
  const siteSettings = useSiteSettings();

  if (!siteSettings) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  const { contact_info } = siteSettings;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">

      {/* Header */}
      <div className="text-center mb-10 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          Contact Us
        </h1>

        <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
          Free Fire diamond top-up support — আমরা 24/7 আপনার সাহায্যে প্রস্তুত
        </p>

        {/* Trust badge */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs md:text-sm text-gray-500">
          <FaClock className="text-red-500" />
          <span>Avg response time: 1–5 minutes</span>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

        {/* Phone */}
        {contact_info?.phone_number && (
          <a
            href={`tel:${contact_info.phone_number}`}
            className="flex items-center gap-4 p-4 md:p-6 bg-white border border-gray-100 rounded-xl shadow-sm active:scale-[0.98] hover:shadow-md transition"
          >
            <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 shrink-0">
              <FaPhoneAlt />
            </div>

            <div>
              <h3 className="text-base md:text-lg font-semibold">
                Direct Call
              </h3>
              <p className="text-sm text-gray-500">
                {contact_info.phone_number}
              </p>
            </div>
          </a>
        )}

        {/* Messenger */}
        {contact_info?.facebook && (
          <a
            href={contact_info.facebook}
            target="_blank"
            className="flex items-center gap-4 p-4 md:p-6 bg-white border border-gray-100 rounded-xl shadow-sm active:scale-[0.98] hover:shadow-md transition"
          >
            <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-pink-100 text-pink-600 shrink-0">
              <FaFacebookMessenger />
            </div>

            <div>
              <h3 className="text-base md:text-lg font-semibold">
                Messenger
              </h3>
              <p className="text-sm text-gray-500">
                Chat instantly
              </p>
            </div>
          </a>
        )}

        {/* WhatsApp (HIGHLIGHTED) */}
        {contact_info?.whatsapp_number && (
          <a
            href={`https://wa.me/${contact_info.whatsapp_number}`}
            target="_blank"
            className="flex items-center gap-4 p-4 md:p-6 bg-green-50 border border-green-200 rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition"
          >
            <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-green-100 text-green-600 shrink-0">
              <FaWhatsapp />
            </div>

            <div>
              <h3 className="text-base md:text-lg font-semibold text-green-700">
                WhatsApp Support
              </h3>
              <p className="text-sm text-gray-600">
                Fastest response (Recommended)
              </p>
            </div>
          </a>
        )}

        {/* Email */}
        {contact_info?.email && (
          <a
            href={`mailto:${contact_info.email}`}
            className="flex items-center gap-4 p-4 md:p-6 bg-white border border-gray-100 rounded-xl shadow-sm active:scale-[0.98] hover:shadow-md transition"
          >
            <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 shrink-0">
              <FaEnvelope />
            </div>

            <div>
              <h3 className="text-base md:text-lg font-semibold">
                Email Support
              </h3>
              <p className="text-sm text-gray-500">
                {contact_info.email}
              </p>
            </div>
          </a>
        )}

      </div>

      {/* Bottom info */}
      <div className="mt-10 md:mt-12 text-center bg-gray-50 p-5 md:p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-2">
          Need help with order?
        </h3>

        <p className="text-sm text-gray-500">
          Payment issue • Delivery delay • Top-up problem — আমরা সাহায্য করতে প্রস্তুত
        </p>
      </div>

    </div>
  );
}