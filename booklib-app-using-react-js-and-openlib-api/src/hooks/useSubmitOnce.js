import { useRef, useCallback } from 'react';

const useSubmitOnce = () => {
  const isSubmittingRef = useRef(false);
  const lastSubmitTimeRef = useRef(0);
  const lastSubmitDataRef = useRef(null);
  const submissionIdRef = useRef(0);

  const submitOnce = useCallback(async (submitFunction, submitData = null) => {
    const now = Date.now();
    const currentSubmissionId = ++submissionIdRef.current;
    
    console.log(`[SubmitOnce] Submission ${currentSubmissionId} requested`);
    
    // Check if already submitting
    if (isSubmittingRef.current) {
      console.log(`[SubmitOnce] Submission ${currentSubmissionId} blocked - already in progress`);
      return;
    }
    
    // Check if too soon since last submit (reduced to 1 second)
    if (now - lastSubmitTimeRef.current < 1000) {
      console.log(`[SubmitOnce] Submission ${currentSubmissionId} blocked - too soon since last submit (${now - lastSubmitTimeRef.current}ms ago)`);
      return;
    }
    
    // Check if same data was submitted recently (excluding timestamp)
    if (submitData && lastSubmitDataRef.current) {
      const currentDataWithoutTimestamp = { ...submitData };
      delete currentDataWithoutTimestamp.timestamp;
      
      const lastDataWithoutTimestamp = { ...lastSubmitDataRef.current };
      delete lastDataWithoutTimestamp.timestamp;
      
      if (JSON.stringify(currentDataWithoutTimestamp) === JSON.stringify(lastDataWithoutTimestamp) &&
          now - lastSubmitTimeRef.current < 3000) {
        console.log(`[SubmitOnce] Submission ${currentSubmissionId} blocked - duplicate data detected`);
        return;
      }
    }

    try {
      isSubmittingRef.current = true;
      lastSubmitTimeRef.current = now;
      lastSubmitDataRef.current = submitData;
      
      console.log(`[SubmitOnce] Executing submission ${currentSubmissionId}...`);
      await submitFunction();
      console.log(`[SubmitOnce] Submission ${currentSubmissionId} completed successfully`);
    } catch (error) {
      console.error(`[SubmitOnce] Submission ${currentSubmissionId} failed:`, error);
      throw error;
    } finally {
      // Add a delay before allowing next submission
      setTimeout(() => {
        isSubmittingRef.current = false;
        console.log(`[SubmitOnce] Submission lock released for ${currentSubmissionId}`);
      }, 1500);
    }
  }, []);

  const isSubmitting = () => isSubmittingRef.current;

  return { submitOnce, isSubmitting };
};

export default useSubmitOnce; 