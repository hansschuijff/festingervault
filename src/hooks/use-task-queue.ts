import PQueue from "p-queue";
import { useCallback, useEffect, useRef } from "react";

const useTaskQueue = () => {
  const queue = useRef(new PQueue({ concurrency: 1 }));

  const addTask = useCallback((task: () => Promise<unknown>) => {
    queue.current.add(task);
  }, []);

  useEffect(() => {
    return () => {
      queue.current.clear();
    };
  }, []);

  return { addTask };
};

export default useTaskQueue;
