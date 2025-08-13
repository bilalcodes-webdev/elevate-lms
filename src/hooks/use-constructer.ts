import { env } from "@/lib/env";

export const ConstructUrl = (key: string) => {
 
  return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storageapi.dev/${key}`;
};
