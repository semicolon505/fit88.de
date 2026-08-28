/**
 * اتجاه التصميم: مجلة رقمية عملية — إيقاع تحريري دافئ، عدم تناظر مقصود، مرجاني محروق كإشارة فعل.
 * هذا الملف يحافظ على تسلسل قصصي واضح: موقف العلامة → ما نقدمه → كيف نعمل → دعوة محادثة.
 */
import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpLeft,
  Check,
  Menu,
  MoveUpLeft,
  Sparkles,
  X,
} from "lucide-react";

const navItems = [
  { label: "الرؤية", href: "#vision" },
  { label: "الخدمات", href: "#services" },
  { label: "المنهج", href: "#process" },
];

const services = [
  {
    id: "01",
    title: "نرتّب الفكرة",
    body: "نحوّل التشتت إلى موقف واضح، ورسالة يفهمها الناس من أول مرور.",
    tags: ["استراتيجية", "نبرة", "هيكلة"],
  },
  {
    id: "02",
    title: "نصمّم التجربة",
    body: "نصنع مسارات خفيفة وواضحة، تجعل كل قرار أسهل وكل شاشة أهدأ.",
    tags: ["UX", "واجهات", "نظم"],
  },
  {
    id: "03",
    title: "نمنحها حضوراً",
    body: "هوية بصرية ومحتوى رقمي يظهران شخصية العمل من دون ضوضاء.",
    tags: ["هوية", "محتوى", "إطلاق"],
  },
];

const process = [
  ["نستمع", "نبدأ بالأسئلة التي تكشف ما يهم فعلاً، لا بما يبدو لامعاً فقط."],
  ["نحدّد", "نختار المسار ونبني لغة بصرية ومحتوى يمكن تطويرهما بثقة."],
  ["نطلق", "نحوّل القرار إلى تجربة متماسكة، جاهزة للنمو والتعلم."],
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="site-shell" dir="rtl">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="مِداد، العودة إلى البداية">
          <img
            src="/manus-storage/brand-window-mark_64d9ab1b.png"
            alt=""
            className="brand-mark"
          />
          <span className="brand-name">مِداد</span>
        </a>

        <nav className="desktop-nav" aria-label="التنقل الرئيسي">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        <a className="header-cta" href="#contact">
          ابدأ محادثة
          <ArrowUpLeft size={16} strokeWidth={1.8} aria-hidden="true" />
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {mobileMenuOpen && (
        <div className="mobile-menu" id="mobile-navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
              <ArrowDownLeft size={20} aria-hidden="true" />
            </a>
          ))}
          <a href="#contact" className="mobile-contact" onClick={closeMenu}>
            ابدأ محادثة
          </a>
        </div>
      )}

      <main id="top">
        <section className="hero section-padding">
          <div className="hero-copy reveal-up">
            <p className="eyebrow"><span /> استوديو رقمي مستقل</p>
            <h1>اجعل الخطوة<br /><em>التالية</em> واضحة.</h1>
            <p className="hero-intro">
              نساعد العلامات والأفكار الجادة على ترتيب رسالتها، وتصميم تجربة تجعل حضورها أكثر دقة وأقرب للناس.
            </p>
            <div className="hero-actions">
              <a href="#contact" className="button button-primary">
                لنرتّب الفكرة
                <ArrowUpLeft size={18} aria-hidden="true" />
              </a>
              <a href="#vision" className="text-action">
                اكتشف منهجنا <MoveUpLeft size={17} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="hero-media reveal-up delay-1">
            <div className="hero-frame">
              <img
                src="/manus-storage/editorial-hero-studio_65bb01ed.jpg"
                alt="مشهد إبداعي دافئ داخل استوديو للتصميم"
              />
            </div>
            <div className="hero-stamp" aria-hidden="true">
              <Sparkles size={16} strokeWidth={1.5} />
              <span>أفكار<br />بأثر</span>
            </div>
            <p className="image-note">نقود التفاصيل الصغيرة<br />إلى حضور كبير.</p>
          </div>

          <div className="hero-aside reveal-up delay-2">
            <span>01 / 04</span>
            <div className="hero-rule" />
            <p>وضوح في القرار.<br />هدوء في التجربة.</p>
          </div>
        </section>

        <section className="statement-band" aria-label="موقفنا">
          <p>التصميم الجيد لا يملأ المساحة.</p>
          <strong>إنه يكشف ما يستحق أن يُرى.</strong>
          <span className="band-mark" aria-hidden="true">↗</span>
        </section>

        <section id="vision" className="vision section-padding">
          <div className="section-label reveal-up">
            <span>لماذا مِداد</span>
          </div>
          <div className="vision-content">
            <div className="vision-heading reveal-up">
              <h2>نصمّم ما يظل<br />واضحاً بعد<br /><em>الانطباع الأول.</em></h2>
            </div>
            <div className="vision-body reveal-up delay-1">
              <p>لا نبدأ بلوحة ألوان. نبدأ بما تريد أن يشعر به الناس، وما الذي يجب أن يفهموه، وأين ينبغي أن تذهب خطوتهم التالية.</p>
              <p>ثم نترجم هذا الوضوح إلى نظام له شخصية: لغة، واجهة، ومحتوى يعملون معاً بدل أن يتنافسوا على انتباه الزائر.</p>
              <a href="#services" className="line-link">كيف يتحول هذا إلى عمل؟ <ArrowDownLeft size={18} /></a>
            </div>
          </div>
        </section>

        <section id="services" className="services section-padding">
          <div className="services-header">
            <div className="section-label light reveal-up">
              <span>02</span>
              <span>ما نفعله</span>
            </div>
            <p className="reveal-up">من النقطة الأولى إلى اللحظة التي يلتقي فيها الناس بعملك.</p>
          </div>

          <div className="services-list">
            {services.map((service, index) => (
              <article className={`service-row reveal-up delay-${index + 1}`} key={service.id}>
                <span className="service-number">{service.id}</span>
                <h3>{service.title}</h3>
                <p>{service.body}</p>
                <div className="service-tags" aria-label="مجالات الخدمة">
                  {service.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <span className="row-arrow" aria-hidden="true"><ArrowUpLeft size={23} /></span>
              </article>
            ))}
          </div>
        </section>

        <section className="showcase section-padding">
          <div className="showcase-primary reveal-up">
            <img
              src="/manus-storage/editorial-process-collage_5d8e70ce.jpg"
              alt="تفاصيل عملية تصميم تتضمن أوراقاً وأدواتاً وألواناً دافئة"
            />
          </div>
          <div className="showcase-copy reveal-up delay-1">
            <p className="eyebrow"><span /> لا مزيد من الواجهات المتشابهة</p>
            <h2>لكل تفصيلة<br />سبب، ولكل<br /><em>سبب شكل.</em></h2>
            <p>نختبر الفكرة قبل أن نزيّنها؛ لأن الجمال الحقيقي في الموقع هو أن يعرف المستخدم إلى أين يمضي ولماذا.</p>
            <div className="showcase-footnote"><span>موقع. هوية. محتوى.</span><span>من فكرة واحدة متماسكة.</span></div>
          </div>
          <div className="showcase-detail reveal-up delay-2">
            <img
              src="/manus-storage/editorial-detail-object_4c3493f1.jpg"
              alt="قطعة تصميمية خزفية بتفاصيل مرجانية وداكنة"
            />
          </div>
        </section>

        <section id="process" className="process section-padding">
          <div className="process-intro reveal-up">
            <div className="section-label"><span>03</span><span>كيف نعمل</span></div>
            <h2>نترك مساحة<br />للتفكير،<br /><em>ونحترم الوقت.</em></h2>
          </div>
          <ol className="process-list">
            {process.map(([title, description], index) => (
              <li className={`process-item reveal-up delay-${index + 1}`} key={title}>
                <span className="process-index">0{index + 1}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
                <Check size={20} strokeWidth={1.4} aria-hidden="true" />
              </li>
            ))}
          </ol>
        </section>

        <section id="contact" className="contact-section section-padding">
          <p className="eyebrow light"><span /> لنكتب السطر الأول</p>
          <h2>عندك فكرة<br />تستحق <em>مكاناً أوضح؟</em></h2>
          <a className="contact-orbit" href="mailto:hello@example.com" aria-label="أرسل لنا رسالة">
            <span>ابدأ<br />من هنا</span>
            <ArrowUpLeft size={27} aria-hidden="true" />
          </a>
          <p className="contact-email">hello@example.com</p>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#top"><img src="/manus-storage/brand-window-mark_64d9ab1b.png" alt="" className="brand-mark" /><span className="brand-name">مِداد</span></a>
        <p>نمنح الأفكار الجيدة مساحة لتظهر.</p>
        <p className="footer-meta">© 2026 — بكل هدوء ودقة.</p>
      </footer>
    </div>
  );
}
