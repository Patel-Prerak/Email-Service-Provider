import { Document } from 'mongoose';
export type AnalyzedEmailDocument = AnalyzedEmail & Document;
export declare class AnalyzedEmail {
    subject: string;
    receivingChain: string[];
    esp: string;
    rawHeaders: Record<string, any>;
    createdAt: Date;
}
export declare const AnalyzedEmailSchema: import("mongoose").Schema<AnalyzedEmail, import("mongoose").Model<AnalyzedEmail, any, any, any, Document<unknown, any, AnalyzedEmail, any, {}> & AnalyzedEmail & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AnalyzedEmail, Document<unknown, {}, import("mongoose").FlatRecord<AnalyzedEmail>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<AnalyzedEmail> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
