"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { FaWhatsapp, FaFacebook, FaInstagram, FaYoutube, FaEnvelope, FaHome, FaWallet, FaList, FaUser, FaTicketAlt, FaBolt } from 'react-icons/fa';

export default function Footer() {
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user-info') || 'null') : null;
    const siteSettings = useSiteSettings();
    const [isSupportOpen, setIsSupportOpen] = useState(false);

    if (!siteSettings?.contact_info) {
        return <div className="p-4 text-center text-gray-500">Loading footer...</div>;
    }

    const { contact_info } = siteSettings;

    return (
        <>
            <footer className="mt-auto mb-16 md:mb-0 text-gray-200 border-t-2 bg-gray-900 border-gray-800">
                <section className="container mx-auto px-5 py-10">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

    {/* 1. Stay Connected */}
    <div>
      <h3 className="text-lg font-bold text-white mb-4">Stay Connected</h3>

      <p className="text-gray-400 text-sm mb-4">
        কোনো সমস্যায় পড়লে হোয়াটসঅ্যাপ এ যোগাযোগ করুন।
      </p>

      <div className="flex gap-4">
        <a href={contact_info.facebook} target="_blank" className="p-2 bg-gray-800 rounded-full hover:bg-red-500 transition">
          <FaFacebook />
        </a>
        <a href={contact_info.instagram} target="_blank" className="p-2 bg-gray-800 rounded-full hover:bg-red-500 transition">
          <FaInstagram />
        </a>
        <a href={contact_info.youtube} target="_blank" className="p-2 bg-gray-800 rounded-full hover:bg-red-500 transition">
          <FaYoutube />
        </a>
      </div>
    </div>

    {/* 2. Quick Links */}
    <div>
      <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>

      <div className="flex flex-col gap-2 text-gray-400 text-sm">
        <Link href="/about" className="hover:text-red-500 transition">About Us</Link>
        <Link href="/privacy-policy" className="hover:text-red-500 transition">Privacy Policy</Link>
        <Link href="/refund-policy" className="hover:text-red-500 transition">Refund Policy</Link>
        
      </div>
    </div>

    {/* 3. Support */}
    <div>
      <h3 className="text-lg font-bold text-white mb-4">Support</h3>

      <a href={`https://wa.me/${contact_info.whatsapp_number}`} target="_blank"
         className="flex items-center gap-4 bg-gray-800 p-4 rounded-xl hover:bg-gray-700 transition">

        <FaWhatsapp size={28} className="text-green-500" />

        <div>
          <p className="text-xs text-gray-400">Help line</p>
          <p className="font-bold text-white">{contact_info.phone_number}</p>
        </div>
      </a>
    </div>

  </div>
</section>

                <div className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
                    <p>© Copyright 2026. All Rights Reserved.</p>
                </div>

                {/* Floating Support Button */}
                <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex items-center gap-2">
                    {isSupportOpen && (
                        <a href={`https://wa.me/${contact_info.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 p-4 rounded-full text-white shadow-lg shadow-green-500/30 hover:bg-green-600 transition">
                            <FaWhatsapp size={24} />
                        </a>
                    )}
                    <button onClick={() => setIsSupportOpen(!isSupportOpen)} className="bg-red-600 p-4 rounded-full text-white shadow-lg hover:bg-red-700 transition font-bold flex items-center gap-2">
                        {isSupportOpen ? 'Close' : 'Support!'}
                    </button>
                </div>

                {/* Mobile Bottom Navigation */}
                <nav className="fixed md:hidden bottom-0 left-0 w-full bg-white border-t border-gray-200 z-40 text-gray-500 flex justify-between px-2 pb-2 pt-1 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                    <Link href="/" className="flex flex-col items-center p-2 hover:text-red-500 transition w-full">
                        <FaHome size={20} className="mb-1" />
                        <span className="text-[10px] font-medium">Home</span>
                    </Link>
                    {!user ? (
                        <>
                            <a href={contact_info.youtube} target="_blank" className="flex flex-col items-center p-2 hover:text-red-500 transition w-full">
                                <FaYoutube size={20} className="mb-1" />
                                <span className="text-[10px] font-medium">Tutorial</span>
                            </a>
                            <Link href="/topup" className="flex flex-col items-center p-2 hover:text-red-500 transition w-full">
                                <FaBolt size={20} className="mb-1" />
                                <span className="text-[10px] font-medium">TopUp</span>
                            </Link>
                            <Link href="/contact" className="flex flex-col items-center p-2 hover:text-red-500 transition w-full">
                                <FaEnvelope size={20} className="mb-1" />
                                <span className="text-[10px] font-medium">Contact</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/profile/add-money" className="flex flex-col items-center p-2 hover:text-red-500 transition w-full">
                                <FaWallet size={20} className="mb-1" />
                                <span className="text-[10px] font-medium">Add Money</span>
                            </Link>
                            <Link href="/profile/order" className="flex flex-col items-center p-2 hover:text-red-500 transition w-full">
                                <FaList size={20} className="mb-1" />
                                <span className="text-[10px] font-medium">Orders</span>
                            </Link>
                            <Link href="/profile/my-codes" className="flex flex-col items-center p-2 hover:text-red-500 transition w-full">
                                <FaTicketAlt size={20} className="mb-1" />
                                <span className="text-[10px] font-medium">My Codes</span>
                            </Link>
                            <Link href="/profile" className="flex flex-col items-center p-2 hover:text-red-500 transition w-full">
                                <FaUser size={20} className="mb-1" />
                                <span className="text-[10px] font-medium">Account</span>
                            </Link>
                        </>
                    )}
                </nav>
            </footer>
        </>
    );
}
