import React, { useEffect, useRef } from 'react';
// Assuming zeu is installed via npm or imported locally
// import { BarMeter, BarMeterOptions } from 'zeu'; 
// For this example file, we assume the types exist.

// Props interface extending the native Zeu options
interface ZeuBarMeterProps extends BarMeterOptions {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ReactBarMeter: React.FC<ZeuBarMeterProps> = ({
  id,
  className,
  style,
  value,
  ...options
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const meterRef = useRef<any>(null); // Replace 'any' with 'BarMeter' type once imported

  useEffect(() => {
    if (canvasRef.current) {
      // Dynamic import or global access
      // const meter = new BarMeter(canvasRef.current.id, options);
      
      // For demonstration, let's pretend we have the class
      // meterRef.current = new BarMeter(canvasRef.current.id, options);
    }

    return () => {
      // Cleanup
      if (meterRef.current) {
        meterRef.current.destroy();
      }
    };
  }, []); // Run once on mount

  // Watch for value changes to update the meter without destroying it
  useEffect(() => {
    if (meterRef.current && value !== undefined) {
      meterRef.current.value = value;
    }
  }, [value]);

  return (
    <canvas
      ref={canvasRef}
      id={id || 'zeu-bar-meter-' + Math.random().toString(36).substr(2, 9)}
      className={className}
      style={style}
      width={options.viewWidth || 100}
      height={options.viewHeight || 200}
    />
  );
};
