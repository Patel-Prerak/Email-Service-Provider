import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnalyzedEmailDocument = AnalyzedEmail & Document;

@Schema()
export class AnalyzedEmail {
  @Prop({ required: true })
  subject: string;

  @Prop({ type: [String] })
  receivingChain: string[];

  @Prop()
  esp: string;

  @Prop({ type: Object })
  rawHeaders: Record<string, any>;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const AnalyzedEmailSchema = SchemaFactory.createForClass(AnalyzedEmail);
