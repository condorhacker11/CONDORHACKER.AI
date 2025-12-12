import React, { useState } from 'react';
import { Lock, Unlock, CreditCard, Bitcoin, X, CheckCircle, Clock, Check, Star, Zap, Crown } from 'lucide-react';
import { PaymentMethod, SubscriptionPlan } from '../types';

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: (type: 'master' | 'demo', credits?: number) => void;
  savedMethods?: PaymentMethod[];
}

const PLANS: SubscriptionPlan[] = [
  {
    id: 'standard',
    name: 'STANDARD',
    price: 25,
    credits: 35,
    description: 'Ideale per un utilizzo occasionale.',
    color: 'border-blue-500/50 text-blue-400'
  },
  {
    id: 'plus',
    name: 'PLUS',
    price: 50,
    credits: 80,
    description: 'Per professionisti e studenti.',
    color: 'border-purple-500/50 text-purple-400',
    popular: true
  },
  {
    id: 'super',
    name: 'SUPER PLUS',
    price: 100,
    credits: 120,
    description: 'Per power users e agenzie.',
    color: 'border-orange-500/50 text-orange-400'
  },
  {
    id: 'unlimited',
    name: 'UNLIMITED PLUS',
    price: 200,
    credits: -1,
    description: 'Accesso totale senza limiti.',
    color: 'border-red-500/50 text-red-500 bg-red-900/10'
  }
];

export const UnlockModal: React.FC<UnlockModalProps> = ({ isOpen, onClose, onUnlock, savedMethods = [] }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<'pin' | 'pay'>('pin');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '2019@#') {
      onUnlock('master', -1); // Master PIN = Unlimited
      onClose();
    } else if (pin.toUpperCase() === 'CONDOR') {
      onUnlock('demo', 10); // Demo = 10 Crediti
      onClose();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleBuyPlan = (plan: SubscriptionPlan) => {
    // Here we would normally open the Payment Selection (Wallet)
    // For this demo, we simulate direct purchase
    const confirm = window.confirm(`Confermi l'acquisto del piano ${plan.name} a €${plan.price}/mese?`);
    if (confirm) {
        onUnlock('master', plan.credits);
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 overflow-y-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">AREA ABBONAMENTI</h2>
            <p className="text-sm text-zinc-400 mt-1">Scegli il piano adatto alle tue esigenze</p>
          </div>

          <div className="flex bg-zinc-800 p-1 rounded-lg mb-6 max-w-md mx-auto">
            <button 
              onClick={() => setActiveTab('pin')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'pin' ? 'bg-zinc-700 text-white shadow' : 'text-zinc-400 hover:text-zinc-300'}`}
            >
              Usa PIN
            </button>
            <button 
              onClick={() => setActiveTab('pay')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'pay' ? 'bg-zinc-700 text-white shadow' : 'text-zinc-400 hover:text-zinc-300'}`}
            >
              Piani & Prezzi
            </button>
          </div>

          {activeTab === 'pin' ? (
            <div className="max-w-xs mx-auto">
                <form onSubmit={handlePinSubmit} className="space-y-4">
                <div>
                    <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="PIN Master o Demo"
                    className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-center font-mono text-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 transition-all text-white placeholder:text-zinc-600 uppercase"
                    autoFocus
                    />
                    <div className="mt-4 text-[11px] text-center text-zinc-500 space-y-2 border-t border-zinc-800 pt-4">
                        <div className="flex justify-between items-center px-4">
                            <span>Master PIN:</span>
                            <span className="text-zinc-300 font-mono">********</span>
                        </div>
                        <div className="flex justify-between items-center px-4">
                            <span>Demo PIN:</span>
                            <span className="text-cyan-400 font-bold font-mono">CONDOR</span>
                        </div>
                        <p className="text-[10px] text-zinc-600 italic mt-2">
                           PIN Demo valido per <span className="text-white font-bold">10 Crediti</span> gratuiti.
                        </p>
                    </div>
                    {error && <p className="text-red-500 text-xs text-center mt-2 font-mono bg-red-900/10 p-2 rounded">PIN NON VALIDO</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-yellow-900/20 flex items-center justify-center gap-2"
                >
                    <Unlock className="w-4 h-4" />
                    ACCEDI
                </button>
                </form>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {PLANS.map((plan) => (
                 <div 
                    key={plan.id}
                    onClick={() => handleBuyPlan(plan)}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] bg-zinc-800/50 hover:bg-zinc-800 ${plan.color} ${plan.popular ? 'ring-1 ring-purple-500 shadow-purple-900/20 shadow-lg' : 'border-zinc-700'}`}
                 >
                    {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full">
                            PIÙ VENDUTO
                        </div>
                    )}
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-bold text-lg">{plan.name}</h3>
                            <div className="text-xs text-zinc-400">{plan.description}</div>
                        </div>
                        {plan.id === 'unlimited' ? <Crown className="w-5 h-5" /> : plan.id === 'super' ? <Star className="w-5 h-5"/> : <Zap className="w-5 h-5"/>}
                    </div>
                    
                    <div className="my-4">
                        <span className="text-3xl font-bold text-white">€{plan.price}</span>
                        <span className="text-sm text-zinc-500"> / mese</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-mono bg-black/30 p-2 rounded">
                        <Check className="w-4 h-4" />
                        {plan.credits === -1 ? (
                            <span className="font-bold text-white">CREDITI ILLIMITATI</span>
                        ) : (
                            <span><span className="font-bold text-white">{plan.credits}</span> Crediti</span>
                        )}
                    </div>
                    
                    <button className="w-full mt-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-bold rounded-lg transition-colors">
                        SELEZIONA
                    </button>
                 </div>
               ))}
            </div>
          )}
        </div>
        
        <div className="bg-zinc-950 p-3 text-center border-t border-zinc-800 mt-auto">
           <p className="text-[10px] text-zinc-600">Secure Payment Gateway v4.2 • Accettiamo Crypto & Fiat</p>
        </div>
      </div>
    </div>
  );
};