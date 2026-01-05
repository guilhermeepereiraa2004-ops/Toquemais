import admin from 'firebase-admin';
// import fs from 'fs-extra'; // Removed to avoid dependency issues

// You must manually put the firebase-key.json in the root folder
// CAUTION: In production (Vercel), we should use Environment Variables for the private key
// But for simplicity to the user, we structure it to check env var or file.

let bucket;

export const initFirebase = () => {
    try {
        if (!admin.apps.length) {
            // Priority: Environment Variable (Vercel)
            if (process.env.FIREBASE_SERVICE_ACCOUNT) {
                try {
                    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount),
                        storageBucket: process.env.FIREBASE_BUCKET_URL
                    });
                    console.log("🔥 Firebase (Env Var) Initialized");
                } catch (e) {
                    console.error("❌ Invalid FIREBASE_SERVICE_ACCOUNT JSON");
                }
            } else {
                console.log("⚠️ Firebase credentials MISSING (Env Var). Uploads will fail.");
            }
        }
        if (admin.apps.length) {
            bucket = admin.storage().bucket();
            console.log("🔥 Firebase Storage Connected!");
        }
    } catch (error) {
        console.error("Erro ao iniciar Firebase:", error.message);
    }
};


export const uploadFileToFirebase = async (fileObject) => {
    if (!bucket) throw new Error("Firebase Storage não inicializado");

    const fileName = `${Date.now()}-${fileObject.originalname}`;
    const file = bucket.file(fileName);

    // Create a stream to write to Firebase
    const stream = file.createWriteStream({
        metadata: {
            contentType: fileObject.mimetype
        }
    });

    return new Promise((resolve, reject) => {
        stream.on('error', (e) => reject(e));
        stream.on('finish', async () => {
            // Make public (optional, but easiest for simple apps)
            await file.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            resolve({
                url: publicUrl,
                fileName: fileName
            });
        });

        // Write the buffer to the stream (assuming we use multer memoryStorage)
        stream.end(fileObject.buffer);
    });
};

export const deleteFileFromFirebase = async (fileUrlOrName) => {
    // Extract filename from URL if necessary
    // URL format: https://storage.googleapis.com/BUCKET/FILENAME
    let fileName = fileUrlOrName;
    if (fileUrlOrName.includes('storage.googleapis.com')) {
        const parts = fileUrlOrName.split('/');
        fileName = parts[parts.length - 1];
    }

    try {
        await bucket.file(fileName).delete();
        console.log(`Arquivo deletado do Firebase: ${fileName}`);
    } catch (error) {
        console.error(`Erro ao deletar do Firebase: ${error.message}`);
    }
};
