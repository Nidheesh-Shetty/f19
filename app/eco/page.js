"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function EcoPage() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState(null); // {name, latitude, longitude}
    const [data, setData] = useState(null); // {temperature, humidity, uv, time}

    // Geocode a place name using Open-Meteo's geocoding API
    async function geocode(place) {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            place
        )}&count=1`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Geocoding failed");
        const json = await res.json();
        if (!json.results || json.results.length === 0) throw new Error("Location not found");
        const r = json.results[0];
        return { name: r.name + (r.country ? ", " + r.country : ""), latitude: r.latitude, longitude: r.longitude };
    }

    // Fetch weather/uv/humidity from Open-Meteo
    async function fetchWeather(lat, lon) {
        // request current weather + hourly humidity and uv_index so we can pick the matching hour
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m,uv_index,temperature_2m&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Weather fetch failed");
        const json = await res.json();

        const current = json.current_weather || null;
        const hourly = json.hourly || null;

        let temperature = current?.temperature ?? null;
        let time = current?.time ?? null;
        let humidity = null;
        let uv = null;

        if (hourly && time) {
            const idx = hourly.time.indexOf(time);
            if (idx !== -1) {
                humidity = hourly.relativehumidity_2m[idx];
                uv = hourly.uv_index[idx];
                // If temperature wasn't available in current_weather, try hourly
                if (temperature == null && hourly.temperature_2m) temperature = hourly.temperature_2m[idx];
            } else {
                // fallback: take the nearest hour (last entry)
                const last = hourly.time.length - 1;
                humidity = hourly.relativehumidity_2m[last];
                uv = hourly.uv_index[last];
            }
        }

        return { temperature, humidity, uv, time };
    }

    async function searchPlace(place) {
        setLoading(true);
        setError(null);
        setData(null);
        try {
            const loc = await geocode(place);
            setLocation(loc);
            const w = await fetchWeather(loc.latitude, loc.longitude);
            setData(w);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function useMyLocation() {
        setLoading(true);
        setError(null);
        setData(null);
        if (!navigator.geolocation) {
            setError("Geolocation not supported by your browser");
            setLoading(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const lat = pos.coords.latitude;
                    const lon = pos.coords.longitude;
                    // Optional reverse geocoding could be done; for now just show coords
                    setLocation({ name: `Lat ${lat.toFixed(3)}, Lon ${lon.toFixed(3)}`, latitude: lat, longitude: lon });
                    const w = await fetchWeather(lat, lon);
                    setData(w);
                } catch (err) {
                    setError(err.message || String(err));
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setError(err.message || "Unable to get location");
                setLoading(false);
            }
        );
    }

    // Optionally, load a default location on mount (example: New York)
    useEffect(() => {
        // no-op by default. Uncomment to auto-load a default city.
        // searchPlace('New York');
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
            <header className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <img src="/images/logo.png" alt="logo" className="w-28 h-auto" />
                        <h1 className="text-2xl font-semibold">Eco Insights — Air & UV</h1>
                    </div>
                    <nav>
                        <ul className="flex items-center gap-4 text-sm">
                            <li>
                                <Link href="/home" className="hover:underline">Home</Link>
                            </li>
                            <li>
                                <Link href="/tracker" className="hover:underline">Tracker</Link>
                            </li>
                            <li>
                                <Link href="/eco" className="font-semibold underline">Eco-Insights</Link>
                            </li>
                            <li>
                                <Link href="/profile" className="hover:underline">Profile</Link>
                            </li>
                            <li>
                                <Link href="/login" className="hover:underline">Login</Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div className="bg-white shadow rounded-lg p-4 mb-6">
                    <div className="flex gap-2">
                        <input
                            className="flex-1 border rounded px-3 py-2"
                            placeholder="Enter city or place (e.g. London)"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") searchPlace(query);
                            }}
                        />
                        <button
                            className="bg-blue-600 text-white px-4 rounded"
                            onClick={() => searchPlace(query)}
                            disabled={!query || loading}
                        >
                            Search
                        </button>
                        <button className="bg-green-600 text-white px-4 rounded" onClick={useMyLocation} disabled={loading}>
                            Use my location
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Data from Open-Meteo (no API key required).</p>
                </div>

                <div className="mb-6">
                    {loading && <div className="text-sm text-gray-600">Loading…</div>}
                    {error && <div className="text-sm text-red-600">Error: {error}</div>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm text-gray-500">Location</div>
                        <div className="text-lg font-medium">{location ? location.name : "—"}</div>
                        {location && <div className="text-xs text-gray-400">Lat: {location.latitude.toFixed(3)}, Lon: {location.longitude.toFixed(3)}</div>}
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm text-gray-500">Temperature</div>
                        <div className="text-2xl font-semibold">{data?.temperature != null ? `${data.temperature} °C` : "—"}</div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm text-gray-500">Humidity</div>
                        <div className="text-2xl font-semibold">{data?.humidity != null ? `${data.humidity} %` : "—"}</div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 md:col-span-2">
                        <div className="text-sm text-gray-500">UV Index</div>
                        <div className="text-3xl font-bold text-amber-600">{data?.uv != null ? data.uv : "—"}</div>
                        <div className="text-xs text-gray-400 mt-2">Time: {data?.time ?? "—"}</div>
                        <div className="text-sm text-gray-500 mt-2">
                            UV index guidance: 0–2 Low, 3–5 Moderate, 6–7 High, 8–10 Very High, 11+ Extreme.
                        </div>
                    </div>

                </div>
            </header>
        </div>
    );
}
