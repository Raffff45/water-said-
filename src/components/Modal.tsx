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

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtn} onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(5, 15, 30, 0.85)",
  backdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
  animation: "fadeIn 0.3s ease",
};

const modal: React.CSSProperties = {
  background: "linear-gradient(145deg, #061a2b, #0b2a44)",
  padding: "30px",
  borderRadius: "18px",
  width: "100%",
  maxWidth: "420px",
  position: "relative",
  boxShadow: "0 20px 80px rgba(0, 200, 255, 0.15)",
  border: "1px solid rgba(0, 200, 255, 0.2)",
  color: "#fff",
  animation: "scaleIn 0.3s ease",
};

const closeBtn: React.CSSProperties = {
  position: "absolute",
  top: "12px",
  right: "14px",
  border: "none",
  background: "transparent",
  color: "#aaa",
  fontSize: "20px",
  cursor: "pointer",
};