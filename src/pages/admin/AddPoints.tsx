import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../app/config/firebase";
import { useAuth } from "../../app/providers/AuthProvider";
import { toast } from "react-toastify";
import { Search, X } from "lucide-react";

type Customer = {
  id: string;
  uid: string;
  fullName: string;
  email: string;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
  points: number;
  createdAt: string;
  membershipSince: string;
};

type Transaction = {
  id: string;
  customerId: string;
  pointsAdjustment: number;
  transactionType: string;
  adminNote: string;
  createdBy: string;
  createdAt: Date;
};

const warriorLevels = [
  { level: "Bronze", points: 0 },
  { level: "Silver", points: 500 },
  { level: "Gold", points: 1000 },
  { level: "Platinum", points: 2000 },
  { level: "Diamond", points: 5000 },
] as const;

const transactionTypes = [
  "Manual Correction",
  "System Adjustment",
  "Promotion",
  "Refund",
  "Bonus",
  "Other",
];

const getCurrentTier = (points: number): Customer["tier"] => {
  return (
    [...warriorLevels].reverse().find((level) => points >= level.points)
      ?.level || "Bronze"
  );
};

const getTierColor = (tier: Customer["tier"]) => {
  switch (tier) {
    case "Bronze":
      return "from-amber-400 to-amber-600";
    case "Silver":
      return "from-slate-400 to-slate-600";
    case "Gold":
      return "from-yellow-400 to-yellow-600";
    case "Platinum":
      return "from-slate-600 to-slate-900";
    case "Diamond":
      return "from-indigo-400 to-indigo-600";
    default:
      return "from-gray-400 to-gray-600";
  }
};

const getTierBadge = (tier: Customer["tier"]) => {
  const base =
    "inline-block px-4 py-1 rounded-lg text-sm font-semibold text-white";

  switch (tier) {
    case "Bronze":
      return `${base} bg-linear-to-r from-amber-400 to-amber-600`;
    case "Silver":
      return `${base} bg-linear-to-r from-slate-400 to-slate-600`;
    case "Gold":
      return `${base} bg-linear-to-r from-yellow-400 to-yellow-600`;
    case "Platinum":
      return `${base} bg-linear-to-r from-slate-600 to-slate-900`;
    case "Diamond":
      return `${base} bg-linear-to-r from-indigo-400 to-indigo-600`;
    default:
      return `${base} bg-linear-to-r from-gray-400 to-gray-600`;
  }
};

const AddPoints = () => {
  const { user: authUser } = useAuth();
  const location = useLocation();
  const preselectedCustomer = (location.state?.preselectedCustomer ??
    null) as Customer | null;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    preselectedCustomer,
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [pointsToAdd, setPointsToAdd] = useState("");
  const [transactionType, setTransactionType] = useState("Manual Correction");
  const [adminNote, setAdminNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.uid.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Load customers
  useEffect(() => {
    const customersQuery = query(
      collection(db, "users"),
      where("role", "==", "client"),
    );

    const unsubscribe = onSnapshot(customersQuery, (snapshot) => {
      const loadedCustomers = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const points = Number(data.points ?? data.userBalance ?? 0);
        const createdAt =
          data.createdAt?.toDate?.().toLocaleDateString() ?? "Unknown";
        const membershipSince = createdAt;

        return {
          id: data.uid ?? docSnap.id,
          uid: data.uid ?? docSnap.id,
          fullName: data.fullName || "Unknown Customer",
          email: data.email || "N/A",
          tier: getCurrentTier(points),
          points,
          createdAt,
          membershipSince,
        };
      });

      setCustomers(loadedCustomers);
    });

    return unsubscribe;
  }, []);

  // Load recent transactions for selected customer
  useEffect(() => {
    if (!selectedCustomer) {
      setRecentTransactions([]);
      return;
    }

    const transactionsQuery = query(
      collection(db, "users", selectedCustomer.uid, "transactions"),
    );

    const unsubscribe = onSnapshot(transactionsQuery, (snapshot) => {
      const transactions = snapshot.docs
        .map((docSnap) => ({
          id: docSnap.id,
          customerId: selectedCustomer.uid,
          pointsAdjustment: docSnap.data().pointsAdjustment ?? 0,
          transactionType: docSnap.data().transactionType ?? "Unknown",
          adminNote: docSnap.data().adminNote ?? "",
          createdBy: docSnap.data().createdBy ?? "System",
          createdAt: docSnap.data().createdAt?.toDate?.() ?? new Date(),
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5);

      setRecentTransactions(transactions);
    });

    return unsubscribe;
  }, [selectedCustomer]);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleAddPoints = async () => {
    if (!selectedCustomer || !pointsToAdd || !authUser) {
      toast.error("Please fill in all required fields");
      return;
    }

    const pointsValue = parseInt(pointsToAdd, 10);
    if (isNaN(pointsValue)) {
      toast.error("Please enter a valid number for points");
      return;
    }

    setIsLoading(true);

    try {
      const batch = writeBatch(db);

      // Get current customer data
      const customerRef = doc(db, "users", selectedCustomer.uid);
      const customerSnap = await getDoc(customerRef);
      const currentPoints = customerSnap.exists()
        ? Number(
            customerSnap.data().points ?? customerSnap.data().userBalance ?? 0,
          )
        : 0;
      const newPoints = currentPoints + pointsValue;

      // Update customer points
      batch.update(customerRef, {
        points: newPoints,
        updatedAt: serverTimestamp(),
      });

      // Create transaction record
      const transactionRef = doc(
        collection(db, "users", selectedCustomer.uid, "transactions"),
      );
      batch.set(transactionRef, {
        pointsAdjustment: pointsValue,
        transactionType,
        adminNote,
        previousPoints: currentPoints,
        newPoints,
        createdBy: authUser.email,
        createdAt: serverTimestamp(),
      });

      // Create audit log
      const auditRef = doc(collection(db, "auditLogs"));
      batch.set(auditRef, {
        type: "points_adjustment",
        customerId: selectedCustomer.uid,
        customerName: selectedCustomer.fullName,
        pointsAdjustment: pointsValue,
        transactionType,
        adminNote,
        previousPoints: currentPoints,
        newPoints,
        performedBy: authUser.email,
        performedAt: serverTimestamp(),
      });

      await batch.commit();

      toast.success(
        `Added ${pointsValue} points to ${selectedCustomer.fullName}`,
      );
      setPointsToAdd("");
      setAdminNote("");
      setTransactionType("Manual Correction");
      setSelectedCustomer(null);
      setSearchTerm("");
    } catch (error) {
      console.error("Error adding points:", error);
      toast.error("Failed to add points. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Add Points
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Manually adjust customer loyalty balances. All adjustments are
            logged and require an admin note for audit trails.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Locate Customer */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                STEP 1: LOCATE CUSTOMER
              </h2>

              {/* Search Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search by Name, Email, or ID
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowDropdown(true);
                    }}
                    placeholder="Type to search..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    onFocus={() => setShowDropdown(true)}
                  />
                </div>

                {/* Search Dropdown */}
                {showDropdown && searchTerm && (
                  <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.slice(0, 5).map((customer) => (
                        <button
                          key={customer.uid}
                          onClick={() => handleSelectCustomer(customer)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="font-medium text-gray-900">
                            {customer.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {customer.uid.substring(0, 8)}... •{" "}
                            {customer.email}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No customers found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Customer */}
              {selectedCustomer && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-green-900">
                      {selectedCustomer.fullName}
                    </div>
                    <div className="text-sm text-green-700">
                      ID: {selectedCustomer.uid.substring(0, 12)}... •{" "}
                      {selectedCustomer.email}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Step 2: Point Adjustment Details */}
            {selectedCustomer && (
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  STEP 2: POINT ADJUSTMENT DETAILS
                </h2>

                <div className="space-y-4">
                  {/* Points to Add */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points to Add
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={pointsToAdd}
                        onChange={(e) => setPointsToAdd(e.target.value)}
                        placeholder="0"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                      <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600 font-medium flex items-center">
                        PTS
                      </div>
                    </div>
                  </div>

                  {/* Transaction Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction Type
                    </label>
                    <select
                      value={transactionType}
                      onChange={(e) => setTransactionType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    >
                      {transactionTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Admin Note */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Note{" "}
                      <span className="text-gray-500">(Optional)</span>
                    </label>
                    <textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Explain the reason for this manual adjustment..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddPoints}
                    disabled={isLoading || !pointsToAdd}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    ✓ Confirm & Add Points
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCustomer(null);
                      setPointsToAdd("");
                      setAdminNote("");
                      setTransactionType("Manual Correction");
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Section - Customer Preview */}
          {selectedCustomer && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Profile Header */}
                <div
                  className={`h-32 bg-linear-to-r ${getTierColor(selectedCustomer.tier)}`}
                />

                {/* Profile Content */}
                <div className="relative px-6 pb-6 -mt-12">
                  {/* Avatar Placeholder */}
                  <div className="w-24 h-24 mx-auto bg-linear-to-br from-pink-400 to-orange-400 rounded-full border-4 border-white mb-4 flex items-center justify-center">
                    <div className="text-4xl font-bold text-white">
                      {selectedCustomer.fullName.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Name and Details */}
                  <h3 className="text-center text-xl font-bold text-gray-900">
                    {selectedCustomer.fullName}
                  </h3>
                  <p className="text-center text-sm text-gray-600 mt-1">
                    Loyalty Member since{" "}
                    {new Date(
                      selectedCustomer.membershipSince,
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-6 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedCustomer.points.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 uppercase font-medium">
                        Current Balance
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={getTierBadge(selectedCustomer.tier)}>
                        {selectedCustomer.tier}
                      </div>
                      <div className="text-xs text-gray-600 uppercase font-medium mt-2">
                        Membership
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  {recentTransactions.length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-semibold text-gray-900 text-sm mb-3">
                        Recent Activity
                      </h4>
                      <div className="space-y-2">
                        {recentTransactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between text-sm py-2"
                          >
                            <div>
                              <div className="text-gray-700 font-medium">
                                {transaction.transactionType}
                              </div>
                              <div className="text-xs text-gray-500">
                                {transaction.createdAt.toLocaleDateString()}
                              </div>
                            </div>
                            <div
                              className={`font-semibold ${
                                transaction.pointsAdjustment >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.pointsAdjustment >= 0 ? "+" : ""}
                              {transaction.pointsAdjustment}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPoints;
