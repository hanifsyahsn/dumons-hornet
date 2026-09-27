import path from "path";
import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import { renderPage } from "./render";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.resolve(__dirname, "../../dist/client")));
app.use(express.static(path.resolve(__dirname, "../../public")));

// Same entry point as dumonscoating.com: the landing page lives at /home.
// Mirrored for Netlify in netlify.toml.
app.get("/", (_req: Request, res: Response) => {
    res.redirect(302, "/home");
});

app.get(/.*/, (req: Request, res: Response) => {
    try {
        const { status, redirect, html } = renderPage(req.url);

        if (redirect) {
            return res.redirect(status, redirect);
        }

        res.status(status);
        res.setHeader("Content-Type", "text/html");
        res.send(html);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
