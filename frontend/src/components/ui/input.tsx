import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    erro?: string;
}

export default function Input({ label, erro, id, ...resto }: InputProps) {
    return (
    <div className="flex flex-col gap-1">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        </label>
        <input
        id={id}
        className={`rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
            erro ? "border-red-500" : "border-gray-300"
        }`}
        {...resto}
        />
        {erro && <span className="text-sm text-red-600">{erro}</span>}
    </div>
    );
}