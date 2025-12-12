import React, { useState } from 'react';
import { X, CreditCard, Bitcoin, Wallet, Trash2, Plus, ShieldCheck, Check } from 'lucide-react';
import { PaymentMethod } from '../types';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedMethods: PaymentMethod[];
  setSavedMethods: React.Dispatch<React.SetStateAction<PaymentMethod[]>>;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, savedMethods, setSavedMethods }) => {
  const [view, setView] = useState<'list' | 'add'>('list');
  const [newMethodType, setNewMethodType] = useState<'paypal' | 'stripe' | 'bitcoin'>('stripe');
  const [inputValue, setInputValue] = useState('');
  const [secondValue, setSecondValue] = useState(''); // Expiry for card, etc.

  if (!isOpen) return null;

  const handleAddMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;

    let label = '';
    let details = '';

    if (newMethodType === 'paypal') {
      label = 'PayPal';
      details = inputValue; // Email
    } else if (newMethodType === 'stripe') {
      label = 'Visa/Mastercard';
      details = `**** ${inputValue.slice(-4)}`;
    } else {
      label = 'Bitcoin Wallet';
      details = `${inputValue.slice(0, 6)}...${inputValue.slice(-4)}`;
    }

    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: newMethodType,
      label,
      details
    };

    setSavedMethods([...savedMethods, newMethod]);
    setView('list');
    setInputValue('');
    setSecondValue('');
  };

  const removeMethod = (id: string) => {
    setSavedMethods(savedMethods.filter(m => m.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-cyan-900/30 rounded-full flex items-center justify-center mb-3">
              <Wallet className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Digital Wallet</h2>
            <p className="text-sm text-zinc-400 mt-1">Gestisci i tuoi metodi di pagamento sicuri</p>
          </div>

          {view === 'list' ? (
            <div className="space-y-4">
              {savedMethods.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-zinc-800 rounded-xl">
                  <p className="text-zinc-500 text-sm mb-4">Nessun metodo salvato</p>
                  <button 
                    onClick={() => setView('add')}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-200 transition-colors inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Aggiungi Metodo
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedMethods.map(method => (
                    <div key={method.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl border border-zinc-700">
                      <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-lg ${method.type === 'paypal' ? 'bg-blue-900/30 text-blue-400' : method.type === 'stripe' ? 'bg-indigo-900/30 text-indigo-400' : 'bg-orange-900/30 text-orange-400'}`}>
                           {method.type === 'paypal' && <span className="font-serif italic font-bold">P</span>}
                           {method.type === 'stripe' && <CreditCard className="w-4 h-4" />}
                           {method.type === 'bitcoin' && <Bitcoin className="w-4 h-4" />}
                         </div>
                         <div>
                           <div className="text-sm font-bold text-zinc-200">{method.label}</div>
                           <div className="text-xs text-zinc-500 font-mono">{method.details}</div>
                         </div>
                      </div>
                      <button 
                        onClick={() => removeMethod(method.id)}
                        className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setView('add')}
                    className="w-full py-3 mt-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm text-zinc-300 transition-colors flex items-center justify-center gap-2 border border-dashed border-zinc-600"
                  >
                    <Plus className="w-4 h-4" /> Aggiungi un altro metodo
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-in slide-in-from-right duration-200">
               <div className="flex gap-2 mb-4">
                 <button 
                   onClick={() => setNewMethodType('stripe')}
                   className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${newMethodType === 'stripe' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                 >
                   Carta
                 </button>
                 <button 
                   onClick={() => setNewMethodType('paypal')}
                   className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${newMethodType === 'paypal' ? 'bg-blue-700 border-blue-600 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                 >
                   PayPal
                 </button>
                 <button 
                   onClick={() => setNewMethodType('bitcoin')}
                   className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${newMethodType === 'bitcoin' ? 'bg-orange-600 border-orange-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                 >
                   Crypto
                 </button>
               </div>

               <form onSubmit={handleAddMethod} className="space-y-4">
                 {newMethodType === 'stripe' && (
                   <>
                     <div className="space-y-1">
                       <label className="text-xs text-zinc-400 ml-1">Numero Carta</label>
                       <input 
                         type="text" 
                         placeholder="0000 0000 0000 0000"
                         className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-mono"
                         value={inputValue}
                         onChange={e => setInputValue(e.target.value)}
                         required
                       />
                     </div>
                     <div className="flex gap-2">
                       <div className="space-y-1 flex-1">
                         <label className="text-xs text-zinc-400 ml-1">Scadenza</label>
                         <input 
                           type="text" 
                           placeholder="MM/YY"
                           className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-mono"
                         />
                       </div>
                       <div className="space-y-1 flex-1">
                         <label className="text-xs text-zinc-400 ml-1">CVC</label>
                         <input 
                           type="text" 
                           placeholder="123"
                           className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-mono"
                         />
                       </div>
                     </div>
                   </>
                 )}

                 {newMethodType === 'paypal' && (
                   <div className="space-y-1">
                     <label className="text-xs text-zinc-400 ml-1">Email PayPal</label>
                     <input 
                       type="email" 
                       placeholder="user@example.com"
                       className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                       value={inputValue}
                       onChange={e => setInputValue(e.target.value)}
                       required
                     />
                   </div>
                 )}

                 {newMethodType === 'bitcoin' && (
                   <div className="space-y-1">
                     <label className="text-xs text-zinc-400 ml-1">Indirizzo Wallet</label>
                     <input 
                       type="text" 
                       placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                       className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 font-mono text-xs"
                       value={inputValue}
                       onChange={e => setInputValue(e.target.value)}
                       required
                     />
                   </div>
                 )}

                 <div className="flex gap-2 pt-2">
                   <button 
                     type="button"
                     onClick={() => setView('list')}
                     className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                   >
                     Annulla
                   </button>
                   <button 
                     type="submit"
                     className="flex-1 py-3 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold transition-colors shadow-lg shadow-cyan-900/20"
                   >
                     Salva Metodo
                   </button>
                 </div>
               </form>
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-zinc-500">
             <ShieldCheck className="w-3 h-3 text-green-500" />
             <span>Crittografia End-to-End attiva</span>
          </div>
        </div>
      </div>
    </div>
  );
};