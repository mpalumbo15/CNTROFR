import { useState, useEffect, useRef } from "react";

const S = `

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; } html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; } body { -webkit-font-smoothing: antialiased; overscroll-behavior-y: none; }
  :root {
    --y: #FFD600; --yd: #E8C200; --yp: rgba(255,214,0,0.1);
    --red: #FF4444; --green: #00C96B; --blue: #3B9EFF;
    --bg: #0E0E14; --bg2: #16161E; --bg3: #1E1E28;
    --b1: #28283A; --b2: #38385A;
    --muted: #606080; --text: #EEEAF8; --text2: #A8A4C8;
  }
  body { background: var(--bg); color: var(--text); font-family: 'Nunito', sans-serif; overflow-x: hidden; }
  .hdr { position: sticky; top: 0; z-index: 200; background: rgba(14,14,20,.96); backdrop-filter: blur(12px); border-bottom: 2px solid var(--b1); padding: 0 16px; display: flex; align-items: center; height: 64px; gap: 12px; }
  .hdr-logo { display: flex; align-items: center; gap: 12px; cursor: pointer; }
  .hdr-plate { background: var(--y); border: 2px solid #B8A000; border-radius: 5px; padding: 3px 10px; box-shadow: 0 2px 0 #8A7800, 0 3px 10px rgba(255,214,0,.25); font-family: 'Bebas Neue'; font-size: 18px; letter-spacing: 4px; color: #111; position: relative; }
  .hdr-plate::before, .hdr-plate::after { content: '●'; position: absolute; top: 50%; transform: translateY(-50%); font-size: 6px; color: #B8A000; }
  .hdr-plate::before { left: 3px; } .hdr-plate::after { right: 3px; }
  .hdr-tagline { font-size: 9px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); }
  .hdr-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
  .lang-toggle { padding: 7px 14px; font-family: 'Bebas Neue'; letter-spacing: 2px; font-size: 13px; min-width: 44px; }
  .hbtn { background: none; border: 2px solid var(--b2); color: var(--text2); padding: 7px 18px; font-family: Nunito; font-size: 12px; font-weight: 800; cursor: pointer; border-radius: 8px; transition: all .2s; }
  .hbtn:hover { border-color: var(--y); color: var(--y); }
  .hbtn-y { background: var(--y); color: #111; border: none; padding: 8px 22px; font-family: Nunito; font-size: 12px; font-weight: 900; cursor: pointer; border-radius: 8px; transition: background .2s; box-shadow: 0 2px 12px rgba(255,214,0,.3); }
  .hbtn-y:hover { background: var(--yd); }
  .burger { background: none; border: none; cursor: pointer; padding: 8px; display: flex; flex-direction: column; gap: 5px; border-radius: 8px; transition: background .2s; }
  .burger:hover { background: var(--bg3); }
  .burger span { display: block; width: 22px; height: 2px; background: var(--text2); border-radius: 2px; transition: all .3s; }
  .burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); background: var(--y); }
  .burger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); background: var(--y); }
  .burger-menu { position: fixed; top: 56px; left: 0; width: 240px; background: var(--bg2); border-right: 2px solid var(--b1); border-bottom: 2px solid var(--b1); border-radius: 0 0 16px 0; z-index: 999; display: flex; flex-direction: column; padding: 8px; gap: 4px; box-shadow: 4px 8px 32px rgba(0,0,0,.4); animation: slideIn .2s ease; }
  @keyframes slideIn { from { opacity:0; transform: translateX(-16px); } to { opacity:1; transform: translateX(0); } }
  .bmenu-item { background: none; border: none; color: var(--text2); font-family: Nunito; font-size: 13px; font-weight: 800; padding: 12px 16px; text-align: left; cursor: pointer; border-radius: 8px; transition: all .15s; letter-spacing: .3px; }
  .bmenu-item:hover { background: var(--bg3); color: var(--y); }
  .bmenu-item.highlight { background: var(--y); color: #111; margin-top: 4px; text-align: center; }
  .bmenu-item.highlight:hover { background: var(--yd); }
  .bmenu-divider { height: 1px; background: var(--b1); margin: 4px 8px; }
  .hero { max-width: 900px; margin: 0 auto; padding: 12px 24px 60px; text-align: center; position: relative; }
  .hero-road { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: repeating-linear-gradient(90deg, var(--y) 0px, var(--y) 40px, transparent 40px, transparent 80px); opacity: .3; }
  .hero-center-plate { display: flex; justify-content: center; margin-bottom: 24px; }
  .hero-plate { background: var(--y); border: 6px solid #B8A000; border-radius: 12px; padding: 10px 32px 12px; box-shadow: 0 6px 0 #8A7800, 0 10px 40px rgba(255,214,0,.35); position: relative; display: inline-flex; flex-direction: column; align-items: center; }
  .hero-plate::before, .hero-plate::after { content: ''; position: absolute; top: 50%; transform: translateY(-50%); font-size: 10px; color: rgba(0,0,0,.3); }
  .hero-plate::before { left: 10px; } .hero-plate::after { right: 10px; }
  .hp-state { font-size: 9px; font-weight: 900; letter-spacing: 3px; color: #8A7800; margin-bottom: 2px; }
  .hp-text { font-family: 'Bebas Neue'; font-size: clamp(42px, 10vw, 72px); letter-spacing: 10px; color: #111; line-height: 1; }
  .hp-url { font-size: 9px; font-weight: 900; color: #8A7800; letter-spacing: 2px; margin-top: 2px; }
  .hero-h1 { font-family: 'Bebas Neue'; font-size: clamp(32px, 7vw, 60px); letter-spacing: 2px; line-height: .95; margin-bottom: 10px; }
  .hero-h1 .y { color: var(--y); }
  .hero-tagline { font-family: 'Bebas Neue'; font-size: clamp(14px, 3vw, 22px); letter-spacing: 6px; color: var(--y); margin-bottom: 14px; }
  .hero-sub { font-size: 15px; color: var(--text2); max-width: 500px; margin: 0 auto 36px; line-height: 1.75; font-weight: 600; }
  .hero-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .btn-lg { background: var(--y); color: #111; border: none; padding: 16px 40px; font-family: Nunito; font-size: 16px; font-weight: 900; cursor: pointer; border-radius: 12px; transition: all .2s; box-shadow: 0 4px 22px rgba(255,214,0,.3); width: 100%; } @media(min-width:600px){ .btn-lg { width: auto; } }
  .btn-lg:hover { background: var(--yd); transform: translateY(-1px); }
  .btn-lg-ghost { background: transparent; border: 2px solid var(--b2); color: var(--text2); padding: 13px 28px; font-family: Nunito; font-size: 15px; font-weight: 800; cursor: pointer; border-radius: 12px; transition: all .2s; }
  .btn-lg-ghost:hover { border-color: var(--y); color: var(--y); }
  .stats { display: flex; justify-content: center; gap: 48px; margin-top: 56px; padding-top: 36px; border-top: 1px solid var(--b1); flex-wrap: wrap; }
  .stat-n { font-family: 'Bebas Neue'; font-size: 40px; color: var(--y); letter-spacing: 1px; }
  .stat-l { font-size: 11px; color: var(--muted); font-weight: 700; margin-top: 2px; letter-spacing: .5px; }
  /* == SAVINGS CALLOUT & BREAKDOWN == */
  .savings-callout { display: inline-flex; align-items: center; gap: 10px; background: rgba(255,214,0,.08); border: 1px solid rgba(255,214,0,.3); border-radius: 100px; padding: 10px 22px; margin-bottom: 18px; font-family: Nunito; font-weight: 800; font-size: clamp(12px, 2.6vw, 15px); color: var(--text2); }
  .savings-callout .sc-icon { font-size: 18px; }
  .savings-callout .y { color: var(--y); font-family: 'Bebas Neue'; font-size: clamp(15px, 3.2vw, 19px); letter-spacing: .5px; }
  .savings-breakdown { margin-top: 40px; padding-top: 32px; border-top: 1px solid var(--b1); }
  .sb-grid { display: flex; justify-content: center; align-items: center; gap: 14px; flex-wrap: wrap; }
  .sb-item { background: var(--bg2); border: 1px solid var(--b1); border-radius: 12px; padding: 12px 18px; min-width: 110px; text-align: center; }
  .sb-amt { font-family: 'Bebas Neue'; font-size: 26px; color: var(--text); letter-spacing: .5px; }
  .sb-label { font-size: 10px; color: var(--muted); font-weight: 700; margin-top: 2px; letter-spacing: .5px; text-transform: uppercase; }
  .sb-plus { font-family: 'Bebas Neue'; font-size: 20px; color: var(--muted); }
  .sb-total { text-align: center; margin-top: 22px; font-family: 'Bebas Neue'; font-size: clamp(18px, 4vw, 28px); letter-spacing: 2px; color: var(--text2); }
  .sb-total .y { color: var(--y); }
  @media (max-width: 640px) { .sb-plus { display: none; } .sb-grid { gap: 10px; } .sb-item { flex: 1 1 calc(50% - 10px); min-width: 0; } }
  /* == SEVERITY / WARNING STYLES == */
  .severity-wrap { margin-top: 10px; animation: fadeIn .3s ease; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
  .extreme-warn { background: rgba(255,40,40,.1); border: 2px solid rgba(255,40,40,.4); border-radius: 12px; padding: 16px 18px; margin-top: 16px; }
  .extreme-warn-title { font-family: 'Bebas Neue'; font-size: 18px; letter-spacing: 2px; color: var(--red); margin-bottom: 6px; }
  .ftb-box { background: rgba(255,214,0,.06); border: 2px solid rgba(255,214,0,.2); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  .ftb-title { font-family: 'Bebas Neue'; font-size: 20px; letter-spacing: 2px; color: var(--y); margin-bottom: 8px; }
  .ftb-body { font-size: 13px; color: var(--text2); line-height: 1.85; font-weight: 600; }
  .buyers-badge { display: inline-block; background: var(--y); color: #111; font-family: 'Bebas Neue'; font-size: 11px; letter-spacing: 3px; padding: 3px 12px; border-radius: 4px; margin-bottom: 8px; }

  /* == BETA BANNER == */
  .beta-banner { background: repeating-linear-gradient(45deg, #111118 0px, #111118 12px, #16161E 12px, #16161E 24px); border-top: 3px solid var(--y); border-bottom: 3px solid var(--y); padding: 14px 24px; display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap; }
  .beta-plate { background: var(--y); border: 2px solid #B8A000; border-radius: 5px; padding: 2px 10px; font-family: 'Bebas Neue'; font-size: 14px; letter-spacing: 3px; color: #111; box-shadow: 0 2px 0 #8A7800; white-space: nowrap; }
  .beta-text { font-size: 12px; font-weight: 800; color: var(--text2); letter-spacing: .3px; text-align: center; }
  .beta-text strong { color: var(--y); }
  .beta-text em { color: var(--muted); font-style: normal; font-size: 11px; }

  .sticky-upgrade-wrap { position: relative; display: inline-block; }
  .sticky-tooltip { display: none; position: absolute; bottom: calc(100% + 10px); right: 0; background: var(--bg2); border: 1px solid var(--y); border-radius: 10px; padding: 12px 14px; width: 220px; font-size: 11px; color: var(--text2); font-weight: 700; line-height: 1.5; white-space: normal; z-index: 600; }
  .sticky-upgrade-wrap:hover .sticky-tooltip { display: block; }
  .session-warn-box { background: var(--bg2); border: 2px solid var(--y); border-radius: 16px; max-width: 480px; width: 100%; padding: 32px 28px; text-align: center; }
  .session-warn-icon { font-size: 36px; margin-bottom: 12px; }
  .session-warn-title { font-family: 'Bebas Neue'; font-size: 26px; letter-spacing: 2px; color: var(--y); margin-bottom: 8px; }
  .session-warn-body { font-size: 13px; color: var(--text2); line-height: 1.8; font-weight: 600; margin-bottom: 24px; }
  .session-warn-body strong { color: var(--text); }
  .session-warn-list { text-align: left; background: var(--bg3); border-radius: 10px; padding: 16px 20px; margin-bottom: 24px; display: flex; flex-direction: column; gap: 8px; }
  .session-warn-list li { font-size: 12px; color: var(--text2); font-weight: 700; list-style: none; display: flex; align-items: flex-start; gap: 8px; }
  .session-warn-list li::before { content: '✓'; color: var(--y); font-weight: 900; flex-shrink: 0; }
  .alert { background: rgba(255,68,68,.07); border-top: 1px solid rgba(255,68,68,.2); border-bottom: 1px solid rgba(255,68,68,.2); padding: 14px 24px; display: flex; justify-content: center; align-items: center; }
  .alert p { font-size: 14px; color: #FF8888; font-weight: 700; max-width: 860px; line-height: 1.6; text-align: center; }
  .alert p strong { color: var(--red); }
  .sec { max-width: 900px; margin: 0 auto; padding: 48px 16px; } @media(min-width:600px){ .sec { padding: 64px 24px; } }
  .sec-eye { font-family: 'Bebas Neue'; font-size: clamp(12px, 1.4vw, 16px); letter-spacing: 4px; color: var(--y); text-align: center; margin-bottom: 10px; }
  .sec-h2 { font-family: 'Bebas Neue'; font-size: clamp(28px, 5vw, 44px); letter-spacing: 1px; text-align: center; margin-bottom: 6px; }
  .sec-sub { text-align: center; font-size: 13px; color: var(--muted); margin-bottom: 36px; font-weight: 600; }
  .steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
  @media(max-width:580px){ .steps { grid-template-columns: 1fr; } }
  .step { background: var(--bg2); border: 2px solid var(--b1); border-radius: 14px; padding: 22px 18px; transition: border-color .2s; }
  .step:hover { border-color: var(--y); }
  .step-num { font-family: 'Bebas Neue'; font-size: 44px; color: var(--y); opacity: .25; line-height: 1; margin-bottom: 8px; }
  .step-title { font-size: 14px; font-weight: 900; margin-bottom: 5px; }
  .step-desc { font-size: 12px; color: var(--text2); line-height: 1.6; font-weight: 600; }
  .tgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px,1fr)); gap: 12px; }
  .tc { background: var(--bg2); border: 2px solid var(--b1); border-radius: 14px; padding: 20px 18px; transition: all .2s; }
  .tc:hover { border-color: var(--y); transform: translateY(-2px); }
  .tc-icon { font-size: 26px; margin-bottom: 8px; }
  .tc-name { font-family: 'Bebas Neue'; font-size: 18px; letter-spacing: 1px; color: var(--text); margin-bottom: 4px; }
  .tc-desc { font-size: 11px; color: var(--text2); line-height: 1.55; font-weight: 600; }
  .tag-free { display: inline-block; margin-top: 8px; background: rgba(0,201,107,.1); border: 1px solid rgba(0,201,107,.25); color: var(--green); font-size: 9px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; padding: 2px 10px; border-radius: 100px; }
  .tag-pro { display: inline-block; margin-top: 8px; background: var(--yp); border: 1px solid rgba(255,214,0,.25); color: var(--y); font-size: 9px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; padding: 2px 10px; border-radius: 100px; }
  .vs-wrap { background: var(--bg2); border: 2px solid var(--b1); border-radius: 16px; overflow: hidden; }
  .vs-table { width: 100%; border-collapse: collapse; }
  .vs-table th { font-size: 10px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; padding: 14px 16px; text-align: left; border-bottom: 1px solid var(--b1); color: var(--muted); background: var(--bg3); }
  .vs-table th.us { color: var(--y); }
  .vs-table td { font-size: 12px; color: var(--text2); padding: 11px 16px; border-bottom: 1px solid var(--b1); font-weight: 600; }
  .vs-table td.feat { font-weight: 900; color: var(--text); }
  .vs-table tr:last-child td { border-bottom: none; }
  .vs-table .hi td { background: rgba(255,214,0,.04); }
  .ck { color: var(--green); } .cx { color: var(--b2); }
  .faq-list { display: flex; flex-direction: column; gap: 10px; }
  .faq-item { background: var(--bg2); border: 2px solid var(--b1); border-radius: 12px; overflow: hidden; transition: border-color .2s; }
  .faq-item.open { border-color: var(--y); }
  .faq-q { padding: 16px 20px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
  .faq-q span { font-size: 14px; font-weight: 800; color: var(--text); }
  .faq-icon { font-family: 'Bebas Neue'; font-size: 20px; color: var(--y); flex-shrink: 0; transition: transform .2s; }
  .faq-item.open .faq-icon { transform: rotate(45deg); }
  .faq-a { padding: 14px 20px 16px; font-size: 13px; color: var(--text2); line-height: 1.75; font-weight: 600; border-top: 1px solid var(--b1); }
  .pgrid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-top: 32px; }
  @media(max-width:900px){ .pgrid { grid-template-columns: repeat(2,1fr); } }
  @media(max-width:520px){ .pgrid { grid-template-columns: 1fr; } }
  .pcard { background: var(--bg2); border: 2px solid var(--b1); border-radius: 18px; padding: 28px 22px; position: relative; transition: all .2s; }
  .pcard:hover { transform: translateY(-3px); }
  .pcard.hot { border-color: var(--y); }
  .hot-lbl { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: var(--y); color: #111; font-size: 9px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; padding: 3px 14px; border-radius: 100px; white-space: nowrap; }
  .pname { font-size: 10px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
  .pprice { font-family: 'Bebas Neue'; font-size: 54px; letter-spacing: 1px; line-height: 1; }
  .pprice sup { font-size: 22px; font-family: Nunito; color: var(--text2); vertical-align: top; margin-top: 10px; }
  .pprice sub { font-size: 13px; font-family: Nunito; color: var(--muted); font-weight: 700; }
  .pdesc { font-size: 12px; color: var(--text2); margin: 10px 0 18px; line-height: 1.65; font-weight: 600; }
  .pfeats { list-style: none; padding: 0; margin-bottom: 22px; }
  .pfeats li { font-size: 12px; color: var(--text2); padding: 4px 0; display: flex; gap: 8px; font-weight: 700; }
  .pfeats li::before { content: '◆'; color: var(--y); font-size: 8px; flex-shrink: 0; margin-top: 4px; }
  .pbtn { width: 100%; padding: 12px; font-family: Nunito; font-size: 13px; font-weight: 900; cursor: pointer; border-radius: 10px; transition: all .2s; }
  .pbtn.out { background: transparent; border: 2px solid var(--b2); color: var(--text2); }
  .pbtn.out:hover { border-color: var(--y); color: var(--y); }
  .pbtn.fill { background: var(--y); color: #111; border: none; box-shadow: 0 3px 14px rgba(255,214,0,.25); }
  .pbtn.fill:hover { background: var(--yd); }
  .contact-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
  @media(max-width:640px){ .contact-wrap { grid-template-columns: 1fr; } }
  .contact-info { display: flex; flex-direction: column; gap: 20px; }
  .ci-item { display: flex; gap: 12px; align-items: flex-start; }
  .ci-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
  .ci-label { font-size: 10px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 3px; }
  .ci-val { font-size: 13px; font-weight: 700; color: var(--text2); }
  .ci-val a { color: var(--y); text-decoration: none; }
  .contact-form { background: var(--bg2); border: 2px solid var(--b1); border-radius: 16px; padding: 24px; }
  .cf-title { font-family: 'Bebas Neue'; font-size: 22px; letter-spacing: 2px; margin-bottom: 16px; }
  .cf-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
  .cf-field label { font-size: 10px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); }
  .cf-field input, .cf-field textarea, .cf-field select { background: var(--bg); border: 2px solid var(--b1); color: var(--text); font-family: Nunito; font-size: 13px; padding: 9px 12px; border-radius: 8px; outline: none; transition: border-color .2s; width: 100%; font-weight: 600; }
  .cf-field input:focus, .cf-field textarea:focus, .cf-field select:focus { border-color: var(--y); }
  .cf-field input::placeholder, .cf-field textarea::placeholder { color: var(--muted); }
  .cf-field select option { background: #111; }
  .cf-field textarea { resize: vertical; min-height: 90px; line-height: 1.6; }
  .cf-btn { width: 100%; background: var(--y); color: #111; border: none; padding: 12px; font-family: Nunito; font-size: 14px; font-weight: 900; cursor: pointer; border-radius: 10px; transition: background .2s; margin-top: 4px; }
  .cf-btn:hover { background: var(--yd); }
  .cf-btn:disabled { background: var(--b1); color: var(--muted); cursor: not-allowed; }
  .cf-success { background: rgba(0,201,107,.08); border: 1px solid rgba(0,201,107,.2); border-radius: 10px; padding: 14px 16px; text-align: center; font-size: 13px; color: var(--green); font-weight: 800; margin-top: 12px; }
  .mbg { position: fixed; inset: 0; z-index: 400; background: rgba(0,0,0,.82); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 20px; }
  .mbox { background: var(--bg2); border: 2px solid var(--b2); border-radius: 20px; width: 100%; max-width: 440px; animation: pop .25s cubic-bezier(.34,1.56,.64,1); }
  @keyframes pop { from { opacity:0; transform:scale(.9); } to { opacity:1; transform:scale(1); } }
  .mtop { padding: 18px 22px; border-bottom: 1px solid var(--b1); display: flex; align-items: center; justify-content: space-between; }
  .mtop h3 { font-family: 'Bebas Neue'; font-size: 22px; letter-spacing: 2px; }
  .mx { background: none; border: none; color: var(--muted); font-size: 26px; cursor: pointer; line-height: 1; }
  .mx:hover { color: var(--text); }
  .mbody { padding: 20px 22px; }
  .order-sum { background: var(--bg3); border: 1px solid var(--b1); border-radius: 12px; padding: 14px 16px; margin-bottom: 18px; }
  .orow { display: flex; justify-content: space-between; align-items: center; }
  .oname { font-size: 13px; color: var(--text2); font-weight: 700; margin-top: 4px; }
  .oprice { font-family: 'Bebas Neue'; font-size: 32px; color: var(--y); }
  .sbox { background: var(--bg3); border: 1px solid var(--b1); border-radius: 12px; padding: 16px; margin-bottom: 14px; }
  .slbl { font-size: 9px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 7px; }
  .sinput { background: var(--bg); border: 1px solid var(--b1); color: var(--text); font-family: 'JetBrains Mono'; font-size: 13px; padding: 9px 12px; border-radius: 8px; outline: none; width: 100%; margin-bottom: 10px; transition: border-color .2s; }
  .sinput:focus { border-color: var(--y); }
  .sinput::placeholder { color: var(--muted); }
  .srow { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .paybtn { width: 100%; background: var(--y); color: #111; border: none; padding: 14px; font-family: Nunito; font-size: 15px; font-weight: 900; cursor: pointer; border-radius: 12px; box-shadow: 0 4px 18px rgba(255,214,0,.3); transition: background .2s; }
  .paybtn:hover { background: var(--yd); }
  .paybtn:disabled { background: var(--b1); color: var(--muted); cursor: not-allowed; box-shadow: none; }
  .secnote { text-align: center; font-size: 11px; color: var(--muted); margin-top: 10px; font-weight: 700; }
  .secnote span { color: var(--green); }
  .tarea { max-width: 900px; margin: 0 auto; padding: 28px 24px 60px; }
  .tnav { display: flex; gap: 6px; padding-bottom: 22px; flex-wrap: wrap; }
  .ttab { background: var(--bg2); border: 2px solid var(--b1); color: var(--muted); padding: 10px 20px; font-family: Nunito; font-size: 13px; font-weight: 800; cursor: pointer; border-radius: 100px; transition: all .2s; white-space: nowrap; display: flex; align-items: center; gap: 6px; min-height: 44px; }
  .ttab:hover:not(.lk) { border-color: var(--b2); color: var(--text2); }
  .ttab.on { background: var(--y); border-color: var(--y); color: #111; }
  .ttab.lk { opacity: .6; cursor: pointer; }
  .access-ok { background: rgba(0,201,107,.08); border: 1px solid rgba(0,201,107,.2); border-radius: 10px; padding: 10px 16px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; font-size: 12px; color: var(--green); font-weight: 800; }
  .upbox { background: var(--bg2); border: 2px solid var(--b1); border-radius: 16px; padding: 56px 32px; text-align: center; }
  .upbox h3 { font-family: 'Bebas Neue'; font-size: 28px; letter-spacing: 2px; margin-bottom: 10px; }
  .upbox p { font-size: 13px; color: var(--text2); max-width: 320px; margin: 0 auto 24px; line-height: 1.7; font-weight: 600; }
  .card { background: var(--bg2); border: 2px solid var(--b1); border-radius: 14px; margin-bottom: 14px; }
  .ch { padding: 14px 20px; border-bottom: 1px solid var(--b1); }
  .clbl { font-size: 10px; font-weight: 900; letter-spacing: 2.5px; text-transform: uppercase; color: var(--y); }
  .cb { padding: 20px; }
  .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .g3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  @media(max-width:540px){ .g2,.g3 { grid-template-columns: 1fr; } }
  .fld { display: flex; flex-direction: column; gap: 5px; }
  .fld label { font-size: 11px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 2px; }
  .fld input, .fld select, .fld textarea { background: var(--bg); border: 2px solid var(--b1); color: var(--text); font-family: 'JetBrains Mono'; font-size: 16px; padding: 12px 14px; border-radius: 10px; outline: none; transition: border-color .2s; width: 100%; -webkit-appearance: none; } @media(min-width:600px){ .fld input, .fld select, .fld textarea { font-size: 13px; padding: 9px 12px; } }
  .fld input:focus, .fld select:focus, .fld textarea:focus { border-color: var(--y); }
  .fld input::placeholder { color: var(--muted); }
  .fld select option { background: #111; }
  .fld textarea { resize: vertical; min-height: 70px; line-height: 1.5; }
  .sp { height: 14px; }
  .go-btn { width: 100%; background: var(--y); color: #111; border: none; padding: 13px; font-family: Nunito; font-size: 14px; font-weight: 900; cursor: pointer; border-radius: 10px; transition: background .2s; margin-top: 16px; }
  .go-btn:hover { background: var(--yd); }
  .go-btn:disabled { background: var(--b1); color: var(--muted); cursor: not-allowed; }
  .ghost-btn { background: transparent; border: 2px solid var(--b2); color: var(--muted); padding: 6px 16px; font-family: Nunito; font-size: 11px; font-weight: 800; cursor: pointer; border-radius: 8px; transition: all .2s; }
  .ghost-btn:hover { border-color: var(--y); color: var(--y); }
  .spin { width: 34px; height: 34px; border: 3px solid var(--b2); border-top-color: var(--y); border-radius: 50%; animation: sp .7s linear infinite; }

  /* == PROGRESS LOADER == */
  .progress-wrap { width: 100%; max-width: 420px; margin: 0 auto; }
  .progress-bar-bg { background: var(--b1); border-radius: 100px; height: 6px; overflow: hidden; margin: 12px 0 8px; }
  .progress-bar-fill { height: 100%; border-radius: 100px; background: linear-gradient(90deg, var(--y), #FFB300); transition: width .4s ease; }
  .progress-pct { font-family: 'JetBrains Mono'; font-size: 11px; color: var(--y); font-weight: 700; text-align: right; }
  .progress-stage { font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); text-align: center; margin-bottom: 4px; min-height: 16px; }
  .progress-disclaimer { font-size: 10px; color: var(--b2); font-weight: 700; text-align: center; margin-top: 10px; line-height: 1.6; }

  /* == TOS PAGE == */
  .tos-wrap { max-width: 760px; margin: 0 auto; padding: 48px 24px 80px; }
  .tos-wrap h1 { font-family: 'Bebas Neue'; font-size: 40px; letter-spacing: 2px; margin-bottom: 6px; }
  .tos-wrap .tos-date { font-size: 11px; color: var(--muted); font-weight: 700; margin-bottom: 36px; }
  .tos-wrap h2 { font-family: 'Bebas Neue'; font-size: 20px; letter-spacing: 1px; color: var(--y); margin: 28px 0 8px; }
  .tos-wrap p { font-size: 13px; color: var(--text2); line-height: 1.85; font-weight: 600; margin-bottom: 10px; }
  .tos-wrap ul { list-style: none; padding: 0; margin-bottom: 12px; }
  .tos-wrap ul li { font-size: 13px; color: var(--text2); padding: 3px 0 3px 18px; position: relative; font-weight: 600; line-height: 1.7; }
  .tos-wrap ul li::before { content: '◆'; position: absolute; left: 0; color: var(--y); font-size: 8px; top: 7px; }
  @keyframes sp { to { transform: rotate(360deg); } }
  .loadbox { padding: 48px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .loadbox p { font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); }
  .ranim { animation: fu .3s ease; }
  @keyframes fu { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  .vstrip { display: flex; align-items: center; gap: 10px; padding: 12px 20px; background: var(--bg3); border-bottom: 1px solid var(--b1); border-radius: 12px 12px 0 0; }
  .badge { font-size: 10px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; padding: 5px 12px; border-radius: 100px; }
  .bg { background: rgba(0,201,107,.12); color: var(--green); border: 1px solid rgba(0,201,107,.25); }
  .ba { background: rgba(255,214,0,.12); color: var(--y); border: 1px solid rgba(255,214,0,.25); }
  .br { background: rgba(255,68,68,.12); color: var(--red); border: 1px solid rgba(255,68,68,.25); }
  .bb { background: rgba(59,158,255,.12); color: var(--blue); border: 1px solid rgba(59,158,255,.25); }
  .bx { background: rgba(96,96,128,.15); color: var(--muted); border: 1px solid var(--b1); }
  .aout { padding: 22px 20px; font-size: 13.5px; line-height: 1.85; color: var(--text2); font-weight: 600; }
  .aout h2 { font-family: 'Bebas Neue'; font-size: 18px; letter-spacing: 2px; color: var(--y); margin: 20px 0 6px; }
  .aout h3 { font-size: 10px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin: 14px 0 5px; }
  .aout p { margin-bottom: 7px; }
  .aout ul { list-style: none; padding: 0; margin-bottom: 8px; }
  .aout ul li { padding: 3px 0 3px 18px; position: relative; color: #C0BCDC; }
  .aout ul li::before { content: '◆'; position: absolute; left: 0; color: var(--y); font-size: 8px; top: 7px; }
  .pg { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap: 10px; margin-bottom: 16px; }
  .pc { background: var(--bg3); border: 2px solid var(--b1); border-radius: 12px; padding: 14px; cursor: pointer; transition: all .2s; position: relative; }
  .pc:hover { border-color: var(--b2); }
  .pc.sel { border-color: var(--y); background: rgba(255,214,0,.05); }
  .pc-chk { position: absolute; top: 10px; right: 10px; width: 18px; height: 18px; border: 2px solid var(--b2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 900; transition: all .2s; }
  .pc.sel .pc-chk { background: var(--y); border-color: var(--y); color: #111; }
  .pc-name { font-size: 13px; font-weight: 800; color: var(--text); margin-bottom: 3px; margin-right: 22px; }
  .pc-desc { font-size: 11px; color: var(--muted); line-height: 1.45; font-weight: 600; }
  .pi { background: var(--bg); border: 2px solid var(--b1); color: var(--text); font-family: 'JetBrains Mono'; font-size: 12px; padding: 7px 10px; border-radius: 8px; outline: none; width: 100%; margin-top: 8px; }
  .pi:focus { border-color: var(--y); }
  .pi::placeholder { color: var(--muted); }
  .phd { margin-bottom: 22px; }
  .phd h2 { font-family: 'Bebas Neue'; font-size: 30px; letter-spacing: 2px; }
  .phd h2 span { color: var(--y); }
  .phd p { font-size: 12px; color: var(--muted); margin-top: 3px; font-weight: 700; }
  .tooltip-wrap { position: relative; display: inline-flex; align-items: center; }
  .tooltip-icon { width: 14px; height: 14px; border-radius: 50%; background: var(--b2); color: var(--muted); font-size: 9px; font-weight: 900; display: inline-flex; align-items: center; justify-content: center; cursor: help; margin-left: 6px; flex-shrink: 0; transition: background .2s; }
  .tooltip-icon:hover { background: var(--y); color: #111; }
  .tooltip-bubble { position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); background: var(--bg3); border: 1px solid var(--y); border-radius: 10px; padding: 10px 14px; width: 240px; font-size: 11px; color: var(--text2); line-height: 1.65; font-weight: 600; z-index: 100; pointer-events: none; opacity: 0; transition: opacity .2s; box-shadow: 0 8px 24px rgba(0,0,0,.4); }
  .tooltip-bubble::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 5px solid transparent; border-top-color: var(--y); }
  .tooltip-wrap:hover .tooltip-bubble { opacity: 1; }
  /* == CONDITION TOGGLE == */
  .cond-toggle { display: flex; gap: 8px; margin-bottom: 16px; }
  .cond-btn { flex: 1; padding: 12px 8px; font-family: Nunito; font-size: 13px; font-weight: 900; border-radius: 10px; cursor: pointer; transition: all .2s; border: 2px solid var(--b1); background: var(--bg); color: var(--muted); text-align: center; min-height: 44px; }
  .cond-btn:hover { border-color: var(--b2); color: var(--text2); }
  .cond-btn.active { background: var(--y); border-color: var(--y); color: #111; }
  .cond-btn.active-cpo { background: var(--blue); border-color: var(--blue); color: #fff; }
  .cond-btn.active-custom { background: var(--b2); border-color: var(--text2); color: var(--text); }
  .cond-btn.active-buyout { background: #7C3AED; border-color: #9F67FF; color: #fff; }
  .hcaptcha-wrap { display: flex; justify-content: center; margin: 10px 0 4px; }
  .cond-tag { display: inline-block; font-size: 9px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; padding: 2px 8px; border-radius: 100px; margin-left: 8px; }
  .cond-tag-new { background: rgba(0,201,107,.12); color: var(--green); border: 1px solid rgba(0,201,107,.25); }
  .cond-tag-used { background: rgba(255,214,0,.12); color: var(--y); border: 1px solid rgba(255,214,0,.25); }
  .cond-tag-cpo { background: rgba(59,158,255,.12); color: var(--blue); border: 1px solid rgba(59,158,255,.25); }

  .disclaimer { background: rgba(255,214,0,.05); border: 1px solid rgba(255,214,0,.15); border-radius: 10px; padding: 12px 16px; margin-bottom: 18px; font-size: 11px; color: var(--muted); line-height: 1.65; font-weight: 600; }
  .disclaimer strong { color: var(--y); }


  /* == MISSION == */
  .mission { background: linear-gradient(135deg, #0E0E14 0%, #16161E 50%, #0E0E14 100%); border-top: 3px solid var(--y); border-bottom: 3px solid var(--y); padding: 64px 24px; text-align: center; position: relative; overflow: hidden; }
  .mission::before { content: 'CNTROFR'; position: absolute; font-family: 'Bebas Neue'; font-size: 180px; color: rgba(255,214,0,.03); top: 50%; left: 50%; transform: translate(-50%,-50%); letter-spacing: 20px; pointer-events: none; white-space: nowrap; }
  .mission-inner { max-width: 760px; margin: 0 auto; position: relative; z-index: 1; }
  .mission-eye { font-family: 'Bebas Neue'; font-size: 11px; letter-spacing: 5px; color: var(--y); margin-bottom: 16px; }
  .mission-h { font-family: 'Bebas Neue'; font-size: clamp(32px, 6vw, 58px); letter-spacing: 2px; line-height: .95; margin-bottom: 20px; }
  .mission-h .y { color: var(--y); }
  .mission-body { font-size: 15px; color: var(--text2); line-height: 1.9; font-weight: 600; margin-bottom: 24px; }
  .mission-body strong { color: var(--text); font-weight: 900; }
  .mission-sig { font-family: 'Bebas Neue'; font-size: 14px; letter-spacing: 4px; color: var(--muted); }

  /* == TIME SAVING == */
  .timesave { background: var(--bg2); border-radius: 16px; padding: 32px; margin-bottom: 0; }
  .tsgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 24px; }
  @media(max-width:580px){ .tsgrid { grid-template-columns: 1fr; } }
  .ts-card { background: var(--bg3); border: 2px solid var(--b1); border-radius: 12px; padding: 20px; text-align: center; }
  .ts-card.bad { border-color: rgba(255,68,68,.2); }
  .ts-card.good { border-color: rgba(0,201,107,.2); }
  .ts-num { font-family: 'Bebas Neue'; font-size: 48px; letter-spacing: 1px; line-height: 1; margin-bottom: 4px; }
  .ts-card.bad .ts-num { color: var(--red); }
  .ts-card.good .ts-num { color: var(--green); }
  .ts-label { font-size: 12px; font-weight: 800; color: var(--text2); margin-bottom: 6px; }
  .ts-desc { font-size: 11px; color: var(--muted); line-height: 1.6; font-weight: 600; }

  /* == EQUITABLE == */
  .equitable { background: var(--bg2); border: 2px solid var(--b1); border-radius: 16px; padding: 32px; }
  .eq-quote { font-family: 'Bebas Neue'; font-size: clamp(20px, 4vw, 32px); letter-spacing: 1px; color: var(--y); line-height: 1.2; margin-bottom: 16px; }
  .eq-body { font-size: 14px; color: var(--text2); line-height: 1.85; font-weight: 600; }
  .eq-body strong { color: var(--text); font-weight: 900; }
  .eq-cta { margin-top: 20px; background: rgba(0,201,107,.08); border: 1px solid rgba(0,201,107,.2); border-radius: 10px; padding: 14px 18px; font-size: 13px; color: var(--green); font-weight: 800; line-height: 1.65; }

  /* == POWERED BY == */
  .powered-by { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,.04); border: 1px solid var(--b1); border-radius: 100px; padding: 5px 12px; margin-top: 16px; }
  .powered-by span { font-size: 9px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); }
  .powered-by-logo { font-size: 10px; font-weight: 900; color: var(--text2); letter-spacing: .5px; }

  .footer { border-top: 2px solid var(--b1); padding: 24px 24px 20px; text-align: center; }
  .footer-plate { display: flex; justify-content: center; margin-bottom: 8px; overflow: hidden; }
  .fp { background: var(--y); border: 3px solid #B8A000; border-radius: 6px; padding: 5px 18px; box-shadow: 0 3px 0 #8A7800; font-family: 'Bebas Neue'; font-size: 20px; letter-spacing: 5px; color: #111; }
  .footer-slogan { font-family: 'Bebas Neue'; font-size: 13px; letter-spacing: 4px; color: var(--muted); margin-bottom: 14px; }
  .footer p { font-size: 11px; color: var(--muted); line-height: 1.8; max-width: 560px; margin: 0 auto; font-weight: 600; }
  .footer a { color: var(--text2); text-decoration: none; }
  .footer a:hover { color: var(--y); }
  .footer-links { display: flex; justify-content: center; gap: 20px; margin-top: 12px; flex-wrap: wrap; }

  /* == TRAFFIC LIGHT VERDICTS == */
  .verdict-hero { padding: 28px 24px; text-align: center; border-bottom: 1px solid var(--b1); }
  .verdict-label { font-size: 10px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }
  .verdict-badge-lg { font-family: 'Bebas Neue'; font-size: clamp(48px, 10vw, 72px); letter-spacing: 4px; line-height: 1; margin-bottom: 16px; }
  .verdict-badge-lg.vg { color: var(--green); text-shadow: 0 0 40px rgba(0,201,107,.4); }
  .verdict-badge-lg.vy { color: var(--y); text-shadow: 0 0 40px rgba(255,214,0,.4); }
  .verdict-badge-lg.vr { color: var(--red); text-shadow: 0 0 40px rgba(255,68,68,.4); }
  .verdict-badge-lg.vx { color: var(--muted); }
  .verdict-new-btn { background: none; border: 2px solid var(--b2); color: var(--muted); padding: 8px 20px; font-family: Nunito; font-size: 12px; font-weight: 800; cursor: pointer; border-radius: 8px; transition: all .2s; }
  .verdict-new-btn:hover { border-color: var(--y); color: var(--y); }

  /* == DO NOT CLOSE WARNING == */
  .dont-close-warn { background: rgba(255,214,0,.06); border: 1px solid rgba(255,214,0,.2); border-radius: 8px; padding: 8px 14px; margin-top: 12px; font-size: 10px; font-weight: 800; color: var(--y); letter-spacing: .5px; text-align: center; }

  /* == COOKIE BANNER == */
  .cookie-banner { position: fixed; bottom: 0; left: 0; right: 0; z-index: 600; background: var(--bg2); border-top: 2px solid var(--b1); padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; box-shadow: 0 -4px 24px rgba(0,0,0,.4); animation: slideUp .3s ease; }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  .cookie-text { font-size: 12px; color: var(--text2); font-weight: 700; flex: 1; min-width: 200px; line-height: 1.65; }
  .cookie-text strong { color: var(--y); }
  .cookie-dismiss { background: var(--y); color: #111; border: none; padding: 9px 22px; font-family: Nunito; font-size: 12px; font-weight: 900; cursor: pointer; border-radius: 8px; transition: background .2s; white-space: nowrap; flex-shrink: 0; }
  .cookie-dismiss:hover { background: var(--yd); }

  /* == MISSION PAGE == */
  .mission-page { max-width: 760px; margin: 0 auto; padding: 48px 24px 80px; }
  .mission-page h1 { font-family: 'Bebas Neue'; font-size: 40px; letter-spacing: 2px; margin-bottom: 6px; }
  .mission-page .mp-date { font-size: 11px; color: var(--muted); font-weight: 700; margin-bottom: 36px; }
  .mission-page h2 { font-family: 'Bebas Neue'; font-size: 20px; letter-spacing: 1px; color: var(--y); margin: 28px 0 8px; }
  .mission-page p { font-size: 13px; color: var(--text2); line-height: 1.85; font-weight: 600; margin-bottom: 10px; }
  .mission-page strong { color: var(--text); font-weight: 900; }

  /* == HERO PLATE SCENE (animated) == */
  .hero-plate-scene { width: 100%; max-width: 620px; height: auto; display: block; margin: 0 auto; }
  .cn-pulse-light { animation: cnPulseLight 2.8s ease-in-out infinite; }
  .cn-pulse-glow { animation: cnPulseGlow 2.8s ease-in-out infinite; }
  @keyframes cnPulseLight { 0%,100% { opacity: .82; } 50% { opacity: 1; } }
  @keyframes cnPulseGlow { 0%,100% { opacity: .25; } 50% { opacity: .6; } }
`;



const GLOSSARY = {
  "MSRP": "Manufacturer's Suggested Retail Price — the sticker price set by the manufacturer. Not what you should pay.",
  "F&I": "Finance & Insurance — the dealership office where add-ons and financing are presented after you agree on a vehicle price.",
  "CPO": "Certified Pre-Owned — a used vehicle that has passed a manufacturer inspection and includes an extended warranty. Programs vary widely by brand.",
  "APR": "Annual Percentage Rate — the true yearly cost of your loan, including interest and fees. Lower is better.",
  "MF": "Money Factor — the interest rate on a lease, expressed as a tiny decimal. Multiply by 2,400 to get the APR equivalent.",
  "Term": "Loan Term — the length of your loan in months (36, 48, 60, 72, 84). Longer terms mean lower monthly payments but more total interest paid over the life of the loan.",
  "GAP": "Guaranteed Asset Protection — covers the difference between what you owe on the loan and what insurance pays out if the car is totaled or stolen.",
  "OTD": "Out The Door price — the total amount you actually pay including vehicle price, taxes, fees, and any add-ons. Always negotiate OTD.",
  "D&H": "Dealer Handling fee — a prep and admin charge that varies by state. Cannot be negotiated as a line item, but a high D&H is leverage on vehicle price.",
  "Doc Fee": "Documentation Fee — the dealer's charge for paperwork processing. Some states cap it; others don't. High fees are common padding.",
  "ACV": "Actual Cash Value — what your trade-in is worth right now, as-is, with zero reconditioning factored in. The baseline the dealer starts from before marking it up for resale.",
  "PPI": "Pre-Purchase Inspection — an independent mechanic inspection before buying a used vehicle. Always worth it on private party and some dealer buys.",
  "Dealer Pack": "Pre-built costs rolled into a vehicle's price covering lot prep: oil/filter, inspection, transport mode removal. Already baked in before you negotiate.",
  "Straw Purchase": "Buying a vehicle on someone else's behalf, or financing under an identity that isn't the actual primary user. Serious legal risk for everyone involved — a reputable dealer will reject this.",
  "Co-Signer": "A creditworthy person who shares legal responsibility for the loan. A legitimate option if you can't qualify on your own — not to be confused with a straw purchase.",
  "Spot Delivery": "Releasing the vehicle before financing is fully funded. Common practice to keep deals moving, but understand your financing terms are not yet final.",
  "PPF": "Paint Protection Film — a clear protective layer applied to the paint. Legitimate product, but pricing varies widely. Independent installers are usually half the dealer price.",
  "VIN": "Vehicle Identification Number — the unique 17-character code that identifies a specific vehicle. Used to pull history reports and verify the car's background.",
};

function HeroPlateScene() {
  return (
    <svg className="hero-plate-scene" viewBox="0 0 700 420" role="img" aria-label="CNTROFR plate mounted on a car's rear trunk, brake lights softly pulsing">
      <defs>
        <linearGradient id="cnBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#232330"/>
          <stop offset="100%" stopColor="#121218"/>
        </linearGradient>
        <filter id="cnBlur" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="10"/></filter>
        <filter id="cnBlurSoft" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="6"/></filter>
      </defs>

      <ellipse cx="350" cy="396" rx="240" ry="17" fill="#000000" opacity="0.35"/>

      {/* Single continuous body silhouette -- shoulders flare out at the taillight zone, taper back at the bumper */}
      <path d="M280,58 L420,58 Q470,60 500,85 Q545,110 570,150 Q585,175 582,195 Q585,230 578,270 Q572,330 562,380 L138,380 Q128,330 122,270 Q115,230 118,195 Q115,175 130,150 Q155,110 200,85 Q230,60 280,58 Z" fill="url(#cnBody)" stroke="#34343f" strokeWidth="1.5"/>

      {/* Rear glass -- flat, no reflections, kept minimal */}
      <path d="M300,66 L400,66 L415,110 L285,110 Z" fill="#0a0a10" opacity="0.9"/>

      {/* Brake light glow, pulsing */}
      <g className="cn-pulse-glow">
        <ellipse cx="150" cy="205" rx="48" ry="44" fill="#E8342F" filter="url(#cnBlur)"/>
        <ellipse cx="550" cy="205" rx="48" ry="44" fill="#E8342F" filter="url(#cnBlur)"/>
        <rect x="215" y="156" width="270" height="9" rx="4.5" fill="#E8342F" filter="url(#cnBlurSoft)"/>
      </g>

      {/* Taillights -- traced along the body's own edge, flush with the silhouette, angular inner cut */}
      <g className="cn-pulse-light">
        <path d="M130,150 Q115,175 118,195 Q118,230 122,270 L185,255 L190,203 L175,158 Z" fill="#E8342F"/>
        <path d="M570,150 Q585,175 582,195 Q582,230 578,270 L515,255 L510,203 L525,158 Z" fill="#E8342F"/>
        <rect x="220" y="159" width="260" height="5" rx="2.5" fill="#FF5B52"/>
      </g>
      <path d="M140,175 L172,168" stroke="#FF9490" strokeWidth="2.5" opacity="0.45" strokeLinecap="round"/>
      <path d="M560,175 L528,168" stroke="#FF9490" strokeWidth="2.5" opacity="0.45" strokeLinecap="round"/>

      <image href="/cntrofrplate.svg" x="255" y="252" width="190" height="92" preserveAspectRatio="xMidYMid meet" />
    </svg>
  );
}

function JargonTip({ term }) {
  const def = GLOSSARY[term];
  if (!def) return <span>{term}</span>;
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:3}}>
      {term}
      <span className="tooltip-wrap">
        <span className="tooltip-icon">?</span>
        <span className="tooltip-bubble"><strong style={{color:"var(--y)",fontFamily:"Bebas Neue",letterSpacing:1,fontSize:12}}>{term}</strong><br/>{def}</span>
      </span>
    </span>
  );
}
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const HCAPTCHA_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY || "10000000-ffff-ffff-ffff-000000000001";

// Global language flag (read by ai() so every tool's AI responses honor it without prop drilling)
let CURRENT_LANG = "en";
export function setGlobalLang(l) { CURRENT_LANG = l; }

async function saveDeal(data) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/deals`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${SUPABASE_ANON_KEY}`, "Prefer": "return=minimal" },
      body: JSON.stringify(data)
    });
  } catch(e) {}
}

async function saveGapFlag(description) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/gap_flags`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${SUPABASE_ANON_KEY}`, "Prefer": "return=minimal" },
      body: JSON.stringify({ description, timestamp: new Date().toISOString() })
    });
  } catch(e) {}
}

async function saveToolRun(data) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/tool_runs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${SUPABASE_ANON_KEY}`, "Prefer": "return=minimal" },
      body: JSON.stringify({ ...data, timestamp: new Date().toISOString() })
    });
  } catch(e) {}
}

function AdminStats() {
  const [stats, setStats] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) { setErr("Supabase not configured"); setLoading(false); return; }
      try {
        const r = await fetch(`${SUPABASE_URL}/rest/v1/tool_runs?select=tool,timestamp`, {
          headers: { "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${SUPABASE_ANON_KEY}` }
        });
        const rows = await r.json();
        if (!Array.isArray(rows)) { setErr("Unexpected response"); setLoading(false); return; }
        const now = Date.now();
        const dayMs = 86400000;
        const byTool = {};
        let last24h = 0, last7d = 0;
        for (const row of rows) {
          byTool[row.tool] = (byTool[row.tool] || 0) + 1;
          const t = new Date(row.timestamp).getTime();
          if (now - t <= dayMs) last24h++;
          if (now - t <= dayMs * 7) last7d++;
        }
        setStats({ total: rows.length, byTool, last24h, last7d });
      } catch(e) { setErr(e.message); }
      setLoading(false);
    })();
  }, []);
  return (
    <div className="sec" style={{maxWidth:600}}>
      <h2 className="sec-h2" style={{marginBottom:24}}>Tool Usage</h2>
      {loading && <p style={{textAlign:"center",color:"var(--muted)"}}>Loading...</p>}
      {err && <p style={{textAlign:"center",color:"var(--red)"}}>{err}</p>}
      {stats && (
        <div>
          <div style={{display:"flex",gap:16,justifyContent:"center",marginBottom:32,flexWrap:"wrap"}}>
            <div style={{background:"var(--bg2)",border:"2px solid var(--b1)",borderRadius:12,padding:"16px 24px",textAlign:"center"}}>
              <div style={{fontFamily:"'Bebas Neue'",fontSize:32,color:"var(--y)"}}>{stats.total}</div>
              <div style={{fontSize:11,color:"var(--muted)",fontWeight:700}}>Total Runs (All Time)</div>
            </div>
            <div style={{background:"var(--bg2)",border:"2px solid var(--b1)",borderRadius:12,padding:"16px 24px",textAlign:"center"}}>
              <div style={{fontFamily:"'Bebas Neue'",fontSize:32,color:"var(--y)"}}>{stats.last24h}</div>
              <div style={{fontSize:11,color:"var(--muted)",fontWeight:700}}>Last 24 Hours</div>
            </div>
            <div style={{background:"var(--bg2)",border:"2px solid var(--b1)",borderRadius:12,padding:"16px 24px",textAlign:"center"}}>
              <div style={{fontFamily:"'Bebas Neue'",fontSize:32,color:"var(--y)"}}>{stats.last7d}</div>
              <div style={{fontSize:11,color:"var(--muted)",fontWeight:700}}>Last 7 Days</div>
            </div>
          </div>
          <div className="card"><div className="ch"><span className="clbl">By Tool</span></div><div className="cb">
            {Object.entries(stats.byTool).sort((a,b)=>b[1]-a[1]).map(([tool,count])=>(
              <div key={tool} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--b1)",fontSize:13,fontWeight:700}}>
                <span style={{color:"var(--text2)"}}>{tool}</span>
                <span style={{color:"var(--y)"}}>{count}</span>
              </div>
            ))}
          </div></div>
        </div>
      )}
    </div>
  );
}


function parseAndFlagGaps(responseText) {
  if (!responseText) return;
  const lines = responseText.split("\n");
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith("GAP:")) {
      const desc = trimmed.slice(4).trim();
      if (desc) saveGapFlag(desc);
    }
  });
}

async function parseStream(response, onChunk = null) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  let stopReason = null;
  let contentBlocks = [];
  let currentBlock = null;
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const data = JSON.parse(jsonStr);
        if (data.type === "content_block_start") {
          currentBlock = { type: data.content_block.type, id: data.content_block.id, name: data.content_block.name || "", text: "", input: "" };
        } else if (data.type === "content_block_delta" && currentBlock) {
          if (data.delta.type === "text_delta") { currentBlock.text += data.delta.text; text += data.delta.text; if (onChunk) onChunk(text); }
          else if (data.delta.type === "input_json_delta") { currentBlock.input += data.delta.partial_json; }
        } else if (data.type === "content_block_stop") {
          if (currentBlock) { contentBlocks.push({ ...currentBlock }); currentBlock = null; }
        } else if (data.type === "message_delta") {
          if (data.delta?.stop_reason) stopReason = data.delta.stop_reason;
        } else if (data.type === "error") {
          return { text: `Error: ${data.error?.message || "Unknown error"}`, stopReason: "error", contentBlocks: [] };
        }
      } catch(e) {}
    }
  }
  return { text, stopReason, contentBlocks };
}

async function ai(prompt, web = false, onChunk = null) {
  try {
    const finalPrompt = CURRENT_LANG === "es"
      ? `${prompt}\n\nIMPORTANT: Respond entirely in Spanish (Español). Translate all headers, labels, and analysis into natural, conversational Spanish suitable for a Spanish-speaking car buyer in the US. Keep dollar amounts and proper nouns (brand/model names) as-is.`
      : prompt;
    const body = { model: "claude-sonnet-4-6", max_tokens: 2000, stream: true, messages: [{ role: "user", content: finalPrompt }] };
    if (web) body.tools = [{ type: "web_search_20250305", name: "web_search" }];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90000);

    const r = await fetch("https://cntrofr.com/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    clearTimeout(timeout);

    const { text, stopReason, contentBlocks } = await parseStream(r, web ? null : onChunk);

    if (web && stopReason === "tool_use") {
      const preText = text;
      const toolUseBlocks = contentBlocks.filter(b => b.type === "tool_use");
      const toolResults = toolUseBlocks.map(tu => ({
        type: "tool_result",
        tool_use_id: tu.id,
        content: "Search completed."
      }));
      const assistantContent = contentBlocks.map(b =>
        b.type === "tool_use"
          ? { type: "tool_use", id: b.id, name: b.name, input: (() => { try { return JSON.parse(b.input || "{}"); } catch(e) { return {}; } })() }
          : { type: "text", text: b.text }
      );
      const body2 = {
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        stream: true,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [
          { role: "user", content: finalPrompt },
          { role: "assistant", content: assistantContent },
          { role: "user", content: toolResults }
        ]
      };
      const controller2 = new AbortController();
      const timeout2 = setTimeout(() => controller2.abort(), 90000);
      const r2 = await fetch("https://cntrofr.com/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body2),
        signal: controller2.signal
      });
      clearTimeout(timeout2);
      const { text: text2 } = await parseStream(r2, onChunk);
      return text2 || preText || "No results returned.";
    }

    return text || "No analysis returned. Please try again.";
  } catch(e) {
    if (e.name === "AbortError") return "Market scan unavailable right now -- ZIP searches can take up to 90 seconds. Try again or leave the ZIP blank for instant results.";
    return `Connection error: ${e.message}`;
  }
}

function MD({ text }) {
  if (!text) return null;
  const lines = text.split("\n"); const els = []; let k = 0;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.startsWith("## ")) els.push(<h2 key={k++}>{l.slice(3)}</h2>);
    else if (l.startsWith("### ")) els.push(<h3 key={k++}>{l.slice(4)}</h3>);
    else if (l.match(/^[-•*◆] /)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^[-•*◆] /)) items.push(<li key={k++}>{lines[i].replace(/^[-•*◆] /, "")}</li>), i++;
      i--; els.push(<ul key={k++}>{items}</ul>);
    } else if (!l.trim()) els.push(<div key={k++} style={{ height: 5 }} />);
    else els.push(<p key={k++}>{l}</p>);
  }
  return <div className="aout">{els}</div>;
}

function Res({ verdict, vc, text, onReset }) {
  const [copied, setCopied] = useState(false);
  const displayVerdict = verdict === "GO" ? "🟢 GREEN LIGHT" : verdict === "WALK AWAY" ? "🔴 WALK AWAY" : verdict === "NEGOTIATE" ? "🟡 NEGOTIATE" : verdict === "ANALYZING" ? "Analyzing..." : verdict;
  const copyResults = () => { navigator.clipboard.writeText(text||"").then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); }); };
  const savePDF = () => {
    const w = window.open("","_blank");
    const rows = (text||"").split("\n").map(l=>l.startsWith("## ")?"<h2>"+l.slice(3)+"</h2>":l.startsWith("### ")?"<h3>"+l.slice(4)+"</h3>":"<p>"+l+"</p>").join("");
    w.document.write("<html><head><title>CNTROFR Deal Analysis</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#333;line-height:1.7;}h2{color:#333;border-bottom:2px solid #FFD600;padding-bottom:4px;}h3{color:#666;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;}</style></head><body><h1>CNTROFR -- "+displayVerdict+"</h1><p style='color:#999;font-size:12px'>Generated "+new Date().toLocaleDateString()+" - cntrofr.com</p>"+rows+"</body></html>");
    w.document.close(); w.print();
  };
  return (
    <div className="card ranim">
      <div className="verdict-hero">
        <div className="verdict-label">Your Verdict</div>
        <div className={`verdict-badge-lg ${vc}`}>{displayVerdict}</div>
        <button className="verdict-new-btn" onClick={onReset}>← Run Another Deal</button>
      </div>
      <MD text={text} />
      {text && (
        <div style={{display:"flex",gap:10,padding:"12px 20px",borderTop:"1px solid var(--b1)",flexWrap:"wrap"}}>
          <button className="ghost-btn" onClick={copyResults}>{copied?"✓ Copied!":"📋 Copy Results"}</button>
          <button className="ghost-btn" onClick={savePDF}>📄 Save as PDF</button>
        </div>
      )}
    </div>
  );
}

function CookieBanner() {
  const [show, setShow] = useState(() => {
    try { return !sessionStorage.getItem("cookie_dismissed"); }
    catch { return true; }
  });
  if (!show) return null;
  return (
    <div className="cookie-banner">
      <div className="cookie-text"><strong>This website doesn't want your cookies.</strong> You're welcome. No tracking, no ad networks, no behavioral data. Just the tools you came for.</div>
      <button className="cookie-dismiss" onClick={()=>{ try { sessionStorage.setItem("cookie_dismissed","1"); } catch {} setShow(false); }}>Got It ✓</button>
    </div>
  );
}

const STAGES = [
  "Pulling deal data",
  "Cross-referencing market intel",
  "Analyzing dealer tactics",
  "Building your counter",
  "Applying insider knowledge",
  "Scanning current sales techniques",
  "Finalizing your scripts",
  "Almost there",
];

function Loading({ msg, web }) {
  const [pct, setPct] = useState(2);
  const [stageIdx, setStageIdx] = useState(0);
  useEffect(() => {
    const target = web ? 92 : 88;
    const interval = setInterval(() => {
      setPct(p => {
        if (p >= target) return p;
        const remaining = target - p;
        const step = Math.max(0.4, remaining * 0.045);
        return Math.min(target, p + step);
      });
      setStageIdx(i => {
        const newPct = pct;
        const stagePos = Math.floor((newPct / 100) * STAGES.length);
        return Math.min(stagePos, STAGES.length - 1);
      });
    }, 380);
    return () => clearInterval(interval);
  }, [pct, web]);
  return (
    <div className="card">
      <div className="loadbox">
        <div className="spin" />
        <div className="progress-wrap">
          <div className="progress-stage">{msg || STAGES[stageIdx]}</div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{width: pct+"%"}} />
          </div>
          <div className="progress-pct">{Math.floor(pct)}%</div>
          <div className="progress-disclaimer">
            {web ? "Live web search active -- ZIP searches can take up to 90 seconds." : "AI analysis typically takes 10-20 seconds. Hang tight."}
          </div>
          <div className="dont-close-warn">⚠ Do not close or refresh this window -- your analysis is in progress</div>
        </div>
      </div>
    </div>
  );
}

// ── Loan math (APR / Term calculator) ────────────────────────────────────────
// Standard amortization. No credit advice -- just arithmetic on numbers the
// buyer provides plus the live rate data we already pulled.
function monthlyPayment(principal, aprPct, termMonths) {
  const r = (aprPct / 100) / 12;
  if (!principal || !termMonths) return 0;
  if (r === 0) return principal / termMonths;
  const pow = Math.pow(1 + r, termMonths);
  return principal * (r * pow) / (pow - 1);
}
function loanMath({ principal, aprPct, termMonths }) {
  const pmt = monthlyPayment(principal, aprPct, termMonths);
  const total = pmt * termMonths;
  const interest = total - principal;
  return { payment: pmt, totalPaid: total, totalInterest: interest };
}
function fmtMoney(n) {
  if (!isFinite(n)) return "--";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
// Shared by the results card render AND the run() save-to-Supabase logic,
// so the displayed number and the catalogued number can never drift apart.
function computeLoanSavings(f, finRate) {
  if (!finRate || !f.apr || !f.term) return null;
  const num = v => parseFloat(String(v||"0").replace(/[$,]/g,"")) || 0;
  const parsePct = str => { const m = String(str||"").match(/[\d.]+/); return m ? parseFloat(m[0]) : null; };
  const principal = Math.max(0, num(f.offer) - (num(f.tradeIn) - num(f.tradeOwed)));
  const aprNum = parseFloat(f.apr);
  const termNum = parseInt(f.term, 10);
  if (!principal || !aprNum || !termNum) return null;
  const oemNum = finRate.oem_rate && finRate.oem_rate !== "null" ? parsePct(finRate.oem_rate) : null;
  const greenNum = finRate.green ? parsePct(finRate.green.avg) : null;
  const compareRate = oemNum ?? greenNum;
  const compareLabel = oemNum ? "Manufacturer Incentive Rate" : "Excellent Credit Average";
  if (!compareRate) return null;
  const yours = loanMath({ principal, aprPct: aprNum, termMonths: termNum });
  const best = loanMath({ principal, aprPct: compareRate, termMonths: termNum });
  return { principal, aprNum, termNum, compareRate, compareLabel, yours, best, monthlyDiff: yours.payment - best.payment, interestDiff: yours.totalInterest - best.totalInterest };
}

function DealAnalyzer({ ftb = false, paid = false, tier = "free", onBuy = null }) {
  const [f, setF] = useState({ year:"", vehicle:"", msrp:"", offer:"", trim:"", mileage:"", tradeIn:"", tradeOwed:"", addons:"", notes:"", zip:"", owners:"", packages:"", apr:"", term:"" }); const [condition, setCondition] = useState("used"); const [accidentReported, setAccidentReported] = useState(false); const [accidentSeverity, setAccidentSeverity] = useState("");
  const [loading, setL] = useState(false); const [loadMsg, setLM] = useState(""); const [res, setR] = useState(null); const [market, setM] = useState(null); const [v, setV] = useState(""); const [finRate, setFR] = useState(null);
  const [hcToken, setHcToken] = useState("");
  const [finalOffer, setFinalOffer] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const captchaRef = useRef(null);
  // ── Quote Scanner state ──────────────────────────────────────────────────
  const [scanAttempts, setScanAttempts] = useState(0);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanMsg, setScanMsg] = useState("");
  const [scanSuccess, setScanSuccess] = useState(false);
  const scanEnabled = (tier === "pro" || tier === "ftb") && !submitted;
  const MAX_SCAN_ATTEMPTS = 3;
  const s = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  // ── Quote Scanner handler ────────────────────────────────────────────────
  const handleScan = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setScanLoading(true);
    setScanMsg("");
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.onerror = () => rej(new Error("Read failed"));
        r.readAsDataURL(file);
      });
      const isPdf = file.type === "application/pdf";
      const mediaType = isPdf ? "application/pdf" : file.type || "image/jpeg";
      const body = {
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        messages: [{
          role: "user",
          content: [
            isPdf
              ? { type: "document", source: { type: "base64", media_type: mediaType, data: base64 } }
              : { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
            { type: "text", text: `You are an expert at reading automotive dealer quotes from any dealership management system (DMS). This document may be from Reynolds & Reynolds, CDK Global, Dealertrack, VinSolutions, Tekion, DealerSocket, or any other dealer system. It may be a printed/scanned worksheet, a PDF export, a screenshot, or a photo taken in a showroom.

Your job is to extract deal information regardless of layout, formatting, font style, or document structure. Common layouts include:
- Reynolds & Reynolds: stacked sections (VEHICLE / TRADE IN / pricing table with line items)
- CDK Global: grid-style layout, sometimes multi-column
- Dealertrack: finance-focused, payment breakdowns, F&I product lines
- VinSolutions: email-style summary sheet, informal structure
- Tekion: clean modern digital format
- Printed worksheets: handwritten or typed, may have crossed-out numbers

Look for these fields anywhere in the document, in any order or layout:

VEHICLE being purchased:
- Year (4-digit number near vehicle description)
- Make and Model (e.g. "Porsche 911", "Honda Accord", "Ford F-150")
- Trim/Type (e.g. "GT3", "EX-L", "Lariat") — often on a separate "Type:" line
- VIN (17-character alphanumeric)
- Mileage/Odometer (numbers near "Miles", "Mileage", "Odometer")
- Color

PRICING (look for these exact or similar labels):
- MSRP / Sale Price / Sticker Price / List Price
- Selling Price / Offer / Agreed Price / Trade Difference
- Doc Fee / Documentary Fee / Processing Fee / Admin Fee
- Dealer Fee / Handling Fee / Prep Fee
- Tax / Sales Tax
- Tag and Title / Registration / Government Fees
- Add-ons / Accessories / Dealer Installed / Protection Products
- Trade Allowance / Trade Value / ACV
- Trade Payoff / Lien Payoff
- Net Price / Balance Forward / Total Due
- Cash Deposit / Down Payment

DEALER INFO:
- Dealer name (usually at top of document)
- City and State

Return ONLY this JSON object — no preamble, no markdown backticks, no explanation:
{
  "year": "",
  "vehicle": "",
  "trim": "",
  "msrp": "",
  "offer": "",
  "mileage": "",
  "addons": "",
  "notes": "",
  "dealerName": "",
  "dealerCity": "",
  "dealerState": "",
  "docFee": "",
  "tradeValue": "",
  "tradePayoff": "",
  "tax": ""
}

Extraction rules:
- "vehicle" = Make and Model ONLY, no year, no trim (e.g. "Porsche 911" not "2018 Porsche 911 GT3")
- "offer" = the vehicle selling/asking price. Look for: "Sale Price", "Selling Price", "MSRP/Sale Price", "Agreed Price", "Vehicle Price". On Reynolds & Reynolds worksheets this is often labeled "MSRP/Sale Price" at the top of the pricing section. Do NOT use "Trade Difference", "Net Price", "Balance Forward", or "Total Due" for this field — those are calculated totals, not the vehicle price. Numbers only, no $ or commas
- "msrp" = sticker/list price, numbers only
- "mileage" = odometer reading, numbers only
- "docFee" = documentary/processing/admin fee amount, numbers only
- "year" = 4-digit model year of the vehicle being purchased (not the trade-in)
- "trim" = trim level only. On Reynolds & Reynolds look for a "Type:" line below the vehicle name (e.g. "GT3 2dr Rear-wheel Drive Coupe" → extract "GT3" only). On other systems look for trim/package designation. Do not include body style or drive type
- "tradeValue" = trade-in allowance/ACV, numbers only
- "tradePayoff" = trade payoff/lien amount, numbers only
- "tax" = sales tax amount, numbers only
- "addons" = comma-separated list of any add-on products, accessories, protection packages, or dealer-installed items
- "notes" = any other fees, special terms, or notable line items not captured above
- If a field is not clearly visible or not present, return empty string — do NOT guess or infer
- Numbers only in numeric fields — strip all $, commas, and spaces` }
          ]
        }]
      };
      // Scanner uses dedicated non-streaming endpoint for clean JSON extraction
      const resp = await fetch("/api/scan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `API ${resp.status}`);
      }
      const data = await resp.json();
      const textBlock = data.content?.find(b => b.type === "text");
      const raw = textBlock?.text || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const extracted = JSON.parse(clean);
      const hasAnyData = extracted.vehicle || extracted.offer || extracted.msrp || extracted.year || extracted.dealerName;
      if (!hasAnyData) throw new Error("Could not extract deal data");
      setF(prev => ({
        ...prev,
        year: extracted.year || prev.year,
        vehicle: extracted.vehicle || prev.vehicle,
        trim: extracted.trim || prev.trim,
        msrp: extracted.msrp || prev.msrp,
        offer: extracted.offer || prev.offer,
        mileage: extracted.mileage || prev.mileage,
        addons: extracted.addons || prev.addons,
        notes: [
          extracted.notes,
          extracted.docFee ? `Doc Fee: $${extracted.docFee}` : "",
          extracted.tax ? `Tax: $${extracted.tax}` : "",
        ].filter(Boolean).join(" | ") || prev.notes,
        dealerName: extracted.dealerName || prev.dealerName,
        dealerCity: extracted.dealerCity || prev.dealerCity,
        dealerState: extracted.dealerState || prev.dealerState,
        tradeIn: extracted.tradeValue || prev.tradeIn,
        tradeOwed: extracted.tradePayoff || prev.tradeOwed,
      }));
      setScanSuccess(true);
      setScanMsg(ftb
        ? "✓ Quote scanned! We filled in what we could find. Take a quick look below and correct anything that looks off — you know your deal better than anyone."
        : "✓ Quote scanned and pre-filled. Review the fields below and correct anything before running your analysis."
      );
    } catch {
      const next = scanAttempts + 1;
      setScanAttempts(next);
      if (next === 1) {
        setScanMsg(ftb
          ? "We couldn't quite read that one. No worries — try a flat, well-lit photo or an exported PDF from the dealer's email."
          : "We couldn't read that clearly. Try a flat, well-lit photo or an exported PDF from the dealer's system."
        );
      } else if (next === 2) {
        setScanMsg(ftb
          ? "Still having a little trouble reading it. A PDF from the dealer's email or portal works best. Or you can fill in the fields below — it only takes a minute and we'll walk you through it! 👇"
          : "Still having trouble? A PDF export from the dealer's email or portal works best. Or jump straight to manual entry below — it's just as fast."
        );
      } else {
        setScanMsg(ftb
          ? "No stress at all — filling in the fields below is actually the most accurate way to go, and we'll guide you through every step. You've got this! 👇"
          : "Manual entry is the most accurate path — and it only takes 2 minutes. Fill in what you know below and we'll handle the rest."
        );
      }
    } finally {
      setScanLoading(false);
    }
  };
  useEffect(() => {
    window.onHcVerify = token => setHcToken(token);
    window.onHcExpire = () => setHcToken("");
    const tryRender = () => {
      if (window.hcaptcha && captchaRef.current && !captchaRef.current.dataset.rendered) {
        captchaRef.current.dataset.rendered = "true";
        window.hcaptcha.render(captchaRef.current, {
          sitekey: HCAPTCHA_KEY,
          callback: "onHcVerify",
          "expired-callback": "onHcExpire"
        });
      }
    };
    window.onHcLoad = tryRender;
    if (!document.getElementById("hcaptcha-script")) {
      const sc = document.createElement("script");
      sc.id = "hcaptcha-script";
      sc.src = "https://js.hcaptcha.com/1/api.js?render=explicit&onload=onHcLoad";
      sc.async = true; sc.defer = true;
      document.head.appendChild(sc);
    }
    if (window.hcaptcha) {
      tryRender();
    } else {
      const iv = setInterval(() => { if (window.hcaptcha) { tryRender(); clearInterval(iv); } }, 200);
      return () => clearInterval(iv);
    }
  }, []);
  const run = async () => {
    setL(true); setR(null); setM(null); setV("ANALYZING");
    setLM("Analyzing your deal...");
    if (window.hcaptcha) window.hcaptcha.reset(); setHcToken("");
    const t = await ai(`Car deal analyst. You are writing for a regular car buyer -- not a car industry professional. Use plain, direct language. Never use industry jargon without immediately explaining it in the same sentence. Be direct -- state facts, give scripts, move on. No hedging.

CNTROFR KNOWLEDGE BASE -- apply this expertise in every analysis:

DOC FEES: Actual dealer cost is $50-80 in labor/materials. Everything above that is profit. Most states require dealers to charge all customers the same fee (audit compliance) so the fee itself cannot be negotiated down -- but a high doc fee IS leverage on vehicle price. National average is $490. Colorado benchmark is $699 -- one of the highest in the region. Above $700 in Colorado = flag. Script: "Your doc fee is $X above state average -- I'd like that reflected in the vehicle price."

F&I PRODUCTS -- dealer cost vs. retail:
- Extended Warranty (VSC): dealer cost $300-800, retail $1,500-4,000. Sometimes worth it on high-mileage used vehicles -- but always buy from credit union or third party (Endurance, CARCHEX), never dealer.
- GAP Insurance: dealer cost $50-200, retail $400-900. Worth it if financing over 80% LTV -- but buy from your insurance company or credit union for $20-40/year, not the dealer at 500%+ markup.
- Credit Life/Disability: almost never worth it -- existing life/disability insurance usually covers this.
- Paint/Fabric Protection: dealer cost $50-100, retail $300-800. A can of Scotchgard ($8) does the same thing. Never worth it.
- Tire & Wheel Protection: situational -- read fine print for pothole exclusions and deductibles.
- Key Replacement: third-party services cover this for a fraction of dealer price.
- Nitrogen Tires: zero real-world benefit over regular air. Pure profit play. Always decline.

ADD-ONS -- dealer markup by category:
- Paint sealant: dealer cost $50-150, charges $300-800 (300-500% markup)
- Window tinting: dealer charges $300-600, shop price $150-250 (100-200% markup)
- GPS/alarm: dealer charges $400-900, installed elsewhere $100-300 (200-400% markup)
- VIN etching: dealer charges $200-400, DIY kit $10-20 (1000%+ markup)
- Wheel locks: dealer charges $100-200, Amazon $20-40 (300-500% markup)
"Already installed" is not a reason to pay -- dealers pre-install these betting buyers won't push back. Script: "I didn't agree to these add-ons. I'd like them removed from the price or reflected as a vehicle discount."

FINANCING: Finance managers are paid on backend gross profit. Rate markup (dealer reserve) is the difference between the buy rate (what the lender approves) and what the dealer quotes you. On a $30,000 loan, a 2% markup costs $1,500-2,000 over the life of the loan. Always get pre-approved externally before visiting a dealer. Script: "I have pre-approval at X% -- can you beat that?"

DEALER HANDLING FEE: Cannot be negotiated as a line item (dealers must charge all customers equally for audit compliance). Use a high handling fee as leverage on vehicle price instead. Fee is posted in store by law.

STATE FEES: Registration, title, and state taxes are non-negotiable government fees, usually under $50. Never push back on these -- they go to the state, not the dealer.
Key facts: Dealers often sell below their stated cost through manufacturer bonuses and end-of-month sales targets -- "we're at invoice" is almost never the full story. The buyer should always make a specific offer, never ask what the dealer will accept. If a dealer tries to change your interest rate based on which add-on products you buy, that is illegal unless your lender specifically requires it. If you feel pressured to decide on the spot, leaving and following up in writing always works in your favor. Market conditions in summer 2026 favor buyers -- demand is softening, off-lease inventory is increasing, and incentive financing is returning. Buyers have more leverage than they have had in years. Use it.
2026 INTELLIGENCE UPDATE: Dealer sales teams are now AI-trained on 50+ buyer objection scenarios -- expect more polished, rehearsed pushback than ever. F&I is now the primary profit center as front-end margins shrink -- more pressure on products this summer than any prior year. Watch for the daily cost framing tactic ("just $1.50 a day") -- always convert to total cost and flag it. Destination fees have exploded in 2026, ranging from $1,150 to $3,250 depending on brand -- these are manufacturer-set and non-negotiable, but they must be disclosed upfront and cannot be hidden or bundled with other fees. Flag any attempt to obscure them. Pre-Delivery Inspection fees are pure junk -- manufacturers already pay dealers for PDI through the destination charge. Any separate "Vehicle Prep Fee" or "Predelivery Service Fee" on a new car is double billing. The FTC warned 97 dealer groups in March 2026 about hidden fees and advertised vehicles that don't exist. Any fee not disclosed before negotiation begins is a red flag. Watch for the porcupine close -- salesperson answers every objection with a question that assumes the sale ("would you want it in black or silver?"). Respond by returning to price. Watch for the puppy dog close -- dealer suggests taking the car home overnight to build emotional attachment before price is agreed. Do not accept delivery until all numbers are finalized in writing.
PRICING FORMAT RULE: Any price stated in counter scripts must always be written as "$X++" where the first + represents state taxes and the second + represents dealer fees. Example: "$22,800++" not "$22,800 out the door." This is because dealers cannot pay the buyer's taxes and must show fees as separate line items by law. Never write a flat out-the-door number without the ++ notation. Always explain to the buyer that ++ means taxes and fees are added on top.
FACTORY PACKAGES RULE: If factory packages are listed, calculate their approximate MSRP value and factor that into the price analysis. A vehicle with $8,000 in factory packages has a different negotiation floor than a base model. Call out specifically which packages are adding the most value and whether the asking price reflects them fairly. For custom orders, packages are non-negotiable on the front end but should be used to establish the true value baseline for F&I and fee analysis.
${f.dealerName ? `Dealer: ${f.dealerName}${f.dealerCity ? ", "+f.dealerCity : ""}${f.dealerState ? " "+f.dealerState : ""}` : "Dealer: not specified"}
${f.year} ${f.vehicle}${f.trim ? " -- "+f.trim : ""} | ${condition.toUpperCase()}${condition==="cpo"?" (CPO)":condition==="custom"?" (CUSTOM ORDER)":condition==="buyout"?" (LEASE BUYOUT)":""} | ${condition==="new"||condition==="custom"?"Factory order -- no odometer":condition==="buyout"?"Lease buyout -- residual price $"+(f.offer||"n/a"):f.mileage?f.mileage+" mi":"Mileage n/a"}${f.owners && condition==="used" ? " | "+f.owners+" previous owner(s)" : ""}${condition==="new" ? " | Sticker price $"+(f.msrp||"n/a") : condition==="custom"||condition==="buyout" ? "" : f.msrp ? " | Listed $"+f.msrp : ""} | ${condition==="buyout"?"Residual (locked)":"Asking"} $${f.offer||"n/a"}${f.packages ? " | Factory packages: "+f.packages : ""}
Trade-in value offered: $${f.tradeIn||"none"} | Amount still owed on trade: $${f.tradeOwed||"none"}
Add-ons: ${f.addons||"none"} | Notes: ${f.notes||"none"}
${condition==="cpo"?"This is a Certified Pre-Owned vehicle -- verify what the manufacturer certification actually covers, mileage and age limits, what is excluded from coverage, and that a service manager has signed off on the inspection checklist.":""}
${condition==="custom"?"This is a custom factory order. The buyer has already committed to a specific vehicle configuration. Price leverage on the vehicle itself is limited -- the analysis should focus entirely on F&I products, add-ons, delivery protection, fees, and financing. Do not analyze the vehicle price as negotiable. Do focus on everything that happens after the vehicle price is locked.":""}
${condition==="buyout"?`This is a LEASE BUYOUT. The residual price listed is contractually set in the original lease agreement -- it is NOT negotiable and should NOT be analyzed for fairness or market comparison. Do not suggest the buyer counter on price. Do not run a market scan. The analysis must focus EXCLUSIVELY on:
1. F&I PRODUCTS -- Every product the finance office presents. Decode each one at dealer cost vs. retail. The buyer already knows this car -- extended warranties may actually make sense here if the vehicle is approaching end of manufacturer warranty. Explain why or why not specifically.
2. FORCE ADDS -- Any dealer-installed add-ons, accessories, or packages the dealer claims are mandatory or already installed. These are almost always negotiable or removable. Call each one out directly.
3. FEES -- Doc fee, dealer fee, acquisition fee (this should have been paid at lease signing -- if it appears again, flag it as potential double billing), any new fees that were not in the original lease agreement.
4. FINANCING -- If the buyer is financing the buyout through the dealer, the interest rate markup is fully negotiable. Explain how to get pre-approved externally and use that as leverage.
5. WHAT NOT TO DO -- Common mistakes lease buyout buyers make in the F&I office because they feel comfortable with the car and let their guard down.`:""}
${condition==="buyout"?"VERDICT: For lease buyouts, skip the GO/NEGOTIATE/WALK verdict on price. Instead give a PROCEED / CAUTION / STOP verdict based solely on whether the F&I, fees, and add-ons are clean or predatory.":""}
## SEVERITY CALL -- Pick exactly ONE header below based on real dollar impact relative to the size of this deal, not vibes. A single line item that's roughly $100-400 over benchmark, or under ~1% of the vehicle price, is NOT extreme -- most buyers won't blink at that on any deal size, small or large. Reserve the top tier for things that would actually cost a buyer real money if they signed without catching it.
- Use "## SLIGHTLY ABOVE AVERAGE" when one or more items are modestly over benchmark (roughly $100-400 total, or under ~1% of vehicle price). State it in one calm, matter-of-fact sentence. This will be the most common outcome -- most deals have something a little off, and that's normal, not alarming.
- Use "## CAUTION" for a single clearly negotiable item in the ~$400-1,500 range, or a pattern worth pushing back on (e.g. a financing rate markup of 1-2 points above buy rate).
- Use "## EXTREME WARNING" only for stacked red flags, predatory F&I markup (2+ point rate markup, warranties marked up 300%+), illegal practices, or a single item exceeding ~$1,500 or ~2% of vehicle price. This should be rare -- reserve it for something a buyer would genuinely regret missing.
If nothing rises even to "slightly above average," omit this section entirely.
## OVERALL VERDICT -- GO, NEGOTIATE, or WALK AWAY. One sentence in plain English.
${f.dealerName ? `## DEALER INTEL -- If you recognize this dealer as part of a major corporate group (AutoNation, Lithia, Asbury, Penske, Sonic, Holman, or similar), briefly note it in one plain sentence and explain what corporate-owned dealerships typically means for the buyer's negotiating experience. If you do not recognize the dealer or cannot confirm the parent company, skip this section entirely.` : ""}
${condition!=="custom" && condition!=="buyout" ? `## VEHICLE PRICE -- Is this price fair? How much room is left to negotiate? If mileage is high, explain how that affects the vehicle's value in plain terms.` : condition==="custom" ? "## DELIVERY & FEES -- What fees are standard at delivery for a custom order and which are negotiable? Flag anything that should have been agreed to in writing before the order was placed." : "## FORCE ADDS -- List every dealer-installed add-on or accessory the buyer is being charged for. Is each one mandatory or negotiable? What is the dealer's actual cost vs. what they are charging?"}
## TRADE-IN -- Is the trade-in offer fair or too low? If the buyer owes more than the car is worth, explain that clearly in plain language.
## ADD-ONS -- For each add-on: Worth It / Overpriced / Skip It. Explain why in one plain sentence.
## YOUR COUNTER -- 3-4 word-for-word scripts the buyer can say out loud. Make them specific dollar offers, not questions.
## RED FLAGS -- Call out any dealer pressure tactics, illegal practices, unsupported claims, or anything that should only be agreed to in writing.
${paid ? `## FINANCING INTELLIGENCE -- Based on current market rates for ${condition==="new"||condition==="custom"?"new":condition==="cpo"?"certified pre-owned":condition==="buyout"?"lease buyout":"used"} vehicles:
- What credit tier does the dealer's quoted rate of ${f.offer?"(see deal terms)":"[not provided]"} suggest the buyer is being placed in?
- Is the quoted rate above market average for any credit tier? If so, how much above and what is that costing the buyer monthly and over the loan term?
- What should the buyer say if the dealer tries to change the rate after they've agreed on a price?
- One sentence recommendation on external pre-approval.` : ""}
${ftb ? `## FIRST TIME BUYER GUIDE
- DOWN PAYMENT -- What is a healthy down payment for this deal? What is the minimum to avoid immediately owing more than the car is worth? Explain in plain dollar terms.
- MONTHLY PAYMENT REALITY CHECK -- Give a simple rule of thumb for what monthly payment range makes sense based on a responsible budget. No industry acronyms.
- SETTING UP YOUR LOAN PAYMENT ONLINE -- After signing, how does the buyer set up their account with the lender to make payments? What should they expect: online portal, automatic payments, bank transfer setup, payment due dates.
- REGISTRATION AND PLATES -- What happens after they drive off the lot? Explain temporary tags, how long permanent plates take, and what it means when the dealer says they handle registration.
- WHAT TO EXPECT AT SIGNING -- A brief plain-language rundown so nothing at the signing table catches them off guard.` : ""}
No interest rate or monthly payment recommendations.
If any add-on, fee, or product in this deal is something you cannot fully evaluate or have not encountered before, include a line formatted exactly as: GAP: [item name] -- [brief reason you could not fully evaluate it]
${finalOffer ? `## FINAL OFFER MODE -- ACTIVATED
The dealer has stated this is their best price or the buyer is about to enter the finance office. Shift to maximum protection mode.
## LAST MOVE -- Give 2 word-for-word final counter scripts. Specific dollar offers written as "$X++" (++ = taxes and fees on top, which the dealer cannot waive). Not questions. Statements.
## FINANCE OFFICE ALERT -- What the F&I manager will try in the next 30 minutes. Word-for-word responses to the most common pressure plays.
## WALK TRIGGER -- Is there anything in this deal that should stop the buyer from signing right now? Answer directly: yes or no, and why.
## FINAL CHECKLIST -- 5 things to verify before ink hits paper.` : ""}`, false, chunk => setR(chunk));
    const m = t.match(/VERDICT[^:]*:\s*(GO|NEGOTIATE|WALK\s*AWAY)/i);
    setV(m ? m[1].trim().toUpperCase() : "COMPLETE"); setR(t);
    parseAndFlagGaps(t);
    saveDeal({
      make: f.vehicle ? f.vehicle.split(" ")[0] : null,
      model: f.vehicle ? f.vehicle.split(" ").slice(1).join(" ") : null,
      year: f.year ? f.year.toString().replace(/\D/g, "") || null : null,
      condition,
      zip: f.zip || null,
      asking_price: f.msrp ? f.msrp.toString().replace(/[$,]/g, "") || null : null,
      offer_price: f.offer ? f.offer.toString().replace(/[$,]/g, "") || null : null,
      add_ons: f.addons || null,
      mileage: f.mileage ? f.mileage.toString().replace(/,/g, "") || null : null,
      trim_level: f.trim || null,
      accident_severity: f.accidentSeverity || null,
      owners: f.owners || null,
      dealer_name: f.dealerName || null,
      dealer_city: f.dealerCity || null,
      dealer_state: f.dealerState || null,
    });
    if (f.zip && f.year && f.vehicle && condition !== "buyout") {
      setLM("Scanning nearby dealer prices...");
      await new Promise(r => setTimeout(r, 3000));
      const mkt = await ai(`Car market pricing analyst. You are writing for a regular car buyer who wants to know if the price they are being quoted is fair compared to what other dealers are charging. Use plain language. Do not narrate your search process or thinking. Output ONLY the final structured analysis starting directly with the first ## header. No preamble, no process commentary.
Search for current ${condition==="new"||condition==="custom"?"new":condition==="cpo"?"certified pre-owned":"used"} ${f.year} ${f.vehicle}${f.trim ? " "+f.trim : ""} listings near zip code ${f.zip}. Find 3-5 dealer listings within 150 miles${f.mileage ? ", with similar mileage to "+f.mileage : ""}.

## MARKET VERDICT -- Is $${f.offer} above, at, or below what other dealers are charging for the same vehicle right now? State it plainly.
## COMPARABLE LISTINGS -- List each comparable vehicle found: dealer name, city, price, and mileage. Plain and readable.
## HOW TO USE THIS -- The exact words the buyer can say at the dealership to use these comparisons as negotiating leverage.
## BOTTOM LINE -- What should this buyer realistically expect to pay based on current market data?`, true);
      setM(mkt);
    }
    setL(false); setLM("");
    // ── Live Financing Rate Intelligence ──────────────────────────────────
    let liveFinRate = null;
    try {
      setLM("Pulling live financing rates...");
      const vehicle = `${f.year||""} ${f.vehicle||""}`.trim();
      const isNew = condition==="new"||condition==="custom";
      const isCPO = condition==="cpo";
      const isBuyout = condition==="buyout";
      const make = f.vehicle ? f.vehicle.split(" ")[0] : "";
      const ratePrompt = `You are a live auto financing rate analyst. Search for current auto loan rates and manufacturer incentive programs. Return ONLY a JSON object, no markdown, no preamble.

Vehicle context: ${vehicle || "unknown"}, ${condition} condition, asking price $${f.offer || "unknown"}
${f.offer && parseFloat(f.offer) > 100000 ? "IMPORTANT: This is a high-value specialty/luxury/exotic vehicle. Lenders treat these differently — rates are typically 1-3% higher than standard used vehicles, some lenders cap loan amounts or require larger down payments, and specialty lenders (JM Associates, Woodside Credit, USAA, PenFed) may offer better terms than traditional banks for collector/performance vehicles." : ""}

Search for:
1. Current average auto loan APRs by credit tier specifically for ${isNew?"new":isCPO?"certified pre-owned":"used"} vehicles priced ${f.offer && parseFloat(f.offer) > 100000 ? "above $100,000 (high-value/luxury/exotic)" : "in the standard market"} (June 2026)
2. ${isNew&&make?`Current ${make} manufacturer financing incentives and special APR programs for ${vehicle}`:""}
3. ${isBuyout&&make?`${make} lease buyout financing policy -- does ${make} require buyout through their captive lender or allow outside financing?`:""}

Return this exact JSON structure:
{
  "green": { "label": "Excellent Credit (750-850+)", "range": "X.X% - X.X%", "avg": "X.X%", "note": "one sentence tip" },
  "yellow": { "label": "Good Credit (680-749)", "range": "X.X% - X.X%", "avg": "X.X%", "note": "one sentence tip" },
  "red": { "label": "Fair/Building (580-679)", "range": "X.X% - X.X%", "avg": "X.X%", "note": "one sentence tip" },
  "oem_rate": "${isNew&&make?`Current ${make} incentive rate if available, or null`:"null"}",
  "oem_program": "${isNew&&make?`Brief description of current OEM program or null`:"null"}",
  "buyout_restriction": "${isBuyout&&make?`true if ${make} requires captive lender only, false if outside financing allowed, null if unknown`:"null"}",
  "buyout_note": "${isBuyout?`One sentence about buyout financing options for ${make||"this manufacturer"}`:"null"}",
  "condition": "${condition}",
  "as_of": "current month and year",
  "disclaimer": "Rates based on current national averages. Verify directly with your lender. Subject to change."
}`;

      const rateBody = {
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: ratePrompt }]
      };
      const rateResp = await fetch("/api/scan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(rateBody) });
      if (rateResp.ok) {
        const rateData = await rateResp.json();
        const textBlock = rateData.content?.find(b => b.type === "text");
        const rateRaw = textBlock?.text || "";
        try {
          const clean = rateRaw.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(clean);
          setFR(parsed);
          liveFinRate = parsed;
        } catch { setFR(null); }
      }
    } catch { setFR(null); }
    setLM(""); setL(false);
    // Catalog realized savings (not the raw APR/term inputs themselves) for future reporting.
    const savings = paid ? computeLoanSavings(f, liveFinRate) : null;
    const moneySaved = savings && savings.interestDiff > 0.5 ? Math.round(savings.interestDiff) : null;
    saveToolRun({ tool: "deal_analyzer", tier, final_offer: finalOffer, condition, zip: f.zip||null, vehicle: f.vehicle||null, money_saved: moneySaved });
    if (tier === "single") setSubmitted(true);
  };
  const vc = v => /^GO/.test(v) ? "vg" : /WALK/.test(v) ? "vr" : /NEG/.test(v) ? "vy" : "vx";
  return (
    <div>
      {!paid && onBuy && (
        <div style={{position:"fixed",bottom:24,right:16,zIndex:500,filter:"drop-shadow(0 4px 20px rgba(255,214,0,.4))"}}>
          <div className="sticky-upgrade-wrap">
            <button className="hbtn-y" style={{padding:"13px 22px",fontSize:13,fontWeight:900,borderRadius:12}} onClick={onBuy}>⚡ Upgrade to Pro — $49</button>
            <div className="sticky-tooltip">
              <div style={{marginBottom:8,fontSize:12,fontWeight:900,color:"var(--y)"}}>📄 Snap your dealer quote. Get your counter in seconds.</div>
              <strong>All 6 tools unlocked:</strong>
              <ul style={{margin:"6px 0 0",paddingLeft:16,lineHeight:1.8}}>
                <li>Quote Scanner — upload your dealer quote</li>
                <li>Deal Analyzer — full breakdown</li>
                <li>Fee Comparison — live state data</li>
                <li>Review Purity — dealer audit</li>
                <li>F&I Decoder — finance office exposed</li>
                <li>Add-On Fighter — counter scripts</li>
              </ul>
              <div style={{marginTop:8,fontSize:10,color:"var(--y)",fontWeight:800}}>Valid 7 days · Unlimited uses · No account</div>
            </div>
          </div>
        </div>
      )}
      {submitted && (
        <div style={{background:"rgba(255,214,0,.06)",border:"1px solid rgba(255,214,0,.2)",borderRadius:10,padding:"12px 16px",marginBottom:12,textAlign:"center",fontSize:13,color:"var(--text2)",fontWeight:800}}>
          ✓ Session submitted. Your results are locked below. Close this tab and access ends.
        </div>
      )}
      <div style={submitted ? {pointerEvents:"none",opacity:.45,userSelect:"none",filter:"grayscale(.3)"} : {}}>
      <div className="phd">
        <h2>Deal <span>Analyzer</span></h2>
        {ftb && <div className="ftb-box"><div className="ftb-title">🎓 First Time Buyer Mode Active</div><p className="ftb-body">Your results will include a full first-time buyer guide — down payment ratios, PTI basics, how to set up your loan payment online, and what to expect after you sign.</p></div>}
        <p>Enter your numbers. Get your counter before you sign.</p>
      </div>

      {/* ── Quote Scanner teaser for free users ───────────────────────── */}
      {!scanEnabled && onBuy && (
        <div style={{background:"rgba(255,214,0,.05)",border:"1px solid rgba(255,214,0,.25)",borderRadius:12,padding:"14px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <span style={{fontSize:22}}>📄</span>
          <div style={{flex:1,minWidth:180}}>
            <div style={{fontSize:13,fontWeight:900,color:"var(--y)",marginBottom:2}}>Got your dealer quote?</div>
            <div style={{fontSize:12,color:"var(--text2)",fontWeight:700,lineHeight:1.5}}>Upload a photo or PDF and we'll scan it for you — skip the form entirely. <span style={{color:"var(--muted)"}}>Pro feature.</span></div>
          </div>
          <button className="hbtn-y" style={{padding:"9px 18px",fontSize:12,whiteSpace:"nowrap"}} onClick={onBuy}>Unlock Scanner — $49</button>
        </div>
      )}

      {/* ── Quote Scanner for paid users ──────────────────────────────── */}
      {scanEnabled && (
        <div style={{background:"rgba(255,214,0,.05)",border:`1px solid ${scanSuccess?"rgba(0,201,107,.3)":scanAttempts>=MAX_SCAN_ATTEMPTS?"rgba(168,164,200,.2)":"rgba(255,214,0,.2)"}`,borderRadius:12,padding:"14px 16px",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
            <span style={{fontSize:18}}>📄</span>
            <div>
              <div style={{fontSize:12,fontWeight:900,color:"var(--y)",letterSpacing:.5}}>QUOTE SCANNER</div>
              <div style={{fontSize:11,color:"var(--text2)",fontWeight:700,lineHeight:1.5}}>
                {ftb
                  ? "Have your dealer quote? Upload a photo or PDF and we'll fill in the fields for you!"
                  : "Have your dealer quote handy? Upload it and skip the form."}
              </div>
            </div>
          </div>
          <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,lineHeight:1.7,marginBottom:10,padding:"6px 10px",background:"rgba(255,255,255,.03)",borderRadius:8}}>
            📸 <strong style={{color:"var(--text2)"}}>Best results:</strong> flat, well-lit photo or exported PDF from the dealer's email/portal. Handwritten notes or partial cuts may not scan correctly. <strong style={{color:"var(--text2)"}}>Manual entry is always the most accurate option.</strong>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <label style={{
              display:"inline-flex",alignItems:"center",gap:6,
              background: scanAttempts >= MAX_SCAN_ATTEMPTS && !scanSuccess ? "rgba(168,164,200,.1)" : "rgba(255,214,0,.12)",
              border: `1px solid ${scanAttempts >= MAX_SCAN_ATTEMPTS && !scanSuccess ? "rgba(168,164,200,.2)" : "rgba(255,214,0,.3)"}`,
              borderRadius:8,padding:"8px 16px",cursor: scanLoading || scanSuccess ? "not-allowed" : "pointer",
              fontSize:12,fontWeight:900,
              color: scanAttempts >= MAX_SCAN_ATTEMPTS && !scanSuccess ? "var(--muted)" : "var(--y)",
              opacity: scanLoading || scanSuccess ? .6 : 1,
              transition:"all .2s"
            }}>
              <input type="file" accept="image/*,application/pdf" style={{display:"none"}} onChange={handleScan} disabled={scanLoading || scanSuccess} />
              {scanLoading ? "⏳ Scanning..." : scanSuccess ? "✓ Scanned" : scanAttempts >= MAX_SCAN_ATTEMPTS ? "📄 Try Again" : "📤 Upload Quote"}
            </label>
            {scanAttempts > 0 && !scanSuccess && (
              <span style={{fontSize:10,color:"var(--muted)",fontWeight:700}}>{MAX_SCAN_ATTEMPTS - scanAttempts} attempt{MAX_SCAN_ATTEMPTS - scanAttempts !== 1 ? "s" : ""} remaining</span>
            )}
          </div>
          {scanMsg && (
            <div style={{
              marginTop:10,fontSize:12,fontWeight:700,lineHeight:1.65,
              color: scanSuccess ? "var(--green)" : scanAttempts >= MAX_SCAN_ATTEMPTS ? "var(--text2)" : "var(--text2)",
              padding:"8px 12px",borderRadius:8,
              background: scanSuccess ? "rgba(0,201,107,.07)" : "rgba(255,255,255,.03)",
              border: scanSuccess ? "1px solid rgba(0,201,107,.2)" : "1px solid rgba(255,255,255,.06)"
            }}>
              {scanMsg}
            </div>
          )}
          {scanAttempts >= MAX_SCAN_ATTEMPTS && !scanSuccess && (
            <div style={{marginTop:8,fontSize:11,color:"var(--y)",fontWeight:800}}>
              👇 {ftb ? "The fields below are ready for you — fill in what you see on your quote." : "The fields below are ready — fill in what you know."}
            </div>
          )}
          {scanSuccess && (
            <div style={{marginTop:8,fontSize:11,color:"var(--muted)",fontWeight:700}}>
              💾 Tip: Screenshot your results before closing — your session data isn't stored anywhere.
            </div>
          )}
        </div>
      )}

      <div className="disclaimer"><strong>Note:</strong> CNTROFR analyzes deal pricing, trade-in value, and add-on products only. We do not provide financing or credit advice. Consult a financial professional for loan decisions.</div>
      <div className="cond-toggle">
        <button className={`cond-btn ${condition==="new"?"active":""}`} onClick={()=>setCondition("new")}>
          🆕 New
        </button>
        <button className={`cond-btn ${condition==="used"?"active":""}`} onClick={()=>setCondition("used")}>
          🔑 Used
        </button>
        <button className={`cond-btn ${condition==="cpo"?"active active-cpo":""}`} onClick={()=>setCondition("cpo")}>
           <JargonTip term="CPO" />
        </button>
        <button className={`cond-btn ${condition==="custom"?"active-custom active":""}`} onClick={()=>setCondition("custom")}>
          🔧 Custom Order
        </button>
        {(tier==="pro"||tier==="single") ? (
          <button className={`cond-btn ${condition==="buyout"?"active active-buyout":""}`} onClick={()=>setCondition("buyout")}>
            📋 Lease Buyout
          </button>
        ) : (
          <button className="cond-btn" style={{opacity:.5,cursor:"pointer",position:"relative"}} onClick={onBuy}>
            📋 Lease Buyout <span style={{fontSize:10,color:"var(--y)",fontWeight:900,display:"block"}}>Pro / Single</span>
          </button>
        )}
      </div>
      {condition==="custom" && (
        <div style={{background:"rgba(168,164,200,.06)",border:"1px solid rgba(168,164,200,.2)",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:11,color:"var(--text2)",fontWeight:700,lineHeight:1.7}}>
          <strong style={{color:"var(--text)"}}>Custom orders limit price leverage</strong> -- but F&I products, add-ons, and fees are still fully negotiable. We'll focus the analysis there.
        </div>
      )}
      {condition==="cpo" && (
        <div style={{background:"rgba(59,158,255,.06)",border:"1px solid rgba(59,158,255,.2)",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:11,color:"#A0C8FF",fontWeight:700,lineHeight:1.7}}>
          <strong style={{color:"var(--blue)"}}>CPO heads up:</strong> Certified Pre-Owned programs vary wildly by manufacturer. We'll analyze what the certification actually covers, what it doesn't, whether the dealer is marking up the CPO premium, and if you'd be better off with an independent warranty instead.
        </div>
      )}
      {condition==="new" && (
        <div style={{background:"rgba(0,201,107,.06)",border:"1px solid rgba(0,201,107,.2)",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:11,color:"#80E8B0",fontWeight:700,lineHeight:1.7}}>
          <strong style={{color:"var(--green)"}}>New vehicle:</strong> Mileage field not required. We'll focus on MSRP vs. market value, dealer markup above sticker, allocation games, and any mandatory add-ons the dealer is bundling.
        </div>
      )}
      {condition==="buyout" && (
        <div style={{background:"rgba(124,58,237,.08)",border:"1px solid rgba(159,103,255,.3)",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:11,color:"#C4B0FF",fontWeight:700,lineHeight:1.7}}>
          <strong style={{color:"#9F67FF"}}>Lease buyout mode:</strong> Your residual price is locked in your lease contract — the dealer cannot negotiate it. We'll skip price analysis entirely and focus on what IS negotiable: F&I products, add-ons, fees, and any force-adds the dealer is trying to sneak in. Enter your residual price in the "Dealer's Offer" field below.
        </div>
      )}

      <div className="card">
        <div className="ch"><span className="clbl">The Vehicle</span></div>
        <div className="cb">
          <div className="g3">
            <div className="fld">
              <label style={{display:"flex",alignItems:"center"}}>
                Dealer
                <div className="tooltip-wrap">
                  <span className="tooltip-icon">?</span>
                  <div className="tooltip-bubble">Adding dealer info sharpens your counter script — we identify parent company pressure tactics, regional fee patterns, and market context. Never shared with them in any form.</div>
                </div>
              </label>
              <input placeholder="AutoNation Honda" value={f.dealerName||""} onChange={s("dealerName")} />
            </div>
            <div className="fld"><label>City</label><input placeholder="Denver" value={f.dealerCity||""} onChange={s("dealerCity")} /></div>
            <div className="fld"><label>State</label><input placeholder="CO" value={f.dealerState||""} onChange={s("dealerState")} maxLength={2} /></div>
          </div>
          <div className="sp" />
          <div className="g2">
            <div className="fld"><label>Year</label><input placeholder="2024" value={f.year} onChange={s("year")} /></div>
            <div className="fld"><label>Make & Model</label><input placeholder="Honda Accord" value={f.vehicle} onChange={s("vehicle")} /></div>
          </div>

          <div className="sp" />
          <div className="fld">
            <label style={{display:"flex",alignItems:"center"}}>
              Trim Level
              <div className="tooltip-wrap">
                <span className="tooltip-icon">?</span>
                <div className="tooltip-bubble">Trim level dramatically affects price. A Civic EX and a Civic Type R can be $15,000+ apart. Including the trim gives us a much more accurate picture of what your car is actually worth -- and what the dealer has room to move on.</div>
              </div>
            </label>
            <input placeholder="e.g. EX-L, Sport, Type R, Platinum -- optional but helps a lot" value={f.trim} onChange={s("trim")} />
          </div>
          {(condition==="new"||condition==="custom") && (
          <div className="fld" style={{marginTop:12}}>
            <label style={{display:"flex",alignItems:"center",gap:6}}>
              Additional Factory Packages
              <div className="tooltip-wrap">
                <span className="tooltip-icon">?</span>
                <div className="tooltip-bubble">Factory packages can add $2,000-15,000+ to a vehicle's real value. List them from the window sticker so we can accurately assess the asking price and your leverage.</div>
              </div>
            </label>
            <textarea placeholder="e.g. Premium Sound Package, Black Optics Package, 20&quot; Wheel Upgrade, Technology Package -- list all factory packages from the window sticker" value={f.packages} onChange={s("packages")} style={{minHeight:68}} />
            <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,marginTop:4,lineHeight:1.6}}>📋 <strong style={{color:"var(--text2)"}}>Check the window sticker</strong> — these significantly affect real vehicle value and the negotiation.</div>
          </div>
          )}
          <div className="sp" />
          <div className="g2">
            {condition!=="new" && condition!=="custom" && (
            <div className="fld">
              <label style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,cursor:"pointer",fontSize:12,fontWeight:800,color:"var(--text2)"}}>
                <input type="checkbox" checked={accidentReported} onChange={e=>{setAccidentReported(e.target.checked);if(!e.target.checked)setAccidentSeverity("");}} style={{accentColor:"var(--y)",width:14,height:14}} />
                Accident Reported (CarFax / AutoCheck)
              </label>
              {accidentReported && (
                <div className="severity-wrap">
                  <div className="fld">
                    <label>Accident Severity</label>
                    <select value={accidentSeverity} onChange={e=>setAccidentSeverity(e.target.value)} style={{background:"var(--bg)",border:"2px solid var(--b1)",color:"var(--text)",fontFamily:"Nunito",fontSize:12,padding:"9px 12px",borderRadius:8,outline:"none",width:"100%"}}>
                      <option value="">Select severity</option>
                      <option value="minor">Minor -- cosmetic damage, airbags not deployed</option>
                      <option value="moderate">Moderate -- structural repair, possible frame work</option>
                      <option value="severe">Severe -- major structural, airbag deployment, total loss candidate</option>
                    </select>
                  </div>
                  <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,marginTop:6,lineHeight:1.6}}>
                    If the dealer is not providing a CarFax or AutoCheck report -- that is a red flag. Walk away.
                  </div>
                </div>
              )}
            </div>
            )}
            {condition!=="new" && condition!=="custom" && (
            <div className="fld">
              <label style={{display:"flex",alignItems:"center"}}>
                Mileage
                <div className="tooltip-wrap">
                  <span className="tooltip-icon">?</span>
                  <div className="tooltip-bubble">Average mileage is roughly 12,000-15,000 miles per year. High mileage accelerates depreciation and affects what the car is truly worth. We use this to flag whether the asking price reflects reality -- or ignores the odometer entirely.</div>
                </div>
              </label>
              <input placeholder="e.g. 34,200" value={f.mileage} onChange={s("mileage")} />
            </div>
            )}
            {condition==="used" && (
            <div className="fld">
              <label>Number of Previous Owners</label>
              <select value={f.owners||""} onChange={s("owners")} style={{background:"var(--bg)",border:"2px solid var(--b1)",color:"var(--text)",fontFamily:"Nunito",fontSize:12,padding:"9px 12px",borderRadius:8,outline:"none",width:"100%"}}>
                <option value="">Unknown / not provided</option>
                <option value="1">1 -- single owner</option>
                <option value="2">2 owners</option>
                <option value="3">3 owners</option>
                <option value="4">4 owners</option>
                <option value="5+">5+ owners</option>
              </select>
            </div>
            )}
            {condition==="new"
              ? <div className="fld"><label><JargonTip term="MSRP" /> (Sticker)</label><input placeholder="32,000" value={f.msrp} onChange={s("msrp")} /></div>
              : condition==="custom" ? null
              : <div className="fld"><label>Listed Price</label><input placeholder="29,500" value={f.msrp} onChange={s("msrp")} /></div>
            }
          </div>
          <div className="sp" />
          <div className="g2">
            {condition==="new"
              ? <div className="fld"><label>Their Asking Price</label><input placeholder="29,500" value={f.offer} onChange={s("offer")} /></div>
              : condition==="custom"
              ? <div className="fld"><label>Agreed Vehicle Price</label><input placeholder="42,000" value={f.offer} onChange={s("offer")} /></div>
              : <div className="fld"><label>Dealer's Offer</label><input placeholder="27,000" value={f.offer} onChange={s("offer")} /></div>
            }
          </div>
        </div>
      </div>
      <div className="card">
        <div className="ch"><span className="clbl">Trade-In (if any)</span></div>
        <div className="cb">
          <div className="g2">
            <div className="fld"><label><JargonTip term="ACV" /> — Trade-In Offered</label><input placeholder="8,500" value={f.tradeIn} onChange={s("tradeIn")} /></div>
            <div className="fld"><label>Owed on Trade</label><input placeholder="4,200" value={f.tradeOwed} onChange={s("tradeOwed")} /></div>
          </div>
        </div>
      </div>

      <div className="card" style={finalOffer ? {border:"2px solid var(--y)",boxShadow:"0 0 0 1px rgba(255,214,0,.15)"} : undefined}>
        <div className="ch"><span className="clbl">Your Loan <span style={{color:"var(--green)",fontSize:9,letterSpacing:1,marginLeft:8}}>NEW</span></span></div>
        <div className="cb">
          {finalOffer && (
            <div style={{background:"rgba(255,214,0,.08)",border:"1px solid rgba(255,214,0,.3)",borderRadius:8,padding:"10px 14px",marginBottom:12,fontSize:11,fontWeight:700,color:"var(--text2)",lineHeight:1.6}}>
              🏁 <strong style={{color:"var(--y)"}}>You're in Final Offer Mode.</strong> This is exactly where rate markup hides. If the finance office has quoted you a rate, drop it in below -- this is your last shot to catch it before you sign.
            </div>
          )}
          <div className="g2">
            <div className="fld"><label><JargonTip term="APR" /> You Were Quoted</label><input placeholder="7.9" value={f.apr} onChange={s("apr")} /></div>
            <div className="fld">
              <label><JargonTip term="Term" /> (months)</label>
              <select value={f.term||""} onChange={s("term")} style={{background:"var(--bg)",border:"2px solid var(--b1)",color:"var(--text)",fontFamily:"Nunito",fontSize:12,padding:"9px 12px",borderRadius:8,outline:"none",width:"100%"}}>
                <option value="">Select term</option>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
                <option value="48">48 months</option>
                <option value="60">60 months</option>
                <option value="72">72 months</option>
                <option value="84">84 months</option>
              </select>
            </div>
          </div>
          <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,marginTop:10,lineHeight:1.65,padding:"8px 0",borderTop:"1px solid var(--b1)"}}>
            📌 <strong style={{color:"var(--text2)"}}>Optional.</strong> If financing, drop in the rate and term from your quote and we'll run the real math against live rate data -- exact dollars, not vibes. We don't do credit -- this is arithmetic on the numbers you give us, not a credit decision.
          </div>
        </div>

      </div>

      {paid && (
      <div className="card">
        <div className="ch"><span className="clbl">Add-Ons & Notes</span></div>
        <div className="cb">
          <div className="fld" style={{marginBottom:12}}><label>Add-Ons</label><input placeholder="Extended warranty $2,100 - GAP $895 - Paint protection $499" value={f.addons} onChange={s("addons")} /></div>
          <div className="fld"><label>{ftb ? "Help Me! 🆘" : "Anything Else We Should Know"}</label><textarea placeholder={ftb ? "Tell us what you don't understand or what's confusing you about this deal. No question is too basic — that's exactly why we're here." : "Been on lot 60 days, competing offer, etc..."} value={f.notes} onChange={s("notes")} /></div>
          <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,marginTop:10,lineHeight:1.65,padding:"8px 0",borderTop:"1px solid var(--b1)"}}>
            📌 <strong style={{color:"var(--text2)"}}>State fees (registration, title, taxes) are set by your state government and cannot be negotiated.</strong> They are typically under $50 in most states and must appear as separate line items. Any attempt to inflate or bundle them into other fees is worth flagging.
          </div>
        </div>
      </div>
      )}
      {paid && (
      <div className="card">
        <div className="ch"><span className="clbl">📍 Local Market Scan <span style={{color:"var(--green)",fontSize:9,letterSpacing:1,marginLeft:8}}>NEW</span></span></div>
        <div className="cb">
          <div className="fld">
            <label>Your Zip Code -- We scan nearby dealers for this exact vehicle</label>
            <input placeholder="e.g. 80021 -- leave blank to skip market scan" value={f.zip} onChange={s("zip")} maxLength={5} />
          </div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:6,fontWeight:700}}>Optional but powerful -- we find what other dealers nearby are charging for the same car and hand you that leverage.</div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:12,marginBottom:4,fontWeight:700,lineHeight:1.65}}>
            💡 <strong style={{color:"var(--text2)"}}>Works best with an active quote or specific offer in hand.</strong> The more detail you enter, the sharper your counter.
          </div>
        </div>
      </div>
      )}
      <div className="card">
        <div className="cb">
          {paid && (
            <div onClick={()=>setFinalOffer(!finalOffer)} style={{cursor:"pointer",background:finalOffer?"rgba(255,214,0,.1)":"rgba(255,255,255,.03)",border:`2px solid ${finalOffer?"var(--y)":"var(--b1)"}`,borderRadius:10,padding:"12px 16px",marginBottom:14,transition:"all .2s"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                <span style={{fontSize:18}}>🏁</span>
                <span style={{fontFamily:"'Bebas Neue'",fontSize:18,letterSpacing:2,color:finalOffer?"var(--y)":"var(--text2)"}}>
                  {finalOffer ? "FINAL OFFER MODE — ON" : "FINAL OFFER MODE"}
                </span>
                <div style={{marginLeft:"auto",background:finalOffer?"var(--y)":"var(--b1)",borderRadius:20,width:36,height:20,position:"relative",transition:"background .2s"}}>
                  <div style={{position:"absolute",top:3,left:finalOffer?18:3,width:14,height:14,borderRadius:"50%",background:finalOffer?"#000":"var(--muted)",transition:"left .2s"}} />
                </div>
              </div>
              <div style={{fontSize:11,color:"var(--muted)",fontWeight:700,lineHeight:1.65}}>
                Dealer says this is their best price — or you've agreed on a number and you're heading to the finance office. Activate this for last-line-of-defense counter scripts, F&I office warnings, and a final checklist before you sign.
              </div>
            </div>
          )}
          <div className="hcaptcha-wrap">
            <div ref={captchaRef} className="h-captcha" data-sitekey={HCAPTCHA_KEY} data-callback="onHcVerify" data-expired-callback="onHcExpire" />
          </div>
          <button className="go-btn" onClick={run} disabled={loading||(!f.vehicle&&!f.offer)||!hcToken}>{loading ? loadMsg||"Working..." : finalOffer ? "→ Get My Final Counter" : f.zip && paid ? "→ Get My Counter + Market Scan" : "→ Get My Counter"}</button>
        </div>
      </div>
      </div>{/* end field lock wrapper */}
      {loading && !res && <Loading msg={loadMsg} web={!!f.zip} />}
      {res && (
        <>
          <Res verdict={v} vc={vc(v)} text={res} onReset={()=>{setR(null);setM(null);setFR(null);}} />
          {(condition==="used"||condition==="cpo") && !loading && (
            <div style={{background:"rgba(255,214,0,.04)",border:"1px solid rgba(255,214,0,.12)",borderRadius:10,padding:"10px 16px",fontSize:11,color:"var(--muted)",fontWeight:700,lineHeight:1.65,marginBottom:8}}>
              ⚠ <strong style={{color:"var(--text2)"}}>Not all pre-owned vehicles are created equal.</strong> This analysis reflects the information you provided. A <JargonTip term="PPI" /> from an independent mechanic before signing is always worth the $100-150.
            </div>
          )}
          {loading && <Loading msg={loadMsg} web={!!f.zip} />}

          {/* ── Financing Intelligence ─────────────────────────────────── */}
          {finRate && (
            <div className="card ranim" style={{marginBottom:12}}>
              <div className="vstrip">
                <span style={{fontFamily:"Nunito",fontSize:9,fontWeight:900,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)"}}>LIVE DATA</span>
                <span className="badge bb">💰 {condition==="new"||condition==="custom"?"NEW VEHICLE":"used"==="used"?f.offer&&parseFloat(f.offer)>100000?"HIGH-VALUE USED VEHICLE":"USED VEHICLE":condition==="cpo"?"CPO VEHICLE":condition==="buyout"?"LEASE BUYOUT":""} FINANCING LANDSCAPE</span>
              </div>

              {/* OEM incentive rate — paid only */}
              {paid && finRate.oem_rate && finRate.oem_rate !== "null" && (
                <div style={{background:"rgba(0,201,107,.07)",border:"1px solid rgba(0,201,107,.25)",borderRadius:10,padding:"10px 14px",marginBottom:12,fontSize:12,fontWeight:700,color:"#80E8B0",lineHeight:1.6}}>
                  <div style={{fontSize:11,fontWeight:900,color:"var(--green)",letterSpacing:.5,marginBottom:4}}>🏭 MANUFACTURER INCENTIVE RATE</div>
                  <strong style={{fontSize:15,color:"var(--green)"}}>{finRate.oem_rate}</strong>
                  {finRate.oem_program && finRate.oem_program !== "null" && <div style={{marginTop:4,fontSize:11,color:"var(--text2)"}}>{finRate.oem_program}</div>}
                </div>
              )}

              {/* Buyout restriction warning — paid only */}
              {paid && condition==="buyout" && finRate.buyout_restriction !== null && finRate.buyout_restriction !== "null" && (
                <div style={{background: finRate.buyout_restriction==="true"||finRate.buyout_restriction===true?"rgba(255,68,68,.07)":"rgba(0,201,107,.07)", border:`1px solid ${finRate.buyout_restriction==="true"||finRate.buyout_restriction===true?"rgba(255,68,68,.25)":"rgba(0,201,107,.25)"}`,borderRadius:10,padding:"10px 14px",marginBottom:12,fontSize:12,fontWeight:700,lineHeight:1.6,color:finRate.buyout_restriction==="true"||finRate.buyout_restriction===true?"#FF9999":"#80E8B0"}}>
                  <div style={{fontSize:11,fontWeight:900,letterSpacing:.5,marginBottom:4}}>{finRate.buyout_restriction==="true"||finRate.buyout_restriction===true?"⚠ CAPTIVE LENDER REQUIRED":"✓ OUTSIDE FINANCING ALLOWED"}</div>
                  {finRate.buyout_note && finRate.buyout_note !== "null" && <div style={{fontSize:11,color:"var(--text2)"}}>{finRate.buyout_note}</div>}
                </div>
              )}

              {/* Green/Yellow/Red range cards */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:10}}>
                {[
                  {key:"green",bg:"rgba(0,201,107,.07)",border:"rgba(0,201,107,.3)",label_color:"var(--green)",emoji:"🟢"},
                  {key:"yellow",bg:"rgba(255,214,0,.07)",border:"rgba(255,214,0,.3)",label_color:"var(--y)",emoji:"🟡"},
                  {key:"red",bg:"rgba(255,68,68,.07)",border:"rgba(255,68,68,.3)",label_color:"var(--red)",emoji:"🔴"},
                ].map(({key,bg,border,label_color,emoji})=>(
                  finRate[key] && (
                    <div key={key} style={{background:bg,border:`1px solid ${border}`,borderRadius:10,padding:"10px 10px",textAlign:"center"}}>
                      <div style={{fontSize:14,marginBottom:4}}>{emoji}</div>
                      <div style={{fontSize:9,fontWeight:900,color:label_color,letterSpacing:.3,marginBottom:4,lineHeight:1.3}}>{finRate[key].label}</div>
                      <div style={{fontSize:15,fontWeight:900,color:"var(--text)",marginBottom:2}}>{finRate[key].range}</div>
                      <div style={{fontSize:10,color:"var(--muted)",fontWeight:700}}>avg {finRate[key].avg}</div>
                      {paid && finRate[key].note && (
                        <div style={{marginTop:6,fontSize:10,color:"var(--text2)",fontWeight:700,lineHeight:1.5,borderTop:"1px solid rgba(255,255,255,.05)",paddingTop:6}}>{finRate[key].note}</div>
                      )}
                    </div>
                  )
                ))}
              </div>

              {/* Free teaser CTA */}
              {!paid && onBuy && (
                <div style={{background:"rgba(255,214,0,.05)",border:"1px solid rgba(255,214,0,.2)",borderRadius:8,padding:"10px 14px",fontSize:11,fontWeight:700,color:"var(--text2)",lineHeight:1.6,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  <div style={{flex:1}}>
                    <strong style={{color:"var(--y)"}}>See how your dealer's quoted rate compares.</strong> Pro unlocks OEM incentive rates, manufacturer captive lender flags, and word-for-word scripts to fight rate markup in the finance office.
                  </div>
                  <button className="hbtn-y" style={{padding:"8px 16px",fontSize:11,whiteSpace:"nowrap"}} onClick={onBuy}>Unlock Pro — $49</button>
                </div>
              )}

              <div style={{marginTop:8,fontSize:10,color:"var(--muted)",fontWeight:700,lineHeight:1.6}}>
                ⚠ {finRate.disclaimer || "Rates based on current national averages. Verify directly with your lender. Subject to change."} {finRate.as_of ? `Data as of ${finRate.as_of}.` : ""} CNTROFR does not provide financial advice.
              </div>
            </div>
          )}

          {!loading && finRate && f.apr && f.term && (() => {
            const savings = computeLoanSavings(f, finRate);
            if (!savings) return null;
            const { aprNum, termNum, compareRate, compareLabel, yours, best, monthlyDiff, interestDiff, principal } = savings;
            return (
              <div className="card ranim" style={finalOffer ? {border:"2px solid var(--y)",boxShadow:"0 0 0 1px rgba(255,214,0,.15)"} : undefined}>
                <div className="vstrip">
                  <span style={{fontFamily:"Nunito",fontSize:9,fontWeight:900,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)"}}>YOUR NUMBERS</span>
                  <span className="badge bb">💵 WHAT YOUR RATE ACTUALLY COSTS</span>
                </div>
                {paid ? (
                  <>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:10}}>
                      <div style={{background:"rgba(255,255,255,.03)",border:"1px solid var(--b1)",borderRadius:10,padding:"10px 12px",textAlign:"center"}}>
                        <div style={{fontSize:9,fontWeight:900,color:"var(--muted)",letterSpacing:.5,marginBottom:4}}>YOUR QUOTE</div>
                        <div style={{fontSize:16,fontWeight:900,color:"var(--text)"}}>{aprNum}% APR</div>
                        <div style={{fontSize:11,color:"var(--text2)",fontWeight:700,marginTop:2}}>{fmtMoney(yours.payment)}/mo</div>
                      </div>
                      <div style={{background:"rgba(0,201,107,.07)",border:"1px solid rgba(0,201,107,.25)",borderRadius:10,padding:"10px 12px",textAlign:"center"}}>
                        <div style={{fontSize:9,fontWeight:900,color:"var(--green)",letterSpacing:.5,marginBottom:4}}>{compareLabel.toUpperCase()}</div>
                        <div style={{fontSize:16,fontWeight:900,color:"var(--text)"}}>{compareRate}% APR</div>
                        <div style={{fontSize:11,color:"var(--text2)",fontWeight:700,marginTop:2}}>{fmtMoney(best.payment)}/mo</div>
                      </div>
                    </div>
                    {monthlyDiff > 0.5 ? (
                      <div style={{background:"rgba(255,68,68,.07)",border:"1px solid rgba(255,68,68,.25)",borderRadius:10,padding:"12px 14px",marginBottom:10}}>
                        <div style={{fontSize:11,fontWeight:900,color:"var(--red)",letterSpacing:.3,marginBottom:4}}>⚠ YOUR RATE IS COSTING YOU EXTRA</div>
                        <div style={{fontSize:13,color:"var(--text2)",fontWeight:700,lineHeight:1.6}}>
                          <strong style={{color:"var(--text)"}}>{fmtMoney(monthlyDiff)}/mo</strong> more than {compareLabel.toLowerCase()} — <strong style={{color:"var(--text)"}}>{fmtMoney(interestDiff)}</strong> more in total interest over {termNum} months.
                        </div>
                      </div>
                    ) : (
                      <div style={{background:"rgba(0,201,107,.07)",border:"1px solid rgba(0,201,107,.25)",borderRadius:10,padding:"12px 14px",marginBottom:10}}>
                        <div style={{fontSize:12,color:"#80E8B0",fontWeight:700,lineHeight:1.6}}>✓ Your quoted rate is at or below {compareLabel.toLowerCase()} -- no obvious markup here.</div>
                      </div>
                    )}
                    <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,lineHeight:1.6}}>
                      Based on a financed amount of {fmtMoney(principal)} (offer price minus trade equity, if entered) -- taxes, fees, and add-ons rolled into the loan will change the real number. We don't do credit. This is arithmetic on the numbers you gave us, not a credit decision or financial advice.
                    </div>
                  </>
                ) : (
                  onBuy && (
                    <div style={{background:"rgba(255,214,0,.05)",border:"1px solid rgba(255,214,0,.2)",borderRadius:8,padding:"10px 14px",fontSize:11,fontWeight:700,color:"var(--text2)",lineHeight:1.6,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                      <div style={{flex:1}}>
                        <strong style={{color:"var(--y)"}}>See exactly what your quoted rate costs you in real dollars.</strong> Pro runs your APR and term against live market data -- monthly payment difference, total interest difference, all of it.
                      </div>
                      <button className="hbtn-y" style={{padding:"8px 16px",fontSize:11,whiteSpace:"nowrap"}} onClick={onBuy}>Unlock Pro — $49</button>
                    </div>
                  )
                )}
              </div>
            );
          })()}

          {!loading && market && (
            <div className="card ranim">
              <div className="vstrip">
                <span style={{fontFamily:"Nunito",fontSize:9,fontWeight:900,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)"}}>LOCAL MARKET</span>
                <span className="badge bb">📍 NEARBY DEALER PRICES</span>
              </div>
              <MD text={market} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FeeComparison({ tier = "single" }) {
  const [f, setF] = useState({ dealer:"", city:"", state:"", fee:"", brand:"" });
  const [loading, setL] = useState(false); const [res, setR] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const s = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const run = async () => {
    setL(true); setR(null);
    const t = await ai(`Car dealer fee analyst. You are writing for a regular car buyer who just received a quote with fees they don't recognize. Use plain language. Explain what each fee actually is and whether it is fair. Do not narrate your search process or thinking. Output ONLY the final structured analysis starting directly with the first ## header. No preamble, no process commentary.
Dealer: ${f.dealer} | ${f.city}, ${f.state} | Brand: ${f.brand} | Documentation fee charged: $${f.fee}
## FEE VERDICT -- FAIR, HIGH, or EXCESSIVE?
## STATE CONTEXT -- Does ${f.state} have a legal cap on this fee? What do most ${f.brand} dealers in ${f.state} actually charge? Explain in plain terms.
## WHAT THIS FEE COVERS -- The legitimate work the dealer does to justify this charge. Be specific.
## WHAT IT DOES NOT JUSTIFY -- Any portion of this fee that is pure profit padding with no real service behind it.
## WHAT TO SAY -- The exact words to push back on this fee at the dealership.
## HOW TO USE THIS AS LEVERAGE -- If a competing dealer charges less, explain exactly how to use that information to negotiate a better deal.`, true, chunk => setR(chunk));
    setR(t); setL(false);
    saveToolRun({ tool: "fee_comparison", tier, state: f.state||null });
    if (tier === "single") setSubmitted(true);
  };
  return (
    <div>
      <div className="phd"><h2>Fee <span>Comparison</span></h2><p>Is that doc fee legit -- or greed with paperwork on top?</p></div>
      <div style={submitted ? {pointerEvents:"none",opacity:.45,userSelect:"none",filter:"grayscale(.3)"} : {}}>
      <div className="card">
        <div className="ch"><span className="clbl">Dealer & Fee Details</span></div>
        <div className="cb">
          <div className="g2">
            <div className="fld"><label>Dealer Name</label><input placeholder="AutoNation Honda" value={f.dealer} onChange={s("dealer")} /></div>
            <div className="fld"><label>Brand</label><input placeholder="Honda, Toyota..." value={f.brand} onChange={s("brand")} /></div>
          </div>
          <div className="sp" />
          <div className="g3">
            <div className="fld"><label>City</label><input placeholder="Dallas" value={f.city} onChange={s("city")} /></div>
            <div className="fld"><label>State</label><input placeholder="TX" value={f.state} onChange={s("state")} /></div>
            <div className="fld"><label><JargonTip term="Doc Fee" /> $</label><input placeholder="799" value={f.fee} onChange={s("fee")} /></div>
          </div>
          <button className="go-btn" onClick={run} disabled={loading||!f.state||!f.fee}>{loading?"Researching...":"→ Analyze This Fee"}</button>
        </div>
      </div>
      </div>
      {submitted && <div style={{textAlign:"center",fontSize:12,color:"var(--muted)",fontWeight:800,padding:"8px",marginBottom:8}}>✓ Session submitted. Results locked below.</div>}
      {loading && !res && <Loading msg="Researching fee standards" web={true} />}
      {res && <div className="card ranim"><div className="vstrip"><span className="badge ba">FEE ANALYSIS</span><div style={{flex:1}}/><button className="ghost-btn" onClick={()=>setR(null)}>Reset</button></div><MD text={res}/></div>}
    </div>
  );
}

function ReviewPurity() {
  const [f, setF] = useState({ dealer:"", city:"", state:"", reviews:"" });
  const [customerRes, setCR] = useState(null); const [employeeRes, setER] = useState(null); const [complaintRes, setKR] = useState(null); const [v, setV] = useState(""); const [eV, setEV] = useState(""); const [kV, setKV] = useState("");
  const [loadingCR, setLCR] = useState(false); const [loadingER, setLER] = useState(false); const [loadingKR, setLKR] = useState(false);
  const [cooldownER, setCoolER] = useState(0); const [cooldownKR, setCoolKR] = useState(0);
  const startCooldown = (setter, seconds=8) => {
    setter(seconds);
    const tick = setInterval(() => {
      setter(prev => { if (prev <= 1) { clearInterval(tick); return 0; } return prev - 1; });
    }, 1000);
  };
  const s = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const isRateErr = t => !t || t === "RATE_LIMIT" || t.toLowerCase().includes("rate limit") || t.includes("token") || t.startsWith("Error:");

  const runCustomer = async () => {
    setLCR(true); setCR(null); setCoolER(0); setCoolKR(0);
    try {
      const c = await ai(`Dealer review analyst. Direct, no hedging. Call it what it is. Do not narrate your search process or thinking. Output ONLY the final structured analysis starting directly with the first ## header. No preamble, no process commentary.
Search Google Reviews, DealerRater, Cars.com for: ${f.dealer}, ${f.city} ${f.state}.${f.reviews?"\nUser experience notes:\n"+f.reviews:""}
## CUSTOMER REVIEW VERDICT -- LIKELY AUTHENTIC, SUSPICIOUS, or HIGH BOT RISK
## BOT FARMING SIGNALS -- Velocity, generic language, clustered 5-star bursts.
## REAL COMPLAINTS -- Themes from 1-3 star reviews. Skip bad-faith reviews.
## PRAISE CHECK -- Specific and believable, or vague and scripted?
## MANAGEMENT RESPONSES -- Defensive, dismissive, or genuine?
## PLATFORM CROSS-CHECK -- Gaps across Google, DealerRater, Cars.com. Flag gaps over 0.5 stars.
## CUSTOMER TRUST SCORE -- HIGH / MODERATE / LOW. One line.`, true);
      const err = isRateErr(c);
      const m = !err && c.match(/(LIKELY AUTHENTIC|SUSPICIOUS|HIGH BOT RISK)/i);
      setV(m ? m[1].trim().toUpperCase() : "ANALYZED");
      setCR(err ? "## Temporarily Unavailable\nHigh demand right now. Hit Retry to try again." : c);
      startCooldown(setCoolER);
    } catch(e) { setCR("## Scan Failed\nConnection issue. Hit Retry to try again."); }
    setLCR(false);
  };

  const runEmployee = async () => {
    setLER(true); setER(null);
    try {
      const e = await ai(`Dealer culture analyst. Direct, no hedging. Call out pressure culture plainly. Do not narrate your search process or thinking. Output ONLY the final structured analysis starting directly with the first ## header. No preamble, no process commentary.
Search Glassdoor, Indeed, LinkedIn for: "${f.dealer}", ${f.city} ${f.state}.
## EMPLOYEE SENTIMENT VERDICT -- HEALTHY CULTURE, CONCERNING, or TOXIC
## GLASSDOOR -- Rating, top complaints, management scores.
## INDEED -- Turnover patterns, pressure culture signs.
## FLOOR vs. SUITS -- Frontline vs. management complaints.
## PRESSURE SIGNALS -- Pushed to hit numbers at buyer's expense?
## TURNOVER FLAGS -- High sales/F&I turnover is a buyer red flag.
## CULTURE VERDICT -- Would you send a friend here? Yes or no.`, true);
      const err = isRateErr(e);
      const m = !err && e.match(/(HEALTHY CULTURE|CONCERNING|TOXIC)/i);
      setEV(m ? m[1].toUpperCase() : "ANALYZED");
      setER(err ? "## Temporarily Unavailable\nHigh demand right now. Hit Retry to try again." : e);
      startCooldown(setCoolKR);
    } catch(e) { setER("## Scan Failed\nConnection issue. Hit Retry to try again."); }
    setLER(false);
  };

  const runComplaints = async () => {
    setLKR(true); setKR(null);
    try {
      const k = await ai(`Consumer protection researcher. Direct, no hedging. State what was found and what it means. Do not narrate your search process or thinking. Output ONLY the final structured analysis starting directly with the first ## header. No preamble, no process commentary.
Search BBB, State AG (${f.state}), CFPB, local news for: "${f.dealer}", ${f.city} ${f.state}.
## COMPLAINT RECORD VERDICT -- CLEAN, MINOR ISSUES, or SIGNIFICANT CONCERNS
## BBB -- Rating, complaint count, types, resolution history.
## COMPLAINT PATTERNS -- Pricing, fees, F&I, service, title issues?
## UNRESOLVED -- Pattern of ignoring complaints?
## LEGAL / NEWS -- Lawsuits, AG actions, press coverage?
## QUESTIONS TO ASK -- 2-3 direct questions for the dealer based on findings.
## OVERALL RISK -- LOW / MODERATE / HIGH with one-line reasoning.`, true);
      const err = isRateErr(k);
      const m = !err && k.match(/(CLEAN|MINOR ISSUES|SIGNIFICANT CONCERNS)/i);
      setKV(m ? m[1].toUpperCase() : "ANALYZED");
      setKR(err ? "## Temporarily Unavailable\nHigh demand right now. Hit Retry to try again." : k);
    } catch(e) { setKR("## Scan Failed\nConnection issue. Hit Retry to try again."); setKV("ANALYZED"); }
    setLKR(false);
  };

  const vc = v => /AUTHENTIC/.test(v)?"bg":/HIGH BOT/.test(v)?"br":/SUSPICIOUS/.test(v)?"ba":"bb";
  const evc = v => /HEALTHY/.test(v)?"bg":/TOXIC/.test(v)?"br":/CONCERNING/.test(v)?"ba":"bb";
  const kvc = v => /CLEAN/.test(v)?"bg":/SIGNIFICANT/.test(v)?"br":/MINOR/.test(v)?"ba":"bb";
  const reset = () => { setCR(null); setER(null); setKR(null); setV(""); setEV(""); setKV(""); setCoolER(0); setCoolKR(0); };

  return (
    <div>
      <div className="phd"><h2>Review <span>Purity</span></h2><p>Customer reviews. Employee culture. Complaint records. Read each result -- then continue to the next scan.</p></div>
      <div className="card">
        <div className="ch"><span className="clbl">Dealer to Audit</span></div>
        <div className="cb">
          <div className="g3">
            <div className="fld"><label>Dealer Name</label><input placeholder="Hendrick Toyota" value={f.dealer} onChange={s("dealer")} /></div>
            <div className="fld"><label>City</label><input placeholder="Charlotte" value={f.city} onChange={s("city")} /></div>
            <div className="fld"><label>State</label><input placeholder="NC" value={f.state} onChange={s("state")} /></div>
          </div>
          <div className="sp" />
          <div className="fld"><label>Your Experience (optional -- makes results sharper)</label><textarea style={{minHeight:90}} placeholder={"Things you liked:\n-- Salesperson was upfront on pricing\n\nThings that felt off:\n-- Tried to add $800 in extras at signing"} value={f.reviews} onChange={s("reviews")} /></div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:6,fontWeight:700}}>Three separate scans -- read each result before moving to the next for best results.</div>
          <button className="go-btn" onClick={runCustomer} disabled={loadingCR||!f.dealer}>
            {loadingCR ? "Scanning customer reviews..." : customerRes ? "↻ Re-run Customer Reviews" : "→ Start -- Scan Customer Reviews"}
          </button>
          {customerRes && <button className="ghost-btn" style={{marginTop:8,width:"100%",textAlign:"center"}} onClick={reset}>Reset All</button>}
        </div>
      </div>

      {loadingCR && (
        <div className="card" style={{padding:"28px",textAlign:"center"}}>
          <div className="spin" style={{margin:"0 auto 12px"}} />
          <div style={{fontSize:11,fontWeight:800,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)"}}>Scanning customer reviews...</div>
          <div className="dont-close-warn" style={{marginTop:12}}>Do not close or refresh this window</div>
        </div>
      )}

      {customerRes && !loadingCR && (
        <div className="card ranim">
          <div className="vstrip">
            <span style={{fontFamily:"Nunito",fontSize:9,fontWeight:900,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)"}}>CUSTOMER REVIEWS</span>
            <span className={`badge ${vc(v)}`}>{v||"ANALYZED"}</span>
            <div style={{flex:1}}/>
            <button className="ghost-btn" onClick={runCustomer}>Retry</button>
          </div>
          <MD text={customerRes} />
          {!employeeRes && !loadingER && (
            <div style={{padding:"16px 20px",borderTop:"1px solid var(--b1)",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
              <div style={{fontSize:11,color:"var(--muted)",fontWeight:700}}>Read the results above, then scan employee culture when ready.</div>
              {cooldownER > 0
                ? <button className="hbtn-y" disabled style={{padding:"10px 24px",fontSize:12,opacity:.5,cursor:"not-allowed"}}>Refueling... {cooldownER}s</button>
                : <button className="hbtn-y" style={{padding:"10px 24px",fontSize:12}} onClick={runEmployee}>Continue to Employee Culture</button>
              }
            </div>
          )}
          {loadingER && (
            <div style={{padding:"20px",borderTop:"1px solid var(--b1)",textAlign:"center",display:"flex",alignItems:"center",gap:12,justifyContent:"center"}}>
              <div className="spin" style={{width:20,height:20,borderWidth:2}} />
              <span style={{fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:"var(--muted)"}}>Scanning employee sentiment...</span>
            </div>
          )}
        </div>
      )}

      {(employeeRes || loadingER) && (
        <div className="card ranim">
          <div className="vstrip">
            <span style={{fontFamily:"Nunito",fontSize:9,fontWeight:900,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)"}}>EMPLOYEE CULTURE</span>
            <span className={`badge ${evc(eV)}`}>{eV||"GLASSDOOR + INDEED"}</span>
            <div style={{flex:1}}/>
            {!loadingER && <button className="ghost-btn" onClick={runEmployee} disabled={cooldownKR>0}>{cooldownKR>0?`Refueling... ${cooldownKR}s`:"Retry"}</button>}
          </div>
          {loadingER ? (
            <div style={{padding:"32px",textAlign:"center",display:"flex",alignItems:"center",gap:12,justifyContent:"center"}}>
              <div className="spin" />
              <span style={{fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:"var(--muted)"}}>Scanning employee sentiment...</span>
            </div>
          ) : (
            <>
              <MD text={employeeRes} />
              {!complaintRes && !loadingKR && (
                <div style={{padding:"16px 20px",borderTop:"1px solid var(--b1)",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                  <div style={{fontSize:11,color:"var(--muted)",fontWeight:700}}>Read the results above, then scan complaint records when ready.</div>
                  {cooldownKR > 0
                    ? <button className="hbtn-y" disabled style={{padding:"10px 24px",fontSize:12,opacity:.5,cursor:"not-allowed"}}>Refueling... {cooldownKR}s</button>
                    : <button className="hbtn-y" style={{padding:"10px 24px",fontSize:12}} onClick={runComplaints}>Continue to Complaint Records</button>
                  }
                </div>
              )}
              {loadingKR && (
                <div style={{padding:"20px",borderTop:"1px solid var(--b1)",textAlign:"center",display:"flex",alignItems:"center",gap:12,justifyContent:"center"}}>
                  <div className="spin" style={{width:20,height:20,borderWidth:2}} />
                  <span style={{fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:"var(--muted)"}}>Pulling BBB and complaint records...</span>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {(complaintRes || loadingKR) && (
        <div className="card ranim">
          <div className="vstrip">
            <span style={{fontFamily:"Nunito",fontSize:9,fontWeight:900,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)"}}>COMPLAINT RECORDS</span>
            <span className={`badge ${kvc(kV)}`}>{kV||"BBB + AG + CFPB"}</span>
            <div style={{flex:1}}/>
            {!loadingKR && <button className="ghost-btn" onClick={runComplaints}>Retry</button>}
          </div>
          {loadingKR ? (
            <div style={{padding:"32px",textAlign:"center",display:"flex",alignItems:"center",gap:12,justifyContent:"center"}}>
              <div className="spin" />
              <span style={{fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:"var(--muted)"}}>Pulling BBB and complaint records...</span>
            </div>
          ) : (
            <>
              <MD text={complaintRes} />
              <div style={{background:"rgba(0,201,107,.06)",border:"1px solid rgba(0,201,107,.15)",borderRadius:10,margin:"0 20px 16px",padding:"14px 16px",fontSize:12,color:"var(--text2)",lineHeight:1.75,fontWeight:600}}>
                <strong style={{color:"var(--green)",display:"block",marginBottom:4}}>A note on responsible spending —</strong>
                CNTROFR exists to expose greed, not to burn down the industry. The profit pressure that makes car buying miserable doesn't come from the floor — it comes from ownership and management structures. Your salesperson often sees none of it.<br/><br/>
                <strong style={{color:"var(--text)"}}>If you had a great experience — say so.</strong> Leave your salesperson a five-star review on Google, DealerRater, and Cars.com. Mention them by name. That review feeds their family and builds their career. The greed at the top doesn't get to take that from them.
              </div>
              <div style={{padding:"14px 20px",borderTop:"1px solid var(--b1)",textAlign:"center"}}>
                <div style={{fontSize:11,color:"var(--green)",fontWeight:800}}>Full Purity Audit Complete</div>
                <button className="ghost-btn" style={{marginTop:8}} onClick={reset}>Start New Audit</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const FI = [
  {id:"ew",name:"Extended Warranty",desc:"3rd-party coverage after factory"},{id:"gap",name:"GAP Insurance",desc:"Covers gap if totaled & underwater"},{id:"tw",name:"Tire & Wheel",desc:"Road hazard protection"},{id:"ppf",name:"Paint Protection Film",desc:"Physical chip/scratch film"},{id:"cc",name:"Ceramic Coating",desc:"Chemical paint protection"},{id:"ip",name:"Interior Protection",desc:"Scotchgard-type treatment"},{id:"cl",name:"Credit Life/Disability",desc:"Loan paid if you die/disabled"},{id:"kr",name:"Key Replacement",desc:"Lost/broken smart key"},{id:"ws",name:"Windshield Protection",desc:"Glass repair/replace"},{id:"rs",name:"Roadside Assistance",desc:"Often duplicated by insurance"},{id:"pm",name:"Prepaid Maintenance",desc:"Oil changes rolled in"},
];
function FIDecoder({ tier = "single" }) {
  const [sel, setSel] = useState({}); const [prices, setP] = useState({}); const [noPrice, setNoPrice] = useState({}); const [veh, setV] = useState(""); const [loading, setL] = useState(false); const [res, setR] = useState(null);
  const [warrantyBrand, setWB] = useState(""); const [drivingHabits, setDrivingHabits] = useState(""); const [ownershipLength, setOwnershipLength] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const toggle = id => setSel(s=>({...s,[id]:!s[id]}));
  const picked = FI.filter(p=>sel[p.id]);
  const run = async () => {
    setL(true); setR(null);
    const priced = picked.filter(p=>!noPrice[p.id]);
    const unpriced = picked.filter(p=>noPrice[p.id]);
    const list = priced.map(p=>`- ${p.name}: $${prices[p.id]||"unknown"}`).join("\n");
    const unpricedList = unpriced.map(p=>`- ${p.name}`).join("\n");
    const t = await ai(`Finance office product analyst. You are writing for a regular car buyer sitting across from a finance manager for the first time. Use plain, direct language. Never use industry terms without explaining them in the same sentence. Be direct and specific.
Key facts: Finance managers are measured on how many products they sell per deal -- they will discount or bundle products to get a yes. If a finance manager tries to change your interest rate based on which products you buy, that is illegal unless your lender specifically requires it. Feeling pressured to decide immediately is a tactic, not a real deadline. The Magnuson-Moss Warranty Act protects buyers -- a manufacturer or dealership must prove a repair is not covered before denying a claim. If they cannot prove it, they must honor it. Know this law exists.
2026 INTELLIGENCE UPDATE: F&I is now the single most important profit center as front-end vehicle margins shrink -- finance managers face more pressure to sell products than ever this summer. Daily cost framing is standard training -- every product will be presented as pennies per day. Always convert to total contract cost and call it out by name. Product bundling at a "discounted" rate is a tactic to get multiple yeses at once -- evaluate every product individually, never as a bundle. GAP insurance from your auto insurance company costs $3-5 per month versus $600-900 upfront at the dealer -- always mention this as your alternative. Extended warranties are service contracts, not manufacturer warranties -- third-party administrators control claims and may restrict which repair shops can be used and require pre-approval before any work begins. Pre-existing condition exclusions are the most common claim denial reason -- if a mechanical issue existed before purchase the contract will not cover it. Payment protection products (job loss, disability) are being pushed hard in 2026 due to economic anxiety -- exclusions are extensive and claims approval rates are low. Evaluate actual policy terms before considering. Finance managers will discount everything if pushed -- "I want to see that in writing" and "I need to think about it" always work.
Vehicle: ${veh||"not specified"}${warrantyBrand?"\nWarranty provider: "+warrantyBrand:""}${drivingHabits?"\nHow they drive: "+drivingHabits:""}${ownershipLength?"\nHow long they plan to own it: "+ownershipLength:""}
${priced.length?`Products with a quoted price -- analyze whether the price is fair:\n${list}`:""}
${unpriced.length?`\nProducts the buyer wants info on BEFORE they get a quote (prep mode -- they have NOT been to the finance office yet):\n${unpricedList}\nFor these, instead of evaluating a quoted price, give: typical price range buyers see at dealerships nationally, typical dealer markup/profit margin on this product, whether it's generally worth buying at all, and what to watch for when it's presented.`:""}
For EACH product WITH A QUOTED PRICE:
## [NAME] -- [WORTH IT / OVERPRICED / SKIP IT / DEPENDS ON YOUR SITUATION]
- What the dealer paid for it vs what they are charging you
- How often claims actually get approved vs denied (use current data)
- The fine print that causes claims to be denied -- explain in plain terms
- A cheaper way to get the same protection if one exists
- Word-for-word script to decline or negotiate the price down
For EACH product WITHOUT A PRICE (prep mode):
## [NAME] -- PREP GUIDE
- Typical price range you'll see at dealerships (give a real dollar range)
- Typical dealer markup / profit margin on this product
- Generally worth buying or skip it -- and for whom
- What to watch for and how to evaluate it when it's presented
## OVERALL FINANCE OFFICE STRATEGY -- Which to keep, which to cut, and how much you could save by removing the flagged ones (priced products only).
## HOW THEY SELL IT -- Finance managers will discount everything if you push back. Explain that "I want to think about it" and "I need to see that in writing" always work.
## MAINTENANCE NOTE -- If the vehicle or driving habits suggest the buyer may be choosing the wrong product, flag it plainly.
## OPENING LINE -- The exact first words to say when sitting down in the finance office.
If any product or fee in this list is something you cannot fully evaluate or have not encountered before, include a line formatted exactly as: GAP: [item name] -- [brief reason you could not fully evaluate it]`, false, chunk => setR(chunk));
    setR(t); setL(false); parseAndFlagGaps(t);
    saveToolRun({ tool: "fi_decoder", tier, vehicle: veh||null });
    if (tier === "single") setSubmitted(true);
  };
  return (
    <div>
      {submitted && <div style={{textAlign:"center",fontSize:12,color:"var(--muted)",fontWeight:800,padding:"8px",marginBottom:8}}>✓ Session submitted. Results locked below.</div>}
      <div style={submitted ? {pointerEvents:"none",opacity:.45,userSelect:"none",filter:"grayscale(.3)"} : {}}>
      <div className="phd"><h2><JargonTip term="F&I" /> <span>Decoder</span></h2><p>Every product exposed -- dealer cost, real value, exit script.</p></div>
      <div className="card"><div className="ch"><span className="clbl">Vehicle</span></div><div className="cb">
        <div className="g2">
          <div className="fld"><label>Year / Make / Model</label><input placeholder="2024 Toyota Camry XSE" value={veh} onChange={e=>setV(e.target.value)} /></div>
          <div className="fld">
            <label style={{display:"flex",alignItems:"center"}}>
              Warranty Provider
              <div className="tooltip-wrap"><span className="tooltip-icon">?</span><div className="tooltip-bubble">Enter the warranty company name if shown on your paperwork. We'll pull specific claims approval rates, known denial patterns, and coverage gaps for that provider.</div></div>
            </label>
            <input placeholder="e.g. Safe-Guard, JM&A, Assurant -- optional" value={warrantyBrand} onChange={e=>setWB(e.target.value)} />
          </div>
        </div>
      </div></div>
      <div className="card"><div className="ch"><span className="clbl">Your Situation</span><span className="clbl-sub">Helps us match coverage to your actual needs</span></div><div className="cb">
        <div className="g2">
          <div className="fld">
            <label>Driving Habits</label>
            <select value={drivingHabits||""} onChange={e=>setDrivingHabits(e.target.value)} style={{background:"var(--bg)",border:"2px solid var(--b1)",color:"var(--text)",fontFamily:"Nunito",fontSize:12,padding:"9px 12px",borderRadius:8,outline:"none",width:"100%"}}>
              <option value="">Select your driving style</option>
              <option value="low">Low mileage -- under 8,000 miles/year</option>
              <option value="average">Average -- 10,000 to 15,000 miles/year</option>
              <option value="high">High mileage -- 15,000 to 25,000 miles/year</option>
              <option value="extreme">Extreme -- 25,000+ miles/year (traveling sales, rideshare, etc.)</option>
            </select>
          </div>
          <div className="fld">
            <label>Estimated Ownership Length</label>
            <select value={ownershipLength||""} onChange={e=>setOwnershipLength(e.target.value)} style={{background:"var(--bg)",border:"2px solid var(--b1)",color:"var(--text)",fontFamily:"Nunito",fontSize:12,padding:"9px 12px",borderRadius:8,outline:"none",width:"100%"}}>
              <option value="">How long do you plan to keep it?</option>
              <option value="short">1-2 years (short term / lease alternative)</option>
              <option value="medium">3-4 years (typical cycle)</option>
              <option value="long">5-7 years (keeping it a while)</option>
              <option value="forever">8+ years (running it into the ground)</option>
            </select>
          </div>
        </div>
        <div style={{fontSize:10,color:"var(--muted)",marginTop:8,fontWeight:700,lineHeight:1.6}}>
          A traveling salesperson putting on 30,000 miles a year needs completely different coverage than someone driving 6,000 miles locally. Your answers change everything about what's actually worth buying.
        </div>
      </div></div>
      <div className="card">
        <div className="ch"><span className="clbl">Products Offered</span></div>
        <div className="cb">
          <div className="pg">{FI.map(p=>(
            <div key={p.id} className={`pc ${sel[p.id]?"sel":""}`} onClick={()=>toggle(p.id)}>
              <div className="pc-chk">{sel[p.id]?"✓":""}</div>
              <div className="pc-name">{p.name}</div>
              <div className="pc-desc">{p.desc}</div>
              {sel[p.id]&&(
                <>
                  {!noPrice[p.id]&&<input className="pi" placeholder="$ quoted" value={prices[p.id]||""} onChange={e=>{e.stopPropagation();setP(pr=>({...pr,[p.id]:e.target.value}))}} onClick={e=>e.stopPropagation()} />}
                  <label style={{display:"flex",alignItems:"center",gap:6,marginTop:8,fontSize:11,color:"var(--text2)",fontWeight:700,cursor:"pointer"}} onClick={e=>e.stopPropagation()}>
                    <input type="checkbox" checked={!!noPrice[p.id]} onChange={e=>{e.stopPropagation();setNoPrice(np=>({...np,[p.id]:e.target.checked}));if(e.target.checked)setP(pr=>({...pr,[p.id]:""}));}} onClick={e=>e.stopPropagation()} style={{cursor:"pointer"}} />
                    I want this coverage but don't have a price yet
                  </label>
                </>
              )}
            </div>
          ))}</div>
          <button className="go-btn" onClick={run} disabled={loading||!picked.length}>{loading?"Decoding...":`→ Decode ${picked.length} Product${picked.length!==1?"s":""}`}</button>
        </div>
      </div>
      </div>{/* end field lock wrapper */}
      {loading && !res && <Loading msg="Decoding F&I products" web={true} />}
      {res && <div className="card ranim"><div className="vstrip"><span className="badge ba">F&I DECODED</span><div style={{flex:1}}/><button className="ghost-btn" onClick={()=>setR(null)}>Reset</button></div><MD text={res}/></div>}
    </div>
  );
}

const AO = [
  {id:"tint",name:"Window Tint",legit:true,desc:"Legit product -- verify quality, warranty & install method"},
  {id:"ppf",name:"Paint Film (PPF)",legit:true,desc:"Legit if properly installed -- check coverage terms"},
  {id:"masks",name:"Door/Bumper Masks",legit:true,desc:"Reasonable protection -- confirm quality of material"},
  {id:"nitro",name:"Nitrogen Tires",legit:false,desc:"Air is already 78% nitrogen. Rarely worth the upcharge."},
  {id:"vin",name:"VIN Etching",legit:null,desc:"Verify if insurance requires it -- often overpriced at dealer"},
  {id:"seal",name:"Paint Sealant",legit:null,desc:"Check coverage terms -- many void in non-controlled environments"},
  {id:"fabric",name:"Fabric/Leather Guard",legit:null,desc:"May suit your needs -- verify what voids coverage before paying"},
  {id:"loj",name:"LoJack / GPS",legit:null,desc:"Legitimate product -- compare dealer price vs. aftermarket options"},
  {id:"dent",name:"Dent Protection",legit:null,desc:"Can be useful -- read the fine print carefully before committing"},
  {id:"theft",name:"Theft Stickers",legit:false,desc:"Sticker-based deterrents -- limited real-world value"},
  {id:"tw",name:"Tire & Wheel / Road Hazard",legit:null,desc:"Worth considering for high-mileage drivers, dirt roads, or AWD vehicles needing matched tread"},
  {id:"mats",name:"All-Weather Mats",legit:null,desc:"Depends on brand and price -- WeatherTech vs. dealer markup"},
  {id:"kit",name:"Emergency Kit",legit:null,desc:"Verify if included in MSRP or added separately -- dealer-added kits are often heavily marked up"},
];
function AddOnFighter({ tier = "single" }) {
  const [sel, setSel] = useState({}); const [prices, setP] = useState({}); const [veh, setV] = useState(""); const [loading, setL] = useState(false); const [res, setR] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const toggle = id => setSel(s=>({...s,[id]:!s[id]}));
  const picked = AO.filter(a=>sel[a.id]);
  const run = async () => {
    setL(true); setR(null);
    const list = picked.map(a=>`- ${a.name}: $${prices[a.id]||"unknown"}`).join("\n");
    const t = await ai(`Car dealer add-on analyst. You are writing for a regular car buyer who just walked into a dealership and found extra items added to their vehicle. Use plain language. Explain what each add-on actually is, what the dealer paid for it, and what the buyer should say. Be direct and specific.
Real market costs for reference: Window tint $150-400 at an independent shop (dealers charge $299-799). Paint protection film on the front $500-900 at an independent shop (dealers charge 2-3x that). Ceramic coating $500-1500 independent. Paint sealant costs $50-100 to apply (dealers charge $300-800). VIN etching product costs $20 (dealers charge $200-400). Nitrogen in tires: regular air is already 78% nitrogen, there is zero real benefit. Fabric protection costs $10-20 to apply (dealers charge $200-500). Roadside assistance is likely already covered by your insurance or AAA. GPS trackers: a consumer GPS device costs $30-100 (dealers charge $300-800). All-weather floor mats: WeatherTech direct is $120-180 (dealers charge $200-400). Tire and wheel protection (also called road hazard): this is actually worth it for drivers with high mileage, gravel or dirt roads, AWD vehicles, or anyone in construction or trades -- verify the claim limits and deductibles before removing. Emergency kit: many vehicles already include one from the factory -- confirm whether this is already included in the vehicle price before flagging it as an extra charge.
Vehicle: ${veh||"not specified"}\nAdd-ons:\n${list}
For EACH add-on:
## [ADD-ON NAME] -- [KEEP / NEGOTIATE / REMOVE]
- What the dealer paid for it, what they are charging, and what it costs elsewhere
- The exact words the dealer will use to keep it on the deal
- The exact words the buyer should say to remove it or negotiate the price
- If it is already physically installed on the vehicle, what to say in that situation
## BATTLE PLAN -- Step by step instructions for removing flagged items. What to say if the dealer claims it cannot be removed.
## TOTAL POTENTIAL SAVINGS -- Estimated dollar amount by removing the flagged items.
If any add-on in this list is something you cannot fully evaluate or have not encountered before, include a line formatted exactly as: GAP: [add-on name] -- [brief reason you could not fully evaluate it]`, false, chunk => setR(chunk));
    setR(t); setL(false); parseAndFlagGaps(t);
    saveToolRun({ tool: "addon_fighter", tier, vehicle: veh||null });
    if (tier === "single") setSubmitted(true);
  };
  const lc = l => l===true?"var(--green)":l===false?"var(--red)":"var(--y)";
  const ll = l => l===true?"LEGIT":l===false?"VERIFY":"REVIEW";
  return (
    <div>
      {submitted && <div style={{textAlign:"center",fontSize:12,color:"var(--muted)",fontWeight:800,padding:"8px",marginBottom:8}}>✓ Session submitted. Results locked below.</div>}
      <div style={submitted ? {pointerEvents:"none",opacity:.45,userSelect:"none",filter:"grayscale(.3)"} : {}}>
      <div className="phd"><h2>Add-On <span>Fighter</span></h2><p>We know their scripts. Here's yours.</p></div>
      <div className="card"><div className="ch"><span className="clbl">Vehicle</span></div><div className="cb"><div className="fld"><label>Year / Make / Model</label><input placeholder="2024 Chevrolet Equinox LT" value={veh} onChange={e=>setV(e.target.value)} /></div></div></div>
      <div className="card">
        <div className="ch"><span className="clbl">Add-Ons On Your Deal</span></div>
        <div className="cb">
          <div className="pg">{AO.map(a=>(
            <div key={a.id} className={`pc ${sel[a.id]?"sel":""}`} onClick={()=>toggle(a.id)}>
              <div className="pc-chk">{sel[a.id]?"✓":""}</div>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:6,marginBottom:3}}>
                <div className="pc-name" style={{flex:1}}>{a.name}</div>
                <span style={{fontFamily:"Nunito",fontSize:8,fontWeight:900,letterSpacing:1.5,textTransform:"uppercase",color:lc(a.legit),flexShrink:0,marginTop:2}}>{ll(a.legit)}</span>
              </div>
              <div className="pc-desc">{a.desc}</div>
              {sel[a.id]&&<input className="pi" placeholder="$ dealer price" value={prices[a.id]||""} onChange={e=>{e.stopPropagation();setP(pr=>({...pr,[a.id]:e.target.value}))}} onClick={e=>e.stopPropagation()} />}
            </div>
          ))}</div>
          <button className="go-btn" onClick={run} disabled={loading||!picked.length}>{loading?"Arming you up...":`→ Fight ${picked.length} Add-On${picked.length!==1?"s":""}`}</button>
        </div>
      </div>
      </div>{/* end field lock wrapper */}
      {loading && !res && <Loading msg="Loading counter scripts" web={false} />}
      {res && <div className="card ranim"><div className="vstrip"><span className="badge br">FIGHT BACK</span><div style={{flex:1}}/><button className="ghost-btn" onClick={()=>setR(null)}>Reset</button></div><MD text={res}/></div>}
    </div>
  );
}

function CounterGuide() {
  const [loading, setL] = useState(false);
  const [res, setR] = useState(null);
  const run = async () => {
    setL(true); setR(null);
    const t = await ai(`You are a former automotive finance manager and dealership insider writing a brutally honest negotiation guide for everyday car buyers. Write for someone who has never bought a car before and has no industry knowledge. Every time you use an industry term, immediately explain it in plain English in the same sentence. Be direct, specific, and actionable.

## HOW DEALER PROFIT WORKS
Explain in plain language: how dealers make money on the front end (the vehicle price) and the back end (financing and add-on products). Explain what invoice price means and why "we're at invoice" is almost never the whole story. Explain manufacturer bonuses and end-of-month sales targets. Explain why dealers can make money even when they appear to give you a great deal. Explain destination fees -- what they are, why they have exploded in 2026 (now ranging $1,150-$3,250 depending on brand), why they are manufacturer-set and non-negotiable, and how automakers use them to advertise a lower base price while collecting more money at signing. Explain that Pre-Delivery Inspection fees are junk -- the manufacturer already pays the dealer for PDI through the destination charge, so any separate prep fee is double billing.

## THE FINANCE OFFICE PLAYBOOK
Walk the buyer through exactly what happens when they sit down with the finance manager after agreeing on a vehicle price. Explain how products are presented one at a time or as a bundle. Explain the four-square negotiation method in plain terms. Explain how dealers mark up interest rates and keep the difference -- and when that practice is illegal. Explain the daily cost framing tactic -- finance managers reframe every product as a daily cost ("just $1.50 a day") to minimize sticker shock. Show the buyer how to convert it back to total cost instantly. Explain product bundling -- offering multiple products at a "discounted" combined rate to get multiple yeses at once. Explain the porcupine close -- answering every buyer objection with a question that assumes the sale ("would you want the black one or the silver one?"). Explain the puppy dog close -- suggesting the buyer take the car home overnight to build emotional attachment before price is finalized. Explain high-pressure closing tactics and exactly how to neutralize each one. Explain the last-minute add-on that often appears at the signing table. Explain the Magnuson-Moss Warranty Act -- dealers must prove a repair is not covered before denying a claim, and buyers should know this law by name.

## ADD-ON REMOVAL SCRIPTS
Cover the most common add-ons dealers push. For each one: explain what it actually is, what it really costs, what the dealer says to keep it, and the exact word-for-word response to remove it. Cover: paint and fabric protection, GAP insurance (and note that GAP from your auto insurance company costs $3-5 per month versus $600-900 upfront at the dealer), extended warranty (note that these are service contracts not manufacturer warranties, and third-party administrators control claims), tire and wheel protection, VIN etching, nitrogen tire fill, key replacement, window tint markups, and payment protection products (job loss, disability -- note that exclusions are extensive and claim approval rates are low).

## TRADE-IN STRATEGY
Explain in plain terms how dealers undervalue trade-ins and why. Explain the difference between what a dealer pays for a trade (wholesale value) and what they sell it for (retail price). Explain why dealers prefer to bundle the trade-in negotiation with the vehicle price negotiation -- and how to keep them separate. Explain how to get a real trade-in offer before walking into the dealership using online tools.

## SUMMER 2026 BUYER ADVANTAGE
Market conditions right now favor buyers more than they have in years. Demand is softening. Off-lease inventory is increasing. Incentive financing is returning. Explain specifically how a buyer can use current market conditions as leverage -- competing dealer quotes, longer days on lot, end of month pressure, and the fact that dealers need volume more than they did during the shortage years.

## YOUR CHEAT SHEET
A concise reference the buyer can actually use at the table:
- The 5 rules of negotiating a car deal
- 6 word-for-word opening lines that work
- 3 things to never say to a dealer
- The exact words to use when walking away
- Red flags that mean you should leave immediately`);
    setR(t); setL(false);
    saveToolRun({ tool: "counter_guide", tier: "paid" });
  };
  return (
    <div>
      <div className="phd">
        <h2>Counter <span>Guide</span></h2>
        <p>The dealer's playbook. Now yours. Written from the inside.</p>
      </div>
      <div className="card">
        <div className="ch"><span className="clbl">Your Insider Briefing</span></div>
        <div className="cb">
          <div style={{fontSize:13,color:"var(--text2)",lineHeight:1.8,fontWeight:600,marginBottom:16}}>
            This guide covers how dealer profit actually works, what happens in the F&I office, add-on removal scripts, trade-in maximization tactics, and a printable cheat sheet for the table. Built from real dealership experience — not a blog post.
          </div>
          <div className="disclaimer"><strong>Note:</strong> This guide reflects general industry knowledge and insider experience. Tactics and pricing vary by region, brand, and dealership. Use this as your foundation — not your only source.</div>
          <button className="go-btn" onClick={run} disabled={loading||!!res}>{loading?"Building your guide...":"→ Generate My Counter Guide"}</button>
          {res && <button className="ghost-btn" style={{marginTop:8,width:"100%",textAlign:"center"}} onClick={()=>setR(null)}>↺ Regenerate</button>}
        </div>
      </div>
      {loading && <Loading msg="Writing your insider guide" web={false} />}
      {res && !loading && (
        <div className="card ranim">
          <div className="vstrip">
            <span className="badge ba">📋 COUNTER GUIDE</span>
            <div style={{flex:1}}/>
            <button className="ghost-btn" onClick={()=>{navigator.clipboard.writeText(res||"")}}>📋 Copy</button>
          </div>
          <MD text={res}/>
        </div>
      )}
    </div>
  );
}

function PrivacyPolicy() {
  return (
    <div className="tos-wrap">
      <h1>Privacy Policy</h1>
      <div className="tos-date">Effective Date: March 2025 - Last Updated: June 24, 2026</div>

      <h2>Our Philosophy</h2>
      <p>CNTROFR was built to keep your money in your pocket -- and your data is no different. We collect the absolute minimum required to operate. We do not sell it, share it, broker it, or monetize it in any way. Full stop.</p>

      <h2>What We Collect</h2>
      <p>We only collect information in the following situations:</p>
      <ul>
        <li><strong>Payment processing</strong> -- handled entirely by Stripe. We never see or store your full card number, CVV, or billing details. Stripe handles all of that under their own PCI-compliant infrastructure.</li>
        <li><strong>Contact form submissions</strong> -- if you reach out to us, we receive your name, email, and message. We use this only to respond to you.</li>
        <li><strong>Quote Scanner uploads</strong> -- if you use the Quote Scanner, the photo or PDF you upload is sent directly to the Anthropic Claude API to extract deal information (vehicle, price, fees, etc.) and pre-fill your form. The uploaded file itself is not stored by CNTROFR and is not saved to our servers or database. Only the data you review, confirm, and submit through the Deal Analyzer is treated the same as manually entered deal data, described below.</li>
        <li><strong>Anonymous deal data</strong> -- when you run a Deal Analyzer (whether filled manually or pre-filled via Quote Scanner and reviewed by you), we log a small set of anonymous, non-identifiable data points (vehicle make, model, year, condition, zip code, and asking price) to build market intelligence over time. This data is never linked to your identity, your payment, or any personal information. No name, no email, no device ID -- ever.</li>
        <li><strong>Access codes</strong> -- when a purchase is made, an access code is generated and stored to validate your session. No personal data is attached to the code.</li>
        <li><strong>Anonymous gap flags</strong> -- when our tools encounter a product, fee, or add-on they cannot fully evaluate, a brief anonymous description is logged for our internal review. This contains only the item name and a note -- no deal data, no personal information, and no connection to your session.</li>
      </ul>
      <p>The deal information you enter into our tools is sent directly to the Anthropic Claude API to generate your analysis. Beyond the anonymous data points described above, <strong>we do not retain your full deal inputs, trade-in details, add-on information, or uploaded quote documents on our servers.</strong></p>
      <p>A note on dealer quotes: dealer quote photos or PDFs sometimes contain your name, address, or other personal details printed by the dealership. We do not extract, store, or retain this information -- our Quote Scanner is designed to pull only vehicle and pricing fields, and the source file itself is discarded after processing.</p>
      <p>The Financing Intelligence feature performs a real-time web search to retrieve current auto loan rate averages and manufacturer incentive programs. This search does not involve any personal information -- no credit score, no SSN, no financial history. The vehicle make, model, year, and condition from your deal are used solely to retrieve relevant rate benchmarks. No personal financing data is ever collected or stored.</p>

      <h2>What We Do NOT Collect</h2>
      <ul>
        <li>Your Social Security number or government ID</li>
        <li>Your credit score or financial history</li>
        <li>Your home address or physical location beyond zip code</li>
        <li>Cookies for advertising or tracking purposes</li>
        <li>Behavioral data sold to third parties</li>
        <li>Any data from minors -- our platform is intended for adults 18 and over</li>
      </ul>

      <h2>Third-Party Services</h2>
      <p>We use a small number of trusted third-party services to operate:</p>
      <ul>
        <li><strong>Anthropic Claude API</strong> -- processes your deal analysis in real time. Subject to Anthropic's privacy policy at anthropic.com.</li>
        <li><strong>Stripe</strong> -- handles payment processing. Subject to Stripe's privacy policy at stripe.com.</li>
        <li><strong>Supabase</strong> -- stores anonymous deal data and access codes as described above. No personally identifiable information is stored. Subject to Supabase's privacy policy at supabase.com.</li>
        <li><strong>Cloudflare</strong> -- provides DNS, DDoS protection, and rate limiting. Standard network logs (IP address, request metadata) may be retained per Cloudflare's policy at cloudflare.com.</li>
        <li><strong>hCaptcha</strong> -- provides bot detection on form submissions. hCaptcha may process limited technical data (browser type, interaction behavior) to verify you are human. No personal information is collected or shared. Subject to hCaptcha's privacy policy at hcaptcha.com.</li>
        <li><strong>Formspree</strong> -- routes contact form submissions to our inbox. Subject to Formspree's privacy policy at formspree.io.</li>
        <li><strong>Vercel</strong> -- hosts the platform. Standard server logs (IP address, request time) may be retained per Vercel's policy.</li>
      </ul>
      <p>None of these providers are authorized to use your data for their own marketing or to sell it to anyone else.</p>

      <h2>No Advertising. Ever.</h2>
      <p>CNTROFR runs zero advertising -- on the platform or behind the scenes. We take no money from dealers, lenders, manufacturers, or ad networks. We are funded exclusively by direct consumer purchases. There is no financial incentive for us to share your data with anyone.</p>

      <h2>Data Retention</h2>
      <p>Contact form data is retained only as long as needed to resolve your inquiry. Anonymous deal data is retained indefinitely for market intelligence purposes and contains no personally identifiable information. Payment records and access codes are retained by Stripe and Supabase respectively per their standard compliance requirements. We do not maintain any internal database of user profiles or personal deal histories.</p>

      <h2>Your Rights</h2>
      <p>If you have contacted us and want your information removed from our records, email <a href="mailto:info@cntrofr.com" style={{color:"var(--y)"}}>info@cntrofr.com</a> and we will delete it promptly. Colorado residents have additional rights under the Colorado Privacy Act (CPA) -- contact us to exercise them.</p>

      <h2>Changes to This Policy</h2>
      <p>If we ever change how we handle data, we will update this page and the effective date at the top. We will never quietly change our data practices -- if something meaningful changes, we'll say so clearly.</p>

      <h2>Contact</h2>
      <p>Privacy questions? Email us at <a href="mailto:info@cntrofr.com" style={{color:"var(--y)"}}>info@cntrofr.com</a>. We respond to every message personally.</p>
    </div>
  );
}

function TermsOfService() {
  return (
    <div className="tos-wrap">
      <h1>Terms of Service</h1>
      <div className="tos-date">Effective Date: March 2025 - Last Updated: June 24, 2026</div>

      <h2>1. About CNTROFR</h2>
      <p>CNTROFR ("we," "us," or "our") is an independent consumer information platform operated by CNTROFR LLC, a Colorado limited liability company. We provide AI-assisted tools to help automobile buyers analyze vehicle deals, compare fees, audit dealer reviews, decode F&I products, fight add-on markups, and prepare negotiation strategies.</p>

      <h2>2. Not Legal, Financial, or Professional Advice</h2>
      <p>Everything on CNTROFR.com is for informational purposes only. Our analysis tools do not constitute legal advice, financial advice, credit counseling, or professional consulting of any kind. We do not recommend specific loan products, interest rates, lenders, or financing arrangements. Always consult a licensed professional before making significant financial decisions.</p>

      <h2>3. No Dealer Affiliations</h2>
      <p>CNTROFR has no financial relationships with any automobile dealership, manufacturer, lender, or financing institution. We do not accept advertising from dealers or receive referral fees of any kind. Our only revenue comes from direct consumer purchases.</p>

      <h2>4. Use of Our Tools</h2>
      <p>CNTROFR offers the following tools and packages, each with specific access levels:</p>
      <ul>
        <li><strong>Deal Analyzer</strong> -- free to all users. Analyzes vehicle price, trade-in, and add-ons with a GO / NEGOTIATE / WALK AWAY verdict.</li>
        <li><strong>Quote Scanner</strong> -- available with First Time Buyer, Single Report, and Pro Bundle access. Allows you to upload a photo or PDF of a dealer quote, which is analyzed to pre-fill Deal Analyzer fields. You are always shown the extracted information before submitting and are responsible for reviewing it for accuracy. Manual entry remains available at all times and is the most accurate option.</li>
        <li><strong>First Time Buyer Package</strong> -- paid access. Includes enhanced Deal Analyzer output with first-time buyer guidance covering down payment ratios, payment-to-income basics, online loan setup, and registration expectations, plus Quote Scanner access.</li>
        <li><strong>Single Report</strong> -- paid access. Unlocks all six tools for one browser session. Access is tied to the active browser session only. Closing or refreshing the tab ends access permanently. Users are presented with a pre-session warning confirming these terms before access is granted.</li>
        <li><strong>Pro Bundle</strong> -- paid access. Unlocks all six tools: Quote Scanner, Deal Analyzer, Fee Comparison, Review Purity, F&I Decoder, Add-On Fighter, and Counter Guide. Valid for 7 days from purchase.</li>
        <li><strong>Counter Guide</strong> -- paid access. AI-generated insider guide covering dealer profit structures, F&I office tactics, add-on removal scripts, and trade-in maximization.</li>
      </ul>
      <p>The Deal Analyzer supports four vehicle conditions: New, Used, Certified Pre-Owned (CPO), and Custom Order. Custom Order mode shifts analysis to F&I products, add-ons, fees, and delivery -- reflecting that vehicle price leverage is limited once a factory order is placed.</p>
      <p>By using CNTROFR tools, you agree to:</p>
      <ul>
        <li>Use the platform for personal, non-commercial purposes only</li>
        <li>Provide accurate information to receive meaningful analysis</li>
        <li>Only upload dealer quotes or documents that you have the right to share with us</li>
        <li>Understand that AI-generated analysis reflects general market knowledge, not guaranteed accuracy</li>
        <li>Understand that Quote Scanner extraction may contain errors and that you are responsible for reviewing all pre-filled fields before submitting</li>
        <li>Not reproduce, resell, or redistribute our analysis output without written permission</li>
      </ul>

      <h2>5. Payment & Refunds</h2>
      <p>All purchases are processed securely through Stripe. Access is granted immediately upon payment confirmation. Due to the instant digital nature of our services, <strong>all sales are final and non-refundable once an access code has been redeemed.</strong></p>
      <p><strong>Single Report sessions:</strong> Single Report access is explicitly limited to one browser session. Users are shown a pre-session disclosure confirming that closing or refreshing the tab ends access permanently and that no refunds will be issued for incomplete or unused sessions. By proceeding past this disclosure, users accept these terms in full.</p>
      <p><strong>Pro Bundle:</strong> Access expires 7 days from the date of purchase regardless of usage. No refunds are issued for unused days or unused tools within the access period.</p>
      <p>If you experience a verified technical failure on our end that prevented access entirely, contact us at info@cntrofr.com within 48 hours with details and we will review and make it right at our discretion.</p>

      <h2>6. Accuracy of Information</h2>
      <p>Our AI tools use current market data and are designed to reflect up-to-date dealer tactics, fee benchmarks, and pricing data. However, market conditions change rapidly. CNTROFR makes no warranty that any specific piece of analysis is accurate, complete, or applicable to your specific situation. Use our output as one informed input -- not the only one.</p>
      <p>The Financing Intelligence feature displays live auto loan rate ranges and manufacturer incentive program data sourced via real-time web search. These rates are based on current national averages and are provided for educational reference only. Actual rates depend on your individual credit profile, lender, loan term, and other factors. Manufacturer incentive programs and captive lender policies change frequently -- always verify current programs directly with the manufacturer and your lender before signing. CNTROFR does not collect, evaluate, or store any personal credit information.</p>

      <h2>7. Privacy & Data</h2>
      <p>We collect only what is necessary to process payments, deliver services, and improve our platform. When you use the Deal Analyzer, a small set of anonymous, non-identifiable data points (vehicle make, model, year, condition, zip code, and asking price) may be logged to build market intelligence. This data is never linked to your identity or payment information. If you use the Quote Scanner, your uploaded photo or PDF is sent to the Anthropic Claude API for processing and is not stored by CNTROFR. We do not sell, rent, or share your personal information with third parties, including automobile dealers, lenders, or advertisers. For full details, see our Privacy Policy.</p>
      <p>Form submissions are protected by hCaptcha bot detection. hCaptcha processes limited technical data to verify you are human. No personal information is collected or shared as part of this process.</p>

      <h2>8. Intellectual Property</h2>
      <p>All content, design, code, and analysis frameworks on CNTROFR.com are the intellectual property of CNTROFR LLC. You may not copy, reproduce, or build derivative products from our platform without express written consent.</p>

      <h2>9. Limitation of Liability</h2>
      <p>CNTROFR LLC shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of our platform or reliance on our analysis. Our maximum liability in any circumstance is limited to the amount you paid for the service in question.</p>

      <h2>10. Governing Law</h2>
      <p>These Terms are governed by the laws of the State of Colorado. Any disputes shall be resolved in the courts of Denver County, Colorado.</p>

      <h2>11. Changes to These Terms</h2>
      <p>We may update these Terms from time to time. Continued use of the platform after changes constitutes acceptance of the updated Terms. We'll always post the effective date at the top of this page.</p>

      <h2>12. Contact</h2>
      <p>Questions about these Terms? Email us at <a href="mailto:info@cntrofr.com" style={{color:"var(--y)"}}>info@cntrofr.com</a>. We respond to every message.</p>
    </div>
  );
}

const FAQS = [
  {q:"Does CNTROFR sell my information or refer me to dealers?",a:"Never. CNTROFR takes zero money from dealers, lenders, manufacturers, or advertising networks. We do not generate leads, sell your contact information, or refer you to any dealership. The moment we do that, the platform is worthless -- our entire value is that we work for you, not for them. Our only revenue comes from direct purchases by buyers like you."},
  {q:"Do you hate car salespeople?",a:"Definitely not. Your salesperson is just that -- a person. If you like their vibe and they listen to your needs, stick with them and let them earn your business. In most cases, the overcharges and the greed don't go to the salesperson. That money goes to the folks in the suits, not the ones working long hours and holidays to move metal."},
  {q:"What does a good deal actually look like?",a:"A great deal is good for both people at the table. CNTROFR exists to expose greed -- not to burn down the industry. Lots of people love cars. Lots of salespeople love selling them. That relationship can and should be a good one. The profit pressure that makes car buying miserable doesn't come from the floor -- it comes from ownership and management structures built to extract maximum margin from every deal. Your salesperson often sees none of it. If you walked out feeling respected, paid a fair price, and weren't loaded up with junk you didn't ask for -- that's a good deal. And if your salesperson made it happen, leave them a five-star review by name. That review feeds their family and builds their career. The greed at the top doesn't get to take that from them."},
  {q:"Why no subscription or app?",a:"Simple -- use us when you need us. CNTROFR is built for the moment you're ready to make a large auto purchase, not something that needs to live on your phone year-round. You're not always car shopping, and you shouldn't be. Pay once, get what you need, go enjoy your new ride."},
  {q:"How do you protect my personal information?",a:"We keep it minimal by design. While some information is necessary for payment processing, we'd rather not hold onto your personal data at all. CNTROFR exists to keep your money with you -- not to collect, sell, or monetize your information in any way."},
  {q:"Does CNTROFR work for used cars too?",a:"Absolutely. Whether you're buying new off the lot or used from a dealer, the same tactics apply. Inflated prices, lowball trade-ins, junk add-ons, and mystery fees don't discriminate -- and neither do our tools. One firm piece of advice though: we do not recommend 'Buy Here, Pay Here' lots under any circumstances. If a dealership doesn't have established relationships with outside banks and lenders, something is off. Reputable dealers work with real financial institutions. If they're financing everything in-house, that's a red flag worth walking away from before you ever get to the numbers."},
  {q:"Can you help me find a vehicle?",a:"That's not our lane. There are plenty of great marketplace tools out there for that part of the process. We're here once you've found the one you want and it's time to talk numbers."},
  {q:"What if the dealer won't budge?",a:"Having the right information is powerful, but the dealership still has to agree to terms. If they won't move, be confident and walk. They are not the only game in town, and a dealer that won't negotiate fairly on one line item is likely doing it everywhere else too."},
  {q:"Is this legit for both new and used car dealerships?",a:"Yes. Franchise dealers, independent lots, certified pre-owned programs -- the F&I playbook and the fee games are industry-wide. CNTROFR is built on insider knowledge from both sides of that desk."},
  {q:"Why is your Pro subscription only 7 days?",a:"Simple -- if you're not ready to pull the trigger in 7 days, you're not prepared to make a purchase. Do your homework first, then come back when you're ready to move. We'll be here. No pressure, no recurring charges, no gotchas."},
  {q:"What should I spend all the money I saved on?",a:"Honestly? You could save it for registration, insurance, or your first service appointment. But we'd probably spend it on sandwiches and video games. And that's exactly the point -- it's your money. Your choice. We just made sure it stayed yours."},
  {q:"This is my first time buying a car. Is CNTROFR for me?",a:"Absolutely -- and we built something specifically for you. First time buyers are the most vulnerable in the dealership. You don't know what you don't know, and the dealer knows everything. Use our First Time Buyer tool before you go anywhere near a showroom. Things change fast in this industry and most people only do this every 5-10 years. You deserve to walk in prepared."},
  {q:"Is CNTROFR for shoppers or buyers?",a:"Buyers. If you're still deciding what you want, come back when you're ready to ink up. We're built for the person who knows what they want and is ready to go get it on fair terms. That focus is exactly what makes us different from every other car research site out there."},
  {q:"I have a question that isn't answered here. How do I reach you?",a:"Email us directly at info@cntrofr.com -- we respond to every message personally. You can also use the contact form on this page and we'll get back to you within 24 hours."},
];

const TOP_FAQS = 4;

function FAQ({ lang = "en" }) {
  const [open, setOpen] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? FAQS : FAQS.slice(0, TOP_FAQS);
  return (
    <div className="sec">
      <div className="sec-eye">{lang==="es"?"Tienes Preguntas":"Got Questions"}</div>
      <h2 className="sec-h2">{lang==="es"?"Preguntas Frecuentes":"Frequently Asked"}</h2>
      <p className="sec-sub">{lang==="es"?"Todo lo que necesitas saber antes de comprar.":"Everything you need to know before you buy."}</p>
      <div className="faq-list">
        {visible.map((f,i)=>(
          <div key={i} className={`faq-item ${open===i?"open":""}`}>
            <div className="faq-q" onClick={()=>setOpen(open===i?null:i)}>
              <span>{f.q}</span>
              <span className="faq-icon">+</span>
            </div>
            {open===i && <div className="faq-a">{f.a}</div>}
          </div>
        ))}
      </div>
      {!showAll && (
        <div style={{textAlign:"center",marginTop:16}}>
          <button
            onClick={()=>setShowAll(true)}
            style={{background:"none",border:"2px solid var(--b1)",color:"var(--muted)",fontFamily:"Nunito",fontSize:12,fontWeight:800,padding:"10px 28px",borderRadius:100,cursor:"pointer",letterSpacing:".5px",transition:"all .2s"}}
            onMouseOver={e=>{e.target.style.borderColor="var(--y)";e.target.style.color="var(--y)";}}
            onMouseOut={e=>{e.target.style.borderColor="var(--b1)";e.target.style.color="var(--muted)";}}
          >
            {lang==="es"?`Ver Todas las Preguntas (${FAQS.length - TOP_FAQS} más) ↓`:`See All Questions (${FAQS.length - TOP_FAQS} more) ↓`}
          </button>
        </div>
      )}
      {showAll && (
        <div style={{textAlign:"center",marginTop:16}}>
          <button
            onClick={()=>{setShowAll(false);setOpen(null);}}
            style={{background:"none",border:"2px solid var(--b1)",color:"var(--muted)",fontFamily:"Nunito",fontSize:12,fontWeight:800,padding:"10px 28px",borderRadius:100,cursor:"pointer",letterSpacing:".5px",transition:"all .2s"}}
            onMouseOver={e=>{e.target.style.borderColor="var(--y)";e.target.style.color="var(--y)";}}
            onMouseOut={e=>{e.target.style.borderColor="var(--b1)";e.target.style.color="var(--muted)";}}
          >
            {lang==="es"?"Mostrar Menos ↑":"Show Less ↑"}
          </button>
        </div>
      )}
    </div>
  );
}

function Contact() {
  const [f, setF] = useState({name:"",email:"",subject:"General Question",message:""});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const s = k => e => setF(p=>({...p,[k]:e.target.value}));
  const send = async () => {
    setSending(true);
    try {
      await fetch("https://formspree.io/f/xpwzgkdq", {
        method:"POST", headers:{"Content-Type":"application/json","Accept":"application/json"},
        body: JSON.stringify(f)
      });
    } catch(e) {}
    setSending(false); setSent(true);
  };
  const ready = f.name && f.email && f.message;
  return (
    <div className="sec">
      <div className="sec-eye">We're Here</div>
      <h2 className="sec-h2">Get In Touch</h2>
      <p className="sec-sub">Real people. Real answers. We respond to every message.</p>
      <div className="contact-wrap">
        <div className="contact-info">
          <div className="ci-item"><div className="ci-icon">📬</div><div><div className="ci-label">Email</div><div className="ci-val"><a href="mailto:info@cntrofr.com">info@cntrofr.com</a></div></div></div>
          <div className="ci-item"><div className="ci-icon"></div><div><div className="ci-label">Response Time</div><div className="ci-val">Within 24 hours</div></div></div>
          <div className="ci-item"><div className="ci-icon">🔒</div><div><div className="ci-label">Privacy</div><div className="ci-val">We never share your info. Ever.</div></div></div>
          <div className="ci-item"><div className="ci-icon">🚗</div><div><div className="ci-label">What We Help With</div><div className="ci-val">Deal questions, tool support, refunds, and anything else on your mind.</div></div></div>
        </div>
        <div className="contact-form">
          <div className="cf-title">Send a Message</div>
          {sent ? (
            <div className="cf-success">✓ Message sent! We'll get back to you within 24 hours.</div>
          ) : (
            <>
              <div className="cf-field"><label>Name</label><input placeholder="First name is fine" value={f.name} onChange={s("name")} /></div>
              <div className="cf-field"><label>Email</label><input type="email" placeholder="you@email.com" value={f.email} onChange={s("email")} /></div>
              <div className="cf-field"><label>Subject</label>
                <select value={f.subject} onChange={s("subject")}>
                  <option>General Question</option>
                  <option>System Issue</option>
                  <option>Feedback</option>
                </select>
                {f.subject==="System Issue" && (
                  <div style={{marginTop:8,background:"rgba(255,214,0,.06)",border:"1px solid rgba(255,214,0,.15)",borderRadius:8,padding:"10px 12px",fontSize:11,color:"var(--muted)",fontWeight:700,lineHeight:1.7}}>
                    <strong style={{color:"var(--y)"}}>System Requirements:</strong> CNTROFR runs best on Chrome or Safari (latest version). Requires a stable internet connection -- analyses involve live AI processing and web search. If a tool is spinning for more than 60 seconds, try refreshing and resubmitting. Mobile is supported but desktop is recommended for best experience.
                  </div>
                )}
              </div>
              <div className="cf-field"><label>Message</label><textarea placeholder="What's on your mind?" value={f.message} onChange={s("message")} /></div>
              <button className="cf-btn" onClick={send} disabled={!ready||sending}>{sending?"Sending...":"Send Message →"}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MissionPage() {
  return (
    <div className="mission-page">
      <h1>Our Mission</h1>
      <div className="mp-date">CNTROFR LLC - Denver, Colorado - Built For Buyers</div>

      <h2>Who Built This — And Why Should You Trust It?</h2>
      <p>Fair question. You're about to hand a dealership tens of thousands of dollars. You should be skeptical of everyone in the room — including us.</p>
      <p>CNTROFR was built by someone who spent years inside automotive retail — on the sales floor and in the finance office. That means sitting in the training sessions dealers run to maximize profit per deal. Learning the objection scripts. Watching how buyers get moved from price negotiation to payment negotiation without realizing it. Seeing firsthand which add-ons have real value and which ones exist purely to pad gross.</p>
      <p><strong>That experience is the intelligence layer behind every tool on this platform.</strong> Not a blog post. Not scraped data. Actual dealership knowledge — flipped to work for you instead of against you.</p>

      <h2>Why We Built This</h2>
      <p>The dealership has lawyers, trainers, and ten thousand deals worth of experience working against you every single day. Their F&I managers go to school on how to extract maximum profit from every buyer that sits across that desk — including you. They have scripts for every objection. They know when you're nervous. They know when you're in love with the car.</p>
      <p>We studied the same playbooks. We sat in the same training sessions. <strong>Now you do too.</strong></p>
      <p>CNTROFR was built because that information gap is fixable — and nobody was fixing it. Not the dealer-funded comparison sites. Not the concierge services that charge $999 and still share your information with dealers. Not the "free" tools that sell your data the moment you click submit.</p>

      <h2>Zero Dealer Affiliations. Ever.</h2>
      <p>CNTROFR has no financial relationships with any dealership, manufacturer, lender, or advertising network — and never will. Our only revenue comes from buyers who use the platform. The moment we take dealer money, the platform is worthless. We built the entire business model around that fact.</p>
      <p>No ads. No lead generation. No referral fees. If it conflicts with the buyer's interest, it doesn't exist here.</p>

      <h2>Real-Time Market Intelligence</h2>
      <p>Every deal analyzed makes the platform smarter. Every submission logs anonymous data — make, model, year, condition, zip, asking price — to build a real-time intelligence layer. No personal information. No tracking. No identity. Just market truth that gets sharper every day.</p>
      <p><strong>That's the mission: make the deal fair, one anonymous data point at a time.</strong></p>

      <h2>For Buyers. Not Shoppers.</h2>
      <p>We're not helping you find a car. We're making sure the one you already found doesn't cost you more than it should. Come back when you're ready to sign — we'll be ready to counter.</p>
      <p style={{fontFamily:"'Bebas Neue'",fontSize:22,letterSpacing:2,color:"var(--y)",marginTop:24}}>"I built the tool I wish my customers had."</p>
      <p style={{color:"var(--muted)",fontSize:12}}>-- The CNTROFR Team - Built in Denver, Colorado</p>
    </div>
  );
}

const ARSENAL_DETAIL = {
  en: [
    { id:"scan", icon:"📄", name:"Quote Scanner", free:false,
      what:"Upload a photo or PDF of your actual dealer quote or buyer's order, and CNTROFR reads it line by line -- no typing, no re-entering numbers by hand.",
      catches:["Reads Reynolds & Reynolds, CDK, Dealertrack, VinSolutions, and Tekion formats -- the actual software dealers use","Flags line items you never asked for","Feeds straight into the same analysis as manual entry, just faster"] },
    { id:"deal", icon:"🔍", name:"Deal Analyzer", free:true,
      what:"The core breakdown -- price, trade-in, and add-ons -- run against real-time market data for your specific vehicle, mileage, and ZIP code.",
      catches:["Whether your price is above, at, or below what the same car is actually selling for nearby","Add-on markup and trade-in lowballing","A clear GO, NEGOTIATE, or WALK verdict -- not just a wall of numbers"] },
    { id:"fee", icon:"💰", name:"Fee Comparison", free:false,
      what:"Checks your doc fee and other line-item fees against what's actually normal and legal in your state -- live, not from a stale table someone built two years ago.",
      catches:["Fees padded above your state's benchmark","Fees that shouldn't be itemized as a separate line at all","The difference between a fee that's negotiable and one that's mandated by law"] },
    { id:"review", icon:"🔎", name:"Review Purity", free:false,
      what:"Looks past the star rating to who actually owns the dealership -- corporate group, employee culture, complaint history -- so you know who's about to get your money.",
      catches:["Large corporate groups known for trained sales pressure (Asbury, Lithia, AutoNation, Penske, Sonic, and others)","Patterns across complaints, not just one bad review taken out of context","Whether good reviews look earned or incentivized"] },
    { id:"fi", icon:"🔓", name:"F&I Decoder", free:false,
      what:"Every product pitched in the finance office -- extended warranty, GAP, paint protection, etched VIN -- decoded to what it actually costs the dealer versus what you're being asked to pay.",
      catches:["Products marked up 300%+ over dealer cost","Products you may already have covered elsewhere (insurance, credit card, manufacturer warranty)","A clean, direct exit line for each product you don't want"] },
    { id:"addons", icon:"🥊", name:"Add-On Fighter", free:false,
      what:"Dealer-installed add-ons -- paint sealant, nitrogen tires, VIN etching, fabric protection -- identified and given word-for-word removal scripts.",
      catches:["Which add-ons are near-pure profit with almost no real cost","Which ones are genuinely non-negotiable by dealer policy (rare, but it happens)","Exactly what to say to get it off the bill"] },
  ],
  es: [
    { id:"scan", icon:"📄", name:"Escáner de Cotización", free:false,
      what:"Sube una foto o PDF de tu cotización real del concesionario o la orden de compra, y CNTROFR la lee línea por línea -- sin escribir ni volver a ingresar números a mano.",
      catches:["Lee formatos de Reynolds & Reynolds, CDK, Dealertrack, VinSolutions y Tekion -- el software real que usan los concesionarios","Marca artículos que nunca pediste","Se conecta directo al mismo análisis que el ingreso manual, solo que más rápido"] },
    { id:"deal", icon:"🔍", name:"Analizador de Ofertas", free:true,
      what:"El desglose principal -- precio, intercambio y extras -- comparado con datos de mercado en tiempo real para tu vehículo, kilometraje y código postal específicos.",
      catches:["Si tu precio está arriba, igual o debajo de lo que el mismo auto se vende realmente cerca de ti","Sobreprecio en extras y ofertas bajas en tu auto de intercambio","Un veredicto claro de PROCEDE, NEGOCIA o RETÍRATE -- no solo una pared de números"] },
    { id:"fee", icon:"💰", name:"Comparación de Tarifas", free:false,
      what:"Compara tu tarifa de documentación y otras tarifas por línea con lo que es realmente normal y legal en tu estado -- en vivo, no de una tabla desactualizada de hace dos años.",
      catches:["Tarifas infladas por encima del punto de referencia de tu estado","Tarifas que ni siquiera deberían aparecer como línea separada","La diferencia entre una tarifa negociable y una exigida por ley"] },
    { id:"review", icon:"🔎", name:"Pureza de Reseñas", free:false,
      what:"Va más allá de la calificación de estrellas para ver quién realmente es dueño del concesionario -- grupo corporativo, cultura laboral, historial de quejas -- para que sepas a quién le vas a dar tu dinero.",
      catches:["Grandes grupos corporativos conocidos por presión de ventas entrenada (Asbury, Lithia, AutoNation, Penske, Sonic, y otros)","Patrones en las quejas, no solo una mala reseña fuera de contexto","Si las buenas reseñas parecen genuinas o incentivadas"] },
    { id:"fi", icon:"🔓", name:"Decodificador F&I", free:false,
      what:"Cada producto que te ofrecen en la oficina de financiamiento -- garantía extendida, GAP, protección de pintura, grabado de VIN -- decodificado para mostrar lo que realmente le cuesta al concesionario contra lo que te piden pagar.",
      catches:["Productos con sobreprecio de 300%+ sobre el costo del concesionario","Productos que ya podrías tener cubiertos en otro lado (seguro, tarjeta de crédito, garantía de fábrica)","Una línea de salida clara y directa para cada producto que no quieras"] },
    { id:"addons", icon:"🥊", name:"Luchador de Extras", free:false,
      what:"Extras instalados por el concesionario -- sellador de pintura, llantas con nitrógeno, grabado de VIN, protección de tela -- identificados con guiones palabra por palabra para eliminarlos.",
      catches:["Qué extras son casi pura ganancia con costo real casi nulo","Cuáles son genuinamente no negociables por política del concesionario (raro, pero pasa)","Exactamente qué decir para quitarlo de la factura"] },
  ],
};

function ArsenalPage({ lang, setView, setTab, buy, canUse, access }) {
  const items = ARSENAL_DETAIL[lang] || ARSENAL_DETAIL.en;
  const open = t => {
    const hasScanAccess = access.includes("fee") || access.includes("ftb");
    if (t.id==="scan") { if (hasScanAccess) { setView("tools"); setTab("deal"); window.scrollTo(0,0); } else { buy(PLANS[2]); } }
    else if (!canUse(t.id)) { buy(PLANS[2]); }
    else { setView("tools"); setTab(t.id); window.scrollTo(0,0); }
  };
  return (
    <div className="sec" style={{maxWidth:840}}>
      <div className="sec-eye">{lang==="es"?"Cómo Funciona":"How It Works"}</div>
      <h2 className="sec-h2">{lang==="es"?"Seis Herramientas. Cada Ángulo Cubierto.":"Six Tools. Every Angle Covered."}</h2>
      <p className="sec-sub">{lang==="es"?"Esto es exactamente lo que hace cada herramienta, y exactamente lo que detecta. Sin misterios antes de pagar.":"Here's exactly what each tool does, and exactly what it catches. No mystery before you pay."}</p>
      <div style={{display:"flex",flexDirection:"column",gap:18,marginTop:8}}>
        {items.map((t,i)=>(
          <div key={i} style={{background:"var(--bg3)",border:"1px solid var(--b1)",borderRadius:16,padding:"24px 26px"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,flexWrap:"wrap"}}>
              <span style={{fontSize:26}}>{t.icon}</span>
              <span style={{fontFamily:"'Bebas Neue'",fontSize:22,letterSpacing:1,color:"var(--text)"}}>{t.name}</span>
              {t.free?<span className="tag-free">{lang==="es"?"Gratis":"Free"}</span>:<span className="tag-pro">Pro</span>}
            </div>
            <p style={{fontSize:14,color:"var(--text2)",lineHeight:1.6,fontWeight:600,marginBottom:14}}>{t.what}</p>
            <div style={{fontSize:10,fontWeight:900,letterSpacing:1,color:"var(--muted)",marginBottom:8}}>{lang==="es"?"QUÉ DETECTA":"WHAT IT CATCHES"}</div>
            <ul style={{margin:0,paddingLeft:18,display:"flex",flexDirection:"column",gap:6}}>
              {t.catches.map((c,j)=>(<li key={j} style={{fontSize:13,color:"var(--text2)",lineHeight:1.5,fontWeight:600}}>{c}</li>))}
            </ul>
            <button className="hbtn-y" style={{marginTop:16,padding:"9px 20px",fontSize:12}} onClick={()=>open(t)}>
              {t.free?(lang==="es"?"Probar Gratis →":"Try It Free →"):(lang==="es"?"Desbloquear →":"Unlock It →")}
            </button>
          </div>
        ))}
      </div>
      <div style={{textAlign:"center",marginTop:36}}>
        <button className="hbtn-y" style={{padding:"13px 28px",fontSize:14}} onClick={()=>{setView("home");window.scrollTo(0,0);setTimeout(()=>document.getElementById("pricing")?.scrollIntoView(),50);}}>
          {lang==="es"?"Ver Precios →":"See Pricing →"}
        </button>
      </div>
    </div>
  );
}


const BETA_CODE = "CNTROFR-BETA";
const BETA_ACTIVE = true;

const PLANS = [
  {id:"firsttime",name:"First Time Buyer",nameEs:"Primer Comprador",price:25,desc:"Your first car deal doesn't have to be your worst one.",descEs:"Tu primera compra de auto no tiene que ser la peor.",features:["5-point dealer prep guide","What dealers assume you already know","Hidden costs that hit after you sign","Co-signer vs. first-time buyer programs","📄 Quote Scanner -- upload your dealer quote","Full Deal Analyzer access","30 days access. No account. No login. Ever."],featuresEs:["Guía de preparación de 5 puntos","Lo que los concesionarios asumen que ya sabes","Costos ocultos que aparecen después de firmar","Co-firmante vs. programas para primeros compradores","📄 Escáner de Cotización -- sube tu cotización del concesionario","Acceso completo al Analizador de Ofertas","30 días de acceso. Sin cuenta. Sin inicio de sesión. Nunca."],btn:"out",unlocks:["deal","ftb"]},
  {id:"single",name:"Single Report",nameEs:"Reporte Individual",price:20,desc:"Every tool. One deal. One session.",descEs:"Todas las herramientas. Una oferta. Una sesión.",features:["All 6 tools unlocked","Deal Analyzer -- full breakdown","Fee Comparison, F&I Decoder, Add-On Fighter","Counter Guide included","One session -- close the tab, access ends","No account. No login. Ever."],featuresEs:["Las 6 herramientas desbloqueadas","Analizador de Ofertas -- desglose completo","Comparación de Tarifas, Decodificador F&I, Luchador de Extras","Guía de Contraoferta incluida","Una sesión -- cierra la pestaña, el acceso termina","Sin cuenta. Sin inicio de sesión. Nunca."],btn:"out",unlocks:["deal","fee","review","fi","addons","guide"]},
  {id:"pro",name:"Pro Bundle",nameEs:"Pro Bundle",price:49,hot:true,desc:"Every tool you need before and during the deal.",descEs:"Todas las herramientas que necesitas antes y durante la oferta.",features:["All 6 tools unlocked","📄 Quote Scanner -- upload your dealer quote","Fee Comparison with live data","Review Purity audit","F&I Decoder + removal scripts","Add-On Fighter with counter scripts","Valid 7 days, unlimited uses","Working multiple deals? This is for you."],featuresEs:["Las 6 herramientas desbloqueadas","📄 Escáner de Cotización -- sube tu cotización del concesionario","Comparación de Tarifas con datos en vivo","Auditoría de Pureza de Reseñas","Decodificador F&I + guiones para eliminar extras","Luchador de Extras con guiones de contraataque","Válido 7 días, usos ilimitados","¿Trabajando varias ofertas? Esto es para ti."],btn:"fill",unlocks:["deal","fee","review","fi","addons","guide"]},
  {id:"guide",name:"Negotiation Guide & Counter Scripts",nameEs:"Guía de Negociación y Guiones de Contraoferta",price:20,desc:"Know the game before you play it. Built from the dealer side, written for the buyer.",descEs:"Conoce el juego antes de jugarlo. Creado desde el lado del concesionario, escrito para el comprador.",features:["How dealer profit actually works","Negotiation strategy from offer to close","Finance office playbook -- exposed","Add-on and upsell counter scripts","Trade-in positioning","Printable cheat sheet"],featuresEs:["Cómo funciona realmente la ganancia del concesionario","Estrategia de negociación desde la oferta hasta el cierre","El manual de la oficina de financiamiento -- expuesto","Guiones de contraataque para extras y ventas adicionales","Posicionamiento de intercambio","Hoja de referencia para imprimir"],btn:"out",unlocks:["guide"]},
];

function PayModal({plan,onClose,onSuccess,lang="en"}) {
  const [busy,setBusy]=useState(false);
  const [promoOpen,setPromoOpen]=useState(false);const [promoCode,setPromoCode]=useState("");const [promoMsg,setPromoMsg]=useState("");
  const [error,setError]=useState("");

  const applyPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    if (BETA_ACTIVE && code === BETA_CODE) { onSuccess(plan); return; }
    setPromoMsg(lang==="es"?"Verificando...":"Checking...");
    try {
      const r = await fetch("https://cntrofr.com/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const d = await r.json();
      if (d.success) { onSuccess({ ...plan, unlocks: d.unlocks }); }
      else { setPromoMsg(d.error || (lang==="es"?"Código no reconocido o aún no activo.":"Code not recognized or not yet active.")); }
    } catch(e) { setPromoMsg(lang==="es"?"Error de conexión. Intenta de nuevo.":"Connection error. Please try again."); }
  };

  const pay = async () => {
    setBusy(true); setError("");
    try {
      const r = await fetch("https://cntrofr.com/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id }),
      });
      const d = await r.json();
      if (d.url) {
        window.location.href = d.url;
      } else {
        setError(d.error || (lang==="es"?"Algo salió mal. Intenta de nuevo.":"Something went wrong. Please try again."));
        setBusy(false);
      }
    } catch(e) {
      setError(lang==="es"?"Error de conexión. Intenta de nuevo.":"Connection error. Please try again.");
      setBusy(false);
    }
  };

  return (
    <div className="mbg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="mbox">
        <div className="mtop"><h3>{lang==="es"?"Completar Compra":"Complete Purchase"}</h3><button className="mx" onClick={onClose}>×</button></div>
        <div className="mbody">
          <div className="order-sum">
            <div className="orow"><span style={{fontFamily:"Nunito",fontSize:11,fontWeight:900,letterSpacing:1,textTransform:"uppercase",color:"var(--muted)"}}>{lang==="es"?"Total a Pagar":"Total Due"}</span><span className="oprice">${plan.price}</span></div>
            <div className="oname">CNTROFR -- {lang==="es"?(plan.nameEs||plan.name):plan.name}</div>
          </div>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:900,letterSpacing:1,textTransform:"uppercase",color:"var(--muted)",marginBottom:8}}>{lang==="es"?"¿Ya tienes un código de acceso?":"Already have an access code?"}</div>
            <div style={{display:"flex",gap:8}}>
              <input value={promoCode} onChange={e=>setPromoCode(e.target.value)} placeholder={lang==="es"?"INGRESA TU CÓDIGO":"ENTER YOUR CODE"} style={{flex:1,background:"var(--bg)",border:"2px solid var(--b2)",color:"var(--text)",fontFamily:"JetBrains Mono",fontSize:15,fontWeight:700,padding:"12px 16px",borderRadius:8,outline:"none",textTransform:"uppercase",letterSpacing:2}} />
              <button onClick={applyPromo} style={{background:"var(--y)",color:"#111",border:"none",padding:"12px 22px",fontFamily:"Nunito",fontSize:13,fontWeight:900,cursor:"pointer",borderRadius:8,whiteSpace:"nowrap"}}>{lang==="es"?"Aplicar":"Apply"}</button>
            </div>
            {promoMsg&&<div style={{fontSize:12,fontWeight:800,marginTop:8,color:(promoMsg==="Checking..."||promoMsg==="Verificando...")?"var(--muted)":"var(--red)"}}>{promoMsg}</div>}
            <div style={{fontSize:10,color:"var(--muted)",marginTop:6,fontWeight:700}}>{lang==="es"?"Revisa tu correo después de la compra — el código llega en 2 minutos. Revisa spam si no lo ves.":"Check your email after purchase — code arrives within 2 minutes. Check spam if you don't see it."}</div>
          </div>
          <div style={{height:1,background:"var(--b1)",margin:"4px 0 16px"}} />
          {error&&<div style={{background:"rgba(255,68,68,.1)",border:"1px solid rgba(255,68,68,.3)",borderRadius:8,padding:"10px 14px",fontSize:12,color:"var(--red)",fontWeight:700,marginBottom:12}}>{error}</div>}
          <button className="paybtn" onClick={pay} disabled={busy}>
            {busy ? (lang==="es"?"Redirigiendo a Stripe...":"Redirecting to Stripe...") : (lang==="es"?`Pagar $${plan.price} — Pago Seguro`:`Pay $${plan.price} — Secure Checkout`)}
          </button>
          <div className="secnote"><span>🔒</span> {lang==="es"?"Protegido por Stripe — No requiere cuenta — Código de acceso instantáneo por correo":"Secured by Stripe — No account required — Instant access code via email"}</div>
          <div style={{fontSize:10,color:"var(--muted)",textAlign:"center",marginTop:8,fontWeight:600,lineHeight:1.6}}>
            {lang==="es"?"CNTROFR nunca te pedirá información personal o detalles de pago. Revisa spam si tu código no llega en 2 minutos.":"CNTROFR will never contact you asking for personal information or payment details. Check spam if your code doesn't arrive within 2 minutes."}
          </div>
        </div>
      </div>
    </div>
  );
}

const TABS = [
  {id:"deal",label:"Deal Analyzer",free:true,component:DealAnalyzer},
  {id:"fee",label:"Fee Comparison",free:false,component:FeeComparison},
  {id:"review",label:"Review Purity",free:false,component:ReviewPurity},
  {id:"fi",label:"F&I Decoder",free:false,component:FIDecoder},
  {id:"addons",label:"Add-On Fighter",free:false,component:AddOnFighter},
  {id:"guide",label:"Counter Guide",free:false,component:CounterGuide},
];

// Maps URL paths <-> view state. /tools also encodes the active tab as a sub-path.
const PATH_TO_VIEW = {
  "/": "home",
  "/mission": "mission",
  "/contact": "contact",
  "/privacy": "privacy",
  "/terms": "tos",
  "/tools": "tools",
  "/faq": "faq",
  "/blog": "blog",
  "/the-arsenal": "arsenal",
  "/blog/dealer-doc-fees-explained": "blog_doc_fees",
  "/blog/fi-products-decoded": "blog_fi",
  "/blog/how-to-negotiate-car-add-ons": "blog_addons",
  "/blog/car-shopper-vs-car-buyer": "blog_shopper",
};
const VIEW_TO_PATH = {
  home: "/",
  mission: "/mission",
  contact: "/contact",
  privacy: "/privacy",
  faq: "/faq",
  tos: "/terms",
  tools: "/tools",
  blog: "/blog",
  arsenal: "/the-arsenal",
  blog_doc_fees: "/blog/dealer-doc-fees-explained",
  blog_fi: "/blog/fi-products-decoded",
  blog_addons: "/blog/how-to-negotiate-car-add-ons",
  blog_shopper: "/blog/car-shopper-vs-car-buyer",
  admin: "/", // admin stays hidden, never reflected in URL
};
const TAB_TO_SLUG = { deal:"deal-analyzer", fee:"fee-comparison", review:"review-purity", fi:"fi-decoder", addons:"add-on-fighter", guide:"counter-guide" };
const SLUG_TO_TAB = Object.fromEntries(Object.entries(TAB_TO_SLUG).map(([k,v])=>[v,k]));

const PAGE_META = {
  home: { title:"CNTROFR -- AI Car Deal Analyzer & Pocket Consultant", desc:"Your pocket consultant for car buying. AI-powered deal analysis, fee breakdowns, F&I decoding, dealer review audits, and word-for-word counter scripts. No account needed." },
  tools: { title:"Free Deal Analyzer & Tools -- CNTROFR", desc:"Run your deal through CNTROFR's AI tools -- Deal Analyzer, Fee Comparison, Review Purity, F&I Decoder, and Add-On Fighter." },
  arsenal: { title:"What Each Tool Actually Does -- CNTROFR", desc:"A full breakdown of CNTROFR's six tools -- Quote Scanner, Deal Analyzer, Fee Comparison, Review Purity, F&I Decoder, and Add-On Fighter -- and exactly what each one catches." },
  mission: { title:"Our Mission -- CNTROFR", desc:"CNTROFR was built by an automotive insider to give car buyers the same playbook dealers use. Zero dealer kickbacks. Ever." },
  blog: { title:"Car Buying Guides & Resources -- CNTROFR", desc:"Expert car buying guides from a certified automotive insider. Doc fees, F&I products, add-on tactics, and everything dealers hope you never learn." },
  blog_doc_fees: { title:"What Is a Dealer Doc Fee — And Is Yours Too High? | CNTROFR", desc:"Doc fees vary wildly by state and dealer. Here's what's normal, what's inflated, and exactly how to use a high doc fee as leverage on your vehicle price." },
  blog_fi: { title:"Every F&I Product Decoded — Dealer Cost vs. What You Pay | CNTROFR", desc:"Finance office products decoded by a certified F&I insider. What each product actually costs the dealer, what it's worth to you, and how to say no." },
  blog_addons: { title:"How to Negotiate Dealer Add-Ons (And Remove the Ones You Don't Want) | CNTROFR", desc:"Dealers pre-install add-ons hoping you'll just pay. Here's how to identify force adds, what they're actually worth, and word-for-word scripts to remove them." },
  blog_shopper: { title:"Car Shopper vs. Car Buyer — Which One Are You? | CNTROFR", desc:"The most expensive car mistake isn't overpaying. It's overpaying for the wrong car. Know your driving habits, match your vehicle to your life, and walk in ready to buy — not browse." },
  contact: { title:"Contact -- CNTROFR", desc:"Get in touch with the CNTROFR team." },
  privacy: { title:"Privacy Policy -- CNTROFR", desc:"CNTROFR's privacy policy. We never sell your data or refer you to dealers." },
  tos: { title:"Terms of Use -- CNTROFR", desc:"Terms of use for CNTROFR's car deal analysis tools." },
  faq: { title:"FAQ & Resources -- CNTROFR", desc:"Everything you need to know about car buying, dealer tactics, and how CNTROFR works as your pocket consultant." },
  admin: { title:"CNTROFR", desc:"" },
};

function pathToInitialState() {
  if (window.location.hash === "#admin") return { view: "admin", tab: "deal" };
  const path = window.location.pathname;
  if (path.startsWith("/tools")) {
    const slug = path.split("/")[2];
    const tab = SLUG_TO_TAB[slug] || "deal";
    return { view: "tools", tab };
  }
  const view = PATH_TO_VIEW[path] || "home";
  return { view, tab: "deal" };
}

export default function App() {
  const [view,setView]=useState(()=>pathToInitialState().view); // home | tools | contact | tos | privacy | mission | admin
  const [menuOpen,setMenuOpen]=useState(false);
  const [tab,setTab]=useState(()=>pathToInitialState().tab);
  const [modal,setModal]=useState(null);
  const [access,setAccess]=useState([]);
  const [sessionWarning,setSessionWarning]=useState(false);
  const [lang,setLang]=useState("en");
  const toggleLang=()=>{const next=lang==="en"?"es":"en";setLang(next);setGlobalLang(next);};
  const buy=plan=>setModal(plan);
  const onPaid=plan=>{setModal(null);setAccess(plan.unlocks||[]);if(plan.id==="single"){setSessionWarning(true);}else{const validTab=(plan.unlocks||[]).find(id=>TABS.find(t=>t.id===id));if(validTab){setView("tools");setTab(validTab);}else if((plan.unlocks||[]).includes("ftb")){setView("tools");setTab("deal");}}};
  const canUse=id=>TABS.find(t=>t.id===id)?.free||access.includes(id)||false;
  const Active=TABS.find(t=>t.id===tab)?.component||DealAnalyzer;

  // Keep the URL, document title, and meta description in sync with the current view (and tab, when on /tools).
  // This runs on every view/tab change but does NOT trigger navigation -- it's one-directional (state -> URL).
  useEffect(() => {
    if (view === "admin") return; // admin route stays hidden, never written to the address bar
    let path = VIEW_TO_PATH[view] || "/";
    if (view === "tools") {
      const slug = TAB_TO_SLUG[tab] || "deal-analyzer";
      path = `/tools/${slug}`;
    }
    if (window.location.pathname !== path) {
      window.history.pushState(null, "", path);
    }
    const meta = PAGE_META[view] || PAGE_META.home;
    document.title = meta.title;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", meta.desc);
  }, [view, tab]);

  // Handle browser back/forward buttons -- read the new URL and update state to match.
  useEffect(() => {
    const onPop = () => {
      const next = pathToInitialState();
      setView(next.view);
      setTab(next.tab);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <>
      <style>{S}</style>
      <CookieBanner />
      <div className="hdr">
        <button className={`burger ${menuOpen?"open":""}`} onClick={()=>setMenuOpen(m=>!m)} aria-label="Menu">
          <span/><span/><span/>
        </button>
        <div className="hdr-logo" onClick={()=>{setView("home");setMenuOpen(false);}}>
          <img src="/cntrofrplate.svg" alt="CNTROFR" style={{height:"40px",width:"auto",display:"block"}} />
          <div className="hdr-tagline">DON'T SIGN. COUNTER.</div>
        </div>
        <div className="hdr-right">
          <button className="hbtn lang-toggle" onClick={toggleLang} aria-label="Toggle language" title={lang==="en"?"Switch to Spanish":"Switch to English"}>
            {lang==="en"?"ES":"EN"}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="burger-menu">
          <button className="bmenu-item" onClick={()=>{setView("home");setMenuOpen(false);window.scrollTo(0,0);}}>🏠 {lang==="es"?"Inicio":"Home"}</button>
          <button className="bmenu-item" onClick={()=>{setView("tools");setTab("deal");setMenuOpen(false);}}> {lang==="es"?"Analizador Gratis":"Free Deal Analyzer"}</button>
          <div className="bmenu-divider"/>
          <button className="bmenu-item" onClick={()=>{setView("arsenal");setMenuOpen(false);window.scrollTo(0,0);}}>🔧 {lang==="es"?"Todas las Herramientas":"All Tools"}</button>
          <button className="bmenu-item" onClick={()=>{setView("mission");setMenuOpen(false);window.scrollTo(0,0);}}>🎯 {lang==="es"?"Misión":"Mission"}</button>
          <button className="bmenu-item" onClick={()=>{setView("blog");setMenuOpen(false);window.scrollTo(0,0);}}>📖 {lang==="es"?"Guías de Compra":"Car Buying Guides"}</button>
          <button className="bmenu-item" onClick={()=>{setView("home");setMenuOpen(false);setTimeout(()=>document.querySelector("#pricing")?.scrollIntoView({behavior:"smooth"}),100);}}>💰 {lang==="es"?"Precios":"Pricing"}</button>
          <button className="bmenu-item" onClick={()=>{setView("faq");setMenuOpen(false);window.scrollTo(0,0);}}>? {lang==="es"?"Preguntas Frecuentes":"FAQ & Resources"}</button>
          <div className="bmenu-divider"/>
          <button className="bmenu-item" onClick={()=>{setView("contact");setMenuOpen(false);window.scrollTo(0,0);}}> {lang==="es"?"Contacto":"Contact"}</button>
          <div className="bmenu-divider"/>
          <button className="bmenu-item highlight" onClick={()=>{buy(PLANS[2]);setMenuOpen(false);}}>{lang==="es"?"Desbloquea Pro Bundle -- $49":"Unlock Pro Bundle -- $49"}</button>
        </div>

      )}

      {view==="home"&&<>

        <div className="hero">
          <div className="hero-road" />
          <h1 style={{position:"absolute",width:1,height:1,padding:0,margin:-1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap",border:0}}>CNTROFR — Car Deal Analyzer | Expose Dealer Markups, Counter Offers & F&I Tactics | Built for Car Buyers</h1>
          <div className="hero-center-plate">
            <HeroPlateScene />
          </div>
          <div className="sec-eye" style={{marginBottom:14}}>{lang==="es"?"TU CONSULTOR DE BOLSILLO PARA AUTOS":"YOUR POCKET CAR CONSULTANT"}</div>
          <div className="savings-callout">
            <span className="sc-icon">💰</span>
            <span className="sc-text">{lang==="es"?<>Los compradores encuentran hasta <span className="y">$8,300</span> escondidos en su oferta.</>:<>Buyers find up to <span className="y">$8,300</span> hiding in their deal.</>}</span>
          </div>
          <h2 className="hero-h1">{lang==="es"?<>El Concesionario Ha Hecho<br/>Esto <span className="y">10,000 Veces.</span><br/>Tú No.</>:<>The Dealer Has Done<br/>This <span className="y">10,000 Times.</span><br/>You Haven't.</>}</h2>
          <div className="hero-tagline">{lang==="es"?"No Firmes. Contraataca.":"Don't Sign. Counter."}</div>
          <p className="hero-sub">{lang==="es"?"CNTROFR es el consultor de bolsillo que los compradores de autos siempre quisieron -- inteligencia privilegiada del concesionario, entregada antes de que firmes cualquier cosa. Sin cuenta. Sin inicio de sesión. Solo respuestas.":"CNTROFR is the pocket consultant every car buyer deserves -- insider dealer intelligence delivered before you sign anything. No account. No login. Just answers."}</p>
          <div className="hero-btns">
            <button className="btn-lg" onClick={()=>buy(PLANS[2])}>{lang==="es"?"Desbloquea Pro -- $49":"Unlock Pro -- $49"}</button>
            <button className="btn-lg-ghost" onClick={()=>{setView("tools");setTab("deal")}}>{lang==="es"?"Prueba el Analizador Gratis":"Try Free Deal Analyzer"}</button>
          </div>
          <div className="savings-breakdown">
            <div className="sb-grid">
              <div className="sb-item"><div className="sb-amt">$2,000</div><div className="sb-label">{lang==="es"?"Precio Inflado":"Inflated Price"}</div></div>
              <div className="sb-plus">+</div>
              <div className="sb-item"><div className="sb-amt">$1,500</div><div className="sb-label">{lang==="es"?"Extras No Deseados":"Unwanted Add-Ons"}</div></div>
              <div className="sb-plus">+</div>
              <div className="sb-item"><div className="sb-amt">$800</div><div className="sb-label">{lang==="es"?"Tarifas del Concesionario":"Doc & Dealer Fees"}</div></div>
              <div className="sb-plus">+</div>
              <div className="sb-item"><div className="sb-amt">$4,000</div><div className="sb-label">{lang==="es"?"Sobreprecios F&I":"F&I Markups"}</div></div>
            </div>
            <div className="sb-total">{lang==="es"?<>HASTA <span className="y">$8,300</span> SOBRE LA MESA</>:<>UP TO <span className="y">$8,300</span> ON THE TABLE</>}</div>
          </div>
          <div className="stats">
            <div className="stat"><div className="stat-n">$8,300</div><div className="stat-l">{lang==="es"?"Máximo en sobrecargos expuestos":"Max in hidden overcharges"}</div></div>
            <div className="stat"><div className="stat-n">{lang==="es"?"6 herramientas":"6 tools"}</div><div className="stat-l">{lang==="es"?"Un precio, arsenal completo":"One price, full arsenal"}</div></div>
            <div className="stat"><div className="stat-n">$0</div><div className="stat-l">{lang==="es"?"Comisiones de concesionarios. Nunca.":"Dealer kickbacks. Ever."}</div></div>
          </div>
        </div>
        <div id="tools" className="alert"><p>{lang==="es"?<>⚠ La regla CARS de la FTC fue eliminada por los tribunales en 2025, pero la FTC sigue activa: <strong>envió advertencias a 97 grupos de concesionarios en 2026 por ocultar tarifas.</strong> Las tácticas siguen siendo reales. Necesitas CNTROFR más que nunca.</>:<>⚠ The FTC's CARS Rule was struck down in 2025, but the FTC is still active — <strong>it warned 97 dealer groups in 2026 for hiding fees in advertised prices.</strong> The tactics are real. You need CNTROFR more than ever.</>}</p></div>
        <div id="how" className="sec">
          <div className="sec-eye">{lang==="es"?"Cómo Funciona":"How It Works"}</div>
          <h2 className="sec-h2">{lang==="es"?"Tres Pasos Hacia Tu Contraoferta":"Three Steps to Your Counter"}</h2>
          <p className="sec-sub">{lang==="es"?"Sin cuenta. Sin esperas. Ingresa tu oferta y obtén tu contraoferta.":"No account. No waiting. Enter your deal and get your counteroffer."}</p>
          <div className="steps">
            <div className="step"><div className="step-num">01</div><div className="step-title">{lang==="es"?"Ingresa los Números de tu Oferta":"Enter Your Deal Numbers"}</div><div className="step-desc">{lang==="es"?"Precio, intercambio, tarifas y extras. Toma 2 minutos.":"Price, trade-in, fees, and add-ons. Takes 2 minutes."}</div></div>
            <div className="step"><div className="step-num">02</div><div className="step-title">{lang==="es"?"La IA Analiza Desde Adentro":"AI Analyzes From the Inside"}</div><div className="step-desc">{lang==="es"?"Basado en conocimiento real de concesionarios -- lo que cuentan con que no sepas.":"Built on real dealer knowledge -- the stuff they count on you not knowing."}</div></div>
            <div className="step"><div className="step-num">03</div><div className="step-title">{lang==="es"?"Obtén Tu Contraoferta":"Get Your Counter"}</div><div className="step-desc">{lang==="es"?"Regresa con un veredicto, números específicos y guiones palabra por palabra.":"Walk back in with a verdict, specific numbers, and word-for-word scripts."}</div></div>
          </div>
        </div>
        <div className="sec" style={{paddingTop:0}}>
          <div className="sec-eye">{lang==="es"?"El Arsenal":"The Arsenal"}</div>
          <h2 className="sec-h2">{lang==="es"?"Seis Herramientas. Un Precio.":"Six Tools. One Price."}</h2>
          <p className="sec-sub">{lang==="es"?"Todo lo que necesitas desde que ves un auto hasta el segundo antes de firmar.":"Everything you need from the moment you see a car to the second before you sign."}</p>
          <div style={{textAlign:"center",marginBottom:20}}>
            <a href="#" onClick={e=>{e.preventDefault();setView("arsenal");window.scrollTo(0,0)}} style={{color:"var(--y)",fontSize:12,fontWeight:800,textDecoration:"underline",cursor:"pointer"}}>
              {lang==="es"?"Ver qué detecta exactamente cada herramienta →":"See exactly what each tool catches →"}
            </a>
          </div>
          <div className="tgrid">
            {(lang==="es"?[{id:"scan",icon:"📄",name:"Escáner de Cotización",desc:"¿Tienes tu cotización del concesionario? Sube una foto o PDF y lo analizamos línea por línea al instante.",free:false},{id:"deal",icon:"🔍",name:"Analizador de Ofertas",desc:"Desglose completo de precio, intercambio y extras con un veredicto de PROCEDE / NEGOCIA / RETÍRATE.",free:true},{id:"fee",icon:"💰",name:"Comparación de Tarifas",desc:"¿Es justa esa tarifa de documentación para tu estado? Lo averiguamos con datos en vivo.",free:false},{id:"review",icon:"🔎",name:"Pureza de Reseñas",desc:"Conoce a quién le estás comprando. Reseñas reales, cultura laboral e historial de quejas -- para que tu dinero vaya a concesionarios que se lo merecen.",free:false},{id:"fi",icon:"🔓",name:"Decodificador F&I",desc:"Cada producto de la oficina de financiamiento decodificado -- costo del concesionario, valor real, guion de salida.",free:false},{id:"addons",icon:"🥊",name:"Luchador de Extras",desc:"Conocemos los guiones que usan los concesionarios. Aquí están los tuyos para contraatacar.",free:false}]:[{id:"scan",icon:"📄",name:"Quote Scanner",desc:"Got your dealer quote? Upload a photo or PDF and we'll scan it line by line — skip the form entirely.",free:false},{id:"deal",icon:"🔍",name:"Deal Analyzer",desc:"Full breakdown of price, trade-in, and add-ons with a GO / NEGOTIATE / WALK verdict.",free:true},{id:"fee",icon:"💰",name:"Fee Comparison",desc:"Is that doc fee fair for your state? We find out with live data.",free:false},{id:"review",icon:"🔎",name:"Review Purity",desc:"Know who you're buying from. Real reviews, employee culture, and complaint history -- so your money goes to dealers who deserve it.",free:false},{id:"fi",icon:"🔓",name:"F&I Decoder",desc:"Every finance office product decoded -- dealer cost, real value, exit script.",free:false},{id:"addons",icon:"🥊",name:"Add-On Fighter",desc:"We know the scripts dealers use. Here are yours to fight back.",free:false}]).map((t,i)=>(
              <div key={i} className="tc" style={{cursor:"pointer"}} onClick={()=>{const hasScanAccess=access.includes("fee")||access.includes("ftb");if(t.id==="scan"){if(hasScanAccess){setView("tools");setTab("deal");window.scrollTo(0,0);}else{buy(PLANS[2]);}}else if(!canUse(t.id)){buy(PLANS[2]);}else{setView("tools");setTab(t.id);window.scrollTo(0,0);}}}>
                <div className="tc-icon">{t.icon}</div>
                <div className="tc-name">{t.name}</div>
                <div className="tc-desc">{t.desc}</div>
                {t.free?<span className="tag-free">{lang==="es"?"Gratis":"Free"}</span>:<span className="tag-pro">Pro</span>}
              </div>
            ))}
          </div>
        </div>
        <div className="sec" style={{paddingTop:0}}>
          <div className="sec-eye">{lang==="es"?"La Comparación":"The Comparison"}</div>
          <h2 className="sec-h2" style={{marginBottom:6}}>{lang==="es"?"¿Por Qué CNTROFR?":"Why CNTROFR?"}</h2>
          <p className="sec-sub" style={{marginBottom:24}}>{lang==="es"?"Nadie más hace todo esto por $49 sin necesidad de cuenta.":"No one else does all of this for $49 with no account required."}</p>
          <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch",borderRadius:16,border:"2px solid var(--b1)"}}>
          <div className="vs-wrap" style={{border:"none",borderRadius:0,minWidth:520}}>
            <table className="vs-table">
              <thead><tr><th>{lang==="es"?"Función":"Feature"}</th><th className="us">CNTROFR ●</th><th>{lang==="es"?"Concierge Humano":"Human Concierge"}</th><th>CarEdge</th><th>TrueCar</th></tr></thead>
              <tbody>
                {(lang==="es"?[["Escáner de cotización (foto/PDF)","✓","✗","✗","✗"],["No requiere cuenta","✓","✗","✗ (requiere cuenta)","✗"],["Pago único, sin suscripción","✓","✗","✗ (mensual/anual)","✗ (financiado por concesionarios)"],["Resultados instantáneos","✓","✗ horas/días","Parcial","✗"],["Cero comisiones de concesionarios","✓","✓","✗ (conecta con concesionarios)","✗"],["Sin datos compartidos con concesionarios","✓","✗","✗","✗"],["Auditoría de reseñas de concesionarios","✓","✗","✗","✗"],["Guiones para eliminar extras","✓","✗","✗","✗"],["Decodificador de productos F&I","✓","✗","✗","✗"],["Comparación de tarifas estatales","✓","✗","✗","✗"],["Análisis del mercado local","✓","✗","Parcial","✗"],["Modo Oferta Final","✓","✗","✗","✗"],["Creado por experto de la industria","✓","Varía","✗","✗"],["Precio","$20-$49","$999+","$99-199/año","Gratis"]]:[["Quote scanner (photo/PDF upload)","✓","✗","✗","✗"],["No login required","✓","✗","✗ (account required)","✗"],["Pay once, no subscription","✓","✗","✗ (monthly/annual)","✗ (dealer-funded)"],["Instant results","✓","✗ hours/days","Partial","✗"],["Zero dealer kickbacks","✓","✓","✗ (connects to dealers)","✗"],["No data shared with dealers","✓","✗","✗","✗"],["Dealer review audit","✓","✗","✗","✗"],["Add-on removal scripts","✓","✗","✗","✗"],["F&I product decoder","✓","✗","✗","✗"],["State fee comparison","✓","✗","✗","✗"],["Local market scan","✓","✗","Partial","✗"],["Final Offer mode","✓","✗","✗","✗"],["Built by industry insider","✓","Varies","✗","✗"],["Price","$20-$49","$999+","$99-199/yr","Free"]]).map(([feat,...vals],i)=>(
                  <tr key={i} className={i===0?"hi":""}><td className="feat">{feat}</td>{vals.map((v,j)=><td key={j}>{v==="✓"?<span className="ck">✓</span>:v==="✗"?<span className="cx">--</span>:v}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>
        <div id="mission" className="mission">
          <div className="mission-inner">
            <div className="mission-eye">{lang==="es"?"Nuestra Misión":"Our Mission"}</div>
            <h2 className="mission-h">{lang==="es"?<>El Concesionario Tiene un Manual.<br/><span className="y">Ahora Tú También.</span></>:<>The Dealer Has A Playbook.<br/><span className="y">Now You Do Too.</span></>}</h2>
            <p className="mission-body">
              {lang==="es"?<>Creamos CNTROFR porque <strong>la casa siempre gana -- hasta ahora.</strong> Sin comisiones de concesionarios. Sin relaciones publicitarias. Sin trajes manejando los hilos detrás de la cortina. Solo inteligencia cruda y sin filtros sobre tu oferta, entregada antes de que firmes cualquier cosa.<br/><br/>
              El concesionario tiene abogados, capacitadores y <strong>diez mil ofertas de experiencia</strong> trabajando en tu contra todos los días. Sus gerentes de F&I van a la escuela para aprender a extraer la máxima ganancia de cada comprador que se sienta frente a ese escritorio -- incluyéndote a ti.<br/><br/>
              Estudiamos los mismos manuales. Conocemos los guiones. <strong>Ahora tú también.</strong><br/><br/>
              Y algo más que vale la pena decir: <strong>un trato justo es bueno para todos.</strong> Tu vendedor está trabajando horas largas y días festivos para alimentar a su familia -- merece tu respeto y tu negocio si te trata bien. La codicia vive en la cima. CNTROFR apunta a eso, no a la gente en el piso de ventas.<br/><br/>
              No firmes. Contraataca.</>:<>We built CNTROFR because <strong>the house always wins -- until now.</strong> No dealer kickbacks. No advertiser relationships. No suits pulling strings behind the curtain. Just raw, unfiltered intelligence about your deal, handed to you before you sign your name to anything.<br/><br/>
              The dealership has lawyers, trainers, and <strong>ten thousand deals worth of experience</strong> working against you every single day. Their F&I managers go to school on how to extract maximum profit from every buyer that sits across that desk -- including you.<br/><br/>
              We studied the same playbooks. We know the scripts. <strong>Now you do too.</strong><br/><br/>
              And here's something else worth saying: <strong>a fair deal is good for everyone.</strong> Your salesperson is working long hours and holidays to feed their family -- they deserve your respect and your business if they treat you right. The greed lives at the top. CNTROFR targets that, not the people on the floor.<br/><br/>
              Don't sign. Counter.</>}
            </p>
            <div className="mission-sig">{lang==="es"?"-- El Equipo CNTROFR - Hecho Para Compradores - Sin Financiamiento de Nadie":"-- The CNTROFR Team - Built For Buyers - Funded By None"}</div>
          </div>
        </div>


        <div id="pricing" className="sec" style={{paddingTop:0}}>
          <div className="sec-eye">{lang==="es"?"Precios":"Pricing"}</div>
          <h2 className="sec-h2">{lang==="es"?"Simple. Transparente. Tuyo.":"Simple. Transparent. Yours."}</h2>
          <p className="sec-sub">{lang==="es"?"Pago único. Sin cuenta. Sin suscripción. Acceso instantáneo.":"Pay once. No account. No subscription. Instant access."}</p>
          <div className="pgrid">
            {PLANS.map(p=>(
              <div key={p.id} className={`pcard ${p.hot?"hot":""}`}>
                {p.hot&&<div className="hot-lbl">{lang==="es"?"Más Popular":"Most Popular"}</div>}
                <div className="pname">{lang==="es"?p.nameEs:p.name}</div>
                <div className="pprice"><sup>$</sup>{p.price}<sub> {lang==="es"?"pago único":"one-time"}</sub></div>
                <div className="pdesc">{lang==="es"?p.descEs:p.desc}</div>
                <ul className="pfeats">{(lang==="es"?p.featuresEs:p.features).map((f,i)=><li key={i}>{f}</li>)}</ul>
                <button className={`pbtn ${p.hot?"fill":"out"}`} onClick={()=>buy(p)}>{p.hot?(lang==="es"?"Desbloquea Pro -- $49":"Unlock Pro -- $49"):p.id==="guide"?(lang==="es"?"Guía de Negociación -- $20":"Negotiation Guide -- $20"):p.id==="firsttime"?(lang==="es"?"Primer Comprador -- $25":"First Time Buyer -- $25"):(lang==="es"?"Reporte Individual -- $20":"Single Report -- $20")}</button>
              </div>
            ))}
          </div>
        </div>
        <div className="sec" style={{paddingTop:0}}>
          <div className="sec-eye">{lang==="es"?"Por Qué CNTROFR Te Ahorra Más Que Dinero":"Why CNTROFR Saves You More Than Money"}</div>
          <h2 className="sec-h2">{lang==="es"?<>La Compra Promedio de Auto Toma <span style={{color:"var(--red)"}}>14+ Horas.</span></>:<>The Average Car Deal Takes <span style={{color:"var(--red)"}}>14+ Hours.</span></>}</h2>
          <p className="sec-sub">{lang==="es"?"Investigación, visitas, negociación, oficina F&I, papeleo -- la mayoría de los compradores entra a ciegas y lo paga.":"Research, visits, negotiation, F&I office, paperwork -- most buyers go in blind and pay for it."}</p>
          <div className="timesave">
            <div className="tsgrid">
              <div className="ts-card bad">
                <div className="ts-num">14h</div>
                <div className="ts-label">{lang==="es"?"Tiempo Promedio Comprando Auto":"Average Time Spent Car Shopping"}</div>
                <div className="ts-desc">{lang==="es"?"Múltiples visitas al concesionario, horas de investigación en línea, y aún así entras sin saber lo que el concesionario sabe sobre tu oferta.":"Multiple dealer visits, hours of online research, and still walking in without knowing what the dealer knows about your deal."}</div>
              </div>
              <div className="ts-card bad">
                <div className="ts-num">$3,200</div>
                <div className="ts-label">{lang==="es"?"Sobrepago Promedio Por Oferta":"Avg Buyer Overpayment Per Deal"}</div>
                <div className="ts-desc">{lang==="es"?"Entre precio inflado del vehículo, intercambio subvalorado, tarifas misteriosas y sobreprecios de F&I -- la mayoría de los compradores deja miles sobre la mesa. Los peores casos llegan hasta $8,300.":"Between inflated vehicle price, lowball trade-in, mystery fees, and F&I markups -- most buyers leave thousands on the table. Worst cases hit $8,300."}</div>
              </div>
              <div className="ts-card good">
                <div className="ts-num">~10m</div>
                <div className="ts-label">{lang==="es"?"Tiempo Para Un Análisis Completo de CNTROFR":"Time to Run a Full CNTROFR Analysis"}</div>
                <div className="ts-desc">{lang==="es"?"Ingresa tu oferta. Obtén tu veredicto, tu contraoferta y tus guiones. Regresa sabiendo lo que ellos saben.":"Enter your deal. Get your verdict, your counter, and your scripts. Walk back in knowing what they know."}</div>
              </div>
              <div className="ts-card good">
                <div className="ts-num">$49</div>
                <div className="ts-label">{lang==="es"?"Costo de Acceso Pro vs. Miles Ahorrados":"Cost of Pro Access vs. Thousands Saved"}</div>
                <div className="ts-desc">{lang==="es"?"En lugar de pasar horas buscando en Google cosas que no podrías saber para prepararte -- déjanos entregártelo en minutos.":"Instead of spending hours Googling things you couldn't possibly know to prepare for -- let us hand it to you in minutes."}</div>
              </div>
            </div>
          </div>
        </div>


        <div id="faq" className="sec" style={{paddingTop:0,paddingBottom:48,textAlign:"center"}}>
          <div className="sec-eye">{lang==="es"?"Tienes Preguntas":"Got Questions"}</div>
          <h2 className="sec-h2">{lang==="es"?"Preguntas Frecuentes":"Frequently Asked"}</h2>
          <p className="sec-sub" style={{marginBottom:28}}>{lang==="es"?"Todo lo que necesitas saber antes de comprar.":"Everything you need to know before you buy."}</p>
          <button className="btn-lg-ghost" onClick={()=>{setView("faq");window.scrollTo(0,0);}}>{lang==="es"?"Ver Preguntas Frecuentes →":"See All FAQs & Resources →"}</button>
        </div>
        <div className="footer">
          <div className="footer-plate"><img src="/cntrofrplateplus.svg" alt="CNTROFR" style={{height:"auto",width:"260px",display:"block"}} /></div>
          <div className="footer-slogan">{lang==="es"?"No Firmes. Contraataca.":"Don't Sign. Counter."}</div>
          <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
            <div className="powered-by">
              <span>Powered by</span>
              <span className="powered-by-logo">Claude AI by Anthropic</span>
            </div>
          </div>
          <p>{lang==="es"?"CNTROFR es una herramienta independiente de protección al consumidor. No recibimos dinero de concesionarios, prestamistas o fabricantes -- nunca. El análisis de IA es solo para fines informativos y no constituye asesoría financiera, legal o profesional.":"CNTROFR is an independent consumer protection tool. We take zero money from dealers, lenders, or manufacturers -- ever. AI analysis is for informational purposes only and does not constitute financial, legal, or professional advice."}</p>
          <div className="footer-links">
            <a href="#" onClick={e=>{e.preventDefault();setView("arsenal");window.scrollTo(0,0)}}>{lang==="es"?"Herramientas":"Tools"}</a>
            <a href="mailto:info@cntrofr.com">info@cntrofr.com</a>
            <a href="#" onClick={e=>{e.preventDefault();setView("contact")}}>{lang==="es"?"Contacto":"Contact"}</a>
            <a href="#" onClick={e=>{e.preventDefault();setView("faq");window.scrollTo(0,0)}}>{lang==="es"?"Preguntas Frecuentes":"FAQ"}</a>
            <a href="#" onClick={e=>{e.preventDefault();setView("blog");window.scrollTo(0,0)}}>{lang==="es"?"Guías":"Guides"}</a>
            <a href="#" onClick={e=>{e.preventDefault();setView("privacy");window.scrollTo(0,0)}}>{lang==="es"?"Política de Privacidad":"Privacy Policy"}</a>
            <a href="#" onClick={e=>{e.preventDefault();setView("tos");window.scrollTo(0,0)}}>{lang==="es"?"Términos de Uso":"Terms of Use"}</a>
          </div>
          <div style={{marginTop:16,fontSize:13,color:"var(--text2)",fontWeight:800,letterSpacing:.3}}>Artwork and logo design by our talented buddy and pal <a href="https://www.instagram.com/righthandman" target="_blank" rel="noopener noreferrer" style={{color:"var(--y)",textDecoration:"none"}}>@righthandman</a></div>
          <div style={{marginTop:8,fontSize:11,color:"var(--muted)",fontWeight:700,letterSpacing:.5}}>🏔️ Developed in Colorado. Built for buyers everywhere.</div>

        </div>
      </>}

      {view==="contact"&&<>
        <Contact />
        <div className="footer">
          <div className="footer-plate"><img src="/cntrofrplateplus.svg" alt="CNTROFR" style={{height:"auto",width:"260px",display:"block"}} /></div>
          <div className="footer-slogan">{lang==="es"?"No Firmes. Contraataca.":"Don't Sign. Counter."}</div>
          <p>{lang==="es"?"CNTROFR es una herramienta independiente de protección al consumidor. No recibimos dinero de concesionarios, prestamistas o fabricantes -- nunca. El análisis de IA es solo para fines informativos y no constituye asesoría financiera, legal o profesional.":"CNTROFR is an independent consumer protection tool. We take zero money from dealers, lenders, or manufacturers -- ever. AI analysis is for informational purposes only and does not constitute financial, legal, or professional advice."}</p>
          <div className="footer-links">
            <a href="#" onClick={e=>{e.preventDefault();setView("arsenal");window.scrollTo(0,0)}}>{lang==="es"?"Herramientas":"Tools"}</a>
            <a href="mailto:info@cntrofr.com">info@cntrofr.com</a>
            <a href="#" onClick={e=>{e.preventDefault();setView("contact")}}>{lang==="es"?"Contacto":"Contact"}</a>
            <a href="#" onClick={e=>{e.preventDefault();setView("privacy");window.scrollTo(0,0)}}>{lang==="es"?"Política de Privacidad":"Privacy Policy"}</a>
            <a href="#" onClick={e=>{e.preventDefault();setView("tos");window.scrollTo(0,0)}}>{lang==="es"?"Términos de Uso":"Terms of Use"}</a>
          </div>
        </div>
      </>}

      {view==="tools"&&(
        <div className="tarea">
          {access.includes("fee") && !sessionWarning && <div className="access-ok">✓ &nbsp;Pro Access Active -- All 6 tools unlocked</div>}
          {access.includes("ftb") && !access.includes("fee") && <div className="access-ok">✓ &nbsp;First Time Buyer Mode Active -- Deal Analyzer unlocked</div>}
          {access.includes("deal") && !access.includes("ftb") && !access.includes("fee") && <div className="access-ok">✓ &nbsp;Single Report Active -- All tools unlocked for this session</div>}
          {access.includes("guide") && !access.includes("fee") && <div className="access-ok">✓ &nbsp;Negotiation Guide Unlocked</div>}
          <div className="tnav">
            {TABS.map(t=>(
              <button key={t.id} className={`ttab ${tab===t.id?"on":""} ${!canUse(t.id)?"lk":""}`} onClick={()=>{if(!canUse(t.id))buy(PLANS[2]);else setTab(t.id);}}>
                {t.label}
                {!t.free&&!canUse(t.id)&&<span>🔒</span>}
                {!t.free&&canUse(t.id)&&<span style={{fontSize:6,color:tab===t.id?"#111":"var(--y)"}}>◆</span>}
              </button>
            ))}
          </div>
          {canUse(tab)?<Active ftb={access.includes("ftb")} paid={access.length>0} tier={access.includes("fee")?"pro":access.includes("ftb")?"ftb":access.includes("guide")&&access.length===1?"guide":"single"} onBuy={()=>buy(PLANS[2])} />:<div className="upbox"><div style={{fontSize:32,marginBottom:8}}>📄</div><h3>Pro Feature</h3><p style={{marginBottom:8}}><strong style={{color:"var(--y)"}}>Snap your dealer quote. Get your counter in seconds.</strong></p><p>Unlock the Quote Scanner, {TABS.find(t=>t.id===tab)?.label}, and all 6 tools with Pro access.</p><button className="hbtn-y" style={{padding:"12px 32px",fontSize:13}} onClick={()=>buy(PLANS[2])}>Unlock Pro — $49</button></div>}
          <div className="footer">
            <div className="footer-plate"><img src="/cntrofrplateplus.svg" alt="CNTROFR" style={{height:"auto",width:"260px",display:"block"}} /></div>
            <p style={{fontSize:11,color:"var(--muted)"}}>{lang==="es"?"CNTROFR es una herramienta independiente de protección al consumidor. No recibimos dinero de concesionarios, prestamistas o fabricantes -- nunca. El análisis de IA es solo para fines informativos y no constituye asesoría financiera, legal o profesional.":"CNTROFR is an independent consumer protection tool. We take zero money from dealers, lenders, or manufacturers -- ever. AI analysis is for informational purposes only and does not constitute financial, legal, or professional advice."}</p>
            <div className="footer-links">
              <a href="#" onClick={e=>{e.preventDefault();setView("arsenal");window.scrollTo(0,0)}}>{lang==="es"?"Herramientas":"Tools"}</a>
              <a href="mailto:info@cntrofr.com">info@cntrofr.com</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("contact")}}>{lang==="es"?"Contacto":"Contact"}</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("privacy");window.scrollTo(0,0)}}>{lang==="es"?"Política de Privacidad":"Privacy Policy"}</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("tos");window.scrollTo(0,0)}}>{lang==="es"?"Términos de Uso":"Terms of Use"}</a>
            </div>
          </div>
        </div>
      )}

      {view==="privacy"&&(
        <>
          <div style={{background:"var(--bg3)",borderBottom:"1px solid var(--b1)",padding:"10px 28px"}}>
            <button className="ghost-btn" onClick={()=>{setView("home");window.scrollTo(0,0)}}>← Back to Home</button>
          </div>
          <PrivacyPolicy />
          <div className="footer">
            <div className="footer-plate"><img src="/cntrofrplateplus.svg" alt="CNTROFR" style={{height:"auto",width:"260px",display:"block"}} /></div>
            <p style={{fontSize:11,color:"var(--muted)"}}>{lang==="es"?"CNTROFR es una herramienta independiente de protección al consumidor. No recibimos dinero de concesionarios, prestamistas o fabricantes -- nunca. El análisis de IA es solo para fines informativos y no constituye asesoría financiera, legal o profesional.":"CNTROFR is an independent consumer protection tool. We take zero money from dealers, lenders, or manufacturers -- ever. AI analysis is for informational purposes only and does not constitute financial, legal, or professional advice."}</p>
            <div className="footer-links">
              <a href="#" onClick={e=>{e.preventDefault();setView("arsenal");window.scrollTo(0,0)}}>{lang==="es"?"Herramientas":"Tools"}</a>
              <a href="mailto:info@cntrofr.com">info@cntrofr.com</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("contact")}}>{lang==="es"?"Contacto":"Contact"}</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("privacy");window.scrollTo(0,0)}}>{lang==="es"?"Política de Privacidad":"Privacy Policy"}</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("tos");window.scrollTo(0,0)}}>{lang==="es"?"Términos de Uso":"Terms of Use"}</a>
            </div>
          </div>
        </>
      )}
      {view==="tos"&&(
        <>
          <div style={{background:"var(--bg3)",borderBottom:"1px solid var(--b1)",padding:"10px 28px"}}>
            <button className="ghost-btn" onClick={()=>{setView("home");window.scrollTo(0,0)}}>← Back to Home</button>
          </div>
          <TermsOfService />
          <div className="footer">
            <div className="footer-plate"><img src="/cntrofrplateplus.svg" alt="CNTROFR" style={{height:"auto",width:"260px",display:"block"}} /></div>
            <p style={{fontSize:11,color:"var(--muted)"}}>{lang==="es"?"CNTROFR es una herramienta independiente de protección al consumidor. No recibimos dinero de concesionarios, prestamistas o fabricantes -- nunca. El análisis de IA es solo para fines informativos y no constituye asesoría financiera, legal o profesional.":"CNTROFR is an independent consumer protection tool. We take zero money from dealers, lenders, or manufacturers -- ever. AI analysis is for informational purposes only and does not constitute financial, legal, or professional advice."}</p>
            <div className="footer-links">
              <a href="#" onClick={e=>{e.preventDefault();setView("arsenal");window.scrollTo(0,0)}}>{lang==="es"?"Herramientas":"Tools"}</a>
              <a href="mailto:info@cntrofr.com">info@cntrofr.com</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("contact")}}>{lang==="es"?"Contacto":"Contact"}</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("privacy");window.scrollTo(0,0)}}>{lang==="es"?"Política de Privacidad":"Privacy Policy"}</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("tos");window.scrollTo(0,0)}}>{lang==="es"?"Términos de Uso":"Terms of Use"}</a>
            </div>
          </div>
        </>
      )}
      {view==="mission"&&(
        <>
          <div style={{background:"var(--bg3)",borderBottom:"1px solid var(--b1)",padding:"10px 28px"}}>
            <button className="ghost-btn" onClick={()=>{setView("home");window.scrollTo(0,0)}}>← Back to Home</button>
          </div>
          <MissionPage />
          <div className="footer">
            <div className="footer-plate"><img src="/cntrofrplateplus.svg" alt="CNTROFR" style={{height:"auto",width:"260px",display:"block"}} /></div>
            <p style={{fontSize:11,color:"var(--muted)"}}>{lang==="es"?"CNTROFR es una herramienta independiente de protección al consumidor. No recibimos dinero de concesionarios, prestamistas o fabricantes -- nunca. El análisis de IA es solo para fines informativos y no constituye asesoría financiera, legal o profesional.":"CNTROFR is an independent consumer protection tool. We take zero money from dealers, lenders, or manufacturers -- ever. AI analysis is for informational purposes only and does not constitute financial, legal, or professional advice."}</p>
            <div className="footer-links">
              <a href="#" onClick={e=>{e.preventDefault();setView("arsenal");window.scrollTo(0,0)}}>{lang==="es"?"Herramientas":"Tools"}</a>
              <a href="mailto:info@cntrofr.com">info@cntrofr.com</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("contact")}}>{lang==="es"?"Contacto":"Contact"}</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("privacy");window.scrollTo(0,0)}}>{lang==="es"?"Política de Privacidad":"Privacy Policy"}</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("tos");window.scrollTo(0,0)}}>{lang==="es"?"Términos de Uso":"Terms of Use"}</a>
            </div>
          </div>
        </>
      )}
      {view==="arsenal"&&(
        <>
          <div style={{background:"var(--bg3)",borderBottom:"1px solid var(--b1)",padding:"10px 28px"}}>
            <button className="ghost-btn" onClick={()=>{setView("home");window.scrollTo(0,0)}}>← Back to Home</button>
          </div>
          <ArsenalPage lang={lang} setView={setView} setTab={setTab} buy={buy} canUse={canUse} access={access} />
          <div className="footer">
            <div className="footer-plate"><img src="/cntrofrplateplus.svg" alt="CNTROFR" style={{height:"auto",width:"260px",display:"block"}} /></div>
            <p style={{fontSize:11,color:"var(--muted)"}}>{lang==="es"?"CNTROFR es una herramienta independiente de protección al consumidor. No recibimos dinero de concesionarios, prestamistas o fabricantes -- nunca. El análisis de IA es solo para fines informativos y no constituye asesoría financiera, legal o profesional.":"CNTROFR is an independent consumer protection tool. We take zero money from dealers, lenders, or manufacturers -- ever. AI analysis is for informational purposes only and does not constitute financial, legal, or professional advice."}</p>
            <div className="footer-links">
              <a href="#" onClick={e=>{e.preventDefault();setView("arsenal");window.scrollTo(0,0)}}>{lang==="es"?"Herramientas":"Tools"}</a>
              <a href="mailto:info@cntrofr.com">info@cntrofr.com</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("contact")}}>{lang==="es"?"Contacto":"Contact"}</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("privacy");window.scrollTo(0,0)}}>{lang==="es"?"Política de Privacidad":"Privacy Policy"}</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("tos");window.scrollTo(0,0)}}>{lang==="es"?"Términos de Uso":"Terms of Use"}</a>
            </div>
          </div>
        </>
      )}
      {view==="faq"&&(
        <>
          <div style={{background:"var(--bg3)",borderBottom:"1px solid var(--b1)",padding:"10px 28px"}}>
            <button className="ghost-btn" onClick={()=>{setView("home");window.scrollTo(0,0)}}>← Back to Home</button>
          </div>
          <FAQ lang={lang} />
          <div className="footer">
            <div className="footer-plate"><img src="/cntrofrplateplus.svg" alt="CNTROFR" style={{height:"auto",width:"260px",display:"block"}} /></div>
            <p style={{fontSize:11,color:"var(--muted)"}}>{lang==="es"?"CNTROFR es una herramienta independiente de protección al consumidor. No recibimos dinero de concesionarios, prestamistas o fabricantes -- nunca. El análisis de IA es solo para fines informativos y no constituye asesoría financiera, legal o profesional.":"CNTROFR is an independent consumer protection tool. We take zero money from dealers, lenders, or manufacturers -- ever. AI analysis is for informational purposes only and does not constitute financial, legal, or professional advice."}</p>
            <div className="footer-links">
              <a href="#" onClick={e=>{e.preventDefault();setView("arsenal");window.scrollTo(0,0)}}>{lang==="es"?"Herramientas":"Tools"}</a>
              <a href="mailto:info@cntrofr.com">info@cntrofr.com</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("contact")}}>{lang==="es"?"Contacto":"Contact"}</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("privacy");window.scrollTo(0,0)}}>{lang==="es"?"Política de Privacidad":"Privacy Policy"}</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("tos");window.scrollTo(0,0)}}>{lang==="es"?"Términos de Uso":"Terms of Use"}</a>
            </div>
          </div>
        </>
      )}
      {view==="blog"&&(
        <>
          <div style={{background:"var(--bg3)",borderBottom:"1px solid var(--b1)",padding:"10px 28px"}}>
            <button className="ghost-btn" onClick={()=>{setView("home");window.scrollTo(0,0)}}>← Back to Home</button>
          </div>
          <div style={{maxWidth:800,margin:"0 auto",padding:"48px 24px"}}>
            <div style={{fontSize:11,fontWeight:900,letterSpacing:3,color:"var(--y)",textTransform:"uppercase",marginBottom:8}}>Car Buying Guides</div>
            <h1 style={{fontSize:32,fontWeight:900,color:"var(--text)",marginBottom:12,lineHeight:1.2}}>Everything Dealers Hope You Never Read</h1>
            <p style={{fontSize:15,color:"var(--text2)",fontWeight:700,lineHeight:1.7,marginBottom:40}}>Written by a certified automotive insider with 15 years of dealership sales and F&I experience. No dealer affiliations. No ads. Just the playbook.</p>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {[
                {view:"blog_doc_fees",title:"What Is a Dealer Doc Fee — And Is Yours Too High?",desc:"Doc fees vary wildly by state. Here's what's normal, what's inflated, and exactly how to use a high doc fee as leverage on your vehicle price.",tag:"Fees",date:"June 2026",time:"5 min read"},
                {view:"blog_fi",title:"Every F&I Product Decoded — Dealer Cost vs. What You Pay",desc:"Finance office products decoded by a certified F&I insider. What each product actually costs the dealer, what it's worth to you, and how to say no.",tag:"F&I",date:"June 2026",time:"7 min read"},
                {view:"blog_addons",title:"How to Negotiate Dealer Add-Ons (And Remove the Ones You Don't Want)",desc:"Dealers pre-install add-ons hoping you'll just pay. Here's how to identify force adds, what they're actually worth, and word-for-word scripts to fight back.",tag:"Add-Ons",date:"June 2026",time:"6 min read"},
                {view:"blog_shopper",title:"Car Shopper vs. Car Buyer — Which One Are You?",desc:"The most expensive car mistake isn't overpaying. It's overpaying for the wrong car. Know your driving habits, match your vehicle to your life, and walk in ready to buy.",tag:"Car Buying 101",date:"June 2026",time:"6 min read"},
              ].map((post,i)=>(
                <div key={i} style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:14,padding:"24px",cursor:"pointer",transition:"border-color .2s"}}
                  onClick={()=>{setView(post.view);window.scrollTo(0,0)}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="var(--y)"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="var(--b1)"}>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
                    <span style={{background:"rgba(255,214,0,.12)",color:"var(--y)",fontSize:10,fontWeight:900,padding:"3px 10px",borderRadius:20,letterSpacing:.5}}>{post.tag}</span>
                    <span style={{fontSize:11,color:"var(--muted)",fontWeight:700}}>{post.date} · {post.time}</span>
                  </div>
                  <h2 style={{fontSize:18,fontWeight:900,color:"var(--text)",marginBottom:8,lineHeight:1.3}}>{post.title}</h2>
                  <p style={{fontSize:13,color:"var(--text2)",fontWeight:700,lineHeight:1.6,marginBottom:14}}>{post.desc}</p>
                  <span style={{fontSize:12,color:"var(--y)",fontWeight:900}}>Read guide →</span>
                </div>
              ))}
            </div>
          </div>
          <div className="footer">
            <div className="footer-plate"><img src="/cntrofrplateplus.svg" alt="CNTROFR" style={{height:"auto",width:"260px",display:"block"}} /></div>
            <div className="footer-links">
              <a href="#" onClick={e=>{e.preventDefault();setView("arsenal");window.scrollTo(0,0)}}>{lang==="es"?"Herramientas":"Tools"}</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("contact")}}>Contact</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("faq");window.scrollTo(0,0)}}>FAQ</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("privacy");window.scrollTo(0,0)}}>Privacy Policy</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("tos");window.scrollTo(0,0)}}>Terms of Use</a>
            </div>
          </div>
        </>
      )}

      {/* ── Blog Post: Doc Fees ─────────────────────────────────────────── */}
      {view==="blog_doc_fees"&&(
        <>
          <div style={{background:"var(--bg3)",borderBottom:"1px solid var(--b1)",padding:"10px 28px",display:"flex",gap:12,alignItems:"center"}}>
            <button className="ghost-btn" onClick={()=>{setView("blog");window.scrollTo(0,0)}}>← All Guides</button>
          </div>
          <div style={{maxWidth:760,margin:"0 auto",padding:"48px 24px"}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16}}>
              <span style={{background:"rgba(255,214,0,.12)",color:"var(--y)",fontSize:10,fontWeight:900,padding:"3px 10px",borderRadius:20,letterSpacing:.5}}>FEES</span>
              <span style={{fontSize:11,color:"var(--muted)",fontWeight:700}}>June 2026 · 5 min read · By a Certified Automotive Insider</span>
            </div>
            <h1 style={{fontSize:30,fontWeight:900,color:"var(--text)",marginBottom:16,lineHeight:1.2}}>What Is a Dealer Doc Fee — And Is Yours Too High?</h1>
            <p style={{fontSize:15,color:"var(--text2)",fontWeight:700,lineHeight:1.8,marginBottom:24}}>If you've ever bought a car, you've seen it buried in the paperwork: a "documentary fee," "doc fee," or "processing fee" somewhere between $200 and $900. Most buyers just pay it. They shouldn't — at least not without understanding what it is and how to use it against the dealer.</p>

            <h2 style={{fontSize:20,fontWeight:900,color:"var(--y)",marginBottom:10,marginTop:32}}>What Is a Doc Fee?</h2>
            <p style={{fontSize:14,color:"var(--text2)",fontWeight:700,lineHeight:1.8,marginBottom:16}}>A documentary fee is what a dealer charges to process your paperwork — title work, registration filing, and contract preparation. The actual cost to the dealer is roughly $50-80 in labor and materials. Everything above that is pure margin.</p>
            <p style={{fontSize:14,color:"var(--text2)",fontWeight:700,lineHeight:1.8,marginBottom:16}}>Dealers love doc fees because they're easy to hide in the total and buyers rarely question them. By the time you're sitting in the finance office, you've already mentally committed to the deal. The doc fee just gets added to the pile.</p>

            <h2 style={{fontSize:20,fontWeight:900,color:"var(--y)",marginBottom:10,marginTop:32}}>Is It Negotiable?</h2>
            <p style={{fontSize:14,color:"var(--text2)",fontWeight:700,lineHeight:1.8,marginBottom:16}}>Technically no — and this is important. Most states require dealers to charge the same doc fee to every customer for audit compliance. A dealer can't lower the fee just for you without lowering it for everyone, which creates a compliance problem. Asking them to remove or lower the doc fee directly is usually a dead end.</p>
            <p style={{fontSize:14,color:"var(--text2)",fontWeight:700,lineHeight:1.8,marginBottom:16}}>But here's what most buyers miss: a high doc fee is leverage on the vehicle price. If a dealer charges $799 when the state average is $400, that $399 gap is real money you can push back into your vehicle discount.</p>
            <div style={{background:"rgba(255,214,0,.06)",border:"1px solid rgba(255,214,0,.25)",borderRadius:12,padding:"16px 20px",marginBottom:24}}>
              <div style={{fontSize:12,fontWeight:900,color:"var(--y)",letterSpacing:.5,marginBottom:8}}>💡 THE SCRIPT</div>
              <p style={{fontSize:13,color:"var(--text)",fontWeight:700,lineHeight:1.7,margin:0}}>"I noticed your doc fee is $799 — that's about $400 above the state average. I'd like to see that reflected in the vehicle price before we finalize anything."</p>
            </div>

            <h2 style={{fontSize:20,fontWeight:900,color:"var(--y)",marginBottom:10,marginTop:32}}>What's Normal by State?</h2>
            <p style={{fontSize:14,color:"var(--text2)",fontWeight:700,lineHeight:1.8,marginBottom:16}}>Doc fees vary dramatically depending on where you buy. Some states cap them by law. Others have zero regulation, meaning dealers can charge whatever they want.</p>
            <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:12,padding:"16px 20px",marginBottom:24}}>
              {[
                {label:"Capped states (under $200)","states":"California ($85), New York ($175), Washington ($200), Oregon ($250)"},
                {label:"Moderate states ($200-500 avg)","states":"Illinois ($324), Texas (~$400), Michigan ($200-600)"},
                {label:"High-fee states ($600-999+)","states":"Florida ($999 avg), North Carolina ($699-749), Colorado ($699), Georgia (~$599)"},
              ].map((r,i)=>(
                <div key={i} style={{padding:"10px 0",borderBottom:i<2?"1px solid var(--b1)":"none"}}>
                  <div style={{fontSize:11,fontWeight:900,color:"var(--y)",letterSpacing:.3,marginBottom:4}}>{r.label}</div>
                  <div style={{fontSize:13,color:"var(--text2)",fontWeight:700}}>{r.states}</div>
                </div>
              ))}
            </div>
            <p style={{fontSize:14,color:"var(--text2)",fontWeight:700,lineHeight:1.8,marginBottom:24}}>Colorado's benchmark doc fee is $699 — one of the highest in the region. Above $700 on a Colorado deal? That's a flag worth pushing on the vehicle price. The national average across all states is $490.</p>

            <h2 style={{fontSize:20,fontWeight:900,color:"var(--y)",marginBottom:10,marginTop:32}}>The Bigger Signal</h2>
            <p style={{fontSize:14,color:"var(--text2)",fontWeight:700,lineHeight:1.8,marginBottom:24}}>A high doc fee rarely travels alone. Dealers who inflate processing fees tend to also markup F&I products aggressively, pre-install unwanted add-ons, and push above-market financing rates. The doc fee is often the first tell that you're dealing with a store that prioritizes extraction over relationship. Know your state average before you walk in — it sets the tone for everything that follows.</p>

            <div style={{background:"rgba(255,214,0,.06)",border:"1px solid rgba(255,214,0,.25)",borderRadius:14,padding:"20px 24px",marginTop:32,marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:900,color:"var(--y)",marginBottom:8}}>📄 Check Your Doc Fee Before You Sign</div>
              <p style={{fontSize:13,color:"var(--text2)",fontWeight:700,lineHeight:1.6,marginBottom:16}}>CNTROFR's Fee Comparison tool shows you exactly where your dealer's fees land against your state average — instantly, before you commit to anything.</p>
              <button className="hbtn-y" style={{padding:"10px 24px",fontSize:13}} onClick={()=>{buy(PLANS[2])}}>Unlock Fee Comparison — $49</button>
            </div>
          </div>
          <div className="footer">
            <div className="footer-plate"><img src="/cntrofrplateplus.svg" alt="CNTROFR" style={{height:"auto",width:"260px",display:"block"}} /></div>
            <div className="footer-links">
              <a href="#" onClick={e=>{e.preventDefault();setView("arsenal");window.scrollTo(0,0)}}>{lang==="es"?"Herramientas":"Tools"}</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("blog");window.scrollTo(0,0)}}>More Guides</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("contact")}}>Contact</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("privacy");window.scrollTo(0,0)}}>Privacy Policy</a>
            </div>
          </div>
        </>
      )}

      {/* ── Blog Post: F&I Products ─────────────────────────────────────── */}
      {view==="blog_fi"&&(
        <>
          <div style={{background:"var(--bg3)",borderBottom:"1px solid var(--b1)",padding:"10px 28px"}}>
            <button className="ghost-btn" onClick={()=>{setView("blog");window.scrollTo(0,0)}}>← All Guides</button>
          </div>
          <div style={{maxWidth:760,margin:"0 auto",padding:"48px 24px"}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16}}>
              <span style={{background:"rgba(255,214,0,.12)",color:"var(--y)",fontSize:10,fontWeight:900,padding:"3px 10px",borderRadius:20,letterSpacing:.5}}>F&I</span>
              <span style={{fontSize:11,color:"var(--muted)",fontWeight:700}}>June 2026 · 7 min read · By a Certified Automotive Insider</span>
            </div>
            <h1 style={{fontSize:30,fontWeight:900,color:"var(--text)",marginBottom:16,lineHeight:1.2}}>Every F&I Product Decoded — Dealer Cost vs. What You Pay</h1>
            <p style={{fontSize:15,color:"var(--text2)",fontWeight:700,lineHeight:1.8,marginBottom:24}}>The finance office is where dealers make their real money. After you've agreed on a vehicle price, you're handed off to a finance manager whose job is to maximize backend profit — through products most buyers don't fully understand. Here's what each one actually costs and what it's actually worth.</p>

            <h2 style={{fontSize:20,fontWeight:900,color:"var(--y)",marginBottom:10,marginTop:32}}>How the F&I Office Works</h2>
            <p style={{fontSize:14,color:"var(--text2)",fontWeight:700,lineHeight:1.8,marginBottom:16}}>Finance managers are paid on backend gross profit — meaning the more they sell you and the higher the markup, the more they make. They're trained to present products in a way that makes them feel essential, urgent, and reasonably priced. Most are not. Here's the breakdown:</p>

            {[
              {name:"Extended Warranty (VSC)",cost:"$300-800 dealer cost",retail:"$1,500-4,000 retail",verdict:"SOMETIMES WORTH IT",color:"var(--y)",note:"If you're buying used with high mileage and no manufacturer coverage, a third-party VSC can make sense. Never buy from the dealer — shop Endurance, CARCHEX, or your credit union. Dealer markup on these is 200-400%."},
              {name:"GAP Insurance",cost:"$50-200 dealer cost",retail:"$400-900 retail",verdict:"SOMETIMES WORTH IT",color:"var(--y)",note:"If you're financing more than 80% of the vehicle's value, GAP covers the difference if it's totaled. But never buy from the dealer — your insurance company or credit union sells the same coverage for $20-40/year. Dealer markup is 500%+."},
              {name:"Credit Life / Disability Insurance",cost:"Varies",retail:"$500-2,000+",verdict:"ALMOST NEVER WORTH IT",color:"var(--red)",note:"Pays your car loan if you die or become disabled. Your existing life/disability insurance likely already covers this. A standalone term life policy costs a fraction of what dealers charge."},
              {name:"Paint & Fabric Protection",cost:"$50-100 dealer cost",retail:"$300-800 retail",verdict:"NOT WORTH IT",color:"var(--red)",note:"A can of Scotchgard from any hardware store ($8) does the same thing as dealer fabric protection. Paint sealant is applied by a detailer — the dealer pays them $30-50 and charges you $400+."},
              {name:"Tire & Wheel Protection",cost:"$150-300 dealer cost",retail:"$600-1,200 retail",verdict:"SITUATIONAL",color:"var(--y)",note:"If you live somewhere with rough roads or potholes, this can pay for itself. Read the fine print carefully — many plans exclude damage from potholes or have high deductibles. Negotiate hard if you want it."},
              {name:"Key Replacement",cost:"$25-50 dealer cost",retail:"$200-500 retail",verdict:"NOT WORTH IT",color:"var(--red)",note:"Locksmith services and third-party key insurance (KeyCare, etc.) cover this for a fraction of what dealers charge. Only modern luxury key fobs might justify consideration."},
              {name:"Nitrogen-Filled Tires",cost:"$0 (already installed)",retail:"$150-300 retail",verdict:"NEVER WORTH IT",color:"var(--red)",note:"Nitrogen in tires versus regular air provides negligible real-world benefit. This is a pure profit play — the dealer fills tires for free and charges you $150-300. Always decline."},
            ].map((p,i)=>(
              <div key={i} style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:12,padding:"16px 20px",marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:8}}>
                  <div style={{fontSize:15,fontWeight:900,color:"var(--text)"}}>{p.name}</div>
                  <span style={{fontSize:10,fontWeight:900,padding:"3px 10px",borderRadius:20,background:`${p.color}22`,color:p.color,letterSpacing:.5,whiteSpace:"nowrap"}}>{p.verdict}</span>
                </div>
                <div style={{display:"flex",gap:16,marginBottom:10,flexWrap:"wrap"}}>
                  <div style={{fontSize:11,fontWeight:900,color:"var(--muted)"}}>Dealer cost: <span style={{color:"var(--green)"}}>{p.cost}</span></div>
                  <div style={{fontSize:11,fontWeight:900,color:"var(--muted)"}}>What they charge: <span style={{color:"var(--red)"}}>{p.retail}</span></div>
                </div>
                <p style={{fontSize:12,color:"var(--text2)",fontWeight:700,lineHeight:1.65,margin:0}}>{p.note}</p>
              </div>
            ))}

            <h2 style={{fontSize:20,fontWeight:900,color:"var(--y)",marginBottom:10,marginTop:32}}>The Universal Rule</h2>
            <p style={{fontSize:14,color:"var(--text2)",fontWeight:700,lineHeight:1.8,marginBottom:24}}>Whatever the finance manager presents, your first answer should always be "not today." You can always add products after purchase. You can never remove them once you've signed. Take the contract home if you need to — you have every right to review it before signing anything.</p>

            <div style={{background:"rgba(255,214,0,.06)",border:"1px solid rgba(255,214,0,.25)",borderRadius:14,padding:"20px 24px",marginTop:32,marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:900,color:"var(--y)",marginBottom:8}}>🔓 Decode Your Specific F&I Products</div>
              <p style={{fontSize:13,color:"var(--text2)",fontWeight:700,lineHeight:1.6,marginBottom:16}}>CNTROFR's F&I Decoder gives you dealer cost, real value, and word-for-word exit scripts for every product in your deal — before you sit down in the finance office.</p>
              <button className="hbtn-y" style={{padding:"10px 24px",fontSize:13}} onClick={()=>{buy(PLANS[2])}}>Unlock F&I Decoder — $49</button>
            </div>
          </div>
          <div className="footer">
            <div className="footer-plate"><img src="/cntrofrplateplus.svg" alt="CNTROFR" style={{height:"auto",width:"260px",display:"block"}} /></div>
            <div className="footer-links">
              <a href="#" onClick={e=>{e.preventDefault();setView("arsenal");window.scrollTo(0,0)}}>{lang==="es"?"Herramientas":"Tools"}</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("blog");window.scrollTo(0,0)}}>More Guides</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("contact")}}>Contact</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("privacy");window.scrollTo(0,0)}}>Privacy Policy</a>
            </div>
          </div>
        </>
      )}

      {/* ── Blog Post: Add-Ons ──────────────────────────────────────────── */}
      {view==="blog_addons"&&(
        <>
          <div style={{background:"var(--bg3)",borderBottom:"1px solid var(--b1)",padding:"10px 28px"}}>
            <button className="ghost-btn" onClick={()=>{setView("blog");window.scrollTo(0,0)}}>← All Guides</button>
          </div>
          <div style={{maxWidth:760,margin:"0 auto",padding:"48px 24px"}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16}}>
              <span style={{background:"rgba(255,214,0,.12)",color:"var(--y)",fontSize:10,fontWeight:900,padding:"3px 10px",borderRadius:20,letterSpacing:.5}}>ADD-ONS</span>
              <span style={{fontSize:11,color:"var(--muted)",fontWeight:700}}>June 2026 · 6 min read · By a Certified Automotive Insider</span>
            </div>
            <h1 style={{fontSize:30,fontWeight:900,color:"var(--text)",marginBottom:16,lineHeight:1.2}}>How to Negotiate Dealer Add-Ons (And Remove the Ones You Don't Want)</h1>
            <p style={{fontSize:15,color:"var(--text2)",fontWeight:700,lineHeight:1.8,marginBottom:24}}>Before you ever sit down to talk numbers, dealers have often already installed hundreds or thousands of dollars worth of add-ons on the vehicle. They're betting you won't push back. Here's how to identify them, value them accurately, and remove the ones you don't want.</p>

            <h2 style={{fontSize:20,fontWeight:900,color:"var(--y)",marginBottom:10,marginTop:32}}>What Are Dealer Add-Ons?</h2>
            <p style={{fontSize:14,color:"var(--text2)",fontWeight:700,lineHeight:1.8,marginBottom:16}}>Dealer add-ons (also called dealer-installed accessories or dealer packs) are products or services that a dealership adds to a vehicle before putting it on the lot — and then charges you for at significant markup. Common examples include:</p>
            <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:12,padding:"16px 20px",marginBottom:24}}>
              {["Paint sealant / paint protection film","Fabric/interior protection","Window tinting","Wheel locks","All-weather floor mats (marked up)","Pinstripes or body side moldings","Alarm or GPS tracking systems (Lo-Jack, etc.)","VIN etching","Nitrogen-filled tires","Cargo nets or trunk liners"].map((item,i)=>(
                <div key={i} style={{fontSize:13,color:"var(--text2)",fontWeight:700,padding:"6px 0",borderBottom:i<9?"1px solid var(--b1)":"none"}}>• {item}</div>
              ))}
            </div>

            <h2 style={{fontSize:20,fontWeight:900,color:"var(--y)",marginBottom:10,marginTop:32}}>The "Already Installed" Play</h2>
            <p style={{fontSize:14,color:"var(--text2)",fontWeight:700,lineHeight:1.8,marginBottom:16}}>The most common dealer tactic is presenting add-ons as non-negotiable because they're "already on the vehicle." This is almost always false. Dealers use this language to create urgency and implied permanence. In reality:</p>
            <div style={{background:"rgba(255,68,68,.06)",border:"1px solid rgba(255,68,68,.2)",borderRadius:12,padding:"16px 20px",marginBottom:24}}>
              <p style={{fontSize:13,color:"var(--text2)",fontWeight:700,lineHeight:1.7,margin:0}}>Most dealer add-ons can be physically removed or simply not charged for. A paint sealant "already applied" costs the dealer $40 and takes 10 minutes to apply. They're not losing money by removing it from your deal — they're just making less profit. That's not your problem.</p>
            </div>

            <h2 style={{fontSize:20,fontWeight:900,color:"var(--y)",marginBottom:10,marginTop:32}}>How to Value Add-Ons Accurately</h2>
            <p style={{fontSize:14,color:"var(--text2)",fontWeight:700,lineHeight:1.8,marginBottom:16}}>Before accepting any add-on price, research what it costs retail outside the dealership. A quick rule of thumb on dealer markup by category:</p>
            {[
              {cat:"Paint/fabric protection",dealer:"$300-800",actual:"$50-150",markup:"300-500%"},
              {cat:"Window tinting",dealer:"$300-600",actual:"$150-250 (shop)",markup:"100-200%"},
              {cat:"GPS/alarm systems",dealer:"$400-900",actual:"$100-300 installed",markup:"200-400%"},
              {cat:"VIN etching",dealer:"$200-400",actual:"$10-20 DIY kit",markup:"1000%+"},
              {cat:"Wheel locks",dealer:"$100-200",actual:"$20-40 Amazon",markup:"300-500%"},
            ].map((r,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,padding:"10px 0",borderBottom:i<4?"1px solid var(--b1)":"none",fontSize:12,fontWeight:700}}>
                <div style={{color:"var(--text)"}}>{r.cat}</div>
                <div style={{color:"var(--red)"}}>{r.dealer}</div>
                <div style={{color:"var(--green)"}}>{r.actual}</div>
                <div style={{color:"var(--muted)"}}>{r.markup}</div>
              </div>
            ))}

            <h2 style={{fontSize:20,fontWeight:900,color:"var(--y)",marginBottom:10,marginTop:32}}>Word-for-Word Scripts</h2>
            {[
              {situation:"Remove all add-ons",script:'"I appreciate you putting this together, but I\'d like to remove the dealer add-ons from the deal entirely and just pay for the vehicle. Can we get a clean out-the-door number without those?"'},
              {situation:"They say they\'re already installed",script:'"I understand they\'re already on the vehicle, but I didn\'t agree to purchase them. I\'d like those removed from the price or reflected as a discount on the vehicle. If that\'s not possible, I\'ll need to look at other options."'},
              {situation:"Negotiate the markup",script:'"The [add-on] is listed at $600. I\'ve checked and the same service runs $150-200 independently. I\'d like to see a price that reflects actual market value, or I\'d prefer to remove it."'},
            ].map((s,i)=>(
              <div key={i} style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:900,color:"var(--y)",letterSpacing:.5,marginBottom:8}}>{s.situation.toUpperCase()}</div>
                <div style={{background:"rgba(255,214,0,.06)",border:"1px solid rgba(255,214,0,.2)",borderRadius:10,padding:"14px 16px",fontSize:13,color:"var(--text)",fontWeight:700,lineHeight:1.7,fontStyle:"italic"}}>"{s.script}"</div>
              </div>
            ))}

            <div style={{background:"rgba(255,214,0,.06)",border:"1px solid rgba(255,214,0,.25)",borderRadius:14,padding:"20px 24px",marginTop:32,marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:900,color:"var(--y)",marginBottom:8}}>🥊 Fight Back on Your Specific Add-Ons</div>
              <p style={{fontSize:13,color:"var(--text2)",fontWeight:700,lineHeight:1.6,marginBottom:16}}>CNTROFR's Add-On Fighter gives you dealer cost, real market value, and personalized counter scripts for every add-on in your deal. Know exactly what to say before they say it.</p>
              <button className="hbtn-y" style={{padding:"10px 24px",fontSize:13}} onClick={()=>{buy(PLANS[2])}}>Unlock Add-On Fighter — $49</button>
            </div>
          </div>
          <div className="footer">
            <div className="footer-plate"><img src="/cntrofrplateplus.svg" alt="CNTROFR" style={{height:"auto",width:"260px",display:"block"}} /></div>
            <div className="footer-links">
              <a href="#" onClick={e=>{e.preventDefault();setView("arsenal");window.scrollTo(0,0)}}>{lang==="es"?"Herramientas":"Tools"}</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("blog");window.scrollTo(0,0)}}>More Guides</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("contact")}}>Contact</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("privacy");window.scrollTo(0,0)}}>Privacy Policy</a>
            </div>
          </div>
        </>
      )}

      {/* ── Blog Post: Shopper vs Buyer ─────────────────────────────────── */}
      {view==="blog_shopper"&&(
        <>
          <div style={{background:"var(--bg3)",borderBottom:"1px solid var(--b1)",padding:"10px 28px"}}>
            <button className="ghost-btn" onClick={()=>{setView("blog");window.scrollTo(0,0)}}>← All Guides</button>
          </div>
          <div style={{maxWidth:760,margin:"0 auto",padding:"48px 24px"}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16}}>
              <span style={{background:"rgba(255,214,0,.12)",color:"var(--y)",fontSize:10,fontWeight:900,padding:"3px 10px",borderRadius:20,letterSpacing:.5}}>CAR BUYING 101</span>
              <span style={{fontSize:11,color:"var(--muted)",fontWeight:700}}>June 2026 · 6 min read · By a Certified Automotive Insider</span>
            </div>
            <h1 style={{fontSize:30,fontWeight:900,color:"var(--text)",marginBottom:16,lineHeight:1.2}}>Car Shopper vs. Car Buyer — Which One Are You?</h1>
            <p style={{fontSize:15,color:"var(--text2)",fontWeight:700,lineHeight:1.8,marginBottom:24}}>The most expensive car mistake isn't overpaying on a deal. It's overpaying for the wrong car entirely. Dealers love shoppers — they're easy to dazzle with features, packages, and monthly payments. Buyers are harder. They know what they want, why they want it, and what it's actually worth. Here's how to make the switch before you set foot on a lot.</p>

            <h2 style={{fontSize:20,fontWeight:900,color:"var(--y)",marginBottom:10,marginTop:32}}>The Shopper Mindset</h2>
            <p style={{fontSize:14,color:"var(--text2)",fontWeight:700,lineHeight:1.8,marginBottom:16}}>Shoppers are driven by feeling. They fall in love with a trim level they can't quite afford, get upsold on a sunroof they'll use twice, and leave the dealership having paid for someone else's idea of what their life should look like. None of that is the dealer's fault — they're just reading the room.</p>
            <p style={{fontSize:14,color:"var(--text2)",fontWeight:700,lineHeight:1.8,marginBottom:24}}>The shiny object trap is real and it's by design. Showroom lighting, new car smell, a test drive on a perfect afternoon — all of it is engineered to make you feel like a buyer when you're still a shopper. The switch from browsing to buying happens fast, and dealers are trained to accelerate it.</p>

            <h2 style={{fontSize:20,fontWeight:900,color:"var(--y)",marginBottom:10,marginTop:32}}>The Buyer Mindset</h2>
            <p style={{fontSize:14,color:"var(--text2)",fontWeight:700,lineHeight:1.8,marginBottom:16}}>Buyers have done the homework before they arrive. They know their budget, their actual needs, and the specific vehicle they're targeting. They're not there to browse — they're there to execute. That shift in posture changes everything about how a dealer interacts with you.</p>
            <div style={{background:"rgba(255,214,0,.06)",border:"1px solid rgba(255,214,0,.25)",borderRadius:12,padding:"16px 20px",marginBottom:24}}>
              <div style={{fontSize:12,fontWeight:900,color:"var(--y)",letterSpacing:.5,marginBottom:8}}>💡 THE MINDSET SHIFT</div>
              <p style={{fontSize:13,color:"var(--text)",fontWeight:700,lineHeight:1.7,margin:0}}>Shoppers ask "what do you have?" Buyers say "I'm looking for a specific vehicle and I'm ready to move this week if the deal is right." One of those sentences makes a dealer work for your business. The other puts you at their mercy.</p>
            </div>

            <h2 style={{fontSize:20,fontWeight:900,color:"var(--y)",marginBottom:10,marginTop:32}}>Start With Your Driving Life</h2>
            <p style={{fontSize:14,color:"var(--text2)",fontWeight:700,lineHeight:1.8,marginBottom:16}}>Before you look at a single vehicle, be honest about how you actually drive — not how you'd like to drive in an imaginary version of your life. Answer these questions first:</p>

            {[
              {q:"How many miles do you drive per year?",a:"Under 10,000 miles/year and you're leasing territory. Over 15,000 and you should almost certainly buy. This single number changes your financial math more than almost anything else about the deal."},
              {q:"Where do you spend most of your time driving?",a:"City driving rewards smaller vehicles with better maneuverability and higher MPG in stop-and-go. Highway commuters benefit from larger, more comfortable vehicles with strong highway fuel economy. If you're splitting both, prioritize whichever represents more of your weekly miles."},
              {q:"Do you actually need the truck?",a:"This is the big one. Trucks and large SUVs are the most heavily marketed vehicles in America for a reason — the margins are enormous. If you're using truck bed or 3rd-row seating less than 10 times a year, you're paying a significant premium (both purchase price and fuel) for capability you're not using."},
              {q:"What does your weather look like?",a:"AWD and 4WD add cost, weight, and fuel consumption. In Colorado, the Pacific Northwest, or the upper Midwest — worth it. In Phoenix, Dallas, or Atlanta — probably not. Be honest about your actual climate, not the one worst-case scenario you're planning for."},
              {q:"How long do you plan to keep it?",a:"Short-term ownership (under 3 years) favors leasing or low-mileage used vehicles. Long-term ownership (5+ years) favors buying new or certified pre-owned with remaining factory warranty. Planning to keep a vehicle 10 years? Reliability data matters more than any feature list."},
            ].map((item,i)=>(
              <div key={i} style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:12,padding:"16px 20px",marginBottom:12}}>
                <div style={{fontSize:14,fontWeight:900,color:"var(--text)",marginBottom:8}}>❓ {item.q}</div>
                <p style={{fontSize:13,color:"var(--text2)",fontWeight:700,lineHeight:1.65,margin:0}}>{item.a}</p>
              </div>
            ))}

            <h2 style={{fontSize:20,fontWeight:900,color:"var(--y)",marginBottom:10,marginTop:32}}>Match the Vehicle to Your Life — Not the Other Way Around</h2>
            <p style={{fontSize:14,color:"var(--text2)",fontWeight:700,lineHeight:1.8,marginBottom:16}}>Once you've answered those questions honestly, the right vehicle category usually becomes obvious. A few common mismatches worth avoiding:</p>

            {[
              {mismatch:"Buying a full-size truck for occasional hauling",cost:"$10,000-20,000 in additional purchase price, $200-400/month more in fuel costs annually, harder to park daily",fix:"A mid-size truck or large SUV with a hitch covers 90% of the same use cases for significantly less money."},
              {mismatch:"Buying a 3-row SUV for a family of three",cost:"$5,000-15,000 in additional purchase price, worse fuel economy, harder to maneuver",fix:"A compact or mid-size SUV or a minivan (which remains the most practical family vehicle by almost every metric people refuse to admit)."},
              {mismatch:"Buying new when your annual miles are under 8,000",cost:"Rapid depreciation on a vehicle that barely moves the odometer",fix:"A 2-3 year old certified pre-owned vehicle lets someone else absorb the depreciation hit while you still get a nearly new experience."},
              {mismatch:"Leasing a vehicle you'll drive over 15,000 miles/year",cost:"Overage charges at $0.25-0.30/mile can add thousands to your lease-end cost",fix:"Buy instead, or negotiate a higher mileage lease upfront — the per-mile rate is almost always cheaper when negotiated at signing."},
            ].map((item,i)=>(
              <div key={i} style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:12,padding:"16px 20px",marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:900,color:"var(--red)",letterSpacing:.5,marginBottom:6}}>⚠ COMMON MISMATCH</div>
                <div style={{fontSize:13,fontWeight:900,color:"var(--text)",marginBottom:6}}>{item.mismatch}</div>
                <div style={{fontSize:12,color:"var(--red)",fontWeight:700,marginBottom:8}}>Real cost: {item.cost}</div>
                <div style={{fontSize:12,color:"var(--green)",fontWeight:700}}>Better path: {item.fix}</div>
              </div>
            ))}

            <h2 style={{fontSize:20,fontWeight:900,color:"var(--y)",marginBottom:10,marginTop:32}}>The One-Week Buyer Window</h2>
            <p style={{fontSize:14,color:"var(--text2)",fontWeight:700,lineHeight:1.8,marginBottom:16}}>Once you've identified the right vehicle for your actual life, you have roughly a one-week window to move from decision to deal. Here's why that timeline matters:</p>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
              {[
                {day:"Day 1-2",action:"Lock in your target vehicle — year, make, model, trim. Narrow to 2-3 options max. Color flexibility saves money — light vs. dark matters less than being rigid about a specific combination."},
                {day:"Day 2-3",action:"Get pre-approved for financing through your bank or credit union before you contact a single dealer. This is non-negotiable. Walking in pre-approved changes the entire dynamic of the finance office conversation."},
                {day:"Day 3-4",action:"Get quotes from 3+ dealers via email or phone. Never negotiate in person on your first contact. Let them compete for your business before you show up anywhere."},
                {day:"Day 4-5",action:"Run your best quote through CNTROFR. Know exactly what you're walking into — fee benchmarks, F&I product costs, add-on scripts, financing markup — before you sit down anywhere."},
                {day:"Day 5-7",action:"Execute the deal. You're not browsing anymore. You know the vehicle, you know the fair price, you know the F&I office playbook. Walk in as a buyer, not a shopper."},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:10,padding:"14px 16px"}}>
                  <div style={{minWidth:64,fontSize:11,fontWeight:900,color:"var(--y)",letterSpacing:.5,paddingTop:2}}>{item.day}</div>
                  <div style={{fontSize:13,color:"var(--text2)",fontWeight:700,lineHeight:1.65}}>{item.action}</div>
                </div>
              ))}
            </div>

            <h2 style={{fontSize:20,fontWeight:900,color:"var(--y)",marginBottom:10,marginTop:32}}>Why the One-Week Window Works</h2>
            <p style={{fontSize:14,color:"var(--text2)",fontWeight:700,lineHeight:1.8,marginBottom:24}}>The average car buyer spends 14+ hours across multiple dealer visits over weeks or months. Most of that time is spent in shopper mode — browsing, comparing, getting emotionally invested before they've done the financial homework. Compressing that into a focused one-week buying process eliminates the window where dealers can work on your emotions and your wallet simultaneously. You arrive informed, pre-approved, and ready. The power dynamic flips entirely.</p>

            <div style={{background:"rgba(255,214,0,.06)",border:"1px solid rgba(255,214,0,.25)",borderRadius:14,padding:"20px 24px",marginTop:32,marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:900,color:"var(--y)",marginBottom:8}}>⚡ Ready to Move From Shopper to Buyer?</div>
              <p style={{fontSize:13,color:"var(--text2)",fontWeight:700,lineHeight:1.6,marginBottom:16}}>CNTROFR's Pro Bundle gives you every tool you need for that one-week window — deal analysis, fee benchmarks, F&I decoding, dealer review audits, add-on scripts, and your full counter playbook. One price. Seven days. Everything you need to walk in as a buyer.</p>
              <button className="hbtn-y" style={{padding:"10px 24px",fontSize:13}} onClick={()=>{buy(PLANS[2])}}>Unlock Pro Bundle — $49</button>
            </div>
          </div>
          <div className="footer">
            <div className="footer-plate"><img src="/cntrofrplateplus.svg" alt="CNTROFR" style={{height:"auto",width:"260px",display:"block"}} /></div>
            <div className="footer-links">
              <a href="#" onClick={e=>{e.preventDefault();setView("arsenal");window.scrollTo(0,0)}}>{lang==="es"?"Herramientas":"Tools"}</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("blog");window.scrollTo(0,0)}}>More Guides</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("contact")}}>Contact</a>
              <a href="#" onClick={e=>{e.preventDefault();setView("privacy");window.scrollTo(0,0)}}>Privacy Policy</a>
            </div>
          </div>
        </>
      )}

      {view==="admin"&&(
        <>
          <div style={{background:"var(--bg3)",borderBottom:"1px solid var(--b1)",padding:"10px 28px"}}>
            <button className="ghost-btn" onClick={()=>{setView("home");window.scrollTo(0,0);window.history.replaceState(null,"","/");}}>← Back to Home</button>
          </div>
          <AdminStats />
        </>
      )}
      {modal&&<PayModal plan={modal} onClose={()=>setModal(null)} onSuccess={onPaid} lang={lang} />}
      {sessionWarning&&(
        <div className="session-warn-overlay">
          <div className="session-warn-box">
            <div className="session-warn-icon">⚠️</div>
            <div className="session-warn-title">Before You Start</div>
            <div className="session-warn-body">This is a <strong>single session</strong>. Close this tab and your access is gone — no exceptions, no refunds for incomplete sessions.</div>
            <ul className="session-warn-list">
              <li>Have your deal sheet or quote in front of you</li>
              <li>Know your vehicle year, make, model, and asking price</li>
              <li>Have all fees and F&I products listed</li>
              <li>Know your trade-in details if applicable</li>
              <li>Do not close or refresh this tab during your session</li>
            </ul>
            <button className="hbtn-y" style={{width:"100%",padding:"14px",fontSize:14}} onClick={()=>{setSessionWarning(false);setView("tools");setTab("deal");}}>I'm Ready — Let's Go</button>
          </div>
        </div>
      )}
    </>
  );
}

