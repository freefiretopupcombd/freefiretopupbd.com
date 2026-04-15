"use client";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import PaymentMethods from './PaymentMethods';
import ManualPaymentForm from './ManualPaymentForm';

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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/manual`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(productDetails)
            });
            const data = await res.json();
            if (data.status === "success") {
                alert("Order submitted successfully! Please wait for admin verification.");
                router.push('/profile/order');
            } else {
                setError(data.message || "Payment submission failed");
            }
        } catch (e: any) { setError(e.message); } finally { setLoading(false); }
    };

    return (
        <div className="container mx-auto px-2 md:px-4 py-6 md:py-10 max-w-6xl">
            {/* Product Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 items-center">
                <img src={`${process.env.NEXT_PUBLIC_BASE_URL}/storage/products/${product.gallery}`} alt={product.name} className="w-24 h-24 rounded-xl shadow-sm" />
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 capitalize">{product.name}</h1>
                    <p className="text-gray-500 text-sm mt-1">Game / Top up</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mt-6">
                {/* Left Column */}
                <div className="flex-grow space-y-6 md:w-2/3">
                    {/* Recharge Selection */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center gap-3">
                            <span className="bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span>
                            <h2 className="text-lg font-bold text-gray-800">Select Recharge</h2>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                            {inputFieldsRecharge.map((field: any, index: number) => {
                                const isSelected = selectedRechargeIndex === index;
                                const isOutOfStock = field.recharge_stock === "0";
                                return (
                     <button
  key={index}
  onClick={() => handleRechargeSelect(field, index)}
  disabled={isOutOfStock}
  className={`relative flex items-center justify-between w-full px-2 py-3 rounded-[0.5rem] border transition-all duration-200 font-['Bree Serif',serif]
  
  ${isSelected 
    ? 'border-orange-500 bg-orange-50 shadow-md shadow-orange-100 scale-[1.01]' 
    : 'border-gray-200 bg-white hover:border-orange-400 hover:shadow-sm'
  }

  ${isOutOfStock 
    ? 'opacity-50 cursor-not-allowed bg-gray-100' 
    : 'cursor-pointer active:scale-[0.98]'
  }
`}
>
  {/* LEFT */}
  <div className="flex items-center gap-2 text-sm"> {/* text-sm = 0.75rem */}
    
    {/* Animated Circle */}
    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200
      ${isSelected 
        ? 'border-orange-500 bg-orange-500 shadow-sm shadow-orange-400' 
        : 'border-gray-300 bg-gray-200'
      }
    `}>
      {isSelected && (
        <span className="text-white text-xs">✔</span> 
      )}
    </div>

    {/* Title */}
    <span className={`font-bold transition-colors
      ${isSelected ? 'text-gray-900' : 'text-gray-600'}
    `}>
      {field.type}
    </span>
  </div>

  {/* RIGHT (Price) */}
  <span className="text-orange-500 font-bold">
    {field.currency_amount} ৳
  </span>

  {/* Glow Effect */}
  {isSelected && (
    <div className="absolute inset-0 rounded-[0.5rem] border border-orange-300 pointer-events-none animate-pulse opacity-40"></div>
  )}
</button>
                                );
                            })}
                        </div>
                        {errorRecharge && <p className="px-4 pb-4 text-red-500 text-sm font-medium">{errorRecharge}</p>}
                    </div>

                    {/* Quantity / Account Info */}
                    <div ref={nextStepRef} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center gap-3">
                            <span className="bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</span>
                            <h2 className="text-lg font-bold text-gray-800">{isQuantitySelectionAllowed ? 'Quantity' : 'Account Info'}</h2>
                        </div>
                        <div className="p-4">
                            {isQuantitySelectionAllowed ? (
                                <div className="flex items-center gap-4">
                                    <span className="font-medium text-gray-700">Quantity</span>
                                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                        <button onClick={decrementQuantity} className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold transition-colors">-</button>
                                        <input type="number" readOnly value={quantity} className="w-16 text-center py-2 focus:outline-none focus:ring-0 select-none bg-white font-medium" />
                                        <button onClick={incrementQuantity} className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold transition-colors">+</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {inputFieldsPlayerId.map((field: any, index: number) => (
                                        <div key={index}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                placeholder={`Enter ${field.label}`}
                                                onChange={handleAccountInfoChange}
                                                required={field.required}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 bg-gray-50 focus:bg-white transition-colors"
                                            />
                                        </div>
                                    ))}
                                    {errorPlayerID && <p className="text-red-500 text-sm font-medium">{errorPlayerID}</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div ref={paymentSectionRef} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center gap-3">
                            <span className="bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</span>
                            <h2 className="text-lg font-bold text-gray-800">Payment Method</h2>
                        </div>
                        <PaymentMethods
                            selectedPaymentMethod={selectedPaymentMethod}
                            onPaymentMethodChange={(e) => { setSelectedPaymentMethod(e.target.value); setShowManualPayment(false); }}
                            onManualPaymentClick={() => { setSelectedPaymentMethod('manual'); setShowManualPayment(true); }}
                        />

                        {user && (
                            <div className="px-4 pb-4">
                                <div className="bg-pink-50 border border-pink-100 rounded-xl p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <span className="text-pink-500">ℹ️</span> Your Wallet Balance
                                    </div>
                                    <div className="font-bold text-pink-600 flex items-center gap-2">
                                        ৳ {Number(wallet?.balance || 0).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && !showManualPayment && <p className="px-4 pb-4 text-red-500 text-sm font-medium">{error}</p>}

                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                            <button
                                onClick={handleBuyNow}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-pink-500/20 transition-all disabled:opacity-70 text-lg flex items-center justify-center gap-2"
                            >
                                {loading ? "Processing..." : `Buy Now - ৳ ${totalAmount}`}
                            </button>
                        </div>
                    </div>

                    {/* Manual Payment Form */}
                    <div ref={manualPaymentRef}>
                        {showManualPayment && (
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
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="md:w-1/3">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                        <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                            <span>📝</span> How to top up?
                        </h3>
                        {product.description ? (
                            <div className="prose prose-sm prose-pink max-w-none text-gray-600 mt-2" dangerouslySetInnerHTML={{ __html: product.description }} />
                        ) : (
                            <ol className="list-decimal pl-5 space-y-3 text-sm text-gray-600">
                                <li>Select the desired package / recharge amount.</li>
                                <li>Enter your Player ID or Account details.</li>
                                <li>Select quantity (if allowed).</li>
                                <li>Choose your preferred payment method.</li>
                                <li>Click on "Buy Now" to complete the purchase.</li>
                            </ol>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}