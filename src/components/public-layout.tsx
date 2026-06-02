"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import s from "./public-layout.module.css";

interface PublicLayoutProps {
    children: React.ReactNode;
    /** Không hiển thị footer (dùng cho login/register) */
    noFooter?: boolean;
}

export function PublicLayout({ children, noFooter = false }: PublicLayoutProps) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className={s.root}>
            {/* ── HEADER ── */}
            <header className={`${s.header} ${scrolled ? s.headerScrolled : ""}`}>
                <div className={s.headerInner}>
                    <Link href="/" className={s.logo}>
                        <span className={s.logoMark}>PCQ</span>
                        <span className={s.logoText}>Mavix</span>
                    </Link>
                    <nav className={s.nav}>
                        <Link className={s.navLink} href="/#benefits">Tính năng</Link>
                        <Link className={s.navLink} href="/#pricing">Giá cả</Link>
                        <Link className={s.navLink} href="/about">Về chúng tôi</Link>
                        <Link className={s.navLink} href="/contact">Liên hệ</Link>
                        <Link className={s.navLink} href="/login">Đăng nhập</Link>
                        <Link className={s.navCta} href="/register">
                            Bắt đầu miễn phí <ArrowRight size={14} />
                        </Link>
                    </nav>
                    {/* Mobile hamburger placeholder */}
                    <button className={s.mobileMenu} aria-label="Mở menu">
                        <span /><span /><span />
                    </button>
                </div>
            </header>

            {/* ── MAIN ── */}
            <main className={s.main}>
                {children}
            </main>

            {/* ── FOOTER ── */}
            {!noFooter && (
                <footer className={s.footer}>
                    <div className={s.footerInner}>
                        <div className={s.footerTop}>
                            <div className={s.footerBrandCol}>
                                <div className={s.footerBrand}>
                                    <span className={s.footerLogoMark}>MX</span>
                                    <span className={s.footerLogoText}>Mavix</span>
                                </div>
                                <p className={s.footerDesc}>
                                    Nền tảng quản lý nhà hàng thông minh, giúp bạn vận hành chuyên nghiệp từ ngày đầu tiên.
                                </p>
                                <div className={s.footerContactInfo}>
                                    <a href="mailto:mavix@mavix.com" className={s.footerContactRow}>mavix@mavix.com</a>
                                    <a href="mailto:ntmanh@ntmanh.io.vn" className={s.footerContactRow}>ntmanh@ntmanh.io.vn</a>
                                    <a href="tel:0799021393" className={s.footerContactRow}>0799 021 393</a>
                                </div>
                            </div>
                            {[
                                {
                                    title: "Sản phẩm",
                                    links: [
                                        { label: "Menu QR", href: "/#benefits" },
                                        { label: "Quản lý đơn hàng", href: "/#benefits" },
                                        { label: "Báo cáo doanh thu", href: "/#benefits" },
                                        { label: "Quản lý nhân viên", href: "/#benefits" },
                                    ],
                                },
                                {
                                    title: "Công ty",
                                    links: [
                                        { label: "Về chúng tôi", href: "/about" },
                                        { label: "Blog", href: "/blog" },
                                        { label: "Tuyển dụng", href: "/career" },
                                        { label: "Liên hệ", href: "/contact" },
                                    ],
                                },
                                {
                                    title: "Hỗ trợ",
                                    links: [
                                        { label: "Trung tâm hỗ trợ", href: "/support" },
                                        { label: "Hướng dẫn bắt đầu", href: "/support/guide" },
                                        { label: "Điều khoản", href: "/support/terms" },
                                        { label: "Bảo mật", href: "/support/privacy" },
                                    ],
                                },
                            ].map((col, i) => (
                                <div key={i} className={s.footerCol}>
                                    <span className={s.footerColTitle}>{col.title}</span>
                                    <ul className={s.footerLinks}>
                                        {col.links.map((l, j) => <li key={j}><Link className={s.footerLink} href={l.href}>{l.label}</Link></li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className={s.footerBottom}>
                            <p className={s.footerCopy}>@Copyright by MADZ Coder & Mavix</p>
                            <div className={s.footerSocials}>
                                <a className={s.footerSocial} href="https://www.facebook.com/thanh.manh2005" target="_blank" rel="noopener noreferrer">Facebook</a>
                                <a className={s.footerSocial} href="mailto:ntmanh@ntmanh.io.vn">Email</a>
                                <a className={s.footerSocial} href="tel:0799021393">Gọi ngay</a>
                            </div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}
