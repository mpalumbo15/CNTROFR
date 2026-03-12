import { useState } from "react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --y: #FFD600; --yd: #E8C200; --yp: rgba(255,214,0,0.1);
    --red: #FF4444; --green: #00C96B; --blue: #3B9EFF;
    --bg: #0E0E14; --bg2: #16161E; --bg3: #1E1E28;
    --b1: #28283A; --b2: #38385A;
    --muted: #606080; --text: #EEEAF8; --text2: #A8A4C8;
  }
  body { background: var(--bg); color: var(--text); font-family: 'Nunito', sans-serif; overflow-x: hidden; }
  .hdr { position: sticky; top: 0; z-index: 200; background: rgba(14,14,20,.96); backdrop-filter: blur(12px); border-bottom: 2px solid var(--b1); padding: 0 28px; display: flex; align-items: center; height: 62px; gap: 16px; }
  .hdr-logo { display: flex; align-items: center; gap: 12px; cursor: pointer; }
  .hdr-plate { background: var(--y); border: 2px solid #B8A000; border-radius: 5px; padding: 3px 10px; box-shadow: 0 2px 0 #8A7800, 0 3px 10px rgba(255,214,0,.25); font-family: 'Bebas Neue'; font-size: 18px; letter-spacing: 4px; color: #111; position: relative; }
  .hdr-plate::before, .hdr-plate::after { content: '●'; position: absolute; top: 50%; transform: translateY(-50%); font-size: 6px; color: #B8A000; }
  .hdr-plate::before { left: 3px; } .hdr-plate::after { right: 3px; }
  .hdr-tagline { font-size: 9px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); }
  .hdr-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
  .hbtn { background: none; border: 2px solid var(--b2); color: var(--text2); padding: 7px 18px; font-family: Nunito; font-size: 12px; font-weight: 800; cursor: pointer; border-radius: 8px; transition: all .2s; }
  .hbtn:hover { border-color: var(--y); color: var(--y); }
  .hbtn-y { background: var(--y); color: #111; border: none; padding: 8px 22px; font-family: Nunito; font-size: 12px; font-weight: 900; cursor: pointer; border-radius: 8px; transition: background .2s; box-shadow: 0 2px 12px rgba(255,214,0,.3); }
  .hbtn-y:hover { background: var(--yd); }
  .hero { max-width: 900px; margin: 0 auto; padding: 80px 24px 60px; text-align: center; position: relative; }
  .hero-road { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: repeating-linear-gradient(90deg, var(--y) 0px, var(--y) 40px, transparent 40px, transparent 80px); opacity: .3; }
  .hero-center-plate { display: flex; justify-content: center; margin-bottom: 32px; }
  .hero-plate { background: var(--y); border: 6px solid #B8A000; border-radius: 12px; padding: 10px 32px 12px; box-shadow: 0 6px 0 #8A7800, 0 10px 40px rgba(255,214,0,.35); position: relative; display: inline-flex; flex-direction: column; align-items: center; }
  .hero-plate::before, .hero-plate::after { content: '◉'; position: absolute; top: 50%; transform: translateY(-50%); font-size: 10px; color: rgba(0,0,0,.3); }
  .hero-plate::before { left: 10px; } .hero-plate::after { right: 10px; }
  .hp-state { font-size: 9px; font-weight: 900; letter-spacing: 3px; color: #8A7800; margin-bottom: 2px; }
  .hp-text { font-family: 'Bebas Neue'; font-size: clamp(42px, 10vw, 72px); letter-spacing: 10px; color: #111; line-height: 1; }
  .hp-url { font-size: 9px; font-weight: 900; color: #8A7800; letter-spacing: 2px; margin-top: 2px; }
  .hero-h1 { font-family: 'Bebas Neue'; font-size: clamp(32px, 7vw, 60px); letter-spacing: 2px; line-height: .95; margin-bottom: 10px; }
  .hero-h1 .y { color: var(--y); }
  .hero-tagline { font-family: 'Bebas Neue'; font-size: clamp(14px, 3vw, 22px); letter-spacing: 6px; color: var(--y); margin-bottom: 14px; }
  .hero-sub { font-size: 15px; color: var(--text2); max-width: 500px; margin: 0 auto 36px; line-height: 1.75; font-weight: 600; }
  .hero-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .btn-lg { background: var(--y); color: #111; border: none; padding: 15px 40px; font-family: Nunito; font-size: 16px; font-weight: 900; cursor: pointer; border-radius: 12px; transition: all .2s; box-shadow: 0 4px 22px rgba(255,214,0,.3); }
  .btn-lg:hover { background: var(--yd); transform: translateY(-1px); }
  .btn-lg-ghost { background: transparent; border: 2px solid var(--b2); color: var(--text2); padding: 13px 28px; font-family: Nunito; font-size: 15px; font-weight: 800; cursor: pointer; border-radius: 12px; transition: all .2s; }
  .btn-lg-ghost:hover { border-color: var(--y); color: var(--y); }
  .stats { display: flex; justify-content: center; gap: 48px; margin-top: 56px; padding-top: 36px; border-top: 1px solid var(--b1); flex-wrap: wrap; }
  .stat-n { font-family: 'Bebas Neue'; font-size: 40px; color: var(--y); letter-spacing: 1px; }
  .stat-l { font-size: 11px; color: var(--muted); font-weight: 700; margin-top: 2px; letter-spacing: .5px; }
  .alert { background: rgba(255,68,68,.07); border-top: 1px solid rgba(255,68,68,.2); border-bottom: 1px solid rgba(255,68,68,.2); padding: 12px 24px; text-align: center; }
  .alert p { font-size: 12px; color: #FF8888; font-weight: 700; }
  .alert p strong { color: var(--red); }
  .sec { max-width: 900px; margin: 0 auto; padding: 64px 24px; }
  .sec-eye { font-family: 'Bebas Neue'; font-size: 12px; letter-spacing: 4px; color: var(--y); text-align: center; margin-bottom: 10px; }
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
  .pgrid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-top: 32px; }
  @media(max-width:640px){ .pgrid { grid-template-columns: 1fr; } }
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
  .ttab { background: var(--bg2); border: 2px solid var(--b1); color: var(--muted); padding: 8px 18px; font-family: Nunito; font-size: 12px; font-weight: 800; cursor: pointer; border-radius: 100px; transition: all .2s; white-space: nowrap; display: flex; align-items: center; gap: 6px; }
  .ttab:hover:not(.lk) { border-color: var(--b2); color: var(--text2); }
  .ttab.on { background: var(--y); border-color: var(--y); color: #111; }
  .ttab.lk { opacity: .4; cursor: not-allowed; }
  .access-ok { background: rgba(0,201,107,.08); border: 1px solid rgba(0,201,107,.2); border-radius: 10px; padding: 10px 16px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; font-size: 12px; color: var(--green); font-weight: 800; }
  .upbox { background: var(--bg2); border: 2px solid var(--b1); border-radius: 16px; padding: 56px 32px; text-align: center; }
  .upbox h3 { font-family: 'Bebas Neue'; font-size: 28px; letter-spacing: 2px; margin-bottom: 10px; }
  .upbox p { font-size: 13px; color: var(--text2); max-width: 320px; margin: 0 auto 24px; line-height: 1.7; font-weight: 600; }
  .card { background: var(--bg2); border: 2px solid var(--b1); border-radius: 14px; margin-bottom: 16px; }
  .ch { padding: 14px 20px; border-bottom: 1px solid var(--b1); }
  .clbl { font-size: 10px; font-weight: 900; letter-spacing: 2.5px; text-transform: uppercase; color: var(--y); }
  .cb { padding: 20px; }
  .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .g3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  @media(max-width:540px){ .g2,.g3 { grid-template-columns: 1fr; } }
  .fld { display: flex; flex-direction: column; gap: 5px; }
  .fld label { font-size: 10px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); }
  .fld input, .fld select, .fld textarea { background: var(--bg); border: 2px solid var(--b1); color: var(--text); font-family: 'JetBrains Mono'; font-size: 12px; padding: 9px 12px; border-radius: 8px; outline: none; transition: border-color .2s; width: 100%; }
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
  .disclaimer { background: rgba(255,214,0,.05); border: 1px solid rgba(255,214,0,.15); border-radius: 10px; padding: 12px 16px; margin-bottom: 18px; font-size: 11px; color: var(--muted); line-height: 1.65; font-weight: 600; }
  .disclaimer strong { color: var(--y); }
  .footer { border-top: 2px solid var(--b1); padding: 36px 24px; text-align: center; }
  .footer-plate { display: flex; justify-content: center; margin-bottom: 12px; }
  .fp { background: var(--y); border: 3px solid #B8A000; border-radius: 6px; padding: 5px 18px; box-shadow: 0 3px 0 #8A7800; font-family: 'Bebas Neue'; font-size: 20px; letter-spacing: 5px; color: #111; }
  .footer-slogan { font-family: 'Bebas Neue'; font-size: 13px; letter-spacing: 4px; color: var(--muted); margin-bottom: 14px; }
  .footer p { font-size: 11px; color: var(--muted); line-height: 1.8; max-width: 560px; margin: 0 auto; font-weight: 600; }
  .footer a { color: var(--text2); text-decoration: none; }
  .footer a:hover { color: var(--y); }
  .footer-links { display: flex; justify-content: center; gap: 20px; margin-top: 12px; flex-wrap: wrap; }
`;

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

async function ai(prompt, web = false) {
  const body = { model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] };
  if (web) body.tools = [{ type: "web_search_20250305", name: "web_search" }];
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
    body: JSON.stringify(body)
  });
  const d = await r.json();
  return d.content?.map(b => b.text || "").filter(Boolean).join("") || "Analysis unavailable. Please try again.";
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
  return (
    <div className="card ranim">
      <div className="vstrip">
        <span style={{fontFamily:"Nunito",fontSize:9,fontWeight:900,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)"}}>VERDICT</span>
        <span className={`badge ${vc}`}>{verdict}</span>
        <div style={{flex:1}} />
        <button className="ghost-btn" onClick={onReset}>New</button>
      </div>
      <MD text={text} />
    </div>
  );
}

function Loading({ msg }) {
  return <div className="card"><div className="loadbox"><div className="spin" /><p>{msg}</p></div></div>;
}

function DealAnalyzer() {
  const [f, setF] = useState({ year:"", vehicle:"", msrp:"", offer:"", trim:"", mileage:"", marketRange:"", tradeIn:"", tradeOwed:"", addons:"", notes:"", zip:"" });
  const [loading, setL] = useState(false); const [loadMsg, setLM] = useState(""); const [res, setR] = useState(null); const [market, setM] = useState(null); const [v, setV] = useState("");
  const s = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const run = async () => {
    setL(true); setR(null); setM(null);
    setLM("Analyzing your deal...");
    const t = await ai(`You are a veteran automotive insider. Analyze this deal honestly.
${f.year} ${f.vehicle}${f.trim ? " — Trim: "+f.trim : ""} | ${f.mileage ? f.mileage+" miles" : "New / mileage not provided"} | MSRP $${f.msrp} | Asking $${f.offer}
Trade offered: $${f.tradeIn||"none"} | Owed: $${f.tradeOwed||"none"}${f.marketRange ? " | Buyer's market range research: "+f.marketRange : ""}
Add-ons: ${f.addons||"none"} | Notes: ${f.notes||"none"}

## OVERALL VERDICT — GO, NEGOTIATE, or WALK AWAY. One sentence why.
## VEHICLE PRICE — Is this fair given the mileage and trim? How much room is left? If mileage is above average (15,000/yr), factor depreciation impact explicitly.
## TRADE-IN — Fair offer or lowball? Account for negative equity if owed exceeds offered.
## ADD-ONS — Worth It / Overpriced / Skip It for each.
## YOUR COUNTER — 3-4 specific things to say before signing.
## RED FLAGS — Any dealer tactics at play?

Do not provide financing rate or payment advice.`);
    const m = t.match(/VERDICT[^:]*:\s*(GO|NEGOTIATE|WALK\s*AWAY)/i);
    setV(m ? m[1].trim().toUpperCase() : "COMPLETE"); setR(t);
    if (f.zip && f.year && f.vehicle) {
      setLM("Scanning nearby dealer prices...");
      const mkt = await ai(`You are an automotive market analyst. Search for current listings of ${f.year} ${f.vehicle}${f.trim ? " "+f.trim : ""} for sale at dealerships near zip code ${f.zip}.
Match the trim level as closely as possible${f.trim ? " — specifically looking for the "+f.trim+" trim" : ""}. ${f.mileage ? "Focus on listings with similar mileage to "+f.mileage+" miles — flag any comps that are significantly higher or lower mileage." : ""} Find 3-5 real comparable listings from dealers within roughly 150 miles. For each listing include:
- Dealer name and city
- Asking price
- Mileage if used
- How it compares to the $${f.offer} being offered to our buyer

## MARKET VERDICT — Is $${f.offer} above market, at market, or below market?
## COMPARABLE LISTINGS — Real dealers and prices found nearby.
## PRICE RANGE — Lowest and highest comparable found.
## LEVERAGE — Exact script to use these comps at the negotiating table.
## BOTTOM LINE — What should this buyer actually pay based on the market?`, true);
      setM(mkt);
    }
    setL(false); setLM("");
  };
  const vc = v => /^GO/.test(v) ? "bg" : /WALK/.test(v) ? "br" : /NEG/.test(v) ? "ba" : "bx";
  return (
    <div>
      <div className="phd"><h2>Deal <span>Analyzer</span></h2><p>Enter your numbers. Get your counter before you sign.</p></div>
      <div className="disclaimer"><strong>Note:</strong> CNTROFR analyzes deal pricing, trade-in value, and add-on products only. We do not provide financing or credit advice. Consult a financial professional for loan decisions.</div>
      <div className="card">
        <div className="ch"><span className="clbl">The Vehicle</span></div>
        <div className="cb">
          <div className="g2">
            <div className="fld"><label>Year</label><input placeholder="2024" value={f.year} onChange={s("year")} /></div>
            <div className="fld"><label>Make & Model</label><input placeholder="Honda Accord EX-L" value={f.vehicle} onChange={s("vehicle")} /></div>
          </div>
          <div className="sp" />
          <div className="fld">
            <label style={{display:"flex",alignItems:"center"}}>
              Trim Level
              <div className="tooltip-wrap">
                <span className="tooltip-icon">?</span>
                <div className="tooltip-bubble">Trim level dramatically affects price. A Civic EX and a Civic Type R can be $15,000+ apart. Including the trim gives us a much more accurate picture of what your car is actually worth — and what the dealer has room to move on.</div>
              </div>
            </label>
            <input placeholder="e.g. EX-L, Sport, Type R, Platinum — optional but helps a lot" value={f.trim} onChange={s("trim")} />
          </div>
          <div className="sp" />
          <div className="g2">
            <div className="fld">
              <label style={{display:"flex",alignItems:"center"}}>
                Mileage
                <div className="tooltip-wrap">
                  <span className="tooltip-icon">?</span>
                  <div className="tooltip-bubble">Average mileage is roughly 12,000–15,000 miles per year. High mileage accelerates depreciation and affects what the car is truly worth. We use this to flag whether the asking price reflects reality — or ignores the odometer entirely.</div>
                </div>
              </label>
              <input placeholder="e.g. 34,200 — leave blank if new" value={f.mileage} onChange={s("mileage")} />
            </div>
            <div className="fld"><label>MSRP (Sticker)</label><input placeholder="32,000" value={f.msrp} onChange={s("msrp")} /></div>
          </div>
          <div className="sp" />
          <div className="g2">
            <div className="fld"><label>Their Asking Price</label><input placeholder="29,500" value={f.offer} onChange={s("offer")} /></div>
            <div className="fld"><label style={{display:"flex",alignItems:"center"}}>Expected Price Range<div className="tooltip-wrap"><span className="tooltip-icon">?</span><div className="tooltip-bubble">Optional — if you've already checked KBB, Edmunds, or CarGurus, drop the range here. We'll factor it into the analysis and tell you if the dealer is inside or outside of fair market.</div></div></label><input placeholder="e.g. 27,000 – 29,500 (from KBB)" value={f.marketRange||""} onChange={s("marketRange")} /></div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="ch"><span className="clbl">Trade-In (if any)</span></div>
        <div className="cb">
          <div className="g2">
            <div className="fld"><label>Trade-In Offered</label><input placeholder="8,500" value={f.tradeIn} onChange={s("tradeIn")} /></div>
            <div className="fld"><label>Owed on Trade</label><input placeholder="4,200" value={f.tradeOwed} onChange={s("tradeOwed")} /></div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="ch"><span className="clbl">Add-Ons & Notes</span></div>
        <div className="cb">
          <div className="fld" style={{marginBottom:12}}><label>Add-Ons</label><input placeholder="Extended warranty $2,100 · GAP $895 · Paint protection $499" value={f.addons} onChange={s("addons")} /></div>
          <div className="fld"><label>Anything Else We Should Know</label><textarea placeholder="Been on lot 60 days, competing offer, etc..." value={f.notes} onChange={s("notes")} /></div>
        </div>
      </div>
      <div className="card">
        <div className="ch"><span className="clbl">📍 Local Market Scan <span style={{color:"var(--green)",fontSize:9,letterSpacing:1,marginLeft:8}}>NEW</span></span></div>
        <div className="cb">
          <div className="fld">
            <label>Your Zip Code — We scan nearby dealers for this exact vehicle</label>
            <input placeholder="e.g. 80021 — leave blank to skip market scan" value={f.zip} onChange={s("zip")} maxLength={5} />
          </div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:6,fontWeight:700}}>Optional but powerful — we find what other dealers nearby are charging for the same car and hand you that leverage.</div>
          <button className="go-btn" onClick={run} disabled={loading||(!f.vehicle&&!f.offer)}>{loading ? loadMsg||"Working..." : f.zip ? "→ Get My Counter + Market Scan" : "→ Get My Counter"}</button>
        </div>
      </div>
      {loading && <Loading msg={loadMsg||"Building your counteroffer..."} />}
      {res && !loading && (
        <>
          <Res verdict={v} vc={vc(v)} text={res} onReset={()=>{setR(null);setM(null);}} />
          {market && (
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

function FeeComparison() {
  const [f, setF] = useState({ dealer:"", city:"", state:"", fee:"", brand:"" });
  const [loading, setL] = useState(false); const [res, setR] = useState(null);
  const s = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const run = async () => {
    setL(true); setR(null);
    const t = await ai(`You are an automotive consumer advocate and former dealer finance manager.
Dealer: ${f.dealer} | ${f.city}, ${f.state} | Brand: ${f.brand} | Doc Fee: $${f.fee}
## FEE VERDICT — FAIR, HIGH, or EXCESSIVE?
## STATE CONTEXT — Laws/caps and typical range for ${f.brand} in ${f.state}.
## WHAT IT COVERS — Legitimate components only.
## WHAT IT DOESN'T JUSTIFY — Padding.
## PERKS CHECK — What should come with a fee this size?
## YOUR COUNTER — Exact words to push back.
## LEVERAGE — How to use competing dealer quotes.`, true);
    setR(t); setL(false);
  };
  return (
    <div>
      <div className="phd"><h2>Fee <span>Comparison</span></h2><p>Is that doc fee legit — or greed with paperwork on top?</p></div>
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
            <div className="fld"><label>Doc Fee $</label><input placeholder="799" value={f.fee} onChange={s("fee")} /></div>
          </div>
          <button className="go-btn" onClick={run} disabled={loading||!f.state||!f.fee}>{loading?"Researching...":"→ Analyze This Fee"}</button>
        </div>
      </div>
      {loading && <Loading msg="Researching fee standards for your state..." />}
      {res && !loading && <div className="card ranim"><div className="vstrip"><span className="badge ba">FEE ANALYSIS</span><div style={{flex:1}}/><button className="ghost-btn" onClick={()=>setR(null)}>Reset</button></div><MD text={res}/></div>}
    </div>
  );
}

function ReviewPurity() {
  const [f, setF] = useState({ dealer:"", city:"", state:"", reviews:"" });
  const [loading, setL] = useState(false); const [loadMsg, setLM] = useState(""); const [customerRes, setCR] = useState(null); const [employeeRes, setER] = useState(null); const [complaintRes, setKR] = useState(null); const [v, setV] = useState("");
  const s = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const run = async () => {
    setL(true); setCR(null); setER(null); setKR(null);

    setLM("Auditing customer reviews...");
    const customer = await ai(`You are a reputation integrity analyst specializing in dealer review manipulation.
Dealer: ${f.dealer}, ${f.city} ${f.state}
${f.reviews?"Customer reviews pasted by user:\n"+f.reviews:"No reviews pasted — search Google Reviews, DealerRater, and Cars.com for this dealer and analyze what you find."}

## CUSTOMER REVIEW VERDICT — LIKELY AUTHENTIC, SUSPICIOUS, or HIGH BOT RISK
## BOT FARMING SIGNALS — Specific patterns: review velocity, generic language, duplicate phrasing, suspiciously clustered 5-star bursts.
## WHAT THE REAL COMPLAINTS SAY — Themes from legitimate 1-3 star reviews. Ignore obvious bad-faith reviews.
## WHAT THE PRAISE SAYS — Are the 5-star reviews specific and believable or vague and scripted?
## MANAGEMENT RESPONSE PATTERNS — Do they respond defensively, dismissively, or genuinely?
## PLATFORM CROSS-CHECK — How does the rating compare across Google, DealerRater, and Cars.com? Big gaps are a red flag.
## CUSTOMER TRUST SCORE — HIGH / MODERATE / LOW with one-line reasoning.`, true);
    const m = customer.match(/(LIKELY AUTHENTIC|SUSPICIOUS|HIGH BOT RISK)/i);
    setV(m?m[1].trim().toUpperCase():"ANALYZED"); setCR(customer);

    setLM("Checking employee sentiment on Glassdoor & Indeed...");
    const employee = await ai(`You are an automotive dealership culture analyst. Search Glassdoor and Indeed for employee reviews of "${f.dealer}" in ${f.city}, ${f.state}.

This matters because angry, burned-out, or pressured employees directly impact the customer experience on the lot.

## EMPLOYEE SENTIMENT VERDICT — HEALTHY CULTURE, CONCERNING, or TOXIC
## GLASSDOOR FINDINGS — Overall rating, most common complaints, management scores. What do former employees say?
## INDEED FINDINGS — Any patterns around turnover, pressure, or toxic management?
## THE FLOOR vs. THE SUITS — Are complaints about frontline staff (sales, service) or management and ownership?
## PRESSURE CULTURE SIGNALS — Do employees describe being pushed to hit numbers at the customer's expense?
## TURNOVER RED FLAGS — High turnover in sales or F&I is a warning sign for buyers. What did you find?
## CULTURE VERDICT — Would you send a friend to buy here based on how employees describe this place?`, true);
    setER(employee);

    setLM("Pulling BBB & complaint records...");
    const complaints = await ai(`You are a consumer protection researcher. Search for complaints and records on "${f.dealer}" in ${f.city}, ${f.state} across:
- BBB (Better Business Bureau) — rating, complaint count, complaint patterns, resolution history
- State Attorney General consumer complaint database for ${f.state}
- CFPB (Consumer Financial Protection Bureau) complaints if applicable
- Any news articles, local press, or legal actions involving this dealership

## COMPLAINT RECORD VERDICT — CLEAN, MINOR ISSUES, or SIGNIFICANT CONCERNS
## BBB RECORD — Rating, number of complaints, types of complaints, how they were resolved (or not).
## COMPLAINT PATTERNS — Are complaints about pricing, fees, F&I products, service, or title/registration issues?
## UNRESOLVED COMPLAINTS — Any pattern of dealers not fixing problems? That tells you everything.
## LEGAL / NEWS — Any lawsuits, AG actions, or local news stories about this dealer?
## WHAT TO ASK THEM — 2-3 direct questions to ask the dealer based on what you found.
## OVERALL RISK LEVEL — LOW / MODERATE / HIGH with reasoning.`, true);
    setKR(complaints);

    setL(false); setLM("");
  };
  const vc = v => /AUTHENTIC/.test(v)?"bg":/HIGH BOT/.test(v)?"br":/SUSPICIOUS/.test(v)?"ba":"bb";
  return (
    <div>
      <div className="phd"><h2>Review <span>Purity</span></h2><p>Customer reviews. Employee culture. Complaint records. The full picture.</p></div>
      <div className="card">
        <div className="ch"><span className="clbl">Dealer to Audit</span></div>
        <div className="cb">
          <div className="g3">
            <div className="fld"><label>Dealer Name</label><input placeholder="Hendrick Toyota" value={f.dealer} onChange={s("dealer")} /></div>
            <div className="fld"><label>City</label><input placeholder="Charlotte" value={f.city} onChange={s("city")} /></div>
            <div className="fld"><label>State</label><input placeholder="NC" value={f.state} onChange={s("state")} /></div>
          </div>
          <div className="sp" />
          <div className="fld"><label>Paste Customer Reviews (optional — better with them)</label><textarea style={{minHeight:110}} placeholder={"5★ — Amazing experience, loved Carlos!\n1★ — Snuck $2k in fees at signing without telling me..."} value={f.reviews} onChange={s("reviews")} /></div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:6,fontWeight:700}}>We run 3 separate scans — customer reviews, employee sentiment (Glassdoor/Indeed), and complaint records (BBB/AG). This takes about 30 seconds.</div>
          <button className="go-btn" onClick={run} disabled={loading||!f.dealer}>{loading ? loadMsg||"Running..." : "→ Run Full Purity Audit"}</button>
        </div>
      </div>
      {loading && <Loading msg={loadMsg||"Running full audit..."} />}
      {!loading && customerRes && (
        <>
          <div className="card ranim">
            <div className="vstrip">
              <span style={{fontFamily:"Nunito",fontSize:9,fontWeight:900,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)"}}>CUSTOMER REVIEWS</span>
              <span className={`badge ${vc(v)}`}>{v||"ANALYZED"}</span>
              <div style={{flex:1}}/>
              <button className="ghost-btn" onClick={()=>{setCR(null);setER(null);setKR(null);}}>Reset</button>
            </div>
            <MD text={customerRes} />
          </div>
          {employeeRes && (
            <div className="card ranim">
              <div className="vstrip">
                <span style={{fontFamily:"Nunito",fontSize:9,fontWeight:900,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)"}}>EMPLOYEE CULTURE</span>
                <span className="badge ba">👔 GLASSDOOR + INDEED</span>
              </div>
              <MD text={employeeRes} />
            </div>
          )}
          {complaintRes && (
            <div className="card ranim">
              <div className="vstrip">
                <span style={{fontFamily:"Nunito",fontSize:9,fontWeight:900,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)"}}>COMPLAINT RECORDS</span>
                <span className="badge br">📋 BBB + AG + CFPB</span>
              </div>
              <MD text={complaintRes} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

const FI = [
  {id:"ew",name:"Extended Warranty",desc:"3rd-party coverage after factory"},{id:"gap",name:"GAP Insurance",desc:"Covers gap if totaled & underwater"},{id:"tw",name:"Tire & Wheel",desc:"Road hazard protection"},{id:"ppf",name:"Paint Protection Film",desc:"Physical chip/scratch film"},{id:"cc",name:"Ceramic Coating",desc:"Chemical paint protection"},{id:"ip",name:"Interior Protection",desc:"Scotchgard-type treatment"},{id:"cl",name:"Credit Life/Disability",desc:"Loan paid if you die/disabled"},{id:"kr",name:"Key Replacement",desc:"Lost/broken smart key"},{id:"ws",name:"Windshield Protection",desc:"Glass repair/replace"},{id:"rs",name:"Roadside Assistance",desc:"Often duplicated by insurance"},{id:"pm",name:"Prepaid Maintenance",desc:"Oil changes rolled in"},
];
function FIDecoder() {
  const [sel, setSel] = useState({}); const [prices, setP] = useState({}); const [veh, setV] = useState(""); const [loading, setL] = useState(false); const [res, setR] = useState(null);
  const toggle = id => setSel(s=>({...s,[id]:!s[id]}));
  const picked = FI.filter(p=>sel[p.id]);
  const run = async () => {
    setL(true); setR(null);
    const list = picked.map(p=>`- ${p.name}: $${prices[p.id]||"unknown"}`).join("\n");
    const t = await ai(`You are a former F&I manager. Vehicle: ${veh||"not specified"}\nProducts:\n${list}
For EACH product:
## [NAME] — [WORTH IT / OVERPRICED / SKIP IT / DEPENDS]
- Dealer cost vs. charge
- Fine print traps
- Where to buy cheaper
- Script to decline
## OVERALL F&I STRATEGY — Keep, cut, savings.
## OPENING LINE — First words walking into F&I.`);
    setR(t); setL(false);
  };
  return (
    <div>
      <div className="phd"><h2>F&I <span>Decoder</span></h2><p>Every product exposed — dealer cost, real value, exit script.</p></div>
      <div className="card"><div className="ch"><span className="clbl">Vehicle</span></div><div className="cb"><div className="fld"><label>Year / Make / Model</label><input placeholder="2024 Toyota Camry XSE" value={veh} onChange={e=>setV(e.target.value)} /></div></div></div>
      <div className="card">
        <div className="ch"><span className="clbl">Products Offered</span></div>
        <div className="cb">
          <div className="pg">{FI.map(p=>(
            <div key={p.id} className={`pc ${sel[p.id]?"sel":""}`} onClick={()=>toggle(p.id)}>
              <div className="pc-chk">{sel[p.id]?"✓":""}</div>
              <div className="pc-name">{p.name}</div>
              <div className="pc-desc">{p.desc}</div>
              {sel[p.id]&&<input className="pi" placeholder="$ quoted" value={prices[p.id]||""} onChange={e=>{e.stopPropagation();setP(pr=>({...pr,[p.id]:e.target.value}))}} onClick={e=>e.stopPropagation()} />}
            </div>
          ))}</div>
          <button className="go-btn" onClick={run} disabled={loading||!picked.length}>{loading?"Decoding...":`→ Decode ${picked.length} Product${picked.length!==1?"s":""}`}</button>
        </div>
      </div>
      {loading && <Loading msg="Pulling back the F&I curtain..." />}
      {res && !loading && <div className="card ranim"><div className="vstrip"><span className="badge ba">F&I DECODED</span><div style={{flex:1}}/><button className="ghost-btn" onClick={()=>setR(null)}>Reset</button></div><MD text={res}/></div>}
    </div>
  );
}

const AO = [
  {id:"tint",name:"Window Tint",legit:true,desc:"Legit — check quality & price"},{id:"ppf",name:"Paint Film (PPF)",legit:true,desc:"Legit if properly installed"},{id:"masks",name:"Door/Bumper Masks",legit:true,desc:"Reasonable protection"},{id:"nitro",name:"Nitrogen Tires",legit:false,desc:"Air is 78% nitrogen. Scam."},{id:"vin",name:"VIN Etching",legit:false,desc:"Antiquated, overpriced"},{id:"seal",name:"Paint Sealant",legit:false,desc:"$8 product for $400"},{id:"fabric",name:"Fabric/Leather Guard",legit:false,desc:"DIY for nothing"},{id:"loj",name:"LoJack / GPS",legit:false,desc:"Buy aftermarket for less"},{id:"dent",name:"Dent Protection",legit:false,desc:"Fine print kills it"},{id:"theft",name:"Theft Stickers",legit:false,desc:"Literally stickers."},{id:"mats",name:"All-Weather Mats",legit:null,desc:"Depends on brand/price"},{id:"kit",name:"Emergency Kit",legit:false,desc:"$400 for a $25 Amazon kit"},
];
function AddOnFighter() {
  const [sel, setSel] = useState({}); const [prices, setP] = useState({}); const [veh, setV] = useState(""); const [loading, setL] = useState(false); const [res, setR] = useState(null);
  const toggle = id => setSel(s=>({...s,[id]:!s[id]}));
  const picked = AO.filter(a=>sel[a.id]);
  const run = async () => {
    setL(true); setR(null);
    const list = picked.map(a=>`- ${a.name}: $${prices[a.id]||"unknown"}`).join("\n");
    const t = await ai(`You are a former car salesperson turned consumer advocate. Vehicle: ${veh||"not specified"}\nAdd-ons:\n${list}
For EACH:
## [ADD-ON] — [KEEP / NEGOTIATE / REMOVE]
- Dealer cost vs. charge
- Script they use to keep it
- Your counter-script to remove it
- If installed, what to say
## BATTLE PLAN — Remove steps. What if they say it can't be removed?
## TOTAL SAVINGS — Estimated by removing flagged items.`);
    setR(t); setL(false);
  };
  const lc = l => l===true?"var(--green)":l===false?"var(--red)":"var(--y)";
  const ll = l => l===true?"LEGIT":l===false?"SCAM":"DEPENDS";
  return (
    <div>
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
      {loading && <Loading msg="Loading your counter scripts..." />}
      {res && !loading && <div className="card ranim"><div className="vstrip"><span className="badge br">FIGHT BACK</span><div style={{flex:1}}/><button className="ghost-btn" onClick={()=>setR(null)}>Reset</button></div><MD text={res}/></div>}
    </div>
  );
}

const FAQS = [
  {q:"Do you hate car salespeople?",a:"Definitely not. Your salesperson is just that — a person. If you like their vibe and they listen to your needs, stick with them and let them earn your business. In most cases, the overcharges and the greed don't go to the salesperson. That money goes to the folks in the suits, not the ones working long hours and holidays to move metal."},
  {q:"Why no subscription or app?",a:"Simple — use us when you need us. CNTROFR is built for the moment you're ready to make a large auto purchase, not something that needs to live on your phone year-round. You're not always car shopping, and you shouldn't be. Pay once, get what you need, go enjoy your new ride."},
  {q:"How do you protect my personal information?",a:"We keep it minimal by design. While some information is necessary for payment processing, we'd rather not hold onto your personal data at all. CNTROFR exists to keep your money with you — not to collect, sell, or monetize your information in any way."},
  {q:"Does CNTROFR work for used cars too?",a:"Absolutely. Whether you're buying new off the lot or used from a dealer, the same tactics apply. Inflated prices, lowball trade-ins, junk add-ons, and mystery fees don't discriminate — and neither do our tools. One firm piece of advice though: we do not recommend 'Buy Here, Pay Here' lots under any circumstances. If a dealership doesn't have established relationships with outside banks and lenders, something is off. Reputable dealers work with real financial institutions. If they're financing everything in-house, that's a red flag worth walking away from before you ever get to the numbers."},
  {q:"Can you help me find a vehicle?",a:"That's not our lane. There are plenty of great marketplace tools out there for that part of the process. We're here once you've found the one you want and it's time to talk numbers."},
  {q:"What if the dealer won't budge?",a:"Having the right information is powerful, but the dealership still has to agree to terms. If they won't move, be confident and walk. They are not the only game in town, and a dealer that won't negotiate fairly on one line item is likely doing it everywhere else too."},
  {q:"Is this legit for both new and used car dealerships?",a:"Yes. Franchise dealers, independent lots, certified pre-owned programs — the F&I playbook and the fee games are industry-wide. CNTROFR is built on insider knowledge from both sides of that desk."},
  {q:"I have a question that isn't answered here. How do I reach you?",a:"Email us directly at info@cntrofr.com — we respond to every message personally. You can also use the contact form on this page and we'll get back to you within 24 hours."},
];

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="sec">
      <div className="sec-eye">Got Questions</div>
      <h2 className="sec-h2">Frequently Asked</h2>
      <p className="sec-sub">Everything you need to know before you buy.</p>
      <div className="faq-list">
        {FAQS.map((f,i)=>(
          <div key={i} className={`faq-item ${open===i?"open":""}`}>
            <div className="faq-q" onClick={()=>setOpen(open===i?null:i)}>
              <span>{f.q}</span>
              <span className="faq-icon">+</span>
            </div>
            {open===i && <div className="faq-a">{f.a}</div>}
          </div>
        ))}
      </div>
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
          <div className="ci-item"><div className="ci-icon">⏱️</div><div><div className="ci-label">Response Time</div><div className="ci-val">Within 24 hours</div></div></div>
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
                  <option>General Question</option><option>Deal Help</option><option>Tool Not Working</option><option>Refund Request</option><option>Feedback / Suggestion</option><option>Other</option>
                </select>
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

const PLANS = [
  {id:"single",name:"Single Report",price:19,desc:"One full deal analysis.",features:["Deal Analyzer — full breakdown","GO / NEGOTIATE / WALK verdict","Your counter offer strategy","No account. No login. Ever."],btn:"out",unlocks:["deal"]},
  {id:"pro",name:"Pro Bundle",price:49,hot:true,desc:"Every tool you need before and during the deal.",features:["All 5 tools unlocked","Fee Comparison with live data","Review Purity audit","F&I Decoder + removal scripts","Add-On Fighter with counter scripts","Valid 7 days, unlimited uses"],btn:"fill",unlocks:["deal","fee","review","fi","addons"]},
  {id:"guide",name:"Counter Guide",price:14,desc:"The no-BS buyer guide written from the dealer side.",features:["How dealer profit works","F&I office playbook exposed","Add-on removal scripts","Trade-in maximization","Printable cheat sheet"],btn:"out",unlocks:[]},
];

function PayModal({plan,onClose,onSuccess}) {
  const [card,setCard]=useState("");const [exp,setExp]=useState("");const [cvc,setCvc]=useState("");const [busy,setBusy]=useState(false);
  const fmt=v=>v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExp=v=>{const d=v.replace(/\D/g,"").slice(0,4);return d.length>2?d.slice(0,2)+"/"+d.slice(2):d;};
  const ready=card.replace(/\s/g,"").length===16&&exp.length===5&&cvc.length>=3;
  const pay=async()=>{setBusy(true);await new Promise(r=>setTimeout(r,1800));setBusy(false);onSuccess(plan);};
  return (
    <div className="mbg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="mbox">
        <div className="mtop"><h3>Complete Purchase</h3><button className="mx" onClick={onClose}>×</button></div>
        <div className="mbody">
          <div className="order-sum">
            <div className="orow"><span style={{fontFamily:"Nunito",fontSize:11,fontWeight:900,letterSpacing:1,textTransform:"uppercase",color:"var(--muted)"}}>Total Due</span><span className="oprice">${plan.price}</span></div>
            <div className="oname">CNTROFR — {plan.name}</div>
          </div>
          <div className="sbox">
            <div className="slbl">Card Number</div>
            <input className="sinput" placeholder="1234 5678 9012 3456" value={card} onChange={e=>setCard(fmt(e.target.value))} />
            <div className="srow">
              <div><div className="slbl">Expiry</div><input className="sinput" placeholder="MM/YY" value={exp} onChange={e=>setExp(fmtExp(e.target.value))} /></div>
              <div><div className="slbl">CVC</div><input className="sinput" placeholder="•••" value={cvc} onChange={e=>setCvc(e.target.value.replace(/\D/g,"").slice(0,4))} /></div>
            </div>
          </div>
          <button className="paybtn" onClick={pay} disabled={!ready||busy}>{busy?"Processing...":"Pay $"+plan.price+" — Get Instant Access"}</button>
          <div className="secnote"><span>🔒</span> Secured by Stripe · No account required · Instant access</div>
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
];

export default function App() {
  const [view,setView]=useState("home");
  const [tab,setTab]=useState("deal");
  const [modal,setModal]=useState(null);
  const [access,setAccess]=useState([]);
  const buy=plan=>setModal(plan);
  const onPaid=plan=>{setModal(null);setAccess(plan.unlocks);if(plan.unlocks.length){setView("tools");setTab(plan.unlocks[0]);}};
  const canUse=id=>TABS.find(t=>t.id===id)?.free||access.includes(id);
  const Active=TABS.find(t=>t.id===tab)?.component||DealAnalyzer;
  return (
    <>
      <style>{S}</style>
      <div className="hdr">
        <div className="hdr-logo" onClick={()=>setView("home")}>
          <div className="hdr-plate">CNTROFR</div>
          <div className="hdr-tagline">Don't Sign. Counter.</div>
        </div>
        <div className="hdr-right">
          {view==="tools"
            ?<button className="hbtn" onClick={()=>setView("home")}>← Home</button>
            :<>
              <button className="hbtn" onClick={()=>setView("contact")}>Contact</button>
              <button className="hbtn" onClick={()=>{setView("tools");setTab("deal")}}>Free Tool</button>
              <button className="hbtn-y" onClick={()=>buy(PLANS[1])}>Get Pro — $49</button>
            </>
          }
        </div>
      </div>

      {view==="home"&&<>
        <div className="hero">
          <div className="hero-road" />
          <div className="hero-center-plate">
            <div className="hero-plate">
              <div className="hp-state">Counter Offer</div>
              <div className="hp-text">CNTROFR</div>
              <div className="hp-url">CNTROFR.COM</div>
            </div>
          </div>
          <h1 className="hero-h1">The Dealer Has Done<br/>This <span className="y">10,000 Times.</span><br/>You Haven't.</h1>
          <div className="hero-tagline">Don't Sign. Counter.</div>
          <p className="hero-sub">CNTROFR gives every car buyer the insider knowledge dealers count on you not having. No account. No login. Just answers.</p>
          <div className="hero-btns">
            <button className="btn-lg" onClick={()=>buy(PLANS[1])}>Get Pro Access — $49</button>
            <button className="btn-lg-ghost" onClick={()=>{setView("tools");setTab("deal")}}>Try Free Deal Analyzer</button>
          </div>
          <div className="stats">
            <div className="stat"><div className="stat-n">$2,800</div><div className="stat-l">Avg dealer markup exposed</div></div>
            <div className="stat"><div className="stat-n">5 tools</div><div className="stat-l">One price, full arsenal</div></div>
            <div className="stat"><div className="stat-n">$0</div><div className="stat-l">Dealer kickbacks. Ever.</div></div>
          </div>
        </div>
        <div className="alert"><p>⚠️ The FTC rule protecting buyers from hidden dealer fees was <strong>sued and killed by the dealer lobby in 2025.</strong> Dealers can now legally hide fees. You need CNTROFR more than ever.</p></div>
        <div className="sec">
          <div className="sec-eye">How It Works</div>
          <h2 className="sec-h2">Three Steps to Your Counter</h2>
          <p className="sec-sub">No account. No waiting. Enter your deal and get your counteroffer.</p>
          <div className="steps">
            <div className="step"><div className="step-num">01</div><div className="step-title">Enter Your Deal Numbers</div><div className="step-desc">Price, trade-in, fees, and add-ons. Takes 2 minutes.</div></div>
            <div className="step"><div className="step-num">02</div><div className="step-title">AI Analyzes From the Inside</div><div className="step-desc">Built on real dealer knowledge — the stuff they count on you not knowing.</div></div>
            <div className="step"><div className="step-num">03</div><div className="step-title">Get Your Counter</div><div className="step-desc">Walk back in with a verdict, specific numbers, and word-for-word scripts.</div></div>
          </div>
        </div>
        <div className="sec" style={{paddingTop:0}}>
          <div className="sec-eye">The Arsenal</div>
          <h2 className="sec-h2">Five Tools. One Price.</h2>
          <p className="sec-sub">Everything you need from the moment you see a car to the second before you sign.</p>
          <div className="tgrid">
            {[{icon:"🔍",name:"Deal Analyzer",desc:"Full breakdown of price, trade-in, and add-ons with a GO / NEGOTIATE / WALK verdict.",free:true},{icon:"💰",name:"Fee Comparison",desc:"Is that doc fee fair for your state? We find out with live data.",free:false},{icon:"⭐",name:"Review Purity",desc:"Real complaints vs. sour grapes — bot farms exposed.",free:false},{icon:"🔓",name:"F&I Decoder",desc:"Every finance office product decoded — dealer cost, real value, exit script.",free:false},{icon:"⚔️",name:"Add-On Fighter",desc:"We know the scripts dealers use. Here are yours to fight back.",free:false}].map((t,i)=>(
              <div key={i} className="tc">
                <div className="tc-icon">{t.icon}</div>
                <div className="tc-name">{t.name}</div>
                <div className="tc-desc">{t.desc}</div>
                {t.free?<span className="tag-free">Free</span>:<span className="tag-pro">Pro</span>}
              </div>
            ))}
          </div>
        </div>
        <div className="sec" style={{paddingTop:0}}>
          <div className="sec-eye">The Comparison</div>
          <h2 className="sec-h2" style={{marginBottom:6}}>Why CNTROFR?</h2>
          <p className="sec-sub" style={{marginBottom:24}}>No one else does all of this for $49 with no account required.</p>
          <div className="vs-wrap">
            <table className="vs-table">
              <thead><tr><th>Feature</th><th className="us">CNTROFR ●</th><th>Human Concierge</th><th>CarEdge</th><th>TrueCar</th></tr></thead>
              <tbody>
                {[["No login required","✓","✗","✗","✗"],["Pay once, no subscription","✓","✗","✗","✓ (dealer-funded)"],["Instant results","✓","✗ hours/days","Partial","✗"],["Zero dealer kickbacks","✓","✓","Partial","✗"],["Bot review detection","✓","✗","✗","✗"],["Add-on removal scripts","✓","✗","✗","✗"],["F&I product decoder","✓","✗","✗","✗"],["State fee comparison","✓","✗","✗","✗"],["Price","$19–$49","$299–$499","$99–199/yr","Free"]].map(([feat,...vals],i)=>(
                  <tr key={i} className={i===0?"hi":""}><td className="feat">{feat}</td>{vals.map((v,j)=><td key={j}>{v==="✓"?<span className="ck">✓</span>:v==="✗"?<span className="cx">—</span>:v}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="sec" style={{paddingTop:0}}>
          <div className="sec-eye">Pricing</div>
          <h2 className="sec-h2">Simple. Transparent. Yours.</h2>
          <p className="sec-sub">Pay once. No account. No subscription. Instant access.</p>
          <div className="pgrid">
            {PLANS.map(p=>(
              <div key={p.id} className={`pcard ${p.hot?"hot":""}`}>
                {p.hot&&<div className="hot-lbl">Most Popular</div>}
                <div className="pname">{p.name}</div>
                <div className="pprice"><sup>$</sup>{p.price}<sub> one-time</sub></div>
                <div className="pdesc">{p.desc}</div>
                <ul className="pfeats">{p.features.map((f,i)=><li key={i}>{f}</li>)}</ul>
                <button className={`pbtn ${p.btn}`} onClick={()=>buy(p)}>Get {p.name}</button>
              </div>
            ))}
          </div>
        </div>
        <FAQ />
        <Contact />
        <div className="footer">
          <div className="footer-plate"><div className="fp">CNTROFR</div></div>
          <div className="footer-slogan">Don't Sign. Counter.</div>
          <p>CNTROFR is an independent consumer protection tool. We take zero money from dealers, lenders, or manufacturers — ever. AI analysis is for informational purposes only and does not constitute financial, legal, or professional advice.</p>
          <div className="footer-links">
            <a href="mailto:info@cntrofr.com">info@cntrofr.com</a>
            <a href="#" onClick={e=>{e.preventDefault();setView("contact")}}>Contact</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
          </div>
        </div>
      </>}

      {view==="contact"&&<>
        <Contact />
        <div className="footer">
          <div className="footer-plate"><div className="fp">CNTROFR</div></div>
          <div className="footer-slogan">Don't Sign. Counter.</div>
          <p>© 2025 CNTROFR · <a href="mailto:info@cntrofr.com">info@cntrofr.com</a></p>
        </div>
      </>}

      {view==="tools"&&(
        <div className="tarea">
          {access.length>0&&<div className="access-ok">✓ &nbsp;Pro Access Active — All 5 tools unlocked</div>}
          <div className="tnav">
            {TABS.map(t=>(
              <button key={t.id} className={`ttab ${tab===t.id?"on":""} ${!canUse(t.id)?"lk":""}`} onClick={()=>{if(!canUse(t.id))buy(PLANS[1]);else setTab(t.id);}}>
                {t.label}
                {!t.free&&!canUse(t.id)&&<span>🔒</span>}
                {!t.free&&canUse(t.id)&&<span style={{fontSize:6,color:tab===t.id?"#111":"var(--y)"}}>◆</span>}
              </button>
            ))}
          </div>
          {canUse(tab)?<Active />:<div className="upbox"><h3>Pro Feature</h3><p>Unlock {TABS.find(t=>t.id===tab)?.label} and all 4 other tools with Pro access.</p><button className="hbtn-y" style={{padding:"12px 32px",fontSize:13}} onClick={()=>buy(PLANS[1])}>Unlock Pro — $49</button></div>}
        </div>
      )}

      {modal&&<PayModal plan={modal} onClose={()=>setModal(null)} onSuccess={onPaid} />}
    </>
  );
}
