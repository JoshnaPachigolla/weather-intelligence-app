import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onRetry, onDismiss }) => {
  return (
    <div
      id="app-error-alert"
      role="alert"
      className="w-full rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 sm:p-5 text-rose-200 backdrop-blur-xl shadow-xl shadow-rose-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 flex-shrink-0 mt-0.5 sm:mt-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-rose-200 tracking-tight">Weather Telemetry Notice</h4>
          <p className="text-xs sm:text-sm text-rose-300/90 mt-0.5 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        {onRetry && (
          <button
            type="button"
            id="btn-error-retry"
            onClick={onRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 hover:text-white text-xs font-semibold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            id="btn-error-dismiss"
            onClick={onDismiss}
            aria-label="Dismiss error notice"
            className="p-1.5 rounded-xl text-rose-400 hover:text-rose-200 hover:bg-rose-500/20 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
