"use client";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import PaymentMethods from './PaymentMethods';
import ManualPaymentForm from './ManualPaymentForm';
import axios from "axios";
import SecureBadge from "../SecureBadge";


export default function TopUpDetailsClient({ product }: { product: any }) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errorRecharge, setErrorRecharge] = useState<string | null>(null);
    const [errorPlayerID, setErrorPlayerID] = useState<string | null>(null);

    const [quantity, setQuantity] = useState(1);
    const [selectedRechargeIndex, setSelectedRechargeIndex] = useState<number | null>(null);
    const [selectedRechargeType, setSelectedRechargeType] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
    const [accountInfo, setAccountInfo] = useState<Record<string, string>>({});
    const [wallet, setWallet] = useState<any>(null);

    // Manual Payment State
    const [showManualPayment, setShowManualPayment] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [selectedManualMethod, setSelectedManualMethod] = useState<any>(null);

    const [successModal, setSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");


// Auto select first manual payment method when manual payment is shown
useEffect(() => {
    if (showManualPayment && paymentMethods.length > 0 && !selectedManualMethod) {
        setSelectedManualMethod(paymentMethods[0]);
    }
}, [showManualPayment, paymentMethods, selectedManualMethod]);
    

    const [senderNumber, setSenderNumber] = useState("");
    const [transactionId, setTransactionId] = useState("");

    const manualPaymentRef = useRef<HTMLDivElement>(null);
    const nextStepRef = useRef<HTMLDivElement>(null);
    const paymentSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user-info');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        async function fetchWalletAndMethods() {
            try {
                if (user?.id) {
                    const walletRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-wallet/${user.id}`);
                    if (walletRes.ok) setWallet(await walletRes.json());
                }
                const methodsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment-methods`);
                if (methodsRes.ok) setPaymentMethods(await methodsRes.json());
            } catch (err) {
                console.error("Error fetching wallet or methods:", err);
            }
        }
        fetchWalletAndMethods();
    }, [user]);

    let inputFields: any = {};
    try {
        inputFields = typeof product?.input_fields === 'string'
            ? JSON.parse(product.input_fields || '{}')
            : (product?.input_fields || {});
    } catch (e) {
        console.error("Error parsing input_fields:", e);
    }

    const inputFieldsPlayerId = inputFields.input_fields_player_id || [];
    const inputFieldsRecharge = useMemo(() => inputFields.input_fields_recharge || [], [inputFields.input_fields_recharge]);
    const isQuantitySelectionAllowed = inputFields.is_quantity_selection_allowed === "YES";

    useEffect(() => {
        if (selectedRechargeIndex !== null) {
            const selectedRecharge = inputFieldsRecharge[selectedRechargeIndex];
            const maxQuantity = parseInt(selectedRecharge.recharge_stock, 10);
            const calculatedAmount = selectedRecharge.currency_amount * quantity;
            setTotalAmount(quantity > maxQuantity ? selectedRecharge.currency_amount * maxQuantity : calculatedAmount);
        } else {
            setTotalAmount(0);
        }
    }, [quantity, selectedRechargeIndex, inputFieldsRecharge]);

    useEffect(() => {
        if (showManualPayment && manualPaymentRef.current) {
            manualPaymentRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [showManualPayment]);

    const handleRechargeSelect = (field: any, index: number) => {
        setSelectedRechargeIndex(index);
        setSelectedRechargeType(field.type);
        setQuantity(1);
        setTotalAmount(field.currency_amount);
        setErrorRecharge(null);

        setTimeout(() => {
            if (nextStepRef.current) {
                nextStepRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 80);
    };

    const incrementQuantity = () => {
        if (selectedRechargeIndex !== null && quantity < parseInt(inputFieldsRecharge[selectedRechargeIndex].recharge_stock, 10)) {
            setQuantity(q => q + 1);
        }
    };

    const decrementQuantity = () => setQuantity(q => q > 1 ? q - 1 : 1);

    const handleAccountInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAccountInfo({ ...accountInfo, [e.target.name]: e.target.value });
        setErrorPlayerID(null);
    };

    const validateSubmission = () => {
        setError(null); setErrorRecharge(null); setErrorPlayerID(null);
        if (!user) {
            router.push('/login');
            return false;
        }
        if (!selectedRechargeType) {
            setErrorRecharge("Recharge type is required");
            return false;
        }
        if (!isQuantitySelectionAllowed) {
            const hasValidAccountInfo = Object.values(accountInfo).some(val => val && val.trim() !== "");
            if (!hasValidAccountInfo) {
                setErrorPlayerID("Account Info / Player ID is required");
                return false;
            }
        }
        if (!selectedPaymentMethod) {
            setError("Please select a payment method.");
            return false;
        }
        return true;
    };

    const handleBuyNow = async () => {
        if (!validateSubmission()) return;

        const productDetails = {
            ...product,
            selectedRechargeType,
            selectedPaymentMethod,
            quantity,
            totalAmount,
            accountInfo,
            productId: product.id,
            full_name: user.name,
            email: user.email,
            amount: totalAmount,
            user_id: user.id
        };

        if (selectedPaymentMethod === "instant") {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/initiate`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                    body: JSON.stringify(productDetails)
                });
                const data = await res.json();
                if (data.payment_url) window.location.href = data.payment_url;
                else setError(data.message || "Payment initiation failed.");
            } catch (e: any) { setError(e.message); } finally { setLoading(false); }
        } else if (selectedPaymentMethod === "wallet") {
            if (wallet?.balance >= totalAmount) {
                setLoading(true);
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/wallet`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                        body: JSON.stringify(productDetails)
                    });
                    const data = await res.json();
                    if (data.status === "success") {
                        setWallet({ ...wallet, balance: wallet.balance - totalAmount });
                        router.push('/profile/order');
                    } else {
                        setError(data.message || "Wallet payment failed. Please add money.");
                    }
                } catch (err: any) {
                    setError("Wallet payment failed: " + err.message);
                } finally { setLoading(false); }
            } else {
                setError("Insufficient wallet balance. Please add money.");
            }
        } else if (selectedPaymentMethod === "manual") {
            setShowManualPayment(true);
        }
    };

    const handleManualPaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateSubmission()) return;
        if (!selectedManualMethod) return setError("Select a manual payment method");
        if (!senderNumber.trim() || !/^01[0-9]{9}$/.test(senderNumber.trim())) return setError("Valid 11-digit phone number required");
        if (!transactionId.trim() || transactionId.trim().length < 5) return setError("Valid TrxID required");

        setLoading(true);
        const productDetails = {
            ...product,
            selectedRechargeType,
            selectedPaymentMethod: "manual",
            quantity,
            totalAmount,
            accountInfo,
            productId: product.id,
            full_name: user.name,
            email: user.email,
            amount: totalAmount,
            user_id: user.id,
            payment_method_id: selectedManualMethod.id,
            sender_number: senderNumber.trim(),
            transaction_id: transactionId.trim()
        };

        try {
    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment/manual`,
        productDetails
    );

    const data = res.data;

    if (data.status === "success") {
    setSuccessMessage("Order submitted successfully! Please wait for admin verification.");
    setSuccessModal(true);
    } else {
        setError(data.message || "Payment submission failed");
    }

} catch (err: any) {
    const message =
        err?.response?.data?.errors?.transaction_id?.[0] ||
        err?.response?.data?.message ||
        "Something went wrong";

    setError(message);

} finally {
    setLoading(false);
}
    };

    return (
        <div className="container mx-auto px-2 md:px-4 py-6 md:py-10 max-w-6xl bg-gradient-to-b from-[#070c18] via-[#0b1224] to-[#05070d] text-white">
            {/* Product Header */}
            <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-4 flex gap-4 items-center shadow-lg">
               <img 
               src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/products/${product.gallery}`} 
               className="w-20 h-20 rounded-xl object-cover border border-gray-700"
               />
                <div>
                    <h1 className="text-xl md:text-2xl font-semibold">{product.name}</h1>
                    <p className="text-gray-400 text-sm mt-1">Game Top-up</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mt-6">
                {/* Left Column */}
                <div className="flex-grow space-y-6 md:w-2/3">
                    {/* Recharge Selection */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">

  {/* HEADER */}
  <div className="bg-slate-800/60 backdrop-blur-md p-4 border-b border-slate-700 flex items-center gap-3">
    <span className="bg-gradient-to-r from-pink-500 to-orange-500 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold shadow-md">
      1
    </span>
    <h2 className="text-lg font-semibold text-white tracking-wide">
      Select Recharge
    </h2>
  </div>

  {/* BODY */}
  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
    {inputFieldsRecharge.map((field: any, index: number) => {
      const isSelected = selectedRechargeIndex === index;
      const isOutOfStock = field.recharge_stock === "0";

      return (
        <button
          key={index}
          onClick={() => handleRechargeSelect(field, index)}
          disabled={isOutOfStock}
          className={`relative flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-all duration-300

          ${isSelected
            ? "border-orange-500 bg-gradient-to-r from-slate-800 to-slate-700 shadow-md scale-[1.02]"
            : "border-slate-700 bg-slate-800 hover:border-orange-400 hover:shadow-md"
          }

          ${isOutOfStock
            ? "opacity-40 cursor-not-allowed"
            : "cursor-pointer active:scale-[0.97]"
          }
          `}
        >

          {/* LEFT */}
          <div className="flex items-center gap-3">

            {/* Radio Circle */}
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300
              ${isSelected
                ? "border-orange-500 bg-orange-500 shadow-md"
                : "border-slate-500"
              }`}
            >
              {isSelected && (
                <span className="text-white text-xs">✔</span>
              )}
            </div>

            {/* Title */}
            <span className={`font-medium text-sm transition-colors
              ${isSelected ? "text-white" : "text-slate-300"}
            `}>
              {field.type}
            </span>
          </div>

          {/* PRICE */}
          <span className="text-orange-400 font-semibold text-sm">
            {field.currency_amount} ৳
          </span>

          {/* Glow Effect */}
          {isSelected && (
            <div className="absolute inset-0 rounded-xl border border-orange-400 opacity-30 animate-pulse pointer-events-none"></div>
          )}
        </button>
      );
    })}
  </div>

  {/* ERROR */}
  {errorRecharge && (
    <p className="px-4 pb-4 text-red-400 text-sm font-medium">
      {errorRecharge}
    </p>
  )}
</div>

                    <div
  ref={nextStepRef}
  className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden"
>
  {/* HEADER */}
  <div className="bg-slate-800/60 backdrop-blur-md p-4 border-b border-slate-700 flex items-center gap-3">
    <span className="bg-gradient-to-r from-pink-500 to-orange-500 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold shadow-md">
      2
    </span>
    <h2 className="text-lg font-semibold text-white tracking-wide">
      {isQuantitySelectionAllowed ? "Quantity" : "Account Info"}
    </h2>
  </div>

  {/* BODY */}
  <div className="p-4">
    {isQuantitySelectionAllowed ? (
      <div className="flex items-center justify-between">

        <span className="text-slate-300 font-medium">
          Quantity
        </span>

        {/* Quantity Box */}
        <div className="flex items-center border border-slate-700 rounded-xl overflow-hidden bg-slate-800 shadow-inner">

          <button
            onClick={decrementQuantity}
            className="px-4 py-2 text-slate-300 hover:bg-slate-700 transition"
          >
            −
          </button>

          <input
            type="number"
            readOnly
            value={quantity}
            className="w-16 text-center py-2 bg-transparent text-white font-semibold focus:outline-none"
          />

          <button
            onClick={incrementQuantity}
            className="px-4 py-2 text-slate-300 hover:bg-slate-700 transition"
          >
            +
          </button>
        </div>
      </div>
    ) : (
      <div className="space-y-4">
        {inputFieldsPlayerId.map((field: any, index: number) => (
          <div key={index}>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              {field.label}
            </label>

            <input
              type={field.type}
              name={field.name}
              placeholder={`Enter ${field.label}`}
              onChange={handleAccountInfoChange}
              required={field.required}
              className="w-full border border-slate-700 rounded-xl px-4 py-2.5
              bg-slate-800 text-white placeholder-slate-400
              focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500
              transition-all"
            />
          </div>
        ))}

        {errorPlayerID && (
          <p className="text-red-400 text-sm font-medium">
            {errorPlayerID}
          </p>
        )}
      </div>
    )}
  </div>
</div>
<div
  ref={paymentSectionRef}
  className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden"
>
  {/* HEADER */}
  <div className="bg-slate-800/60 backdrop-blur-md p-4 border-b border-slate-700 flex items-center gap-3">
    <span className="bg-gradient-to-r from-pink-500 to-orange-500 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold shadow-md">
      3
    </span>
    <h2 className="text-lg font-semibold text-white tracking-wide">
      Payment Method
    </h2>
  </div>

  {/* PAYMENT METHODS */}
  <div className="p-4">
    <PaymentMethods
      selectedPaymentMethod={selectedPaymentMethod}
      onPaymentMethodChange={(e) => {
        setSelectedPaymentMethod(e.target.value);
        setShowManualPayment(false);
      }}
      onManualPaymentClick={() => {
        setSelectedPaymentMethod("manual");
        setShowManualPayment(true);
      }}
    />
  </div>

  {/* WALLET */}



  
  {user && (
    <div className="px-4 pb-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex items-center justify-between shadow-inner">

        <div className="flex items-center gap-2 text-slate-300 text-sm">
          <span className="text-orange-400">💰</span>
          Your Wallet Balance
        </div>

        <div className="font-semibold text-orange-400">
          ৳ {Number(wallet?.balance || 0).toFixed(2)}
        </div>
      </div>
    </div>
  )}

  {/* ERROR */}
  {error && !showManualPayment && (
    <p className="px-4 pb-4 text-red-400 text-sm font-medium">
      {error}
    </p>
  )}

  {/* FOOTER / CTA */}
  <div className="p-4 border-t border-slate-700 bg-slate-900">

    <button
      onClick={handleBuyNow}
      disabled={loading}
      className="w-full bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 
      hover:from-pink-600 hover:to-red-600
      text-white font-semibold py-3.5 px-6 rounded-xl 
      shadow-lg shadow-orange-500/20 
      transition-all duration-300 
      disabled:opacity-60
      flex items-center justify-center gap-2 text-base"
    >
      {loading ? (
        <>
          <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          Processing...
        </>
      ) : (
        <>Buy Now • ৳ {totalAmount}</>
      )}
    </button>

    {/* Secure Badge */}
    <div className="mt-3 opacity-80">
      <SecureBadge />
    </div>
  </div>
</div>

                    {/* Manual Payment Form */}


                    {successModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

    <div className="bg-white w-[90%] max-w-md p-6 rounded-2xl shadow-xl text-center">

      <div className="text-green-500 text-5xl">✔</div>

      <h2 className="text-xl font-bold mt-3 text-gray-800">
        Success!
      </h2>

      <p className="text-gray-600 mt-2">
        {successMessage}
      </p>

      <button
        onClick={() => router.push("/profile/order")}
        className="mt-5 w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-semibold"
      >
        Go to Orders
      </button>

    </div>

  </div>
)}


                    <div ref={manualPaymentRef} className="mt-4">

  {showManualPayment && (
    <div className="transition-all duration-300 ease-in-out">

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-xs text-gray-400 font-medium">
          Manual Payment
        </span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      {/* Card Wrapper */}
      <div className="  rounded-2xl shadow-md p-1">

        <ManualPaymentForm
          product={product}
          selectedRechargeType={selectedRechargeType}
          quantity={quantity}
          totalAmount={totalAmount}
          paymentMethods={paymentMethods}
          selectedManualMethod={selectedManualMethod}
          setSelectedManualMethod={setSelectedManualMethod}
          senderNumber={senderNumber}
          setSenderNumber={setSenderNumber}
          transactionId={transactionId}
          setTransactionId={setTransactionId}
          error={error}
          loading={loading}
          onSubmit={handleManualPaymentSubmit}
          onCancel={() => setShowManualPayment(false)}
        />

      </div>

    </div>
  )}

</div>
            </div>

                {/* Right Column */}
<div className="md:w-1/3">
  <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6 sticky top-24">

    {/* HEADER */}
    <h3 className="font-semibold text-white text-lg border-b border-slate-700 pb-3 mb-4 flex items-center gap-2">
      <span className="text-orange-400 text-xl">📝</span>
      How to top up?
    </h3>

    {/* CONTENT */}
    {product.description ? (
      <div
        className="prose prose-sm max-w-none mt-2
        prose-p:text-slate-300
        prose-strong:text-white
        prose-li:text-slate-300
        prose-headings:text-white"
        dangerouslySetInnerHTML={{ __html: product.description }}
      />
    ) : (
      <ol className="list-decimal pl-5 space-y-3 text-sm text-slate-300">

        <li className="leading-relaxed">
          Select your desired recharge package.
        </li>

        <li className="leading-relaxed">
          Enter your Player ID or account details.
        </li>

        <li className="leading-relaxed">
          Choose quantity (if available).
        </li>

        <li className="leading-relaxed">
          Select your preferred payment method.
        </li>

        <li className="leading-relaxed">
          Click <span className="text-orange-400 font-medium">“Buy Now”</span> to complete the purchase.
        </li>

      </ol>
    )}

    {/* FOOTER NOTE */}
    <div className="mt-6 p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-400 flex gap-2">
      <span className="text-orange-400">⚡</span>
      <span>Make sure your account info is correct before payment.</span>
    </div>

  </div>
</div>
            </div>
        </div>
    );
}