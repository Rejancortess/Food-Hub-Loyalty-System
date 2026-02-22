const Button = ({ children, className = "", ...props }: any) => {
  return (
    <button
      disabled={props.disabled}
      className={`bg-green-600 text-white font-bold hover:bg-green-700 active:scale-95 transition-transform w-full py-3 rounded-lg mt-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
