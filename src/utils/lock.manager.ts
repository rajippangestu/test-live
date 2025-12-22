const customerLocks: Record<number, boolean> = {};

export const acquireLock = async (customerId: number): Promise<boolean> => {
    if (customerLocks[customerId]) {
        return false;
    }
    customerLocks[customerId] = true;
    return true;
};

export const releaseLock = (customerId: number): void => {
    delete customerLocks[customerId];
};
