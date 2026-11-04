import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, garmentUrl, userImageUrl, garmentName } = body;

    const apiKey = process.env.DECART_API_KEY;

    // 1. CHẾ ĐỘ THẬT: Khi đã có DECART_API_KEY từ https://platform.decart.ai
    if (apiKey) {
      if (action === 'create-live-session') {
        // Tạo WebRTC Ephemeral Token cho phiên thử đồ qua webcam thời gian thực
        const decartRes = await fetch('https://api.decart.ai/v1/realtime/sessions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'lucy-vton-latest',
            garment_url: garmentUrl,
            prompt: `Virtual try-on of ${garmentName || 'clothing'} on person, photorealistic fitting, preserve fabric texture`,
          }),
        });

        if (!decartRes.ok) {
          const errData = await decartRes.json().catch(() => ({}));
          throw new Error(errData.message || 'Decart API không thể khởi tạo phiên WebRTC');
        }

        const data = await decartRes.json();
        return NextResponse.json({
          mode: 'LIVE_DECART_API',
          clientToken: data.client_secret || data.token,
          sessionId: data.id,
          model: 'lucy-vton-latest',
        });
      } else if (action === 'render-photo') {
        // Gọi Batch VTON Job ghép trang phục lên ảnh chụp toàn thân của khách
        const decartJobRes = await fetch('https://api.decart.ai/v1/jobs/lucy-vton-latest', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            garment_image_url: garmentUrl,
            person_image_url: userImageUrl,
          }),
        });

        if (!decartJobRes.ok) {
          const errData = await decartJobRes.json().catch(() => ({}));
          throw new Error(errData.message || 'Decart VTON Job thất bại');
        }

        const jobData = await decartJobRes.json();
        return NextResponse.json({
          mode: 'LIVE_DECART_API',
          jobId: jobData.id,
          resultUrl: jobData.output_url || jobData.result_image_url,
          status: 'COMPLETED',
        });
      }
    }

    // 2. CHẾ ĐỘ MÔ PHỎNG (DEMO / TRIAL): Khi người dùng đang trải nghiệm trên Localhost chưa gắn Key
    if (action === 'create-live-session') {
      return NextResponse.json({
        mode: 'DEMO_SIMULATION',
        sessionId: `demo-session-${Date.now()}`,
        model: 'lucy-vton-latest (Demo Mode)',
        notice: 'Đang chạy chế độ trải nghiệm UI Webcam trực tiếp. Để kết nối mô hình Lucy-VTON của Decart AI thật, vui lòng cấu hình DECART_API_KEY trong file .env.local.',
      });
    }

    if (action === 'render-photo') {
      // Giả lập thời gian render AI 1.8 giây và trả về kết quả ướm thử
      return NextResponse.json({
        mode: 'DEMO_SIMULATION',
        resultUrl: userImageUrl || garmentUrl,
        garmentUrl,
        status: 'COMPLETED',
        notice: 'Ghép đồ mô phỏng thành công! (Điền DECART_API_KEY để kích hoạt AI xử lý vải thực tế)',
      });
    }

    return NextResponse.json({ error: 'Hành động không hợp lệ' }, { status: 400 });
  } catch (error: any) {
    console.error('Lỗi Try-On API:', error);
    return NextResponse.json(
      { error: error?.message || 'Có lỗi xảy ra khi xử lý thử đồ AI.' },
      { status: 500 }
    );
  }
}

