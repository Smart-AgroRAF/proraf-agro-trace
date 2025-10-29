import { createContext, useContext, useState, type ReactNode } from "react";

type ToastMessage = {
    id: number;
    message: string;
    type: "success" | "error" | "info";
    txHash?: string;
    description?: string;
};

interface ToastContextType {
    addToast: (message: string, options: {
        type: ToastMessage['type'],
        txHash?: string,
        description?: string
    }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = (message: string, options: { type: ToastMessage['type'], txHash?: string, description?: string }) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, ...options }]);
        setTimeout(() => {
            removeToast(id);
        }, 6000); // Auto-dismiss after 6 seconds
    };

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm space-y-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`p-4 rounded-lg shadow-lg text-white text-sm ${toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}>
                        <p className="font-bold">{toast.message}</p>
                        {toast.description && (
                            <p className="mt-1">{toast.description}</p>
                        )}
                        {toast.txHash && (
                            <p className="mt-1 font-mono break-all text-xs">
                                Hash: {toast.txHash}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within a ToastProvider");
    return context;
};
