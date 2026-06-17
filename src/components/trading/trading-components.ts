@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap");

html,
body,
#root {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
  background: #080d18;
  font-family: Roboto, sans-serif;
}

* {
  box-sizing: border-box;
}

button,
select,
input {
  font-family: Roboto, sans-serif;
}

button {
  cursor: pointer;
}

.nt-header {
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 8px 14px;
  background: rgba(28, 43, 76, 0.9);
  border-bottom: 1px solid rgba(145, 178, 232, 0.16);
  color: #ffffff;
}

.nt-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.nt-brand-logo {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(135deg, #34c8ff, #3264e9);
  color: #ffffff;
  font-size: 21px;
  font-weight: 900;
}

.nt-brand-text {
  font-size: 18px;
  font-weight: 900;
  white-space: nowrap;
}

.nt-star,
.nt-fullscreen {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  color: #dcecff;
  background: rgba(255, 255, 255, 0.08);
}

.nt-account-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.nt-account-bar select {
  height: 40px;
  max-width: 108px;
  border: 1px solid rgba(147, 185, 245, 0.15);
  border-radius: 13px;
  padding: 0 12px;
  outline: none;
  color: #ffffff;
  background: rgba(38, 58, 100, 0.85);
  font-weight: 800;
}

.nt-balance {
  min-width: 118px;
  text-align: right;
  font-size: 18px;
  white-space: nowrap;
}

.nt-top-up {
  height: 40px;
  border: 0;
  border-radius: 12px;
  padding: 0 18px;
  color: #ffffff;
  background: linear-gradient(135deg, #5fe777, #25b24a);
  font-weight: 900;
}

.nt-avatar {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #8ed0ff, #5275ff);
  color: #ffffff;
  font-weight: 900;
}

.nt-sidebar {
  min-height: 0;
  padding: 10px 7px;
  background: rgba(7, 13, 28, 0.9);
  border-right: 1px solid rgba(142, 176, 232, 0.13);
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.nt-sidebar button {
  min-height: 48px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: rgba(230, 241, 255, 0.82);
  display: grid;
  place-items: center;
  gap: 2px;
  padding: 4px;
}

.nt-sidebar button span {
  font-size: 20px;
  line-height: 1;
}

.nt-sidebar button small {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 10px;
  font-weight: 800;
}

.nt-sidebar button.active,
.nt-sidebar button:hover {
  color: #ffffff;
  background: rgba(58, 133, 255, 0.18);
}

.nt-quick-menu {
  min-height: 0;
  padding: 10px 7px;
  background: rgba(8, 14, 30, 0.92);
  border-left: 1px solid rgba(142, 176, 232, 0.13);
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.nt-quick-menu button {
  min-height: 56px;
  border: 0;
  border-radius: 12px;
  padding: 5px;
  color: rgba(231, 241, 255, 0.83);
  background: transparent;
  display: grid;
  place-items: center;
  gap: 2px;
}

.nt-quick-menu button:hover {
  color: #ffffff;
  background: rgba(61, 137, 255, 0.16);
}

.nt-quick-menu span {
  font-size: 18px;
}

.nt-quick-menu small {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 10px;
  font-weight: 800;
}

.nt-bottom-nav {
  display: none;
}

.nt-asset-selector {
  position: relative;
  min-width: 0;
}

.nt-asset-trigger,
.nt-tool-btn {
  height: 40px;
  border: 1px solid rgba(147, 185, 245, 0.15);
  border-radius: 13px;
  color: #ffffff;
  background: rgba(38, 58, 100, 0.86);
  font-weight: 900;
}

.nt-asset-trigger {
  min-width: 168px;
  max-width: 230px;
  padding: 0 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.nt-asset-trigger span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nt-asset-menu {
  position: absolute;
  z-index: 40;
  top: calc(100% + 10px);
  left: 0;
  width: 380px;
  max-width: calc(100vw - 120px);
  padding: 12px;
  border: 1px solid rgba(155, 191, 255, 0.18);
  border-radius: 18px;
  background: rgba(13, 23, 45, 0.98);
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.45);
}

.nt-asset-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 10px;
}

.nt-asset-tabs button,
.nt-asset-list button,
.nt-floating button {
  border: 0;
  border-radius: 11px;
  padding: 9px 11px;
  color: #dceaff;
  background: rgba(50, 72, 116, 0.76);
  font-weight: 800;
}

.nt-asset-tabs button.active,
.nt-asset-list button.active,
.nt-floating button.active {
  color: #ffffff;
  background: linear-gradient(135deg, #38c9ff, #3368f0);
}

.nt-asset-list {
  display: grid;
  gap: 8px;
}

.nt-asset-list button {
  text-align: left;
  display: grid;
  gap: 3px;
}

.nt-asset-list span {
  color: #9db0cd;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nt-toolbar-left {
  position: absolute;
  z-index: 8;
  top: 16px;
  left: 206px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nt-tool-wrap {
  position: relative;
}

.nt-tool-btn {
  padding: 0 13px;
}

.nt-tool-btn.compact {
  width: 48px;
  padding: 0;
}

.nt-chart-types {
  position: absolute;
  z-index: 8;
  top: 16px;
  right: 20px;
  display: flex;
  gap: 8px;
}

.nt-chart-types button {
  height: 40px;
  border: 1px solid rgba(148, 185, 244, 0.16);
  border-radius: 12px;
  padding: 0 14px;
  color: #ffffff;
  background: rgba(47, 68, 111, 0.86);
  font-weight: 900;
}

.nt-chart-types button.active {
  background: linear-gradient(135deg, #3bd3ff, #2e68ef);
}

.nt-floating {
  position: absolute;
  z-index: 50;
  top: 70px;
  left: 228px;
  width: 360px;
  max-width: calc(100vw - 110px);
  padding: 12px;
  border: 1px solid rgba(155, 191, 255, 0.18);
  border-radius: 18px;
  background: rgba(13, 23, 45, 0.98);
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.45);
}

.nt-floating h3 {
  margin: 0 0 10px;
  color: #ffffff;
  font-size: 14px;
}

.nt-floating div {
  max-height: 330px;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
}

.nt-timeframes {
  top: calc(100% + 10px);
  left: 0;
  width: 260px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 7px;
}

.nt-drawings {
  left: 330px;
  width: 300px;
}

.nt-chart-wrap {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #101a32;
}

.nt-chart-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.nt-trade-panel {
  min-height: 0;
  padding: 14px;
  border-left: 1px solid rgba(142, 176, 232, 0.13);
  background: linear-gradient(180deg, rgba(19, 32, 61, 0.96), rgba(10, 16, 33, 0.98));
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: #ffffff;
}

.nt-sentiment {
  display: grid;
  grid-template-columns: 42px 1fr 42px;
  align-items: center;
  gap: 8px;
  color: #8dff9a;
  font-weight: 900;
}

.nt-sentiment div {
  height: 16px;
  overflow: hidden;
  border-radius: 999px;
  background: linear-gradient(90deg, #3ed86d 0 50%, #ff4444 50% 100%);
  position: relative;
}

.nt-sentiment i {
  position: absolute;
  width: 5px;
  top: -4px;
  bottom: -4px;
  left: 50%;
  border-radius: 99px;
  background: #cbd9ff;
}

.nt-time-card,
.nt-amount-card,
.nt-payout-card {
  border-radius: 18px;
  background: rgba(9, 15, 31, 0.46);
}

.nt-time-card {
  padding: 12px;
}

.nt-time-card h3,
.nt-amount-card h3 {
  text-align: center;
  margin: 0 0 9px;
  font-size: 15px;
}

.nt-time-card p {
  margin: 8px 0 10px;
  text-align: center;
  color: #b9c8e2;
  font-size: 12px;
  font-weight: 700;
}

.nt-time-main {
  display: grid;
  grid-template-columns: 54px 1fr 54px;
  gap: 9px;
  align-items: center;
}

.nt-time-main button,
.nt-expiry-grid button {
  border: 0;
  border-radius: 14px;
  color: #ffffff;
  background: linear-gradient(135deg, #4bd8ff, #2e6df2);
  font-size: 24px;
  font-weight: 900;
}

.nt-time-main button {
  height: 52px;
}

.nt-time-main strong {
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.42);
  font-size: 24px;
}

.nt-expiry-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
}

.nt-expiry-grid div {
  min-width: 0;
  display: grid;
  place-items: center;
  gap: 5px;
  padding: 8px;
  border-radius: 14px;
  background: rgba(48, 67, 106, 0.52);
}

.nt-expiry-grid button {
  width: 100%;
  height: 28px;
  font-size: 17px;
}

.nt-expiry-grid strong {
  font-size: 20px;
}

.nt-expiry-grid small {
  color: #d9e6ff;
  font-size: 10px;
  font-weight: 800;
}

.nt-amount-card {
  padding: 12px;
}

.nt-amount-card label {
  height: 56px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 64px;
  align-items: center;
  border-radius: 15px;
  background: rgba(0, 0, 0, 0.55);
}

.nt-amount-card input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  padding: 0 16px;
  color: #ffffff;
  background: transparent;
  font-size: 25px;
  font-weight: 900;
}

.nt-amount-card span {
  font-size: 18px;
  font-weight: 900;
}

.nt-payout-card {
  padding: 13px;
  display: grid;
  gap: 10px;
  border: 1px dashed rgba(151, 189, 255, 0.16);
}

.nt-payout-card div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.nt-payout-card span {
  color: #bdcae1;
  font-weight: 700;
}

.nt-payout-card strong {
  color: #7fff91;
  font-size: 18px;
}

.nt-trade-actions {
  display: grid;
  gap: 10px;
  margin-top: auto;
}

.nt-trade-actions button {
  height: 54px;
  border: 0;
  border-radius: 15px;
  color: #ffffff;
  font-size: 17px;
  font-weight: 950;
}

.nt-trade-actions button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.nt-trade-actions .buy {
  background: linear-gradient(135deg, #6af178, #26be49);
}

.nt-trade-actions .ai {
  background: linear-gradient(135deg, #68dfff, #1f8fff);
}

.nt-trade-actions .sell {
  background: linear-gradient(135deg, #ff786c, #f13731);
}

@media (max-width: 980px) {
  .nt-header {
    height: 78px;
    padding: 8px 12px;
  }

  .nt-brand-text,
  .nt-star,
  .nt-fullscreen {
    display: none;
  }

  .nt-brand-logo {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    font-size: 30px;
  }

  .nt-account-bar {
    flex: 1;
    justify-content: flex-end;
  }

  .nt-account-bar select {
    max-width: 118px;
    height: 58px;
    border-radius: 18px;
  }

  .nt-balance {
    min-width: 118px;
    font-size: 18px;
  }

  .nt-top-up {
    width: 64px;
    height: 58px;
    padding: 0;
    font-size: 0;
  }

  .nt-top-up::after {
    content: "💳";
    font-size: 27px;
  }

  .nt-avatar {
    width: 56px;
    height: 56px;
  }

  .nt-sidebar {
    width: 64px;
    padding: 8px 5px 82px;
  }

  .nt-sidebar button {
    min-height: 54px;
  }

  .nt-sidebar button small {
    display: none;
  }

  .nt-sidebar button span {
    font-size: 26px;
  }

  .nt-quick-menu {
    display: none;
  }

  .nt-bottom-nav {
    position: fixed;
    z-index: 80;
    left: 0;
    right: 0;
    bottom: 0;
    height: 72px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 5px;
    padding: 5px;
    background: rgba(8, 14, 30, 0.96);
    border-top: 1px solid rgba(142, 176, 232, 0.15);
  }

  .nt-bottom-nav button {
    border: 0;
    border-radius: 12px;
    background: rgba(42, 59, 96, 0.76);
    color: rgba(231, 241, 255, 0.86);
  }

  .nt-bottom-nav span {
    display: block;
    font-size: 20px;
  }

  .nt-bottom-nav small {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 11px;
  }

  .nt-asset-trigger {
    width: 190px;
    max-width: 42vw;
    height: 54px;
    border-radius: 11px;
    font-size: 18px;
  }

  .nt-toolbar-left {
    top: 22px;
    left: 216px;
    gap: 7px;
  }

  .nt-tool-btn {
    width: 54px;
    height: 54px;
    padding: 0;
    border-radius: 11px;
    overflow: hidden;
    font-size: 0;
  }

  .nt-tool-btn::after {
    font-size: 22px;
  }

  .nt-tool-btn:nth-child(1)::after {
    content: "📊";
  }

  .nt-chart-types {
    left: 14px;
    right: 10px;
    top: 94px;
    gap: 7px;
  }

  .nt-chart-types button {
    flex: 1;
    min-width: 0;
    height: 46px;
    padding: 0 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
  }

  .nt-floating {
    left: 10px;
    right: 10px;
    width: auto;
    top: 150px;
    max-width: none;
  }

  .nt-floating div {
    max-height: 240px;
  }

  .nt-trade-panel {
    position: fixed;
    z-index: 70;
    left: 64px;
    right: 0;
    bottom: 72px;
    height: 330px;
    padding: 8px 10px;
    border-left: 0;
    border-top: 1px solid rgba(142, 176, 232, 0.18);
    background: rgba(18, 29, 55, 0.94);
    gap: 7px;
  }

  .nt-time-card {
    padding: 7px;
  }

  .nt-time-card h3,
  .nt-amount-card h3 {
    margin-bottom: 5px;
    font-size: 14px;
  }

  .nt-time-card p {
    display: none;
  }

  .nt-time-main {
    grid-template-columns: 70px 1fr 70px;
    gap: 8px;
  }

  .nt-time-main button,
  .nt-time-main strong {
    height: 48px;
  }

  .nt-time-main strong {
    font-size: 23px;
  }

  .nt-expiry-grid {
    gap: 7px;
    margin-top: 7px;
  }

  .nt-expiry-grid div {
    padding: 5px;
    gap: 2px;
  }

  .nt-expiry-grid button {
    height: 28px;
  }

  .nt-expiry-grid strong {
    font-size: 17px;
  }

  .nt-expiry-grid small {
    font-size: 9px;
  }

  .nt-amount-card {
    padding: 7px;
  }

  .nt-amount-card label {
    height: 48px;
  }

  .nt-amount-card input {
    font-size: 25px;
  }

  .nt-payout-card {
    grid-template-columns: repeat(3, 1fr);
    padding: 9px;
    gap: 8px;
  }

  .nt-payout-card div {
    display: grid;
    gap: 3px;
    text-align: center;
  }

  .nt-payout-card span {
    font-size: 12px;
  }

  .nt-payout-card strong {
    font-size: 16px;
  }

  .nt-trade-actions {
    grid-template-columns: 1fr 1.4fr 1fr;
    gap: 8px;
  }

  .nt-trade-actions button {
    height: 54px;
    font-size: 15px;
  }
}