import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function Card({ children, className = "", onClick }: CardProps) {
    return (
    <div
        onClick={onClick}
        className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${
        onClick ? "cursor-pointer transition hover:shadow-md" : ""
        } ${className}`}
    >
        {children}
    </div>
    );
}