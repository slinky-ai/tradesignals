
import { useState, useEffect } from "react";

export const useDeploymentProgress = (
  isDeploying: boolean,
  deploymentSteps: string[],
  onComplete?: () => void
) => {
  const [progress, setProgress] = useState(0);
  const [deploymentStatus, setDeploymentStatus] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isDeploying) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          
          const stepIncrement = Math.floor(Math.random() * 15) + 5;
          const newProgress = Math.min(prevProgress + stepIncrement, 100);
          const currentStep = Math.floor((prevProgress / 100) * deploymentSteps.length);
          setDeploymentStatus(deploymentSteps[currentStep]);
          if (newProgress >= 100) {
            clearInterval(interval);
            if (onComplete) {
              onComplete();
            }
          }
        
          return newProgress;
          // return Math.min(prevProgress + stepIncrement, 100);
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isDeploying, deploymentSteps]);

  return {
    progress,
    deploymentStatus
  };
};
