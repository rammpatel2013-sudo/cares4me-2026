'use client';

import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test';
const PRESET_AMOUNTS = [10, 25, 50, 100];

type CampaignData = {
  id: number;
  slug: string;
  title: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  metricType: 'currency' | 'count';
  metricUnit: string;
  beneficiaries?: string;
  status: 'active' | 'archived';
};

function formatMetric(value: number, metricType: 'currency' | 'count', metricUnit: string) {
  if (metricType === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  }
  return `${Math.round(value).toLocaleString('en-US')} ${metricUnit}`;
}

function computePercentage(raised: number, target: number) {
  if (!target || target <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((raised / target) * 100)));
}

export default function PaymentClient({ campaign }: { campaign: CampaignData }) {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const percentage = computePercentage(campaign.raisedAmount, campaign.targetAmount);
  const isInKind = campaign.metricType === 'count';

  // Resolve the final amount to charge: preset takes priority, then custom
  const finalAmount =
    selectedPreset !== null
      ? selectedPreset
      : customAmount.trim()
      ? parseFloat(customAmount.replace(/[^0-9.]/g, ''))
      : null;

  const amountValid = finalAmount !== null && Number.isFinite(finalAmount) && finalAmount >= 1;

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow p-8 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-black text-[#1E5A96] mb-3">Thank You!</h2>
        <p className="text-gray-700 mb-2">
          Your donation of <strong>${finalAmount?.toFixed(2)}</strong> toward{' '}
          <strong>{campaign.title}</strong> was received.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          A confirmation will appear in your PayPal or Venmo account.
        </p>
        <a
          href="/campaigns"
          className="inline-block bg-[#2BA5D7] text-white py-2 px-6 rounded-lg font-bold hover:bg-[#1E5A96] transition"
        >
          Back to Campaigns
        </a>
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: PAYPAL_CLIENT_ID,
        currency: 'USD',
        intent: 'capture',
        components: 'buttons',
      }}
    >
      {/* Campaign summary card */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h1 className="text-2xl font-black text-[#1E5A96] mb-2">{campaign.title}</h1>
        <p className="text-gray-700 text-sm mb-4">{campaign.description}</p>

        {!!campaign.beneficiaries && (
          <p className="text-xs font-semibold uppercase tracking-wide text-[#2BA5D7] mb-4">
            Impact: {campaign.beneficiaries}
          </p>
        )}

        {/* Progress bar */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-bold text-gray-900">Progress</span>
            <span className="text-sm text-gray-600">
              {formatMetric(campaign.raisedAmount, campaign.metricType, campaign.metricUnit)} of{' '}
              {formatMetric(campaign.targetAmount, campaign.metricType, campaign.metricUnit)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#7CB342] h-2.5 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{percentage}% funded</p>
        </div>
      </div>

      {/* Donation form */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-black text-[#1E5A96] mb-2">Make a Donation</h2>

        {isInKind && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
            This campaign collects <strong>{campaign.metricUnit}</strong>. Your monetary donation
            helps cover transportation, sorting, and handling costs — thank you!
          </div>
        )}

        {/* Preset amount chips */}
        <p className="text-sm font-semibold text-gray-700 mb-3">Select an amount:</p>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {PRESET_AMOUNTS.map((amt) => (
            <button
              key={amt}
              onClick={() => {
                setSelectedPreset(amt);
                setCustomAmount('');
                setErrorMsg('');
              }}
              className={`py-2 rounded-lg border-2 font-bold text-sm transition ${
                selectedPreset === amt
                  ? 'bg-[#1E5A96] border-[#1E5A96] text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-[#2BA5D7]'
              }`}
            >
              ${amt}
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Or enter a custom amount:
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
            <input
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 75"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedPreset(null);
                setErrorMsg('');
              }}
              className="w-full pl-7 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#2BA5D7] focus:outline-none text-gray-900"
            />
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <p className="text-red-600 text-sm mb-4">{errorMsg}</p>
        )}

        {/* PayPal / Venmo buttons */}
        {amountValid ? (
          <PayPalButtons
            style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'donate' }}
            fundingSource={undefined}
            createOrder={(_data, actions) =>
              actions.order.create({
                intent: 'CAPTURE',
                purchase_units: [
                  {
                    amount: {
                      value: (finalAmount as number).toFixed(2),
                      currency_code: 'USD',
                    },
                    description: `Donation to: ${campaign.title}`,
                  },
                ],
              })
            }
            onApprove={(_data, actions) =>
              actions.order!.capture().then(() => {
                setSuccess(true);
              })
            }
            onError={() => {
              setErrorMsg('Payment could not be completed. Please try again.');
            }}
          />
        ) : (
          <div className="border-2 border-dashed border-gray-200 rounded-lg py-6 text-center text-gray-400 text-sm">
            Select or enter an amount above to see payment options.
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4 text-center">
          Powered by PayPal · Venmo users will see a dedicated Venmo button above.
        </p>
      </div>
    </PayPalScriptProvider>
  );
}
