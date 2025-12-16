const customerLocks: Record<number, boolean> = {};

export const acquireLock = async (customerId: number): Promise<void> => {
    while (customerLocks[customerId]) {
        await new Promise(r => setTimeout(r, 5));
    }
    customerLocks[customerId] = true;
};

export const releaseLock = (customerId: number): void => {
    customerLocks[customerId] = false;
};
