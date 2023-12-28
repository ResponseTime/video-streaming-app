import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json())

app.post("/process-video", (req, res) => {
    const filePath = req.body.filePath;
    const outFile = req.body.outFile;

    if (!filePath || !outFile) {
        res.status(400).json({ message: "Invalid file" });
    }
    ffmpeg(filePath)
        .outputOption("-vf", "scale=-1:360")
        .on("end", (err) => {
            res.status(200).json({
                message: "Video finished"
            });
        })
        .on("error", (err) => {
            console.log(err.message);
            res.status(500).json({ message: err.message });
        })
        .save(outFile);
});

app.listen(port, () => {
    console.log("listening on port 3000");
});
