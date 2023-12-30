import express from "express";
import { convert, deleteProcessedVideo, deleteRawVideo, downloadRaw, setupDir, uploadProcessed } from "./storage";

setupDir();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json())

app.post("/process-video", async (req, res) => {
    let data;
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        data = JSON.parse(message)
        if (!data.name) {
            throw new Error(`Invalid message payload received`);
        }
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ err })
    }
    const inputFile = data.name;
    const processedFile = `processed-${inputFile}`;

    await downloadRaw(inputFile);
    try {
        await convert(inputFile, processedFile)
    }
    catch (err) {
        await Promise.all([
            deleteRawVideo(inputFile),
            deleteProcessedVideo(processedFile)
        ])
        return res.status(500).json({ err })
    }
    await uploadProcessed(processedFile);
    await Promise.all([
        deleteRawVideo(inputFile),
        deleteProcessedVideo(processedFile)
    ])
    res.status(200).json({ success: true })
});

app.listen(port, () => {
    console.log("listening on port 3000");
});
