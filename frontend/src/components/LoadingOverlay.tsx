import { useGlobalState } from '../contexts/GlobalStateContext';

export function LoadingOverlay() {
  const { state } = useGlobalState();

  if (!state.isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    </div>
  );
} 