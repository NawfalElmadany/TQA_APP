import React, { useState } from 'react';
import FormCard from './FormCard';
import TartiliForm from './TartiliForm';
import HafalanForm from './HafalanForm';
import MurojaahForm from './MurojaahForm';

type ActiveTab = 'tartili' | 'hafalan' | 'murojaah';

const InputDataForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tartili');

  const getTabClassName = (tabName: ActiveTab) => {
    const baseClasses = 'px-5 py-2.5 w-full text-sm font-medium leading-5 rounded-md focus:outline-none focus:ring-2 ring-offset-2 ring-offset-card dark:ring-offset-dark-card ring-brand-accent transition-colors duration-200';
    if (activeTab === tabName) {
      return `${baseClasses} bg-brand-accent text-white shadow`;
    }
    return `${baseClasses} text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 hover:text-slate-800 dark:hover:text-slate-100`;
  };

  return (
    <FormCard title="Input Data Perkembangan">
      <div className="mb-8 flex justify-center space-x-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
        <button className={getTabClassName('tartili')} onClick={() => setActiveTab('tartili')}>
          Catatan Tartili
        </button>
        <button className={getTabClassName('hafalan')} onClick={() => setActiveTab('hafalan')}>
          Hafalan Surat
        </button>
        <button className={getTabClassName('murojaah')} onClick={() => setActiveTab('murojaah')}>
          Murojaah
        </button>
      </div>

      <div key={activeTab} className="animate-fade-in">
        {activeTab === 'tartili' && <TartiliForm />}
        {activeTab === 'hafalan' && <HafalanForm />}
        {activeTab === 'murojaah' && <MurojaahForm />}
      </div>
    </FormCard>
  );
};

export default InputDataForm;