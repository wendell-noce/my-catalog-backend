import { BadRequestException, Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_KEY || '',
    );
  }

  async upload(file: Express.Multer.File, bucket: string, path: string) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file.buffer, {
        upsert: true,
        contentType: file.mimetype,
      });

    if (error) throw new BadRequestException(error.message);

    const { publicUrl } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(data.path).data;

    return publicUrl;
  }
}
