import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const emptySlab = { min: '', max: '', rate: '' };

const TariffSetupPage = () => {
    const [slabs, setSlabs] = useState([emptySlab]);

    useEffect(() => {
        const fetchTariff = async () => {
            try {
                const { data } = await api.get('/tariff');
                if (data?.slabs?.length) {
                    setSlabs(data.slabs);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to load tariff');
            }
        };

        fetchTariff();
    }, []);

    const updateSlab = (index, field, value) => {
        setSlabs((prev) => prev.map((slab, i) => (i === index ? { ...slab, [field]: value } : slab)));
    };

    const addSlab = () => {
        setSlabs((prev) => [...prev, emptySlab]);
    };

    const saveTariff = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                slabs: slabs.map((s) => ({ min: Number(s.min), max: Number(s.max), rate: Number(s.rate) })),
            };
            await api.post('/tariff', payload);
            toast.success('Tariff saved');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save tariff');
        }
    };

    return (
        <div className="card p-6">
            <h2 className="text-2xl font-bold">Tariff Setup</h2>

            <form className="mt-4 space-y-4" onSubmit={saveTariff}>
                {slabs.map((slab, index) => (
                    <div key={index} className="grid gap-3 md:grid-cols-3">
                        <input
                            type="number"
                            value={slab.min}
                            onChange={(e) => updateSlab(index, 'min', e.target.value)}
                            placeholder="Min"
                            className="rounded-lg border border-slate-300 px-3 py-2"
                            required
                        />
                        <input
                            type="number"
                            value={slab.max}
                            onChange={(e) => updateSlab(index, 'max', e.target.value)}
                            placeholder="Max"
                            className="rounded-lg border border-slate-300 px-3 py-2"
                            required
                        />
                        <input
                            type="number"
                            value={slab.rate}
                            onChange={(e) => updateSlab(index, 'rate', e.target.value)}
                            placeholder="Rate"
                            className="rounded-lg border border-slate-300 px-3 py-2"
                            required
                        />
                    </div>
                ))}

                <div className="flex gap-3">
                    <button type="button" onClick={addSlab} className="rounded-lg border border-slate-300 px-4 py-2">
                        Add Slab
                    </button>
                    <button className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-600">
                        Save Tariff
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TariffSetupPage;
