# Lima Technology

> Liquid storage, no sync, private by design.

[![C](https://img.shields.io/badge/-C-A8B9CC?style=flat-square&logo=c&logoColor=black)](#)
[![Linux](https://img.shields.io/badge/-Linux-FCC624?style=flat-square&logo=linux&logoColor=black)](#)
[![Electron](https://img.shields.io/badge/-Electron-47848F?style=flat-square&logo=electron&logoColor=white)](#)
[![Year](https://img.shields.io/badge/2011–2019-lightgrey?style=flat-square)](#)

## Personal storage has a design problem

### The pains
- Storage is a mess.
- Sync is a pain in the ass.
- Backup is never something you actually want to think about.
- Dropbox-like cloud solutions let you sync a folder about the size of a USB key — not much more.
- I'd like to sync files without it costing me my privacy.
- The files are mine. I don't want to rent them.

### The underlying design problem

Personal storage, as it's conceived today, is designed to mirror the hardware underneath rather than the way people actually think about their files.

Every device has its own hard drive — a shoebox you drop things into. You can't have the same things on two devices unless you manually sync them: copy files across and keep the organization identical by hand. And even then, you're capped by the size of the smallest local drive. You can buy another drive, or a cloud bucket, or a Dropbox plan — but each of those is just *yet another shoebox*.

The end result: files everywhere, everything scattered, sync limited to small cloud folders, and no real hegemony between your devices.

Yet the technology to fix this already exists: decentralized filesystems, fast internet connections, ubiquitous Wi-Fi. The other half of the problem was privacy — very real at the time, when people were not comfortable putting everything into Dropbox.

## Design decisions

### The ideal
- **Unify storage into one space.** A user can have N devices; they should all display exactly the same files, regardless of shape, OS, or capacity. A file on my Mac desktop should be on my Windows desktop too.
- **Make storage liquid.** When I buy a hard drive I want it to expand the storage available to me transparently — not hand me another shoebox to sync into.
- **Make location a choice, not a constraint.** Local vs cloud, backup, where the bytes live — the user should be able to plug in anything. Don't want hardware at home and can afford cloud? Add a bucket. Want privacy? Swap in a hard drive.

### How the system works

We split **file presentation** from **file storage**.

**File presentation**
- Identical on every device. All devices show the same files and folders, whatever the count and whatever each device's capacity.
- File transfer feels instant, because "transferring a file" is really just transferring its metadata plus a pointer to where the bytes can be fetched.

**File storage**
- The source of truth is a backend storage pool made of one or more Network Attached Storage devices (NAS) and/or cloud buckets. It holds *all* of the user's files, replicated so it can recover from failures — every file lives on at least two nodes.
- Each device's local drive is just a **cache**: it keeps the files the user is most likely to reach for, up to its own capacity. Cached files open as easily as local files; everything else streams from the other sources.
- Storage is fully decentralized, so every device cooperates when the user tries to access a file.

## The tech

We had to invent and re-imagine entire layers of the stack for the vision to happen.

1. **A fully decentralized, fully P2P virtual filesystem.** Implemented in C, running on Android, iOS, Linux, macOS and Windows. It shows the same eventually-synchronized file tree on all devices, handles torrent-like data movement between devices, and enforces the rules that keep a copy of every file in the backend pool and on at least two nodes. Fully end-to-end encrypted.
2. **A mobile app** that serves as the filesystem UI on phones.
3. **Finder & Explorer integration.** We "hacked" the macOS Finder and Windows Explorer to adapt them to our new way of approaching files: the ability to see a file that isn't physically on your device, progress feedback on the icon when you open one, a distinction between *pinned* files (kept on-device when offline) and the rest, and graying out non-accessible files when offline.
4. **A zero-setup NAS dongle.** Designed, built and productized. Plug it into your router, plug a drive into it. Boom — you have more storage.

## The road
- Launched on Kickstarter — the 6th biggest campaign ever in the tech category, $1.2M raised.
- Raised Seed / Series A from VCs.
- Shipped the device, with pain: backers received it ~1.5 years late, as the software finally came together.
- Shipped a second version — ~40× more powerful hardware, more reliable software.
- Ran into funding problems.
- Acquisition (not on good terms).

→ [lima-technology.com](https://lima-technology.com) · 2011–2019 · Paris
