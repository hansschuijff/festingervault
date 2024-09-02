import PQueue from "p-queue";
import { useCallback, useEffect, useRef } from "react";

export default function useTaskQueue(concurrency:number=2) {
	const queue = useRef(new PQueue({ concurrency}));

	const addTask = useCallback((task: () => Promise<unknown>) => {
		queue.current.add(task);
	}, []);

	useEffect(() => {
		return () => {
			queue.current.clear();
		};
	}, []);

	return { addTask };
}
