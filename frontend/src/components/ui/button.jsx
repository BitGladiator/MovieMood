export function Button({ children, ...props }) {
    return (
      <button {...props} className="bg-indigo-600 text-white px-4 py-2 rounded-md">
        {children}
      </button>
    );
  }
  