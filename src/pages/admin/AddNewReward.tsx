import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  BadgePercent,
  Gift,
  ImagePlus,
  Sparkles,
  Star,
} from "lucide-react";
import { PATHS } from "../../app/config/constants";
import { useAuth } from "../../app/providers/AuthProvider";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../app/config/firebase";

const rewardCategories = [
  "Main Course",
  "Drinks",
  "Dessert",
  "Combo Meal",
  "Snack",
  "Limited Offer",
] as const;

const defaultDescription =
  "Describe the dish and why it's a great reward for loyal customers.";

const AddNewReward = () => {
  const { user } = useAuth();
  const [rewardName, setRewardName] = useState("");
  const [description, setDescription] = useState("");
  const [pointsRequired, setPointsRequired] = useState(500);
  const [category, setCategory] =
    useState<(typeof rewardCategories)[number]>("Main Course");
  const [status, setStatus] = useState<"Published" | "Draft">("Published");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const imageLabel = useMemo(
    () => (imagePreview ? "Uploaded reward image" : "No image uploaded yet"),
    [imagePreview],
  );

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const nextPreview = URL.createObjectURL(file);
    setSelectedImage(file);
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextPreview;
    });
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = rewardName.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError("Reward name is required.");
      return;
    }

    if (!trimmedDescription) {
      setError("Reward description is required.");
      return;
    }

    if (!selectedImage) {
      setError("Reward image is required.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const rewardRef = doc(collection(db, "rewards"));
      const imagePath = `rewards/${rewardRef.id}/${selectedImage.name}`;
      const imageRef = ref(storage, imagePath);

      await uploadBytes(imageRef, selectedImage);
      const imageUrl = await getDownloadURL(imageRef);

      await setDoc(rewardRef, {
        id: rewardRef.id,
        name: trimmedName,
        description: trimmedDescription,
        pointsRequired: Number(pointsRequired),
        category,
        status,
        imageUrl,
        imagePath,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user?.uid ?? null,
        createdByEmail: user?.email ?? null,
      });

      setSuccess("Reward saved to Firebase successfully.");
      toast.success("Reward created successfully.");
      setRewardName("");
      setDescription("");
      setPointsRequired(500);
      setCategory("Main Course");
      setStatus("Published");
      setSelectedImage(null);
      setImagePreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    } catch (saveError) {
      console.error("Error saving reward:", saveError);
      setError("Unable to save reward. Please try again.");
      toast.error("Failed to create reward.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="py-4 sm:py-6 px-3 sm:px-0 max-w-7xl mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-5 sm:mb-6">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Sparkles size={14} /> Reward Builder
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900">
            Add New Reward
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-500 max-w-2xl">
            Create a new incentive for your loyal customers and preview exactly
            how it will look in the app.
          </p>
        </div>

        <Link
          to={PATHS.ADMIN_DASHBOARD}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm"
        >
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Reward Details
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Fill in the reward information, image, and availability.
            </p>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Reward Name
              </span>
              <input
                value={rewardName}
                onChange={(event) => setRewardName(event.target.value)}
                placeholder="e.g., Premium Matcha Latte"
                className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Description
              </span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={defaultDescription}
                rows={5}
                className="w-full resize-none rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Points Required
              </span>
              <div className="relative">
                <BadgePercent
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={pointsRequired}
                  onChange={(event) =>
                    setPointsRequired(Number(event.target.value))
                  }
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Category
              </span>
              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value as (typeof rewardCategories)[number],
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              >
                {rewardCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Reward Status
              </span>
              <div className="grid grid-cols-2 gap-2 rounded-xl border border-gray-200 bg-slate-50 p-2">
                <button
                  type="button"
                  onClick={() => setStatus("Published")}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${status === "Published" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:bg-white"}`}
                >
                  Published
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("Draft")}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${status === "Draft" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-white"}`}
                >
                  Draft
                </button>
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Reward Image
              </span>
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center transition hover:border-emerald-300 hover:bg-emerald-50/40">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="reward-image"
                />
                <label
                  htmlFor="reward-image"
                  className="flex cursor-pointer flex-col items-center gap-2"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <ImagePlus size={22} />
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-slate-500">
                    SVG, PNG, JPG or GIF
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {imageLabel}
                  </span>
                </label>
              </div>
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end pt-2">
            <Link
              to={PATHS.ADMIN_DASHBOARD}
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Gift size={16} /> {isSaving ? "Saving..." : "Create Reward"}
            </button>
          </div>
        </form>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Live Preview
              </h3>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase text-slate-600">
                {category}
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="relative h-56 bg-linear-to-br from-slate-200 to-slate-100">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Reward preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <ImagePlus size={28} />
                      <span className="text-sm font-medium">Image preview</span>
                    </div>
                  </div>
                )}

                <div className="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-700 shadow-sm">
                  {status}
                </div>

                <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-md">
                  <Star size={12} fill="currentColor" /> {pointsRequired} pts
                </div>
              </div>

              <div className="p-4">
                <h4 className="text-lg font-bold text-slate-900 truncate">
                  {rewardName || "Untitled Reward"}
                </h4>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {description || defaultDescription}
                </p>

                <button
                  type="button"
                  className="mt-4 w-full rounded-xl border border-emerald-600 px-4 py-3 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
                >
                  Redeem Now
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-slate-600 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Gift size={16} />
              </span>
              <p className="leading-6">
                This is how customers will see the reward in their mobile app
                and the Redeem Rewards section.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AddNewReward;
