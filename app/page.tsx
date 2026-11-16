"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen, Compass, Heart, Moon, Sun, Search, Menu, X, ArrowLeft,
  Sparkles, Brain, ScrollText, BookHeart, Check, Plus, Trash2,
  ExternalLink, ChevronLeft, Bookmark, ShieldCheck, Clock3
} from "lucide-react";
import { dailyVerses, wisdoms, learningCards, sourceDirectory } from "@/lib/content";

type Reflection = { id: string; text: string; createdAt: string };
const habits = [
  "نمازهای واجب را به‌موقع بخوانم",
  "چند آیه قرآن با ترجمه مطالعه کنم",
  "یک نکته از اخلاق اهل‌بیت بیاموزم",
  "از زبان و رفتارم مراقبت کنم",
  "به کسی کمک یا نیکی کنم",
  "پیش از خواب اعمال روزم را مرور کنم"
];

export default function Home() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dayIndex, setDayIndex] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const [reflectionText, setReflectionText] = useState("");
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const verse = dailyVerses[dayIndex % dailyVerses.length];
  const wisdom = wisdoms[dayIndex % wisdoms.length];
  const progress = Math.round((done.length / habits.length) * 100);
  const filteredCards = useMemo(() => learningCards.filter((card) =>
    `${card.title} ${card.description} ${card.category}`.toLowerCase().includes(search.toLowerCase())
  ), [search]);

  useEffect(() => {
    const saved = localStorage.getItem("rah-noor-habits");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === new Date().toDateString()) setDone(parsed.done || []);
      } catch {}
    }
    fetch("/api/reflections").then(r => r.json()).then(data => setReflections(data.reflections || [])).catch(() => {});
  }, []);

  function toggleHabit(habit: string) {
    const next = done.includes(habit) ? done.filter(x => x !== habit) : [...done, habit];
    setDone(next);
    localStorage.setItem("rah-noor-habits", JSON.stringify({ date: new Date().toDateString(), done: next }));
  }

  async function saveReflection(e: React.FormEvent) {
    e.preventDefault();
    if (!reflectionText.trim()) return;
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: reflectionText })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "ذخیره نشد");
      setReflections(old => [data.reflection, ...old]);
      setReflectionText("");
      setMessage("یادداشتت ذخیره شد.");
    } catch {
      setMessage("ذخیره انجام نشد. سرور را بررسی کن.");
    } finally { setLoading(false); }
  }

  async function removeReflection(id: string) {
    const response = await fetch(`/api/reflections/${id}`, { method: "DELETE" });
    if (response.ok) setReflections(old => old.filter(item => item.id !== id));
  }

  const nav = [
    ["قرآن و تدبر", "#quran"], ["اهل‌بیت", "#ahlulbayt"], ["رشد روزانه", "#journey"],
    ["علم و انسان", "#science"], ["منابع", "#sources"]
  ];

  return (
    <main className={dark ? "site dark" : "site light"}>
      <div className="topline"><span>راهی برای شناخت، آرامش و بهتر زیستن</span><span className="topline-right"><ShieldCheck size={14}/> محتوای مستند و منبع‌محور</span></div>
      <header className="navbar wrap">
        <a href="#" className="brand"><span className="brand-mark"><Sparkles size={21}/></span><span>راهِ نور<small>RAH-E-NOOR</small></span></a>
        <nav className="desktop-nav">{nav.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
        <div className="nav-actions">
          <button className="icon-btn" aria-label="تغییر حالت رنگ" onClick={() => setDark(!dark)}>{dark ? <Sun/> : <Moon/>}</button>
          <a className="nav-cta" href="#journey">شروع مسیر <ArrowLeft size={16}/></a>
          <button className="icon-btn mobile-menu" aria-label="بازکردن منو" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
        </div>
      </header>
      {menuOpen && <div className="mobile-nav">{nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}</div>}

      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line"/> مسیر آگاهی و بندگی <span className="eyebrow-line"/></div>
          <h1>به سوی نوری<br/>که <em>پایان ندارد</em></h1>
          <p className="hero-lead">سفری آرام و آگاهانه برای شناخت پروردگار؛ با چراغ قرآن، حکمت اهل‌بیت (ع)، اخلاق نیک و دانش معتبر.</p>
          <div className="hero-buttons"><a className="primary-btn" href="#journey">از امروز آغاز کن <ArrowLeft size={18}/></a><a className="text-btn" href="#quran">یک آیه بخوان <ChevronLeft size={17}/></a></div>
          <div className="hero-note"><span className="note-dot"/> قدم‌های کوچک، پیوستگی بزرگ می‌سازند.</div>
        </div>
        <div className="hero-art" aria-label="نقش هندسی اسلامی">
          <div className="art-glow"/><div className="art-ring ring-one"/><div className="art-ring ring-two"/>
          <div className="art-star">✧</div><div className="art-center"><span>اللَّه</span><small>یاد او، چراغ دل</small></div>
          <div className="art-caption"><span>۰۱ / مسیر شناخت</span><span>تأمل · ایمان · عمل</span></div>
        </div>
      </section>

      <section className="verse-band" id="quran">
        <div className="wrap verse-layout">
          <div className="section-kicker"><BookOpen size={18}/>  آیهٔ امروز نورآقا نوروزی</div>
          <div className="verse-content">
            <div className="arabic">{verse.arabic}</div>
            <h2>{verse.translation}</h2>
            <p>{verse.reflection}</p>
            <div className="verse-meta"><span>{verse.reference}</span><span>ترجمهٔ روان برای مطالعه</span></div>
          </div>
          <button className="round-arrow" onClick={() => setDayIndex(i => i + 1)} aria-label="آیهٔ بعدی"><ArrowLeft/></button>
        </div>
      </section>

      <section className="section wrap" id="ahlulbayt">
        <div className="section-heading"><div><div className="eyebrow muted">حکمت و سیره</div><h2>از کلام و مکتب اهل‌بیت (ع)</h2></div><p>اندیشه‌ای که در رفتار نیک، عدالت و مهربانی جلوه می‌کند.</p></div>
        <div className="wisdom-card">
          <div className="wisdom-symbol"><ScrollText size={28}/></div>
          <div className="wisdom-main"><span className="small-label">{wisdom.title}</span><div className="wisdom-arabic">{wisdom.text}</div><h3>{wisdom.translation}</h3><p className="source-line">{wisdom.source}</p><p className="source-note">{wisdom.note}</p></div>
          <div className="wisdom-index">حکمت<br/><strong>{dayIndex + 1}</strong></div>
        </div>
      </section>

      <section className="section journey-section" id="journey">
        <div className="wrap">
          <div className="section-heading"><div><div className="eyebrow muted">رشد پیوسته</div><h2>مسیر معنوی امروز من</h2></div><p>قرار نیست کامل باشی؛ کافی است هر روز یک قدم آگاهانه برداری.</p></div>
          <div className="journey-grid">
            <div className="habit-panel">
              <div className="panel-top"><div><span className="small-label">برنامهٔ امروز</span><h3>شش تمرین کوچک</h3></div><div className="progress-ring" style={{background:`conic-gradient(var(--mint) ${progress}%, var(--line) 0)`}}><span>{progress}%</span></div></div>
              <div className="progress-track"><span style={{width:`${progress}%`}}/></div>
              <div className="habit-list">{habits.map((habit, index) => <button className={`habit-item ${done.includes(habit) ? "checked" : ""}`} key={habit} onClick={() => toggleHabit(habit)}><span className="habit-check">{done.includes(habit) ? <Check size={15}/> : <span>{String(index + 1).padStart(2,"0")}</span>}</span><span>{habit}</span></button>)}</div>
              <p className="panel-foot"><Clock3 size={14}/> پیشرفت این بخش روی همین دستگاه ذخیره می‌شود.</p>
            </div>
            <div className="reflection-panel">
              <div className="reflection-icon"><BookHeart size={24}/></div><span className="small-label">دفتر تأمل شخصی</span><h3>امروز چه چیزی آموختم؟</h3><p>یک فکر، سپاسگزاری یا تصمیم خوبت را بنویس تا بعداً به آن برگردی.</p>
              <form onSubmit={saveReflection}><textarea value={reflectionText} onChange={e => setReflectionText(e.target.value)} maxLength={2000} placeholder="امروز از این آیه یا تجربه آموختم که..." aria-label="یادداشت روزانه"/><div className="form-bottom"><span>{reflectionText.length}/۲۰۰۰</span><button className="primary-btn small" disabled={loading || !reflectionText.trim()}>{loading ? "در حال ذخیره..." : "ذخیرهٔ یادداشت"} <Plus size={15}/></button></div></form>
              {message && <p className="form-message">{message}</p>}
              {reflections.length > 0 && <div className="saved-notes"><strong>یادداشت‌های اخیر</strong>{reflections.slice(0,3).map(item => <div className="saved-note" key={item.id}><span>{item.text}</span><button onClick={() => removeReflection(item.id)} aria-label="حذف یادداشت"><Trash2 size={14}/></button></div>)}</div>}
            </div>
          </div>
        </div>
      </section>

      <section className="section wrap" id="science">
        <div className="section-heading"><div><div className="eyebrow muted">نگاه چندبُعدی</div><h2>ایمان، اخلاق و شناخت انسان</h2></div><p>میان متن دینی و یافتهٔ علمی تفاوت می‌گذاریم؛ هرکدام را با روش و منبع خودش می‌خوانیم.</p></div>
        <div className="search-box"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="جست‌وجو در موضوعات این بخش..." /></div>
        <div className="learning-grid">{filteredCards.map((card, i) => <article className="learning-card" key={card.title}><div className="card-icon">{i === 0 ? <BookOpen/> : i === 1 ? <Heart/> : <Brain/>}</div><span className="small-label">{card.category}</span><h3>{card.title}</h3><p>{card.description}</p><span className="tag">{card.tag}</span></article>)}</div>
      </section>

      <section className="closing-quote">
        <div className="wrap closing-inner"><Sparkles size={23}/><p>«رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا»</p><span>پروردگارا، پس از آن‌که ما را هدایت کردی، دل‌هایمان را منحرف مگردان. — آل‌عمران، ۸</span></div>
      </section>

      <section className="section wrap" id="sources">
        <div className="section-heading"><div><div className="eyebrow muted">پشتوانهٔ محتوا</div><h2>کتابخانهٔ منابع</h2></div><p>برای مطالعهٔ عمیق‌تر، به متن و نسخهٔ اصلی مراجعه کن.</p></div>
        <div className="sources-grid">{sourceDirectory.map(source => <a className="source-card" href={source.url} target="_blank" rel="noreferrer" key={source.name}><div><Bookmark size={18}/><ExternalLink size={15}/></div><h3>{source.name}</h3><p>{source.detail}</p></a>)}</div>
        <div className="integrity-note"><ShieldCheck size={18}/><p><strong>تعهد علمی و دینی:</strong> نقل‌قول‌ها با درجهٔ اطمینان مناسب معرفی می‌شوند. ترجمه و برداشت تفسیری از متن اصلی جداست. مطالب علمی نیز باید به پژوهش معتبر و قابل بررسی ارجاع داشته باشند.</p></div>
      </section>

      <footer className="footer"><div className="wrap footer-inner"><a href="#" className="brand"><span className="brand-mark"><Sparkles size={20}/></span><span>راهِ نور<small>RAH-E-NOOR</small></span></a><p>با نیت پاک، دانش درست و عمل نیک.</p><span>© {new Date().getFullYear()} راه نور</span></div></footer>
    </main>
  );
}
