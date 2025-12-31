export async function sendEmailNotification(
  email: string,
  subject: string,
  content: string
) {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, subject, content }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Gagal kirim email");
    return data;
  } catch (error) {
    console.error("Email Utility Error:", error);
    throw error;
  }
}

interface OrderItem {
  id?: string | number;
  name: string;
  price: number;
  quantity: number;
}

export async function sendOrderSuccessEmail(
  email: string,
  orderData: { id: string; total: number; items: OrderItem[] }
) {
  const itemsHtml = orderData.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 8px; border-bottom: 1px solid #f0f0f0; font-size: 14px;"><strong>${
        item.name
      }</strong></td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #f0f0f0; text-align: center; font-size: 14px;">${
        item.quantity
      } x</td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #f0f0f0; text-align: right; font-size: 14px; font-weight: 600;">Rp ${item.price.toLocaleString()}</td>
    </tr>
  `
    )
    .join("");

  const content = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #006241; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 20px;">Notifikasi Pesanan Berhasil!</h1>
        <p style="margin: 5px 0 0; opacity: 0.8; font-size: 14px;">ID Transaksi: #${orderData.id
          .substring(0, 8)
          .toUpperCase()}</p>
      </div>
      
      <div style="padding: 24px;">
        <p style="margin-top: 0;">Halo,</p>
        <p>Transaksi Anda telah berhasil dibuat. Berikut adalah rincian <strong>daftar item yang Anda pesan</strong>:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
          <thead>
            <tr style="border-bottom: 2px solid #006241;">
              <th style="padding: 8px; text-align: left; font-size: 12px; color: #006241; text-transform: uppercase;">Daftar Item</th>
              <th style="padding: 8px; text-align: center; font-size: 12px; color: #006241; text-transform: uppercase;">Jumlah</th>
              <th style="padding: 8px; text-align: right; font-size: 12px; color: #006241; text-transform: uppercase;">Harga</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 20px 8px 8px; font-weight: bold; font-size: 16px;">Total Pembayaran</td>
              <td style="padding: 20px 8px 8px; font-weight: bold; text-align: right; color: #006241; font-size: 20px;">Rp ${orderData.total.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; font-size: 13px; color: #666; line-height: 1.5;">
          <strong>Catatan:</strong><br>
          Silakan tunjukkan notifikasi ini kepada staf kami di kasir untuk pengambilan pesanan Anda (jika Pick Up) atau tunggu kurir kami mengantarkannya ke lokasi Anda.
        </div>
      </div>
      
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 11px; color: #999;">
        Email ini dikirim otomatis oleh sistem <strong>Fore Coffee Clone</strong>.<br>
        &copy; 2025 dual_posresto. All rights reserved.
      </div>
    </div>
  `;

  return sendEmailNotification(
    email,
    `Notifikasi Pesanan: Rincian Daftar Belanja #${orderData.id
      .substring(0, 8)
      .toUpperCase()}`,
    content
  );
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  const content = `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; text-align: center;">
      <h2 style="color: #006241;">Reset Password Anda 🔑</h2>
      <p>Kami menerima permintaan untuk mereset password akun Anda.</p>
      <div style="margin: 30px 0;">
        <a href="${resetLink}" style="background: #006241; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password Sekarang</a>
      </div>
      <p style="font-size: 12px; color: #999;">Jika Anda tidak merasa melakukan permintaan ini, silakan abaikan email ini.</p>
      <p style="font-size: 12px; color: #999;">Link ini akan kadaluarsa dalam 1 jam.</p>
    </div>
  `;
  return sendEmailNotification(email, "Permintaan Reset Password", content);
}
