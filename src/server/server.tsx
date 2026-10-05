import path from "path";
import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import { renderPage } from "./render";
import { DEFAULT_PATH, MAINTENANCE_MODE, UNDER_CONSTRUCTION_PATH } from "../constants/routing";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.resolve(__dirname, "../../dist/client")));
app.use(express.static(path.resolve(__dirname, "../../public")));

// "/" lands on DEFAULT_PATH (/home, or /under-construction in maintenance mode).
// Mirrored for Netlify in the _redirects file written by prerender.
app.get("/", (_req: Request, res: Response) => {
    res.redirect(302, DEFAULT_PATH);
});

app.get(/.*/, (req: Request, res: Response) => {
    // Maintenance mode: every page except the under-construction one redirects to it
    // (static files were already served above). Mirrored in prerender's _redirects.
    if (MAINTENANCE_MODE && req.path !== UNDER_CONSTRUCTION_PATH) {
        return res.redirect(302, UNDER_CONSTRUCTION_PATH);
    }

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
