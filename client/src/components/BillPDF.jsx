const BillPDF = ({ bill, user }) => {
  const billDate = new Date(bill.createdAt);
  const dueDate = new Date(billDate.getTime() + 30 * 24 * 60 * 60 * 1000);

  return (
    <div
      id="bill-to-pdf"
      className="hidden p-12 bg-white text-slate-900"
      style={{ width: '210mm', minHeight: '297mm' }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b-2 border-teal-700 pb-6">
          <h1 className="text-4xl font-bold text-teal-700">ELECTRICITY BILL</h1>
          <p className="text-sm text-slate-600 mt-2">Monthly Billing Statement</p>
        </div>

        {/* Bill Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Left Column - Bill Details */}
          <div>
            <h3 className="text-lg font-bold mb-4">Bill Details</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-slate-500">Bill ID</p>
                <p className="font-semibold">{bill._id}</p>
              </div>
              <div>
                <p className="text-slate-500">Bill Date</p>
                <p className="font-semibold">{billDate.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-slate-500">Due Date</p>
                <p className="font-semibold">{dueDate.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <p className={`font-semibold ${bill.status === 'paid' ? 'text-green-600' : 'text-red-600'} capitalize`}>
                  {bill.status}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Customer Details */}
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Details</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-slate-500">Name</p>
                <p className="font-semibold">{user.name}</p>
              </div>
              <div>
                <p className="text-slate-500">Email</p>
                <p className="font-semibold">{user.email}</p>
              </div>
              <div>
                <p className="text-slate-500">Meter Number</p>
                <p className="font-semibold">{user.meterNumber}</p>
              </div>
              {user.address && (
                <div>
                  <p className="text-slate-500">Address</p>
                  <p className="font-semibold">{user.address}</p>
                </div>
              )}
              {user.phone && (
                <div>
                  <p className="text-slate-500">Phone</p>
                  <p className="font-semibold">{user.phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Billing Information */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Consumption Details</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-3 text-left font-bold">Description</th>
                <th className="border border-slate-300 p-3 text-right font-bold">Units</th>
                <th className="border border-slate-300 p-3 text-right font-bold">Rate</th>
                <th className="border border-slate-300 p-3 text-right font-bold">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 p-3">Electricity Consumption</td>
                <td className="border border-slate-300 p-3 text-right">{bill.units} kWh</td>
                <td className="border border-slate-300 p-3 text-right">Variable</td>
                <td className="border border-slate-300 p-3 text-right font-semibold">
                  Rs. {bill.amount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mb-8 border-t-2 border-b-2 border-teal-700 py-6">
          <div className="grid grid-cols-2 gap-8">
            <div></div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">Rs. {bill.amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Charges:</span>
                <span className="font-semibold">Rs. 0</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-teal-700">
                <span>Total Amount Due:</span>
                <span>Rs. {bill.amount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        {bill.status === 'paid' && (
          <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-8">
            <p className="text-green-800 font-semibold">
              ✓ Payment Received on {bill.paidAt ? new Date(bill.paidAt).toLocaleDateString() : ''}
            </p>
            {bill.transactionId && (
              <p className="text-sm text-green-700 mt-1">
                Transaction ID: {bill.transactionId}
              </p>
            )}
          </div>
        )}

        {bill.status === 'unpaid' && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-8">
            <p className="text-red-800 font-semibold">
              ⚠ Payment Pending - Please pay by {dueDate.toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-slate-300 text-center text-xs text-slate-600">
          <p>This is a computer-generated bill. No signature is required.</p>
          <p className="mt-2">
            Thank you for being our valued customer. For disputes, contact us within 30 days.
          </p>
          <p className="mt-4 font-semibold">Electricity Board Management System</p>
        </div>
      </div>
    </div>
  );
};

export default BillPDF;
