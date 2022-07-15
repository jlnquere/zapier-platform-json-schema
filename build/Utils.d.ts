export default class Utils {
    static getZapierReference(key: string): string;
    static getDotNotationnReference(key: string): string;
    static getNestedObject(obj: {
        [x: string]: any;
    }): {};
    static flatten<G>(arr: any[]): G[];
    private static set;
}
