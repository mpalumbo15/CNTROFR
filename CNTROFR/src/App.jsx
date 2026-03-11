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

  /* ── LICENSE PLATE COMPONENT ── */
  .plate {
    display: inline-flex; flex-direction: column; align-items: center;
    background: var(--y); border: 4px solid #B8A000;
    border-radius: 8px; padding: 6px 16px 8px;
    box-shadow: 0 4px 0 #8A7800, 0 6px 20px rgba(255,214,0,.3);
    position: relative;
  }
  .plate::before, .plate::after {
    content: '●'; position: absolute; top: 50%; transform: translateY(-50%);
    font-size: 8px; color: #B8A000;
  }
  .plate::before { left: 6px; }
  .plate::after { right: 6px; }
  .plate-state { font-size: 7px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; color: #8A7800; margin-bottom: 1px; }
  .plate-text { font-family: 'Bebas Neue'; font-size: 28px; letter-spacing: 6px; color: #111; line-height: 1; }
  .plate-url { font-size: 7px; font-weight: 900; color: #8A7800; letter-spacing: 1px; margin-top: 1px; }

  /* ── HEADER ── */
  .hdr {
    position: sticky; top: 0; z-index: 200;
    background: rgba(14,14,20,.96); backdrop-filter: blur(12px);
    border-bottom: 2px solid var(--b1);
    padding: 0 28px; display: flex; align-items: center; height: 62px; gap: 16px;
  }
  .hdr-logo { display: flex; align-items: center; gap: 12px; cursor: pointer; }
  .hdr-plate {
    background: var(--y); border: 2px solid #B8A000;
    border-radius: 5px; padding: 3px 10px;
    box-shadow: 0 2px 0 #8A7800, 0 3px 10px rgba(255,214,0,.25);
    font-family: 'Bebas Neue'; font-size: 18px; letter-spacing: 4px; color: #111;
    position: relative;
  }
  .hdr-plate::before, .hdr-plate::after {
    content: '●'; position: absolute; top: 50%; transform: translateY(-50%);
    font-size: 6px; color: #B8A000;
  }
  .hdr-plate::before { left: 3px; }
  .hdr-plate::after { right: 3px; }
  .hdr-tagline { font-size: 9px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); }
  .hdr-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
  .hbtn { background: none; border: 2px solid var(--b2); color: var(--text2); padding: 7px 18px; font-family: Nunito; font-size: 12px; font-weight: 800; cursor: pointer; border-radius: 8px; transition: all .2s; }
  .hbtn:hover { border-color: var(--y); color: var(--y); }
  .hbtn-y { background: var(--y); color: #111; border: none; padding: 8px 22px; font-family: Nunito; font-size: 12px; font-weight: 900; cursor: pointer; border-radius: 8px; transition: background .2s; box-shadow: 0 2px 12px rgba(255,214,0,.3); }
  .hbtn-y:hover { background: var(--yd); }

  /* ── HERO ── */
  .hero { max-width: 900px; margin: 0 auto; padding: 80px 24px 60px; text-align: center; position: relative; }
  .hero-road {
    position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
    background: repeating-linear-gradient(90deg, var(--y) 0px, var(--y) 40px, transparent 40px, transparent 80px);
    opacity: .3;
  }
  .hero-center-plate {
    display: flex; justify-content: center; margin-bottom: 32px;
  }
  .hero-plate {
    background: var(--y); border: 6px solid #B8A000;
    border-radius: 12px; padding: 10px 32px 12px;
    box-shadow: 0 6px 0 #8A7800, 0 10px 40px rgba(255,214,0,.35);
    position: relative; display: inline-flex; flex-direction: column; align-items: center;
  }
  .hero-plate::before, .hero-plate::after {
    content: '◉'; position: absolute; top: 50%; transform: translateY(-50%);
    font-size: 10px; color: rgba(0,0,0,.3);
  }
  .hero-plate::before { left: 10px; }
  .hero-plate::after { right: 10px; }
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

  /* ── ALERT ── */
  .alert { background: rgba(255,68,68,.07); border-top: 1px solid rgba(255,68,68,.2); border-bottom: 1px solid rgba(255,68,68,.2); padding: 12px 24px; text-align: center; }
  .alert p { font-size: 12px; color: #FF8888; font-weight: 700; }
  .alert p strong { color: var(--red); }

  /* ── HOW IT WORKS ── */
  .how { max-width: 900px; margin: 0 auto; padding: 64px 24px; }
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

  /* ── TOOLS PREVIEW ── */
  .tools-prev { max-width: 900px; margin: 0 auto; padding: 0 24px 64px; }
  .tgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px,1fr)); gap: 12px; }
  .tc { background: var(--bg2); border: 2px solid var(--b1); border-radius: 14px; padding: 20px 18px; transition: all .2s; }
  .tc:hover { border-color: var(--y); transform: translateY(-2px); }
  .tc-icon { font-size: 26px; margin-bottom: 8px; }
  .tc-name { font-family: 'Bebas Neue'; font-size: 18px; letter-spacing: 1px; color: var(--text); margin-bottom: 4px; }
  .tc-desc { font-size: 11px; color: var(--text2); line-height: 1.55; font-weight: 600; }
  .tag-free { display: inline-block; margin-top: 8px; background: rgba(0,201,107,.1); border: 1px solid rgba(0,201,107,.25); color: var(--green); font-size: 9px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; padding: 2px 10px; border-radius: 100px; }
  .tag-pro { display: inline-block; margin-top: 8px; background: var(--yp); border: 1px solid rgba(255,214,0,.25); color: var(--y); font-size: 9px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; padding: 2px 10px; border-radius: 100px; }

  /* ── VS TABLE ── */
  .vs { max-width: 900px; margin: 0 auto; padding: 0 24px 60px; }
  .vs-wrap { background: var(--bg2); border: 2px solid var(--b1); border-radius: 16px; overflow: hidden; }
  .vs-table { width: 100%; border-collapse: collapse; }
  .vs-table th { font-size: 10px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; padding: 14px 16px; text-align: left; border-bottom: 1px solid var(--b1); color: var(--muted); background: var(--bg3); }
  .vs-table th.us { color: var(--y); }
  .vs-table td { font-size: 12px; color: var(--text2); padding: 11px 16px; border-bottom: 1px solid var(--b1); font-weight: 600; }
  .vs-table td.feat { font-weight: 900; color: var(--text); }
  .vs-table tr:last-child td { border-bottom: none; }
  .vs-table .hi td { background: rgba(255,214,0,.04); }
  .ck { color: var(--green); } .cx { color: var(--b2); }

  /* ── PRICING ── */
  .pricing { max-width: 900px; margin: 0 auto; padding: 0 24px 72px; }
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

  /* ── MODAL ── */
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

  /* ── TOOL AREA ── */
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

  /* ── FORMS ── */
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

  /* ── RESULTS ── */
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

  /* ── PRODUCT PICKER ── */
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

  /* ── PAGE HEADER ── */
  .phd { margin-bottom: 22px; }
  .phd h2 { font-family: 'Bebas Neue'; font-size: 30px; letter-spacing: 2px; }
  .phd h2 span { color: var(--y); }
  .phd p { font-size: 12px; color: var(--muted); margin-top: 3px; font-weight: 700; }

  /* ── FOOTER ── */
  .footer { border-top: 2px solid var(--b1); padding: 36px 24px; text-align: center; }
  .footer-plate { display: flex; justify-content: center; margin-bottom: 12px; }
  .fp { background: var(--y); border: 3px solid #B8A000; border-radius: 6px; padding: 5px 18px; box-shadow: 0 3px 0 #8A7800; font-family: 'Bebas Neue'; font-size: 20px; letter-spacing: 5px; color: #111; }
  .footer-slogan { font-family: 'Bebas Neue'; font-size: 13px; letter-spacing: 4px; color: var(--muted); margin-bottom: 14px; }
  .footer p { font-size: 11px; color: var(--muted); line-height: 1.8; max-width: 560px; margin: 0 auto; font-weight: 600; }
  .footer a { color: var(--text2); text-decoration: none; }
  .footer a:hover { color: var(--y); }
`;

// ── AI ──────────────────────────────────────────────────────────────────
async function ai(prompt, web = false) {
  const body = { model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] };
  if (web) body.tools = [{ type: "web_search_20250305", name: "web_search" }];
  const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const d = await r.json();
  return d.content?.map(b => b.text || "").filter(Boolean).join("") || "";
}

// ── MARKDOWN ────────────────────────────────────────────────────────────
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
        <span style={{ fontFamily:"Nunito", fontSize:9, fontWeight:900, letterSpacing:2, textTransform:"uppercase", color:"var(--muted)" }}>VERDICT</span>
        <span className={`badge ${vc}`}>{verdict}</span>
        <div style={{ flex:1 }} />
        <button className="ghost-btn" onClick={onReset}>New</button>
      </div>
      <MD text={text} />
    </div>
  );
}

function Loading({ msg }) {
  return <div className="card"><div className="loadbox"><div className="spin" /><p>{msg}</p></div></div>;
}

// ══ DEAL ANALYZER ══════════════════════════════════════════════════════════
function DealAnalyzer() {
  const [f, setF] = useState({ year:"", vehicle:"", msrp:"", offer:"", monthly:"", rate:"", term:"60", down:"", tradeIn:"", tradeOwed:"", addons:"", notes:"" });
  const [loading, setL] = useState(false); const [res, setR] = useState(null); const [v, setV] = useState("");
  const s = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const run = async () => {
    setL(true); setR(null);
    const t = await ai(`You are a veteran automotive insider — a trusted friend who's been on the other side of the desk. Analyze this deal straight.
${f.year} ${f.vehicle} | MSRP $${f.msrp} | Offer $${f.offer} | Monthly $${f.monthly}
Rate ${f.rate}% | ${f.term}mo | Down $${f.down} | Trade $${f.tradeIn} | Owed $${f.tradeOwed}
Add-ons: ${f.addons||"none"} | Notes: ${f.notes||"none"}

## OVERALL VERDICT — GO, NEGOTIATE, or WALK AWAY. One sentence why.
## VEHICLE PRICE — Fair? Room left?
## FINANCING — Rate vs market. Payment packing?
## TRADE-IN — Fair or lowballed?
## ADD-ONS — Worth It / Overpriced / Pure Profit for each.
## YOUR COUNTER — 3-4 exact things to say before signing.
## RED FLAGS — Dealer tactics at play here.`);
    const m = t.match(/VERDICT[^:]*:\s*(GO|NEGOTIATE|WALK\s*AWAY)/i);
    setV(m ? m[1].trim().toUpperCase() : "COMPLETE"); setR(t); setL(false);
  };
  const vc = v => /^GO/.test(v) ? "bg" : /WALK/.test(v) ? "br" : /NEG/.test(v) ? "ba" : "bx";
  return (
    <div>
      <div className="phd"><h2>Deal <span>Analyzer</span></h2><p>Enter your numbers. Get your counter before you sign.</p></div>
      <div className="card">
        <div className="ch"><span className="clbl">The Deal</span></div>
        <div className="cb">
          <div className="g2"><div className="fld"><label>Year</label><input placeholder="2024" value={f.year} onChange={s("year")} /></div><div className="fld"><label>Make & Model</label><input placeholder="Honda Accord EX-L" value={f.vehicle} onChange={s("vehicle")} /></div></div>
          <div className="sp" />
          <div className="g3"><div className="fld"><label>MSRP</label><input placeholder="32,000" value={f.msrp} onChange={s("msrp")} /></div><div className="fld"><label>Their Offer</label><input placeholder="29,500" value={f.offer} onChange={s("offer")} /></div><div className="fld"><label>Monthly</label><input placeholder="487" value={f.monthly} onChange={s("monthly")} /></div></div>
          <div className="sp" />
          <div className="g3"><div className="fld"><label>Rate %</label><input placeholder="6.9" value={f.rate} onChange={s("rate")} /></div><div className="fld"><label>Term</label><select value={f.term} onChange={s("term")}>{["36","48","60","72","84"].map(t=><option key={t}>{t} months</option>)}</select></div><div className="fld"><label>Down</label><input placeholder="2,000" value={f.down} onChange={s("down")} /></div></div>
          <div className="sp" />
          <div className="g2"><div className="fld"><label>Trade Offered</label><input placeholder="8,500" value={f.tradeIn} onChange={s("tradeIn")} /></div><div className="fld"><label>Owed on Trade</label><input placeholder="4,200" value={f.tradeOwed} onChange={s("tradeOwed")} /></div></div>
          <div className="sp" />
          <div className="fld" style={{marginBottom:10}}><label>Add-Ons</label><input placeholder="Extended warranty $2,100 · GAP $895 · Paint protection $499" value={f.addons} onChange={s("addons")} /></div>
          <div className="fld"><label>Notes</label><textarea placeholder="Been on lot 60 days, dealer says best price..." value={f.notes} onChange={s("notes")} /></div>
          <button className="go-btn" onClick={run} disabled={loading||(!f.vehicle&&!f.offer)}>{loading ? "Analyzing..." : "→ Get My Counter"}</button>
        </div>
      </div>
      {loading && <Loading msg="Building your counteroffer..." />}
      {res && !loading && <Res verdict={v} vc={vc(v)} text={res} onReset={()=>setR(null)} />}
    </div>
  );
}

// ══ FEE COMPARISON ═════════════════════════════════════════════════════════
function FeeComparison() {
  const [f, setF] = useState({ dealer:"", city:"", state:"", fee:"", brand:"" });
  const [loading, setL] = useState(false); const [res, setR] = useState(null);
  const s = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const run = async () => {
    setL(true); setR(null);
    const t = await ai(`You are an automotive consumer advocate and former dealer finance manager.
Dealer: ${f.dealer} | ${f.city}, ${f.state} | Franchise: ${f.brand} | Doc Fee: $${f.fee}

## FEE VERDICT — FAIR, HIGH, or EXCESSIVE?
## STATE CONTEXT — ${f.state} laws/caps, typical ${f.brand} range.
## WHAT IT COVERS — Legitimate components only.
## WHAT IT DOESN'T JUSTIFY — Dealer padding.
## PERKS CHECK — What should come with a fee this size? Ask for it.
## YOUR COUNTER — Exact words to push back.
## LEVERAGE — How to use competing quotes.`, true);
    setR(t); setL(false);
  };
  return (
    <div>
      <div className="phd"><h2>Fee <span>Comparison</span></h2><p>Is that doc fee legit — or just greed with paperwork on top?</p></div>
      <div className="card">
        <div className="ch"><span className="clbl">Dealer & Fee Details</span></div>
        <div className="cb">
          <div className="g2"><div className="fld"><label>Dealer Name</label><input placeholder="AutoNation Honda" value={f.dealer} onChange={s("dealer")} /></div><div className="fld"><label>Franchise</label><input placeholder="Honda, Toyota, Ford..." value={f.brand} onChange={s("brand")} /></div></div>
          <div className="sp" />
          <div className="g3"><div className="fld"><label>City</label><input placeholder="Dallas" value={f.city} onChange={s("city")} /></div><div className="fld"><label>State</label><input placeholder="TX" value={f.state} onChange={s("state")} /></div><div className="fld"><label>Doc Fee</label><input placeholder="799" value={f.fee} onChange={s("fee")} /></div></div>
          <button className="go-btn" onClick={run} disabled={loading||!f.state||!f.fee}>{loading ? "Researching..." : "→ Analyze This Fee"}</button>
        </div>
      </div>
      {loading && <Loading msg="Researching fee standards for your state..." />}
      {res && !loading && <div className="card ranim"><div className="vstrip"><span className="badge ba">FEE ANALYSIS</span><div style={{flex:1}}/><button className="ghost-btn" onClick={()=>setR(null)}>Reset</button></div><MD text={res}/></div>}
    </div>
  );
}

// ══ REVIEW PURITY ══════════════════════════════════════════════════════════
function ReviewPurity() {
  const [f, setF] = useState({ dealer:"", city:"", state:"", reviews:"" });
  const [loading, setL] = useState(false); const [res, setR] = useState(null); const [v, setV] = useState("");
  const s = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const run = async () => {
    setL(true); setR(null);
    const t = await ai(`You are a reputation integrity analyst specializing in dealer review manipulation.
Dealer: ${f.dealer}, ${f.city} ${f.state}
${f.reviews ? "Reviews:\n"+f.reviews : "No reviews — give audit guidance."}

## AUTHENTICITY VERDICT — LIKELY AUTHENTIC, SUSPICIOUS, or HIGH BOT RISK
## BOT FARMING SIGNALS — Specific patterns.
## SOUR GRAPES FILTER — Real complaints vs. bad-faith noise.
## RED FLAGS TO TAKE SERIOUSLY — Recurring legitimate issues.
## HOW TO VERIFY — Audit steps across Google, DealerRater, Cars.com.
## ASK THE DEALER — 2-3 pointed questions based on patterns.
## TRUST SCORE — HIGH / MODERATE / LOW with reasoning.`, true);
    const m = t.match(/VERDICT[^:—\n]*(LIKELY AUTHENTIC|SUSPICIOUS|HIGH BOT RISK)/i);
    setV(m ? m[1].trim().toUpperCase() : "ANALYZED"); setR(t); setL(false);
  };
  const vc = v => /AUTHENTIC/.test(v) ? "bg" : /HIGH BOT/.test(v) ? "br" : /SUSPICIOUS/.test(v) ? "ba" : "bb";
  return (
    <div>
      <div className="phd"><h2>Review <span>Purity</span></h2><p>Real complaints vs. sour grapes — and bot farms exposed.</p></div>
      <div className="card">
        <div className="ch"><span className="clbl">Dealer to Audit</span></div>
        <div className="cb">
          <div className="g3"><div className="fld"><label>Dealer Name</label><input placeholder="Hendrick Toyota" value={f.dealer} onChange={s("dealer")} /></div><div className="fld"><label>City</label><input placeholder="Charlotte" value={f.city} onChange={s("city")} /></div><div className="fld"><label>State</label><input placeholder="NC" value={f.state} onChange={s("state")} /></div></div>
          <div className="sp" />
          <div className="fld"><label>Paste Reviews (optional — better with them)</label><textarea style={{minHeight:110}} placeholder={"5★ — Amazing experience, loved Carlos!\n1★ — Snuck $2k in fees at signing without telling me..."} value={f.reviews} onChange={s("reviews")} /></div>
          <button className="go-btn" onClick={run} disabled={loading||!f.dealer}>{loading ? "Auditing..." : "→ Run Purity Check"}</button>
        </div>
      </div>
      {loading && <Loading msg="Auditing review authenticity..." />}
      {res && !loading && <Res verdict={v} vc={vc(v)} text={res} onReset={()=>setR(null)} />}
    </div>
  );
}

// ══ F&I DECODER ════════════════════════════════════════════════════════════
const FI = [
  {id:"ew",name:"Extended Warranty",desc:"3rd-party coverage after factory"},{id:"gap",name:"GAP Insurance",desc:"Covers gap if totaled & underwater"},{id:"tw",name:"Tire & Wheel",desc:"Road hazard protection"},{id:"ppf",name:"Paint Protection Film",desc:"Physical chip/scratch film"},{id:"cc",name:"Ceramic Coating",desc:"Chemical paint protection"},{id:"ip",name:"Interior Protection",desc:"Scotchgard-type treatment"},{id:"cl",name:"Credit Life/Disability",desc:"Loan paid if you die/disabled"},{id:"kr",name:"Key Replacement",desc:"Lost/broken smart key"},{id:"ws",name:"Windshield Protection",desc:"Glass repair/replace"},{id:"rs",name:"Roadside Assistance",desc:"Often duplicated by insurance"},{id:"pm",name:"Prepaid Maintenance",desc:"Oil changes rolled into loan"},
];
function FIDecoder() {
  const [sel, setSel] = useState({}); const [prices, setP] = useState({}); const [veh, setV] = useState(""); const [loading, setL] = useState(false); const [res, setR] = useState(null);
  const toggle = id => setSel(s => ({ ...s, [id]: !s[id] }));
  const picked = FI.filter(p => sel[p.id]);
  const run = async () => {
    setL(true); setR(null);
    const list = picked.map(p=>`- ${p.name}: $${prices[p.id]||"unknown"}`).join("\n");
    const t = await ai(`You are a former F&I manager with 15 years in automotive. You know exactly what every product costs the dealer and what it's actually worth.
Vehicle: ${veh||"not specified"}
Products offered:\n${list}

For EACH product:
## [NAME] — [WORTH IT / OVERPRICED / SKIP IT / DEPENDS]
- Dealer cost vs. what they charge you
- What legit coverage looks like vs. fine print traps
- Where to buy it cheaper if applicable
- Exact script to decline or negotiate down

## OVERALL F&I STRATEGY — Keep, cut, and estimated savings.
## OPENING LINE — Your first sentence walking into the F&I office.`);
    setR(t); setL(false);
  };
  return (
    <div>
      <div className="phd"><h2>F&I <span>Decoder</span></h2><p>Every product exposed — dealer cost, real value, and your exit script.</p></div>
      <div className="card"><div className="ch"><span className="clbl">Vehicle</span></div><div className="cb"><div className="fld"><label>Year / Make / Model</label><input placeholder="2024 Toyota Camry XSE" value={veh} onChange={e=>setV(e.target.value)} /></div></div></div>
      <div className="card">
        <div className="ch"><span className="clbl">Products Being Offered — Select All That Apply</span></div>
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

// ══ ADD-ON FIGHTER ═════════════════════════════════════════════════════════
const AO = [
  {id:"tint",name:"Window Tint",legit:true,desc:"Legitimate — check quality & price"},{id:"ppf",name:"Paint Film (PPF)",legit:true,desc:"Legit if properly installed"},{id:"masks",name:"Door/Bumper Masks",legit:true,desc:"Reasonable protection"},{id:"nitro",name:"Nitrogen Tires",legit:false,desc:"Air is 78% nitrogen. Total scam."},{id:"vin",name:"VIN Etching",legit:false,desc:"Antiquated, overpriced, avoid"},{id:"seal",name:"Paint Sealant",legit:false,desc:"$8 Scotchgard sold for $400"},{id:"fabric",name:"Fabric/Leather Guard",legit:false,desc:"Same — you can DIY for nothing"},{id:"loj",name:"LoJack / GPS",legit:false,desc:"Buy aftermarket for a fraction"},{id:"dent",name:"Dent Protection",legit:false,desc:"Fine print makes it near useless"},{id:"theft",name:"Theft Stickers",legit:false,desc:"Literally stickers. Massive markup."},{id:"mats",name:"All-Weather Mats",legit:null,desc:"Depends on brand and price"},{id:"kit",name:"Emergency Kit",legit:false,desc:"$400 for a $25 Amazon kit"},
];
function AddOnFighter() {
  const [sel, setSel] = useState({}); const [prices, setP] = useState({}); const [veh, setV] = useState(""); const [loading, setL] = useState(false); const [res, setR] = useState(null);
  const toggle = id => setSel(s => ({ ...s, [id]: !s[id] }));
  const picked = AO.filter(a => sel[a.id]);
  const run = async () => {
    setL(true); setR(null);
    const list = picked.map(a=>`- ${a.name}: $${prices[a.id]||"unknown"}`).join("\n");
    const t = await ai(`You are a former car salesperson turned consumer fighter. You know every add-on sales script and exactly how to beat each one.
Vehicle: ${veh||"not specified"}
Add-ons on the deal:\n${list}

For EACH add-on:
## [ADD-ON] — [KEEP / NEGOTIATE / REMOVE]
- Real dealer cost vs. what they charge
- The exact script the salesperson uses to keep it
- Your exact counter-script to get it removed
- If it's already on the car physically, what to say

## BATTLE PLAN — Step-by-step to remove unwanted add-ons. What if they say it "can't" be removed?
## TOTAL SAVINGS — Estimated savings by removing flagged items.`);
    setR(t); setL(false);
  };
  const lc = l => l===true ? "var(--green)" : l===false ? "var(--red)" : "var(--y)";
  const ll = l => l===true ? "LEGIT" : l===false ? "SCAM" : "DEPENDS";
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
          <button className="go-btn" onClick={run} disabled={loading||!picked.length}>{loading?"Loading your scripts...":`→ Fight ${picked.length} Add-On${picked.length!==1?"s":""}`}</button>
        </div>
      </div>
      {loading && <Loading msg="Arming you up..." />}
      {res && !loading && <div className="card ranim"><div className="vstrip"><span className="badge br">FIGHT BACK</span><div style={{flex:1}}/><button className="ghost-btn" onClick={()=>setR(null)}>Reset</button></div><MD text={res}/></div>}
    </div>
  );
}

// ══ PLANS & PAYMENT ════════════════════════════════════════════════════════
const PLANS = [
  { id:"single", name:"Single Report", price:19, desc:"One full deal analysis. Perfect for your next purchase.", features:["Deal Analyzer — full breakdown","GO / NEGOTIATE / WALK verdict","Your counter offer strategy","No account. No login. Ever."], btn:"out", unlocks:["deal"] },
  { id:"pro", name:"Pro Bundle", price:49, hot:true, desc:"Every tool you need before and during the deal.", features:["All 5 tools unlocked","Fee Comparison with live data","Review Purity audit","F&I Decoder + removal scripts","Add-On Fighter with counter scripts","Valid 7 days, unlimited uses"], btn:"fill", unlocks:["deal","fee","review","fi","addons"] },
  { id:"guide", name:"Counter Guide", price:14, desc:"The no-BS buyer guide written from the dealer side.", features:["How dealer profit actually works","F&I office playbook exposed","Add-on removal scripts","Trade-in maximization","Printable cheat sheet for the lot"], btn:"out", unlocks:[] },
];

function PayModal({ plan, onClose, onSuccess }) {
  const [card, setCard] = useState(""); const [exp, setExp] = useState(""); const [cvc, setCvc] = useState(""); const [busy, setBusy] = useState(false);
  const fmt = v => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExp = v => { const d=v.replace(/\D/g,"").slice(0,4); return d.length>2?d.slice(0,2)+"/"+d.slice(2):d; };
  const ready = card.replace(/\s/g,"").length===16 && exp.length===5 && cvc.length>=3;
  const pay = async () => { setBusy(true); await new Promise(r=>setTimeout(r,1800)); setBusy(false); onSuccess(plan); };
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

// ══ TABS ═══════════════════════════════════════════════════════════════════
const TABS = [
  { id:"deal", label:"Deal Analyzer", free:true, component:DealAnalyzer },
  { id:"fee", label:"Fee Comparison", free:false, component:FeeComparison },
  { id:"review", label:"Review Purity", free:false, component:ReviewPurity },
  { id:"fi", label:"F&I Decoder", free:false, component:FIDecoder },
  { id:"addons", label:"Add-On Fighter", free:false, component:AddOnFighter },
];

// ══ ROOT ═══════════════════════════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState("home");
  const [tab, setTab] = useState("deal");
  const [modal, setModal] = useState(null);
  const [access, setAccess] = useState([]);
  const buy = plan => setModal(plan);
  const onPaid = plan => { setModal(null); setAccess(plan.unlocks); if(plan.unlocks.length){ setView("tools"); setTab(plan.unlocks[0]); } };
  const canUse = id => TABS.find(t=>t.id===id)?.free || access.includes(id);
  const Active = TABS.find(t=>t.id===tab)?.component || DealAnalyzer;

  return (
    <>
      <style>{S}</style>

      {/* HEADER */}
      <div className="hdr">
        <div className="hdr-logo" onClick={()=>setView("home")}>
          <div className="hdr-plate">CNTROFR</div>
          <div className="hdr-tagline">Don't Sign. Counter.</div>
        </div>
        <div className="hdr-right">
          {view==="tools"
            ? <button className="hbtn" onClick={()=>setView("home")}>← Home</button>
            : <>
                <button className="hbtn" onClick={()=>{setView("tools");setTab("deal")}}>Free Tool</button>
                <button className="hbtn-y" onClick={()=>buy(PLANS[1])}>Get Pro — $49</button>
              </>
          }
        </div>
      </div>

      {view==="home" && <>
        {/* HERO */}
        <div className="hero">
          <div className="hero-road" />
          <div className="hero-center-plate">
            <div className="hero-plate">
              <div className="hp-state">Counter Offer</div>
              <div className="hp-text">CNTROFR</div>
              <div className="hp-url">CNTROFR.COM</div>
            </div>
          </div>
          <h1 className="hero-h1">The Dealer Has Done<br />This <span className="y">10,000 Times.</span><br />You Haven't.</h1>
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

        {/* ALERT */}
        <div className="alert">
          <p>⚠️ The FTC rule protecting buyers from hidden dealer fees was <strong>sued and killed by the dealer lobby in 2025.</strong> Dealers can now legally hide fees. You need CNTROFR more than ever.</p>
        </div>

        {/* HOW IT WORKS */}
        <div className="how">
          <div className="sec-eye">How It Works</div>
          <h2 className="sec-h2">Three Steps to Your Counter</h2>
          <p className="sec-sub">No account. No waiting. Just enter your deal and get your counteroffer.</p>
          <div className="steps">
            <div className="step"><div className="step-num">01</div><div className="step-title">Enter Your Deal Numbers</div><div className="step-desc">Paste in price, financing, trade-in, and add-ons. Takes 2 minutes.</div></div>
            <div className="step"><div className="step-num">02</div><div className="step-title">AI Analyzes From the Inside</div><div className="step-desc">Our AI was trained on real dealer knowledge — the stuff they don't tell you.</div></div>
            <div className="step"><div className="step-num">03</div><div className="step-title">Get Your Counter</div><div className="step-desc">Walk back in with a verdict, specific numbers, and word-for-word scripts.</div></div>
          </div>
        </div>

        {/* TOOLS PREVIEW */}
        <div className="tools-prev">
          <div className="sec-eye">The Arsenal</div>
          <h2 className="sec-h2">Five Tools. One Price.</h2>
          <p className="sec-sub">Everything you need from the moment you see a car to the second before you sign.</p>
          <div className="tgrid">
            {[
              {icon:"🔍",name:"Deal Analyzer",desc:"Full breakdown of price, financing, trade-in, and add-ons with a GO / NEGOTIATE / WALK verdict.",free:true},
              {icon:"💰",name:"Fee Comparison",desc:"Is that doc fee fair for your state and franchise? We find out with live data.",free:false},
              {icon:"⭐",name:"Review Purity",desc:"Separates real complaints from sour grapes and exposes bot-farmed ratings.",free:false},
              {icon:"🔓",name:"F&I Decoder",desc:"Every finance office product decoded — dealer cost, real value, and your exit script.",free:false},
              {icon:"⚔️",name:"Add-On Fighter",desc:"We know the scripts dealers use to keep add-ons. Here are yours to remove them.",free:false},
            ].map((t,i)=>(
              <div key={i} className="tc">
                <div className="tc-icon">{t.icon}</div>
                <div className="tc-name">{t.name}</div>
                <div className="tc-desc">{t.desc}</div>
                {t.free ? <span className="tag-free">Free</span> : <span className="tag-pro">Pro</span>}
              </div>
            ))}
          </div>
        </div>

        {/* VS TABLE */}
        <div className="vs">
          <div className="sec-eye">The Comparison</div>
          <h2 className="sec-h2" style={{marginBottom:6}}>Why CNTROFR?</h2>
          <p className="sec-sub" style={{marginBottom:24}}>No other service does all of this — especially not for $49 with no account required.</p>
          <div className="vs-wrap">
            <table className="vs-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className="us">CNTROFR ●</th>
                  <th>Human Concierge</th>
                  <th>CarEdge</th>
                  <th>TrueCar</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["No login required","✓","✗","✗","✗"],
                  ["Pay once, no subscription","✓","✗","✗","✓ (free/dealer-funded)"],
                  ["Instant results (< 10 min)","✓","✗ hours/days","Partial","✗"],
                  ["Zero dealer kickbacks","✓","✓","Partial","✗"],
                  ["Bot review detection","✓","✗","✗","✗"],
                  ["Add-on removal scripts","✓","✗","✗","✗"],
                  ["F&I product decoder","✓","✗","✗","✗"],
                  ["State fee comparison","✓","✗","✗","✗"],
                  ["Price","$19–$49","$299–$499","$99–199/yr","Free"],
                ].map(([feat,...vals],i)=>(
                  <tr key={i} className={i===0?"hi":""}>
                    <td className="feat">{feat}</td>
                    {vals.map((v,j)=><td key={j}>{v==="✓"?<span className="ck">✓</span>:v==="✗"?<span className="cx">—</span>:v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PRICING */}
        <div className="pricing">
          <div className="sec-eye">Pricing</div>
          <h2 className="sec-h2">Simple. Transparent. Yours.</h2>
          <p className="sec-sub">Pay once. No account. No subscription. Instant access.</p>
          <div className="pgrid">
            {PLANS.map(p=>(
              <div key={p.id} className={`pcard ${p.hot?"hot":""}`}>
                {p.hot && <div className="hot-lbl">Most Popular</div>}
                <div className="pname">{p.name}</div>
                <div className="pprice"><sup>$</sup>{p.price}<sub> one-time</sub></div>
                <div className="pdesc">{p.desc}</div>
                <ul className="pfeats">{p.features.map((f,i)=><li key={i}>{f}</li>)}</ul>
                <button className={`pbtn ${p.btn}`} onClick={()=>buy(p)}>Get {p.name}</button>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="footer">
          <div className="footer-plate"><div className="fp">CNTROFR</div></div>
          <div className="footer-slogan">Don't Sign. Counter.</div>
          <p>CNTROFR is an independent consumer protection tool. We take zero money from dealers, lenders, or manufacturers — ever.<br />AI analysis is for informational purposes. Always verify before signing. · <a href="#">Privacy</a> · <a href="#">Terms</a></p>
        </div>
      </>}

      {view==="tools" && (
        <div className="tarea">
          {access.length>0 && <div className="access-ok">✓ &nbsp;Pro Access Active — All 5 tools unlocked</div>}
          <div className="tnav">
            {TABS.map(t=>(
              <button key={t.id}
                className={`ttab ${tab===t.id?"on":""} ${!canUse(t.id)?"lk":""}`}
                onClick={()=>{ if(!canUse(t.id)) buy(PLANS[1]); else setTab(t.id); }}>
                {t.label}
                {!t.free && !canUse(t.id) && <span>🔒</span>}
                {!t.free && canUse(t.id) && <span style={{fontSize:6,color:tab===t.id?"#111":"var(--y)"}}>◆</span>}
              </button>
            ))}
          </div>
          {canUse(tab)
            ? <Active />
            : <div className="upbox">
                <h3>Pro Feature</h3>
                <p>Unlock {TABS.find(t=>t.id===tab)?.label} and all 4 other premium tools with Pro access.</p>
                <button className="hbtn-y" style={{padding:"12px 32px",fontSize:13}} onClick={()=>buy(PLANS[1])}>Unlock Pro — $49</button>
              </div>
          }
        </div>
      )}

      {modal && <PayModal plan={modal} onClose={()=>setModal(null)} onSuccess={onPaid} />}
    </>
  );
}
