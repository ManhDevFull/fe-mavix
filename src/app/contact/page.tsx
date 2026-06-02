"use client";

import { FormEvent, useState } from "react";
import { PublicLayout } from "../../components/public-layout";
import styles from "./contact.module.css";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <PublicLayout>
      <div className={styles.page}>
        <div className={styles.contentGrid}>
          {/* ── LEFT: heading + form ── */}
          <div className={styles.formArea}>
            <div className={styles.formHeading}>
              <h1 className={styles.title}>Chúng tôi luôn<br />sẵn sàng hỗ trợ</h1>
              <p className={styles.subtitle}>
                Phản hồi trong vòng 4 giờ làm việc — không có bot, chỉ là con người thực sự.
              </p>
            </div>

            {sent ? (
              <div className={styles.successBox}>
                <div className={styles.successIcon}>✓</div>
                <h3>Đã nhận tin nhắn!</h3>
                <p>Chúng tôi sẽ phản hồi trong vòng 4 giờ làm việc.</p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.fieldRow}>
                  <label className={styles.field}>
                    <span>Họ và tên</span>
                    <input required placeholder="Nguyễn Văn A" />
                  </label>
                  <label className={styles.field}>
                    <span>Email</span>
                    <input type="email" required placeholder="ban@example.com" />
                  </label>
                </div>
                <label className={styles.field}>
                  <span>Chủ đề</span>
                  <select>
                    <option>Tư vấn triển khai</option>
                    <option>Hỗ trợ kỹ thuật</option>
                    <option>Báo giá doanh nghiệp</option>
                    <option>Phản hồi sản phẩm</option>
                    <option>Khác</option>
                  </select>
                </label>
                <label className={styles.field}>
                  <span>Tin nhắn</span>
                  <textarea required rows={5} placeholder="Mô tả nhu cầu hoặc vấn đề của bạn..." />
                </label>
                <button type="submit" className={styles.submitBtn}>
                  Gửi tin nhắn
                </button>
              </form>
            )}
          </div>

          {/* ── RIGHT: info + FAQ ── */}
          <div className={styles.infoArea}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>Thông tin liên hệ</h3>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Facebook</span>
                  <a className={styles.infoVal} href="https://www.facebook.com/thanh.manh2005" target="_blank" rel="noopener noreferrer">
                    facebook.com/thanh.manh2005
                  </a>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email Hỗ trợ</span>
                  <a className={styles.infoVal} href="mailto:mavix@mavix.com">
                    mavix@mavix.com
                  </a>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email Kỹ thuật</span>
                  <a className={styles.infoVal} href="mailto:ntmanh@ntmanh.io.vn">
                    ntmanh@ntmanh.io.vn
                  </a>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>SĐT / Zalo</span>
                  <a className={styles.infoVal} href="tel:0799021393">0799 021 393</a>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Giờ làm việc</span>
                  <span className={styles.infoVal}>8:00 – 22:00 hàng ngày</span>
                </div>
              </div>
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>Câu hỏi thường gặp</h3>
              {[
                { q: "Mất bao lâu để triển khai?", a: "Thường chỉ cần 15–30 phút để thiết lập và bắt đầu nhận đơn." },
                { q: "Có cần phần cứng đặc biệt không?", a: "Không. Bất kỳ điện thoại, tablet hoặc màn hình nào cũng hoạt động được." },
                { q: "Dữ liệu của tôi có an toàn không?", a: "Có. Dữ liệu được mã hóa và sao lưu tự động hàng ngày." },
              ].map((faq, i) => (
                <div key={i} className={styles.faqItem}>
                  <p className={styles.faqQ}>{faq.q}</p>
                  <p className={styles.faqA}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
