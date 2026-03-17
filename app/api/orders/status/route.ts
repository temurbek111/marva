import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Supabase env topilmadi",
        },
        { status: 500 }
      );
    }

    const body = await req.json();

    const {
      orderId,
      order_status,
      delivery_status,
      courier_name,
      courier_phone,
      pickup_point,
      delivery_note,
    } = body ?? {};

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "orderId topilmadi",
        },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, any> = {};

    if (order_status !== undefined) updatePayload.order_status = order_status;
    if (delivery_status !== undefined) updatePayload.delivery_status = delivery_status;
    if (courier_name !== undefined) updatePayload.courier_name = courier_name;
    if (courier_phone !== undefined) updatePayload.courier_phone = courier_phone;
    if (pickup_point !== undefined) updatePayload.pickup_point = pickup_point;
    if (delivery_note !== undefined) updatePayload.delivery_note = delivery_note;

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Update uchun maydon yuborilmadi",
        },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data, error } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      console.error("orders/status route error:", error);

      return NextResponse.json(
        {
          success: false,
          message: error.message || "Status update bo‘lmadi",
          error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: data,
    });
  } catch (error: any) {
    console.error("orders/status route catch:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Server xatosi",
      },
      { status: 500 }
    );
  }
}