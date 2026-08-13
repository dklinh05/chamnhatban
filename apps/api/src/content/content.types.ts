export const CONTENT_STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const CONTENT_ITEM_TYPES = ['LESSON', 'VOCABULARY', 'GRAMMAR', 'KANJI', 'KANA'] as const;
export type ContentItemType = (typeof CONTENT_ITEM_TYPES)[number];

export const CONTENT_AUDIT_ACTIONS = ['PUBLISH', 'ARCHIVE'] as const;
export type ContentAuditAction = (typeof CONTENT_AUDIT_ACTIONS)[number];
