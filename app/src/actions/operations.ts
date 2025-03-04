import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

// write a schema that accepts a number of PDF files
const mergePdfsSchema = z.object({
  files: z.array(z.instanceof(File)),
});
export const operations = {
  mergePdfs: defineAction({
    accept: 'form',
    input: mergePdfsSchema,
    handler: async (input, context) => {
      const { files } = input;
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });
      const cookieHeader = context.request.headers.get('cookie') || '';
      console.log(cookieHeader);
      const functionUrl = import.meta.env.PUBLIC_FB_FUNC_MERGE_PDFS_URL;
      try {
        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            Cookie: cookieHeader,
          },
          body: formData,
        });

        const data = await response.json();
        return {
          success: true,
          data: data,
        };
      } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
          return {
            success: false,
            error: 'validation error',
            issues: error.issues,
          };
        }
        return {
          success: false,
          error: 'Issue merging files',
        };
      }
    },
  }),
};
