import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shipment_id, lat, lon, distance_remaining } = body;

    if (!shipment_id) {
      return NextResponse.json(
        { error: "shipment_id is required" },
        { status: 400 }
      );
    }

    let disruption_probability = 0.15;
    const risk_factors: string[] = [];
    const recommended_actions: string[] = [];

    // If coordinates are provided, fetch real data
    if (lat !== undefined && lon !== undefined) {
      // 1. Fetch OpenWeather Data
      const weatherKey = process.env.OPENWEATHER_API_KEY;
      if (weatherKey) {
        try {
          const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=metric`);
          if (weatherRes.ok) {
            const weatherData = await weatherRes.json();
            const mainWeather = weatherData.weather?.[0]?.main?.toLowerCase() || "";
            const temp = weatherData.main?.temp;
            
            if (mainWeather.includes("rain") || mainWeather.includes("snow") || mainWeather.includes("storm") || mainWeather.includes("extreme")) {
              disruption_probability += 0.35;
              risk_factors.push(`Severe Weather: ${weatherData.weather[0].description}`);
              recommended_actions.push("Re-route to avoid severe weather area");
            } else {
              risk_factors.push(`Weather Normal: ${temp}°C, ${weatherData.weather[0].description}`);
            }
          }
        } catch (err) {
          console.error("OpenWeather API error:", err);
        }
      }

      // 2. Fetch TomTom Traffic Data
      const tomtomKey = process.env.TOMTOM_API_KEY;
      if (tomtomKey) {
        try {
          // absolute/10 means zoom level 10
          const trafficRes = await fetch(`https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${lat},${lon}&key=${tomtomKey}`);
          if (trafficRes.ok) {
            const trafficData = await trafficRes.json();
            const flow = trafficData.flowSegmentData;
            if (flow) {
              const currentSpeed = flow.currentSpeed;
              const freeFlowSpeed = flow.freeFlowSpeed;
              if (currentSpeed < freeFlowSpeed * 0.6) { // Speed is less than 60% of free flow
                disruption_probability += 0.40;
                risk_factors.push(`Heavy Traffic: Speed ${currentSpeed}km/h (Normal: ${freeFlowSpeed}km/h)`);
                recommended_actions.push("Notify customer of potential traffic delay");
              } else {
                risk_factors.push(`Traffic Normal: Speed ${currentSpeed}km/h`);
              }
            }
          }
        } catch (err) {
          console.error("TomTom API error:", err);
        }
      }
    } else {
      // Fallback behavior if no lat/lon
      risk_factors.push("Normal operations (Mock)");
      recommended_actions.push("Continue on current route");
    }

    if (risk_factors.length === 0) {
      risk_factors.push("Normal operations");
      recommended_actions.push("Continue on current route");
    }

    if (distance_remaining && distance_remaining < 50) {
      disruption_probability = Math.max(0.05, disruption_probability - 0.2);
    }

    // Cap disruption probability
    disruption_probability = Math.min(0.99, disruption_probability);

    return NextResponse.json({
      disruption_probability,
      risk_factors,
      recommended_actions,
    });
  } catch (error) {
    console.error("Error predicting disruption:", error);
    return NextResponse.json(
      { error: "Failed to predict disruption" },
      { status: 500 }
    );
  }
}
