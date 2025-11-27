const PixelatedBackground = () => {
    return (
      <div className="fixed inset-0 z-[-1] bg-black">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "8px 8px",
            maskImage: "linear-gradient(to bottom, white, transparent)",
          }}
        />
      </div>
    )
  }
  
  export default PixelatedBackground
  