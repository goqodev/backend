declare class TranslationDto {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
}
declare class TranslationsDto {
    ro: TranslationDto;
    en: TranslationDto;
    ru: TranslationDto;
}
declare class SectionTranslationDto {
    title: string;
    content: string;
    list?: string[];
    items?: {
        subtitle: string;
        text: string;
    }[];
}
declare class SectionTranslationsDto {
    ro: SectionTranslationDto;
    en: SectionTranslationDto;
    ru: SectionTranslationDto;
}
declare class SectionDto {
    key: string;
    type: 'text' | 'list' | 'items';
    sortOrder?: number;
    translations: SectionTranslationsDto;
}
export declare class CreatePostDto {
    slug: string;
    category: string;
    readTime: number;
    image: string;
    date: string;
    author: string;
    isPublished?: boolean;
    translations: TranslationsDto;
    sections: SectionDto[];
}
export {};
