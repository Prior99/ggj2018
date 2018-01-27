export interface Controller {
    update?: (dt: number) => void;
    render?: () => void;
}
