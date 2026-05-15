const calculateBillAmount = (units, slabs) => {
    let remainingUnits = units;
    let total = 0;

    const sortedSlabs = [...slabs].sort((a, b) => a.min - b.min);

    for (const slab of sortedSlabs) {
        if (remainingUnits <= 0) break;

        const slabCapacity = slab.max - slab.min + 1;
        const slabUnits = Math.min(remainingUnits, slabCapacity);
        total += slabUnits * slab.rate;
        remainingUnits -= slabUnits;
    }

    if (remainingUnits > 0 && sortedSlabs.length > 0) {
        const lastRate = sortedSlabs[sortedSlabs.length - 1].rate;
        total += remainingUnits * lastRate;
    }

    return Number(total.toFixed(2));
};

module.exports = {
    calculateBillAmount,
};
