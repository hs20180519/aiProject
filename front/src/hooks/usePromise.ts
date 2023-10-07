import { useState, useEffect } from "react";

/**대기 중/ 완료/ 실패에 관한 상태 관리 */
export default function usePromise(promiseCreator: any, deps: any) {
  const [loading, setLoading] = useState(false);
  const [resolved, setResolved] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const process = async () => {
      setLoading(true);
      try {
        const resolved = await promiseCreator();
        setResolved(resolved);
      } catch (e) {
        // setError(e);
      }
      setLoading(false);
    };
    process();
  }, deps);

  return [loading, resolved, error];
}
