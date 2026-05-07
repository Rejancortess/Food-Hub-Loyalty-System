import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../app/config/firebase";
import { Clock3, Loader2, User, Users, Wifi, WifiOff } from "lucide-react";

type Customer = {
  id: string;
  uid: string;
  fullName: string;
  email: string;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
  points: number;
  lastVisit: string;
  status: "Active" | "Inactive";
};

const warriorLevels = [
  { level: "Bronze", points: 0 },
  { level: "Silver", points: 500 },
  { level: "Gold", points: 1000 },
  { level: "Platinum", points: 2000 },
  { level: "Diamond", points: 5000 },
] as const;

const tierBadge = (tier: Customer["tier"]) => {
  const base =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";

  switch (tier) {
    case "Bronze":
      return `${base} bg-amber-100 text-amber-700`;
    case "Silver":
      return `${base} bg-slate-100 text-slate-700`;
    case "Gold":
      return `${base} bg-yellow-100 text-yellow-800`;
    case "Platinum":
      return `${base} bg-slate-900 text-white px-4`;
    case "Diamond":
      return `${base} bg-indigo-100 text-indigo-700`;
    default:
      return `${base} bg-gray-100 text-gray-700`;
  }
};

const getCurrentTier = (points: number): Customer["tier"] => {
  return (
    [...warriorLevels].reverse().find((level) => points >= level.points)
      ?.level || "Bronze"
  );
};

const formatFirestoreDate = (value: unknown) => {
  if (!value) return "Just now";

  if (typeof value === "string") return value;

  if (value instanceof Date) {
    return value.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (typeof value === "object" && value !== null && "toDate" in value) {
    const dateValue = (value as { toDate: () => Date }).toDate();
    return dateValue.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return "Just now";
};

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const customersQuery = query(
      collection(db, "users"),
      where("role", "==", "client"),
    );

    const unsubscribe = onSnapshot(
      customersQuery,
      (snapshot) => {
        const realtimeCustomers = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data();
            const points = Number(data.points ?? data.userBalance ?? 0);
            const status: Customer["status"] =
              data.status === "Active" ? "Active" : "Inactive";
            const lastVisit = formatFirestoreDate(
              data.lastSeenAt ?? data.updatedAt ?? data.createdAt,
            );

            return {
              id: data.uid ?? docSnap.id,
              uid: data.uid ?? docSnap.id,
              fullName: data.fullName || "Unknown Customer",
              email: data.email || "N/A",
              tier: getCurrentTier(points),
              points,
              lastVisit,
              status,
            };
          })
          .sort((a, b) => {
            if (a.status !== b.status) {
              return a.status === "Active" ? -1 : 1;
            }

            return b.points - a.points;
          });

        setCustomers(realtimeCustomers);
        setLoading(false);
      },
      (snapshotError) => {
        console.error("Failed to load customers:", snapshotError);
        setError("Unable to load realtime customers. Please try again.");
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const activeCount = useMemo(
    () => customers.filter((customer) => customer.status === "Active").length,
    [customers],
  );

  const inactiveCount = customers.length - activeCount;
  const totalPoints = useMemo(
    () => customers.reduce((sum, customer) => sum + customer.points, 0),
    [customers],
  );

  return (
    <div className="py-4 sm:py-6 px-3 sm:px-0 max-w-6xl mx-auto">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-green-700">
            Realtime Customers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            All client accounts sync live from Firestore.
          </p>
          <div className="mt-2 h-0.5 w-16 rounded bg-green-200" />
        </div>

        <div className="grid grid-cols-3 gap-2 text-[11px] sm:text-sm w-full sm:max-w-md lg:max-w-sm lg:ml-auto">
          <div className="rounded-xl bg-white px-2.5 py-2 shadow-sm ring-1 ring-gray-100 min-w-0">
            <p className="text-slate-400">Total</p>
            <p className="font-semibold text-gray-800">{customers.length}</p>
          </div>
          <div className="rounded-xl bg-white px-2.5 py-2 shadow-sm ring-1 ring-gray-100 min-w-0">
            <p className="text-slate-400">Active</p>
            <p className="font-semibold text-green-600">{activeCount}</p>
          </div>
          <div className="rounded-xl bg-white px-2.5 py-2 shadow-sm ring-1 ring-gray-100 min-w-0">
            <p className="text-slate-400">Points</p>
            <p className="font-semibold text-slate-700">
              {totalPoints.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden mt-3 sm:mt-5">
        <div className="p-3 sm:p-4 md:hidden space-y-3">
          {loading ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center text-slate-500">
              <div className="inline-flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading realtime customers...
              </div>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-10 text-center text-red-600 text-sm">
              {error}
            </div>
          ) : customers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center text-slate-500">
              <Users className="mx-auto mb-3 h-10 w-10 text-slate-300" />
              No client accounts found yet.
            </div>
          ) : (
            customers.map((customer) => (
              <div
                key={customer.uid}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <User className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {customer.fullName}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                          ID: {customer.id}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {customer.status === "Active" ? (
                          <Wifi className="h-4 w-4 text-green-500" />
                        ) : (
                          <WifiOff className="h-4 w-4 text-gray-300" />
                        )}
                        <span
                          className={`text-xs font-medium ${customer.status === "Active" ? "text-green-700" : "text-slate-400"}`}
                        >
                          {customer.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl bg-emerald-50 px-3 py-2">
                        <p className="text-slate-400">Tier</p>
                        <p className="mt-1">
                          <span
                            className={`${tierBadge(customer.tier)} text-[11px]`}
                          >
                            {customer.tier.toUpperCase()}
                          </span>
                        </p>
                      </div>

                      <div className="rounded-xl bg-gray-50 px-3 py-2">
                        <p className="text-slate-400">Points</p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {customer.points.toLocaleString()} pts
                        </p>
                      </div>

                      <div className="rounded-xl bg-gray-50 px-3 py-2 col-span-2">
                        <p className="text-slate-400">Email</p>
                        <p className="mt-1 truncate text-gray-700">
                          {customer.email}
                        </p>
                      </div>

                      <div className="rounded-xl bg-gray-50 px-3 py-2 col-span-2">
                        <p className="text-slate-400">Last Visit</p>
                        <p className="mt-1 inline-flex items-center gap-2 text-gray-700">
                          <Clock3 size={14} />
                          {customer.lastVisit}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-emerald-50 text-left text-xs sm:text-sm text-slate-600">
                <th className="px-3 sm:px-4 py-3 sm:py-4 w-[28%]">PROFILE</th>
                <th className="px-3 sm:px-4 py-3 sm:py-4 hidden md:table-cell w-[23%]">
                  EMAIL
                </th>
                <th className="px-3 sm:px-4 py-3 sm:py-4 w-[14%]">TIER</th>
                <th className="px-3 sm:px-4 py-3 sm:py-4 hidden lg:table-cell w-[15%]">
                  TOTAL POINTS
                </th>
                <th className="px-3 sm:px-4 py-3 sm:py-4 hidden md:table-cell w-[15%]">
                  LAST VISIT
                </th>
                <th className="px-3 sm:px-4 py-3 sm:py-4 w-[10%]">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-14 text-center text-slate-500"
                  >
                    <div className="inline-flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Loading realtime customers...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-14 text-center text-red-600 text-sm"
                  >
                    {error}
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-14 text-center text-slate-500"
                  >
                    <Users className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                    No client accounts found yet.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.uid}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                          <User className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs sm:text-sm text-gray-800 truncate max-w-40 sm:max-w-none">
                            {customer.fullName}
                          </div>
                          <div className="text-xs text-slate-400 truncate">
                            ID: {customer.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-slate-600 hidden md:table-cell text-xs sm:text-sm">
                      <span className="truncate block">{customer.email}</span>
                    </td>

                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <span className={`${tierBadge(customer.tier)} text-xs`}>
                        {customer.tier.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-3 sm:px-4 py-3 sm:py-4 font-bold text-gray-800 hidden lg:table-cell text-xs sm:text-sm">
                      {customer.points.toLocaleString()} pts
                    </td>

                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-slate-600 hidden md:table-cell text-xs sm:text-sm">
                      <span className="inline-flex items-center gap-2">
                        <Clock3 size={14} />
                        {customer.lastVisit}
                      </span>
                    </td>

                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="flex items-center gap-2">
                        {customer.status === "Active" ? (
                          <Wifi className="h-4 w-4 text-green-500" />
                        ) : (
                          <WifiOff className="h-4 w-4 text-gray-300" />
                        )}
                        <span
                          className={`text-xs sm:text-sm font-medium ${customer.status === "Active" ? "text-green-700" : "text-slate-400"}`}
                        >
                          {customer.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 border-t border-gray-100 bg-emerald-50 px-3 sm:px-5 py-3 sm:py-4">
          <div className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {customers.length > 0
              ? `Showing ${customers.length} realtime customers`
              : "Realtime list updates automatically when clients log in or out."}
          </div>
          <div className="text-xs sm:text-sm font-medium text-slate-600">
            {activeCount} active / {inactiveCount} inactive
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
