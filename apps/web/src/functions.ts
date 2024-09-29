export const verifyMessage = (address: string, methodStr: string) => {
    return `You [${address}] are going to sign this message for method [${methodStr}]`
}