export interface Prize {
  id: string;
  text: string;
  color: string;
  probability?: number;
}

export interface WheelProps {
  prizes: Prize[];
  onSpin?: (winner: Prize) => void;
  isSpinning?: boolean;
}
