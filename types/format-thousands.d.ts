declare module 'format-thousands' {
    interface FormatThousands {
        (value: number | bigint | undefined, separator: string): string;
    }

    declare const formatThousands: FormatThousands;
    export = formatThousands;
}
