// FloatingCard.tsx
import "../App.css";

interface Item {
  title: string;
  description?: string;
  type?: string;
  // ... other fields
}

interface ItemProps {
  item: Item;
  onClick?: () => void;
}

export default function FloatingCard({ item, onClick }: ItemProps) {
  if (!item) return null;

  return (
    <div className="marker-container" onClick={onClick} >
      <div className="modern-floating-card">
        <div className="card-glass-header">
           <div className="text-content">
              {/* 2. Optional Chaining: use item?.title just to be safe */}
              <div className="card-title">{item?.title || "Untitled Project"}</div>
              {item.description && <div className="card-subtitle">{item.description}</div>}
           </div>
        </div>
      </div>
      {/* This is the vertical line connecting card to globe */}
      <div className="marker-line"></div>
    </div>
  );
}