export type BatchResult = {
    success: number;
    failed: number;    
  };

  export default async function batchRequestByIds (ids: readonly string[], requestFunction : (id : string) => Promise<Response>) : Promise<BatchResult> {
    const results = await Promise.allSettled(ids.map (id => requestFunction(id))) ;

    const resultsSummary: BatchResult = {
        success: 0,
        failed: 0        
      };


    results.forEach((res) => {      

      if (res.status === 'fulfilled') {
        const response = res.value;

        // first case : natif fetch  (Response)
        if (typeof Response !== "undefined" && response instanceof Response) {
          if (response.ok) resultsSummary.success++;          
          else resultsSummary.failed++;        
        }
        // Second case:  fetch via proxy JSON { ok, status, error }
        else if (typeof response.status === "string") {
          if (response.status === "ok") {
            resultsSummary.success++;          
          } else {
            resultsSummary.failed++;            
          }
        }
        // unknown case  
        else {
          resultsSummary.failed++;          
        }
      } else {
        // Case Promise rejected
        resultsSummary.failed++;        
      }
    });

    return resultsSummary;


  } 

