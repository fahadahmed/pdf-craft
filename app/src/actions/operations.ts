import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { PDFDocument } from 'pdf-lib';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { admin } from '../firebase/server';

const auth = getAuth();
const firestore = admin.firestore();
const bucket = admin.storage().bucket();

const mergePdfsSchema = z.object({
  files: z.array(z.instanceof(File)),
});

export const operations = {
  mergePdfs: defineAction({
    accept: 'form',
    input: mergePdfsSchema,
    handler: async (input, context) => {
      const { files } = input;
      const cookieHeader = context.request.headers.get('cookie') || '';
      const sessionCookie = cookieHeader
        .split('; ')
        .find((c) => c.startsWith('__session='))
        ?.split('=')[1];

      try {
        if (!sessionCookie) {
          throw new Error('Unauthorized');
        }

        const decodedToken = await auth.verifySessionCookie(
          sessionCookie,
          true
        );
        const userId = decodedToken.uid;

        const mergedPdf = await PDFDocument.create();
        for (const pdfFile of files) {
          const pdfBytes = await pdfFile.arrayBuffer();
          const pdf = await PDFDocument.load(pdfBytes, {
            ignoreEncryption: true,
          });
          const copiedPages = await mergedPdf.copyPages(
            pdf,
            pdf.getPageIndices()
          );
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedPdfBytes = await mergedPdf.save();
        const mergedFileName = `merged-${Date.now()}.pdf`;
        const storagePath = `users/${userId}/${mergedFileName}`;
        const fileRef = bucket.file(storagePath);

        await fileRef.save(Buffer.from(mergedPdfBytes), {
          metadata: { contentType: 'application/pdf' },
        });

        const [url] = await fileRef.getSignedUrl({
          action: 'read',
          expires: '03-01-2030',
        });

        // await firestore.collection('users').doc(userId).set(
        //   {
        //     mergedPdfUrl: url,
        //     updatedAt: FieldValue.serverTimestamp(),
        //   },
        //   { merge: true }
        // );

        return {
          success: true,
          message: 'Files merged successfully',
          data: { fileUrl: url },
        };
      } catch (error) {
        console.error(error);
        if (error instanceof z.ZodError) {
          return {
            success: false,
            error: 'validation error',
            issues: error.issues,
          };
        }
        return { success: false, error: 'Issue merging files' };
      }
    },
  }),
};
