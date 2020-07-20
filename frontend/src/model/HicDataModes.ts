export const BinSize = {
    AUTO: 0,
    "2.5M": 2500000,
    "1M": 1000000,
    "500K": 500000,
    "250K": 250000,
    "100K": 100000,
    "50K": 50000,
    "25K": 25000,
    "10K": 10000,
    "5K": 5000,
};

export const SORTED_BIN_SIZES = [2500000, 1000000, 500000, 250000, 100000, 50000, 25000, 10000, 5000];

export enum NormalizationMode {
    NONE = "NONE",
    KR = "KR",
    VC_SQRT = "VC_SQRT",
    VC = "VC",
}
