import type { ReactNode } from "react";
import { Icon } from "./Icon";
import type { LucideProps } from "lucide-react";

interface EmptyStateProps {
  icon: string;
  title: string;
  body: string;
  action?: ReactNode;
  iconStyle?: LucideProps["style"];
}

export function EmptyState({ icon, title, body, action, iconStyle }: EmptyStateProps) {
  return (
    <div className="empty">
      <div className="ico">
        <Icon n={icon} style={{ width: 28, height: 28, ...iconStyle }} />
      </div>
      <div className="ttl">{title}</div>
      <div className="sub">{body}</div>
      {action}
    </div>
  );
}
