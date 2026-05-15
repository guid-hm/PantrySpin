import { useAppStore } from "@/store/useAppStore";
import { Icon } from "./Icon";

export function Toast() {
  const toastMsg = useAppStore((s) => s.toastMsg);
  if (!toastMsg) return null;

  return (
    <div className="toast">
      <Icon n="check-circle-2" className="basil" style={{ width: 16, height: 16 }} />
      {toastMsg}
    </div>
  );
}
