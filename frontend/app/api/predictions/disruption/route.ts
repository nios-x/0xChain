import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shipment_id, weather_condition, traffic_level, distance_remaining } = body;

    if (!shipment_id) {
      return NextResponse.json(
        { error: "shipment_id is required" },
        { status: 400 }
      );
    }

    // Mocked Prediction Logic
    let disruption_probability = 0.15;
    let risk_factors = ["Normal operations"];
    let recommended_actions = ["Continue on current route"];

    if (weather_condition === "rain" || traffic_level === "high") {
      disruption_probability = 0.65;
      risk_factors = ["Adverse weather", "Heavy traffic ahead"];
      recommended_actions = ["Consider alternative route", "Notify customer of potential delay"];
    }

    if (distance_remaining && distance_remaining < 50) {
      disruption_probability = Math.max(0.05, disruption_probability - 0.2);
    }

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
