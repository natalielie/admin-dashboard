import { ContentDocument } from '../schema/content.schema';

export interface ContentWithFile {
  content: ContentDocument;
  contentFile: string;
}
