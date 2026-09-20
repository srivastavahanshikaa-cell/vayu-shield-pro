import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { profile, aqi, category, dominantPollutant, cityName } = body;

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      source: "fallback",
      tip:
        "AI tips are optional in VayuShield. Add a GEMINI_API_KEY to your .env.local " +
        "to unlock live Gemini-generated advice personalised for the " +
        profile +
        " profile in " +
        cityName +
        ".",
    });
  }

  try {
    const prompt =
      "You are a concise public-health assistant. City: " +
      cityName +
      ". AQI: " +
      aqi +
      " (" +
      category +
      "). Dominant pollutant: " +
      dominantPollutant +
      ". Health profile: " +
      profile +
      ". In under 60 words, give one practical, specific, non-alarmist health tip for this person today.";

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Gemini API responded with " + res.status);
    }

    const data = await res.json();
    const tip =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "Unable to parse Gemini response — showing standard guidance instead.";

    return NextResponse.json({ source: "gemini", tip });
  } catch (err) {
    return NextResponse.json({
      source: "fallback",
      tip: "Gemini AI is temporarily unavailable. Please rely on the standard triage recommendations above.",
    });
  }
}
