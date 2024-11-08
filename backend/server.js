import express from 'express'
import cors from 'cors'

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/api/data", (req, res) => {
    res.json({ message: "Hello from the backend!" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
