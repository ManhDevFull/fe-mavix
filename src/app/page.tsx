"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  QrCode,
  MonitorSmartphone,
  Activity,
  BadgeCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Zap,
  Lock,
  CloudCheck,
  ArrowRight,
} from "lucide-react";
import { PublicLayout } from "../components/public-layout";
import s from "./home.module.css";

gsap.registerPlugin(ScrollTrigger);

const BAR_HEIGHTS = [30, 50, 40, 85, 60, 45, 30, 65, 45, 75];

export default function HomePage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!container.current) return;
      // ── Hero entrance
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-eyebrow", { opacity: 0, y: 20, duration: 0.7 }, 0.1)
        .from(".hero-h1", { opacity: 0, y: 28, duration: 0.9 }, 0.25)
        .from(".hero-desc", { opacity: 0, y: 20, duration: 0.7 }, 0.42)
        .from(".hero-actions", { opacity: 0, y: 16, duration: 0.6 }, 0.55)
        .from(".hero-sidebar", { opacity: 0, x: 24, duration: 0.9, ease: "power2.out" }, 0.3);

      // ── Scroll reveals (single elements)
      gsap.utils.toArray<HTMLElement>(".sr").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
          opacity: 0, y: 36,
          duration: 0.85,
          ease: "power2.out",
        });
      });

      // ── Stagger groups
      gsap.utils.toArray<HTMLElement>(".sr-group").forEach((group) => {
        gsap.from(group.querySelectorAll(".sr-item"), {
          scrollTrigger: { trigger: group, start: "top 86%" },
          opacity: 0, y: 32,
          duration: 0.75,
          stagger: 0.1,
          ease: "power2.out",
          clearProps: "all",
        });
      });

      // ── Stats elastic
      gsap.from(".stat-val", {
        scrollTrigger: { trigger: ".stats-row", start: "top 88%" },
        scale: 0.7, opacity: 0,
        duration: 0.85,
        stagger: 0.2,
        ease: "elastic.out(1, 0.6)",
      });
    },
    { scope: container }
  );

  return (
    <PublicLayout>
      <div ref={container} className={s.page}>
        {/* hero + stats share the first viewport */}
        <div className={s.aboveFold}>
          <section className={s.heroSection}>
            <div className={s.heroCard}>
              {/* Main copy */}
              <div className={s.heroMain}>
                <p className={`hero-eyebrow ${s.heroEyebrow}`}>Next-Gen Restaurant OS</p>
                <h1 className={`hero-h1 ${s.heroH1}`}>
                  Nền tảng QR IoT<br />
                  quản lý nhà hàng<br />
                  hiện đại
                </h1>
                <p className={`hero-desc ${s.heroDesc}`}>
                  Đồng bộ hóa quy trình phục vụ từ mã QR đến thiết bị hiển thị IoT.
                  Giảm sai sót, tăng tốc độ phục vụ và tối ưu hóa doanh thu ngay hôm nay.
                </p>
                <div className={`hero-actions ${s.heroActions}`}>
                  <Link className={s.btnPrimary} href="/register">
                    Bắt đầu miễn phí
                  </Link>
                  <button className={s.btnSecondary}>Xem demo</button>
                </div>
              </div>

              {/* Feature sidebar */}
              <aside className={`hero-sidebar ${s.heroSidebar}`}>
                <div>
                  <h3 className={s.heroSidebarTitle}>Hệ sinh thái</h3>
                  <ul className={s.heroFeatureList}>
                    {[
                      "Menu QR Đa năng (Gọi món & Thanh toán)",
                      "Bảng hiển thị IoT bếp & quầy bar",
                      "Quản lý phiên đăng nhập thực thời",
                      "Báo cáo doanh thu chuyên sâu",
                    ].map((t, i) => (
                      <li key={i} className={s.heroFeatureItem}>
                        <CheckCircle2 size={15} className={s.heroFeatureIcon} />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className={s.heroWatermark}>MAVIX</p>
              </aside>
            </div>
          </section>

          {/* ═══════════════════════════════
            STATS
        ═══════════════════════════════ */}
          <section className={s.statsSection}>
            <div className={`stats-row ${s.statsRow}`}>
              <h2 className={`sr ${s.statsLabel}`}>
                Được thiết kế cho quán cafe, trà sữa và nhà hàng hiện đại
              </h2>
              <div className={s.statsGroup}>
                {[
                  { val: "~15ms", unit: "Độ trễ đồng bộ" },
                  { val: "99.9%", unit: "Thời gian uptime" },
                ].map((st, i) => (
                  <div key={i} className={s.statItem}>
                    <p className={`stat-val ${s.statValue}`}>{st.val}</p>
                    <p className={s.statUnit}>{st.unit}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>{/* end aboveFold */}

        {/* ═══════════════════════════════
            ZIGZAG (Problem / Solution)
        ═══════════════════════════════ */}
        <section className={s.zigzagSection}>
          <div className={s.zigzagInner}>
            {/* Row 1 — Problem */}
            <div className={`sr ${s.zigzagRow}`}>
              <div className={s.zigzagVisual}>
                <AlertCircle size={44} color="#ef4444" />
                <h3>Quản lý thủ công</h3>
                <p>Nhầm lẫn đơn hàng, chậm trễ phục vụ và thiếu sót dữ liệu là vấn đề nhức nhối.</p>
              </div>
              <div className={s.zigzagText}>
                <h2>Xóa bỏ rào cản vận hành</h2>
                <p>
                  Hệ thống cũ khiến khách hàng phải chờ đợi lâu và nhân viên bị quá tải.
                  Mavix tự động hóa việc nhận đơn, giúp giảm 40% thời gian phục vụ tại bàn.
                </p>
              </div>
            </div>

            {/* Row 2 — Solution */}
            <div className={`sr ${s.zigzagRow}`}>
              <div className={s.zigzagText}>
                <h2>Đồng bộ hóa tức thì</h2>
                <p>
                  Khi khách hàng quét mã và đặt món, dữ liệu được truyền thẳng đến màn hình IoT
                  tại bếp. Không còn giấy tờ, không còn sai sót thông tin.
                </p>
              </div>
              <div className={`${s.zigzagVisual} ${s.zigzagVisualDark}`}>
                <RefreshCw size={44} color="#00328a" className={s.spin} />
                <h3>Công nghệ IoT</h3>
                <p>Kết nối mọi thiết bị trong một mạng lưới duy nhất, mượt mà và tin cậy.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════
            FEATURES GRID
        ═══════════════════════════════ */}
        <section className={s.featuresSection}>
          <div className={s.featuresInner}>
            <div className={`sr ${s.sectionHeader}`}>
              <h2 className={s.sectionTitle}>Tính năng cốt lõi</h2>
              <div className={s.sectionAccent} />
            </div>
            <div className={`sr-group ${s.featuresGrid}`}>
              {[
                { icon: <QrCode size={32} />, title: "QR Ordering", desc: "Menu điện tử chuyên nghiệp, tùy chỉnh linh hoạt theo thương hiệu của bạn." },
                { icon: <MonitorSmartphone size={32} />, title: "IoT Management", desc: "Quản lý và theo dõi trạng thái các thiết bị hiển thị trong nhà hàng từ xa." },
                { icon: <Activity size={32} />, title: "Real-time Dashboard", desc: "Theo dõi đơn hàng, doanh thu và hiệu suất nhân viên theo từng giây." },
                { icon: <BadgeCheck size={32} />, title: "Role Management", desc: "Phân quyền chi tiết cho quản lý, kế toán, nhân viên bếp và phục vụ." },
              ].map((f, i) => (
                <div key={i} className={`sr-item ${s.featureCard}`}>
                  <div className={s.featureCardIcon}>{f.icon}</div>
                  <h4 className={s.featureCardTitle}>{f.title}</h4>
                  <p className={s.featureCardDesc}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════
            HOW IT WORKS
        ═══════════════════════════════ */}
        <section className={s.stepsSection}>
          <div className={s.stepsInner}>
            <div className={`sr ${s.sectionHeader}`}>
              <h2 className={s.sectionTitle}>Quy trình triển khai</h2>
              <div className={s.sectionAccent} />
            </div>
            <div className={`sr-group ${s.stepsGrid}`}>
              {[
                { step: "01", title: "Thiết lập cấu hình", desc: "Nhập thực đơn, sơ đồ bàn và thông tin thanh toán chỉ trong 15 phút.", dark: true },
                { step: "02", title: "In mã & Kết nối IoT", desc: "Dán mã QR tại bàn và kết nối bảng hiển thị bếp với hệ thống qua Wi-Fi.", dark: false },
                { step: "03", title: "Vận hành & Tăng trưởng", desc: "Bắt đầu nhận đơn và sử dụng dữ liệu để tối ưu hóa kinh doanh hàng ngày.", dark: true },
              ].map((st, i) => (
                <div key={i} className={`sr-item ${s.stepItem}`}>
                  <div className={`${s.stepNumber} ${st.dark ? s.stepNumberDark : ""}`}>{st.step}</div>
                  <div className={s.stepCard}>
                    <h4>{st.title}</h4>
                    <p>{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════
            DASHBOARD SHOWCASE (dark)
        ═══════════════════════════════ */}
        <section className={s.showcaseSection}>
          <div className={`sr ${s.showcaseInner}`}>
            <div className={s.showcaseHeader}>
              <div>
                <h2 className={s.showcaseTitle}>Quản trị tối giản & Hiệu quả</h2>
                <p className={s.showcaseDesc}>
                  Dashboard thiết kế tập trung vào số liệu thực tế, không gây rối mắt — để bạn ra quyết định nhanh hơn.
                </p>
              </div>
              <div className={s.livePill}>
                <div className={s.livePillLabel}>Live</div>
                <div className={s.livePillSub}>Status</div>
              </div>
            </div>

            <div className={s.dashMockup}>
              <div className={s.dashGrid}>
                {/* Sidebar */}
                <div className={s.dashSidebar}>
                  <div className={s.dashSidebarTop} />
                  {[75, 85, 65, 55].map((w, i) => (
                    <div key={i} className={s.dashSidebarLine} style={{ width: `${w}%` }} />
                  ))}
                </div>
                {/* Main area */}
                <div className={s.dashMain}>
                  <div className={s.dashKpis}>
                    <div className={s.kpiCard}>
                      <span className={s.kpiLabel}>Doanh thu hôm nay</span>
                      <span className={s.kpiValue}>12.500k</span>
                      <div className={s.kpiBar} />
                    </div>
                    <div className={s.kpiCard}>
                      <span className={s.kpiLabel}>Đơn hàng mới</span>
                      <span className={s.kpiValue}>24</span>
                      <span className={s.kpiGrowth}>+15% so hôm qua</span>
                    </div>
                    <div className={s.kpiCard}>
                      <span className={s.kpiLabel}>Bàn đang mở</span>
                      <span className={s.kpiValue}>18/25</span>
                      <div className={s.kpiLiveWrap}>
                        <div className={s.kpiDot} />
                        <span className={s.kpiLiveText}>Live Monitor</span>
                      </div>
                    </div>
                  </div>
                  <div className={s.dashChart}>
                    {BAR_HEIGHTS.map((h, i) => (
                      <div
                        key={i}
                        className={`${s.chartBar} ${i === 3 ? s.chartBarActive : ""}`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════
            PRICING (5 gói)
        ═══════════════════════════════ */}
        <section id="pricing" className={s.pricingSection}>
          <div className={s.pricingInner}>
            <div className={`sr ${s.sectionHeader}`}>
              <h2 className={s.sectionTitle}>Bảng giá linh hoạt</h2>
              <div className={s.sectionAccent} />
              <p className={s.pricingSubtitle}>Nâng cấp bất cứ khi nào bạn sẵn sàng mở rộng quy mô</p>
            </div>
            <div className={`sr-group ${s.pricingGrid}`}>
              {[
                {
                  name: "Free", price: "0đ",
                  feats: ["Tối đa 5 bàn", "Menu QR cơ bản", "1 Tài khoản quản lý"],
                },
                {
                  name: "Plus", price: "199k", sub: "/th",
                  feats: ["Tối đa 15 bàn", "Quản lý menu chi tiết", "2 Tài khoản nhân viên"],
                },
                {
                  name: "Pro", price: "399k", sub: "/th", pop: true,
                  feats: ["Không giới hạn bàn", "Báo cáo chuyên sâu", "Tích hợp IoT Display", "Hỗ trợ 24/7"],
                },
                {
                  name: "Premium", price: "799k", sub: "/th",
                  feats: ["Chuỗi nhà hàng", "Quản lý kho nâng cao", "Không giới hạn tài khoản", "Tính năng CRM"],
                },
                {
                  name: "Edition", price: "Tùy chỉnh",
                  feats: ["Giải pháp đặc thù", "Triển khai tại chỗ", "API riêng biệt", "SLA 99.99%"],
                  cta: "Liên hệ",
                },
              ].map((p, i) => (
                <div key={i} className={`sr-item ${s.pricingCard} ${p.pop ? s.pricingCardPop : ""}`}>
                  {p.pop && <div className={s.popBadge}>Phổ biến nhất</div>}
                  <h3 className={`${s.pricingName} ${p.pop ? s.pricingNamePop : ""}`}>{p.name}</h3>
                  <p className={s.pricingPrice}>
                    {p.price}
                    {p.sub && <span className={s.pricingSub}>{p.sub}</span>}
                  </p>
                  <ul className={s.pricingFeats}>
                    {p.feats.map((f, j) => (
                      <li key={j} className={s.pricingFeat}>
                        <span>•</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`${s.pricingBtn} ${p.pop ? s.pricingBtnDark : ""}`}>
                    {p.cta ?? "Đăng ký"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════
            SECURITY
        ═══════════════════════════════ */}
        <section className={s.securitySection}>
          <div className={`sr-group ${s.securityGrid}`}>
            {[
              {
                icon: <CloudCheck size={32} />,
                title: "Cloud-based Infra",
                desc: "Dữ liệu của bạn được sao lưu thời gian thực trên hệ thống đám mây bảo mật cao, đảm bảo không bao giờ thất thoát thông tin.",
              },
              {
                icon: <Lock size={32} />,
                title: "Secure Auth",
                desc: "Sử dụng các tiêu chuẩn bảo mật hiện đại nhất cho mọi giao dịch thanh toán và các phiên đăng nhập quản trị.",
              },
              {
                icon: <Zap size={32} />,
                title: "Real-time Performance",
                desc: "Hạ tầng mạng độ trễ thấp tối ưu cho việc truyền tải dữ liệu đơn hàng tức thì trong môi trường nhà hàng bận rộn.",
              },
            ].map((sec, i) => (
              <div key={i} className="sr-item">
                <div className={s.securityIcon}>{sec.icon}</div>
                <h5 className={s.securityTitle}>{sec.title}</h5>
                <p className={s.securityDesc}>{sec.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════
            FINAL CTA
        ═══════════════════════════════ */}
        <section className={s.ctaSection}>
          <div className={`sr ${s.ctaCard}`}>
            <h2 className={s.ctaTitle}>
              Sẵn sàng kiến tạo nhà hàng số của riêng bạn?
            </h2>
            <p className={s.ctaDesc}>
              Gia nhập cộng đồng hơn 1,000+ chủ nhà hàng đang tin dùng Mavix để tối ưu vận hành hàng ngày.
            </p>
            <div className={s.ctaActions}>
              <Link className={s.btnBlack} href="/register">
                Đăng ký ngay <ArrowRight size={15} style={{ display: "inline", verticalAlign: "middle" }} />
              </Link>
              <Link className={s.btnOutline} href="/contact">Liên hệ tư vấn</Link>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
