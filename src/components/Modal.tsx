import { useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.classList.add("modal-open");

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.classList.remove("modal-open");
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ isolation: "isolate" }}>
      <div className="modal modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}