
export type StoreSize = 'small' | 'medium' | 'big';

export interface NameStore {
    name: string;
    size: StoreSize;
    data: number[];
}
