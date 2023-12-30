import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const storage = new Storage();
const rawvideoBucket = "rs-raw-vid"
const processedvideoBucket = "rs-processed-vid"

const localRaw = "./raw-videos"
const localProcessed = "./processed-videos"

export function setupDir() {
    ensureDirectoryExist(localRaw)
    ensureDirectoryExist(localProcessed)
}

export function convert(rawvideo: string, processedvideo: string) {
    return new Promise<void>((resolve, reject) => {
        ffmpeg(`${localRaw}/${rawvideo}`)
            .outputOption("-vf", "scale=-1:360")
            .on("end", (err) => {
                resolve();
            })
            .on("error", (err) => {
                console.log(err.message);
                reject();
            })
            .save(`${localProcessed}/${processedvideo}`);
    })
}

export async function downloadRaw(file: string) {
    await storage.bucket(rawvideoBucket).file(file).download({ destination: `${localRaw}/${file}` })
    console.log(`gs://${rawvideoBucket}/${file} downloaded to ${localRaw}/${file}`);
}
export async function uploadProcessed(file: string) {
    const bucket = storage.bucket(processedvideoBucket)
    await bucket.upload(`${localProcessed}/${file}`, { destination: file })
    await bucket.file(file).makePublic();
    console.log(`gs://${localProcessed}/${file} uploaded to ${processedvideoBucket}/${file}`);
}

function deleteFile(file: string) {
    return new Promise<void>((resolve, reject) => {
        if (fs.existsSync(file)) {
            fs.unlink(file, (err) => {
                if (err) {
                    console.error(`Failed to delete file: ${file}`, err)
                    reject(err)
                }
                else {
                    console.log(`File Deleted ${file}`)
                    resolve()
                }
            })
        }
        else {
            console.log(`File not found at ${file}, skipping the delete`)
            reject()
        }
    })
}

export function deleteRawVideo(file: string) {
    return deleteFile(file)
}

export function deleteProcessedVideo(file: string) {
    return deleteFile(file)
}

function ensureDirectoryExist(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
        console.log(`Directory ${dirPath} Created`)
    }
}