export function runTasksLimit(tasks: (() => Promise<void>)[], limit = 10) {
    return new Promise<void>((resolve, reject) => {
        const waitingTasks = tasks.concat();
        let stoppingSignal = false;
        async function executor() {
            if (stoppingSignal) {
                return;
            }
            console.log(`剩余任务数量：${waitingTasks.length}`);
            if (waitingTasks.length <= 0) {
                stoppingSignal = true;
                resolve();
            }
            try {
                await waitingTasks.pop()?.();
            } catch (e) {
                reject(e);
            }
            return executor();
        }

        for (let i = 0; i < limit; i++) {
            executor();
        }
    });
}
