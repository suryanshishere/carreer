export function getDisplayKey(k: string): string {
    return k.includes(".") || k.includes("_1_") ? k.split(/\.|_1_/).pop() as string : k;
}