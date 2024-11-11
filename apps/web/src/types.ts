export enum KeysTypes {
    NONE = 0,
    MANAGEMENT,
    ACTION,
    CLAIM,
    ENCRYPTION
}

export enum ExecuteStatus {
    PROCESSING = 0,
    CANCELED,
    EXECUTED
}

export enum ClaimTopics {
    NONE = 0,
    NAMES,
    KYC,
    AML,
    COMPANY_IDENTITY,
    TRADE_LISENCE,
    LETTER_OF_CREDIT,
    ASSAY_REPORT
}

export enum TokenClaimTopics {
    NONE = 0,
    GOLD_PURITY,
    HOLLOWMARK_ABSENCE,
}