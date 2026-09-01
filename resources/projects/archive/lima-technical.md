# Lima Technology

> Personal cloud before Dropbox won. P2P distributed filesystem, custom Linux firmware, FUSE kernel extension.

[![C](https://img.shields.io/badge/-C-A8B9CC?style=flat-square&logo=c&logoColor=black)](#)
[![Linux](https://img.shields.io/badge/-Linux-FCC624?style=flat-square&logo=linux&logoColor=black)](#)
[![Electron](https://img.shields.io/badge/-Electron-47848F?style=flat-square&logo=electron&logoColor=white)](#)
[![Year](https://img.shields.io/badge/2011–2019-lightgrey?style=flat-square)](#)

Lima made all your storage accessible from all your devices — without uploading anything to someone else's servers. Plug a Lima device into your router, connect a USB drive. Every file appears on every device you own: Mac, Windows, Linux, iOS, Android. Like iCloud Drive, but peer-to-peer, cross-platform, and years earlier.

## Five technical layers, all built from scratch

**P2P mesh network** — devices communicate directly. No central server routing traffic. Lima dynamically adapts to LAN, internet, or mixed. Torrent-style multi-source transfers: all your devices that have a file send pieces in parallel.

**Decentralized FUSE filesystem** — files appear in your normal Finder/Explorer as local. Metadata-first: sync file names/sizes/dates instantly. Contents fetched on demand — you see everything, download only what you open. "Hologram files" — zero local storage until opened. Similar to what iCloud does today; we shipped it years earlier, cross-OS.

**Deep OS integration** — macOS Finder status badges (`osxfuse-kext` + `liferay-nativity`), right-click menus to pin files offline, Windows Explorer integration. Before Apple made their API public.

**Unification layer** — sync your entire user space (Documents, Desktop, Pictures, Music) across Mac + Windows + Linux. Cross-platform iCloud, before iCloud.

**AI-based cache management** — the Lima device learned which files you'd need on which device and pre-cached them. Mobile gets recent photos; desktop gets work files. Gets smarter with usage.

## The hardware

2.7cm × 6.9cm × 3.7cm · 30g · silent · 6W. Transforms any USB drive into a storage pod. Lima Original (USB2, 16 Mbps remote) and Lima Ultra (USB3, 240 Mbps remote).

AES-256 end-to-end on all communications. 2048-bit public/private key device auth. Zero data on Lima's servers.

## Results

| | |
|---|---|
| Kickstarter 2013 | $1.2M — 6th biggest Tech campaign at the time |
| Team | 30+ people from Oracle, Canonical, Apple, Dropbox |
| Devices shipped | 80,000+ across five continents |
| Raised | $10M+ in VC and government grants |
| Awards | 4× CES Innovation, Futur en Seine Gold, Huawei Pulse, MIT Innovator Under 35 |

## Stack

Custom OpenEmbedded Linux (Allwinner SoC ARM) · libsodium · lz4 · lmdb · msgpack · Lua · osxfuse-kext · liferay-nativity · Electron + [react-electron](./react-electron.md)

→ [lima-technology.com](https://lima-technology.com) · 2011–2019 · Paris
 