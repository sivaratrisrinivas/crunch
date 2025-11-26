# Crunch 🥨

**Stop wasting data. Stop guessing why your video is stuttering.**

### 1. Why do I need this?
You are probably streaming video wrong.
*   **The "Waste" Problem:** Streaming 4K video on a regular laptop screen is like pouring a gallon of water into a pint glass. It doesn't make the video look better; it just wastes your internet data and drains your battery faster.
*   **The "Lag" Problem:** When a video stutters, is it your Wi-Fi acting up, or is your computer too slow to handle the video? usually, you have no idea.

**Crunch** tells you the truth about your stream in plain English.

---

### 2. What does it do?
Crunch is a tiny browser extension that adds a "Health Card" to YouTube, Twitch, and other streaming sites. It calculates 4 simple things:

*   **Efficiency:** Are you watching in the right resolution?
    *   🟢 **1.0x (Perfect):** Every pixel you download is being seen.
    *   🔴 **(Waste):** You are streaming high quality, but your window is too small to show it. (Action: Go Full Screen or lower the quality).
    *   🟡 **(Blurry):** Your screen is big, but the video is low quality.
*   **Drops:** Is your computer choking?
    *   If this number goes up, your internet is fine, but your computer hardware is struggling to play the video.
*   **Buffer:** Is your internet fast enough?
    *   Shows how many seconds of video are pre-loaded. If this is high, your Wi-Fi is great.
*   **Codec:** The Engine.
    *   Shows you the specific technology (AV1, VP9, H.264) the site is using to send you the video.

---

### 3. How to Install
Since this is a custom tool, you won't find it in the store yet. Here is how to run it on your machine:

1.  **Download:** Create a folder named `crunch` and put the 4 files (`manifest.json`, `content.js`, `inject.js`, `background.js`) inside it.
2.  **Open Chrome Extensions:** Type `chrome://extensions` in your address bar and hit Enter.
3.  **Developer Mode:** Toggle the switch in the top-right corner to **ON**.
4.  **Load:** Click the button that says **"Load Unpacked"** and select your `crunch` folder.
5.  **Done:** You will see the Pretzel 🥨 icon in your toolbar.

---
### 4. How to Use
1.  Go to YouTube, Twitch, or any video site.
2.  **Click the Crunch (Puzzle Piece/Icon)** in your browser toolbar to toggle the stats card on or off.
3.  **Read the card:**
    *   If it says **Waste**, lower your video quality to save bandwidth.
    *   If **Drops** turn red, close other tabs to help your computer breathe.
    *   If **Buffer** turns red, move closer to your Wi-Fi router.
