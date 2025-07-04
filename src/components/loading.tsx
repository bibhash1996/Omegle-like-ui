import './index.css';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="loader">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-lg text-gray-700">Loading...</p>
    </div>
  );
};

export default Loading;
