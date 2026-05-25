import { Router } from "express";
import axios from "axios";

const router = Router();
const BASE_URL = "https://api.coingecko.com/api/v3";
const API_KEY = process.env.CG_API_KEY;


router.get("/", async (req, res) => {
    try {
        const { data } = await axios.get(`${BASE_URL}/coins/bitcoin`, {
            headers: {
                "x-cg-demo-api-key": API_KEY,
            }
        });

        res.render("index", { coin: data, error: null });
    } catch (error) {
        res.render("index", { coin: null, error: "Error fetching data" });
    }
});


router.get("/api/coin", async (req, res) => {
    const coinQuery = req.query.name?.toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
    if (!coinQuery) {
        return res.json({ success: false, message: "Por favor, digite o nome de uma moeda válida." });
    }

    try {
        const response = await axios.get(
            `${BASE_URL}/coins/${coinQuery}`,
            {
                headers: { "x-cg-demo-api-key": API_KEY },
            }
        );

        const data = response.data;
        res.json({ success: true, data });
    } catch (error) {
        res.json({ success: false, message: "Coin not found"})
    }
});


router.get("/api/favorites", async (req, res) => {
    const list = req.query.list;
    if (!list) {
        return res.json({ success: true, data: [] });
    }

    try {
        const response = await axios.get(
            `${BASE_URL}/coins/markets?vs_currency=usd&ids=${list}`,
            {
                headers: { "x-cg-demo-api-key": API_KEY }
            }
        );

        res.json({ success: true, data: response.data });
    } catch (err) {
        console.error(err);
        res.json({ success: false, data: [] });
    }
});


export default router;