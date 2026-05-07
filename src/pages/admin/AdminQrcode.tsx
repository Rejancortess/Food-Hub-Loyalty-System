import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../app/config/firebase";
import { PATHS } from "../../app/config/constants";
import { Plus, Gift, ArrowLeft, Check, RefreshCcw, Camera } from "lucide-react";

type WarriorLevel = {
  level: string;
  points: number;
};

type CameraDevice = {
  id: string;
  label: string;
};

type ScannedCustomer = {
  userId: string;
  email: string;
  points: number;
  level: string;
  fullName: string;
  status?: "Active" | "Inactive";
  lastVisit?: string;
};

type EligibleReward = {
  name: string;
  cost: number;
};

const WarriorLevels: WarriorLevel[] = [
  { level: "Bronze", points: 0 },
  { level: "Silver", points: 500 },
  { level: "Gold", points: 1000 },
  { level: "Platinum", points: 2000 },
  { level: "Diamond", points: 5000 },
];

const AdminQrcode = () => {
  const navigate = useNavigate();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scannedData, setScannedData] = useState<ScannedCustomer | null>(null);
  const [scanning, setScanning] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [hasTriedAutoFallback, setHasTriedAutoFallback] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<
    "environment" | "user"
  >("environment");
  const [availableCameras, setAvailableCameras] = useState<CameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [eligibleRewards, setEligibleRewards] = useState<EligibleReward[]>([]);

  const allRewards: EligibleReward[] = [
    { name: "Warrior Burger", cost: 500 },
    { name: "Fruit Punch", cost: 300 },
    { name: "Premium Combo", cost: 750 },
    { name: "Double Loyalty", cost: 1000 },
    { name: "VIP Membership", cost: 1500 },
    { name: "Free Dessert", cost: 400 },
  ];

  const getCurrentLevel = (balance: number) => {
    return (
      [...WarriorLevels].reverse().find((warrior) => balance >= warrior.points)
        ?.level || "Bronze"
    );
  };

  const getPreferredCameraId = () => {
    if (!availableCameras.length) return null;
    if (selectedCameraId) return selectedCameraId;

    const preferred = availableCameras.find((camera) => {
      const label = camera.label.toLowerCase();
      if (cameraFacingMode === "environment") {
        return (
          label.includes("back") ||
          label.includes("rear") ||
          label.includes("environment")
        );
      }
      return (
        label.includes("front") ||
        label.includes("face") ||
        label.includes("user")
      );
    });

    return preferred?.id || availableCameras[0].id;
  };

  useEffect(() => {
    if (!scanning || !hasCameraPermission) return;

    let isDisposed = false;
    let blackPreviewTimer: ReturnType<typeof setTimeout> | undefined;

    const startScanner = async () => {
      try {
        setError(null);

        const cameraId = getPreferredCameraId();
        if (!cameraId) {
          setError("No camera detected. Please check your device camera.");
          return;
        }

        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        await scanner.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.333334,
            disableFlip: false,
          },
          async (decodedText) => {
            if (isDisposed) return;
            try {
              setError(null);

              const data = JSON.parse(decodedText);
              const { userId } = data;

              const userDoc = await getDoc(doc(db, "users", userId));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                const userPoints = userData.points || userData.userBalance || 0;
                const userLevel = getCurrentLevel(userPoints);

                const customer: ScannedCustomer = {
                  userId,
                  email: userData.email || "N/A",
                  points: userPoints,
                  level: userLevel,
                  fullName: userData.fullName || "Unknown",
                  status: "Active",
                };

                setScannedData(customer);
                setScanning(false);

                const eligible = allRewards.filter(
                  (reward) => reward.cost <= customer.points,
                );
                setEligibleRewards(eligible);

                await scanner.stop();
                await scanner.clear();
                scannerRef.current = null;
              } else {
                setError("User not found in database");
              }
            } catch (scanProcessingError) {
              console.error("Error processing QR data:", scanProcessingError);
              setError("Invalid QR code or user not found");
            }
          },
          () => {},
        );

        blackPreviewTimer = setTimeout(() => {
          const videoElement = document.querySelector(
            "#qr-reader video",
          ) as HTMLVideoElement | null;

          const hasFrame =
            !!videoElement &&
            videoElement.videoWidth > 0 &&
            videoElement.videoHeight > 0;

          if (!hasFrame && !isDisposed) {
            if (!hasTriedAutoFallback) {
              setHasTriedAutoFallback(true);
              setError(
                "Camera preview is black. Trying alternate camera automatically...",
              );
              setCameraFacingMode((prev) =>
                prev === "environment" ? "user" : "environment",
              );
              setSelectedCameraId(null);
            } else {
              setError(
                "Camera preview is still black. Select another camera below or press Reset and Allow Camera again.",
              );
            }
          }
        }, 2500);
      } catch (startError) {
        console.error("Failed to start scanner:", startError);
        setError(
          "Unable to start camera. Try switching camera, close other camera apps/tabs, then try again.",
        );
      }
    };

    startScanner();

    return () => {
      isDisposed = true;
      if (blackPreviewTimer) {
        clearTimeout(blackPreviewTimer);
      }

      const scanner = scannerRef.current;
      if (scanner) {
        scanner
          .stop()
          .catch(() => undefined)
          .finally(() => {
            scanner.clear();
            scannerRef.current = null;
          });
      }
    };
  }, [
    scanning,
    hasCameraPermission,
    selectedCameraId,
    cameraFacingMode,
    hasTriedAutoFallback,
  ]);

  const handleRequestCameraPermission = async () => {
    try {
      setIsRequestingPermission(true);
      setError(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Camera is not supported on this browser/device.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: cameraFacingMode } },
      });
      stream.getTracks().forEach((track) => track.stop());

      const camerasRaw = await Html5Qrcode.getCameras();
      const cameras: CameraDevice[] = camerasRaw.map((camera) => ({
        id: camera.id,
        label: camera.label || `Camera ${camera.id}`,
      }));

      setAvailableCameras(cameras);
      setSelectedCameraId(null);
      setHasTriedAutoFallback(false);
      setHasCameraPermission(true);
    } catch (permissionError) {
      console.error("Camera permission denied:", permissionError);
      setHasCameraPermission(false);
      setError(
        "Camera permission denied. Please allow access in browser settings.",
      );
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handleReset = () => {
    setScannedData(null);
    setScanning(true);
    setHasTriedAutoFallback(false);
    setError(null);
    setEligibleRewards([]);
  };

  const handleSwitchCamera = () => {
    setError(null);
    setSelectedCameraId(null);
    setCameraFacingMode((prev) =>
      prev === "environment" ? "user" : "environment",
    );
  };

  const handleAddPoints = () => {
    if (scannedData) {
      navigate(PATHS.ADMIN_ADDPOINTS, {
        state: {
          preselectedCustomer: {
            id: scannedData.userId,
            uid: scannedData.userId,
            fullName: scannedData.fullName,
            email: scannedData.email,
            points: scannedData.points,
            tier: scannedData.level,
          },
        },
      });
    }
  };

  const getWorriorTitle = (level: string) => {
    const titles: Record<string, string> = {
      Bronze: "The Flavor Novice",
      Silver: "The Taste Explorer",
      Gold: "The Culinary Master",
      Platinum: "The Flavor Defender",
      Diamond: "The Food Legend",
    };
    return titles[level] || "Warrior Member";
  };

  return (
    <div className="py-3 sm:py-6 px-3 sm:px-0 grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
      <div className="lg:col-span-2">
        <div className="mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-green-700">
            Scan Customer QR Code
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Point the camera at the member's digital card to fetch their warrior
            profile.
          </p>
          <div className="mt-2 h-0.5 w-12 sm:w-16 rounded bg-green-200" />
        </div>

        {scanning && (
          <div className="rounded-xl sm:rounded-2xl bg-black overflow-hidden shadow-lg border-2 sm:border-4 border-green-500">
            {hasCameraPermission ? (
              <div
                id="qr-reader"
                className="w-full"
                style={{ minHeight: "250px", aspectRatio: "4/3" }}
              />
            ) : (
              <div className="w-full min-h-64 sm:min-h-96 flex items-center justify-center px-4 sm:px-6 text-center text-white">
                <div className="max-w-md">
                  <div className="mx-auto mb-4 w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                    <Camera
                      size={18}
                      className="text-green-400 sm:w-5.5 sm:h-5.5"
                    />
                  </div>
                  <p className="text-sm sm:text-base font-semibold">
                    Camera Permission Needed
                  </p>
                  <p className="mt-2 text-xs sm:text-sm text-slate-300">
                    Allow camera access to start scanning customer QR codes.
                  </p>
                  <button
                    onClick={handleRequestCameraPermission}
                    disabled={isRequestingPermission}
                    className="mt-4 w-full sm:w-auto px-6 py-3 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {isRequestingPermission ? "Requesting..." : "Allow Camera"}
                  </button>
                </div>
              </div>
            )}
            <div className="bg-black px-3 sm:px-6 py-2 sm:py-4 flex items-center justify-center gap-2 sm:gap-4 text-white border-t border-green-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm font-medium">
                LIVE CAMERA FEED
              </span>
            </div>
          </div>
        )}

        {!scanning && scannedData && (
          <div className="rounded-xl sm:rounded-2xl bg-black overflow-hidden shadow-lg border-2 sm:border-4 border-green-500 p-4 sm:p-6 text-center">
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Check size={24} className="text-black sm:w-8 sm:h-8" />
            </div>
            <p className="text-green-500 font-semibold mb-2 text-sm sm:text-base">
              QR Code Scanned Successfully
            </p>
            <p className="text-slate-300 text-sm">
              Click "Scan Another" to scan a different customer
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 sm:px-6 py-3 sm:py-4 text-red-700 text-xs sm:text-sm">
            {error}
          </div>
        )}

        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-wrap gap-2 sm:gap-3 justify-center">
          {scanning && hasCameraPermission && (
            <>
              <button
                onClick={handleSwitchCamera}
                className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium text-sm sm:text-sm inline-flex items-center justify-center sm:justify-start gap-2"
              >
                <RefreshCcw size={16} className="sm:w-3.5 sm:h-3.5" />
                <span className="text-xs sm:text-sm">
                  {cameraFacingMode === "environment"
                    ? "Switch to Front Cam"
                    : "Switch to Back Cam"}
                </span>
              </button>
              {availableCameras.length > 1 && (
                <select
                  value={selectedCameraId ?? ""}
                  onChange={(event) =>
                    setSelectedCameraId(event.target.value || null)
                  }
                  className="w-full sm:w-auto px-4 py-3 sm:px-3 sm:py-2 rounded-lg border border-gray-300 text-sm bg-white"
                >
                  <option value="">Auto Select Camera</option>
                  {availableCameras.map((camera) => (
                    <option key={camera.id} value={camera.id}>
                      {camera.label}
                    </option>
                  ))}
                </select>
              )}
            </>
          )}
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
          >
            {scannedData ? "Scan Another" : "Reset"}
          </button>
        </div>

        <div className="mt-4 sm:mt-6 bg-emerald-50 rounded-lg px-3 sm:px-4 py-3 border border-emerald-200 text-xs sm:text-sm text-slate-600">
          <p className="font-medium mb-2 text-xs sm:text-sm">💡 Tip:</p>
          <p>
            Ensure the QR code is centered and clearly visible. In low-light
            environments, use the flash toggle in the viewfinder controls.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            If preview is black, choose a different camera from the dropdown or
            close other apps using the camera.
          </p>
        </div>
      </div>

      {scannedData && (
        <div className="lg:col-span-1">
          <div className="rounded-xl sm:rounded-2xl bg-white shadow-lg ring-1 ring-gray-100 overflow-hidden sticky top-0 sm:top-6 z-10 lg:z-auto">
            <div className="bg-emerald-50 px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h3 className="font-semibold text-slate-700 text-sm sm:text-base">
                  Scanned Customer Info
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 whitespace-nowrap">
                  ACTIVE MEMBER
                </span>
              </div>
            </div>

            <div className="px-3 sm:px-6 py-4 sm:py-6 text-center">
              <div className="mx-auto mb-3 sm:mb-4 w-16 sm:w-20 h-16 sm:h-20 bg-linear-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
                {scannedData.fullName.charAt(0)}
              </div>

              <h4 className="text-base sm:text-lg font-bold text-gray-800 truncate">
                {scannedData.fullName}
              </h4>
              <p className="text-xs text-slate-500 mb-3 sm:mb-4 truncate px-1">
                "{getWorriorTitle(scannedData.level)}"
              </p>

              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 sm:mb-6 bg-amber-100 text-amber-700">
                {scannedData.level.toUpperCase()}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-4 py-3 sm:py-4 border-y border-gray-100">
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-1">
                    TOTAL POINTS
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">
                    {scannedData.points.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 text-left">
                <p className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2">
                  <Gift size={14} className="sm:w-4 sm:h-4" /> ELIGIBLE REWARDS
                </p>
                <div className="space-y-2 max-h-48 sm:max-h-40 overflow-y-auto">
                  {eligibleRewards.length > 0 ? (
                    <>
                      {eligibleRewards.slice(0, 2).map((reward) => (
                        <div
                          key={reward.name}
                          className="flex items-center justify-between text-xs sm:text-sm bg-gray-50 px-2 sm:px-3 py-2 rounded"
                        >
                          <span className="text-gray-700 truncate">
                            {reward.name}
                          </span>
                          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ml-2">
                            {reward.cost} pts
                          </span>
                        </div>
                      ))}
                      {eligibleRewards.length > 2 && (
                        <button className="text-xs text-slate-500 hover:text-slate-700 w-full py-2 font-medium">
                          View all {eligibleRewards.length} rewards
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-4">
                      No rewards available. Continue earning points!
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 mt-4 sm:mt-6">
                <button
                  onClick={handleAddPoints}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 sm:py-3 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
                >
                  <Plus size={16} className="sm:w-4.5 sm:h-4.5" />{" "}
                  <span>Add Points</span>
                </button>
                <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 sm:py-3 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base">
                  <Gift size={16} className="sm:w-4.5 sm:h-4.5" />{" "}
                  <span>Redeem Reward</span>
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100 px-3 sm:px-6 py-2 sm:py-3 bg-gray-50">
              <button
                onClick={handleReset}
                className="w-full text-center text-slate-600 hover:text-slate-900 text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
              >
                <ArrowLeft size={14} className="sm:w-4 sm:h-4" />{" "}
                <span>Back to Scan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQrcode;
