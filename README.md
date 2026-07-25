# Packet Path — a 7-day networking course for cybersecurity beginners

A self-contained, hands-on networking course built for people going into security.
Two HTML files, no build step, no dependencies, no accounts, no server.

| File | What it is |
|---|---|
| `index.html` | Landing page — hero, curriculum, sample lesson, toolkit, FAQ |
| `course.html` | The full course — 7 days, 21 labs, cheat sheet, final assessment |

## Running it

Open `index.html` in a browser. That's it.

It works straight off the filesystem (`file://`), so you can save both files to a USB
stick and work through the whole course offline. If you'd rather serve it:

```bash
python3 -m http.server 8000
# then open http://127.0.0.1:8000
```

To publish it, push to GitHub and enable **Settings → Pages → Deploy from branch**.
No build configuration is needed.

## Curriculum

| Day | Topic | Lab |
|---|---|---|
| 1 | OSI & TCP/IP models, encapsulation, IPv4 addressing, subnetting | Map your own address, mask and gateway; subnet by hand; diagnostic ping sequence |
| 2 | Hubs/switches/routers, MAC & ARP, VLANs, NAT/PAT, DHCP | Watch your ARP cache fill; read your DHCP lease; build a routed network in Packet Tracer |
| 3 | TCP vs UDP, the three-way handshake, flags, states, ports | Audit every listening port; banner-grab by hand; capture a real handshake in Wireshark |
| 4 | DNS hierarchy & records, HTTP, TLS, full packet flow | `dig +trace` from root to answer; read headers and certificates in DevTools; DNS on the wire |
| 5 | Firewalls, VPNs, IDS/IPS, and the attacks they stop | Read and write host firewall rules; decompose a Snort signature; apply a router ACL |
| 6 | Wireshark, capture vs display filters, `tshark`, pcap triage | Five-step triage method; see a credential in cleartext, then watch HTTPS hide it |
| 7 | **Capstone** — build, assess, exploit, remediate, report | Build a 3-VLAN network, find six planted weaknesses, prove one, fix them all, write it up |

Plus a searchable cheat sheet (ports, CIDR, commands, Wireshark filters, attack/defence
matrix, Cisco IOS crib) and a 12-question final assessment.

## Tools you need

All free, none requiring payment:

- **Wireshark** — packet analysis (Days 3, 4, 6, 7)
- **Cisco Packet Tracer** (free via Cisco Networking Academy) or **GNS3** — network simulation (Days 2, 5, 7)
- **Your terminal** — `ping`, `traceroute`, `dig`/`nslookup`, `ss`/`netstat`, `arp`, `curl`, `nc`
- **Your browser's DevTools** — the Network tab (Day 4)

## Scope and legality

Every lab targets your own machine, your own network, a simulator running locally, or a
public sample capture. Scanning, sniffing or spoofing on networks you do not own or have
written permission to test is a criminal offence in most jurisdictions. The attack labs
are deliberately built inside Packet Tracer for that reason, and the course says so in
each place it matters.

## Implementation notes

- Vanilla HTML/CSS/JS, embedded inline. No frameworks, no build, no external JS or CSS.
- The only external request is Google Fonts (Instrument Serif, Inter, JetBrains Mono),
  with full system-font fallbacks so the pages still look right fully offline.
- Cream light theme by default with a hand-tuned dark theme; the choice persists in
  `localStorage` and is applied before first paint, so there's no flash.
- Progress (completed days and ticked lab steps) persists in `localStorage` under
  `packetpath.progress.v1` — device-local, no account, no analytics, no server.
- Accessible: semantic landmarks, real `<details>` elements so days work without JS,
  keyboard-operable tabs and quizzes, visible focus rings, and a full
  `prefers-reduced-motion` path.
- Responsive from 320px up; every wide table and diagram scrolls inside its own
  container so the page body never scrolls sideways.
- `course.html` prints cleanly if you want the cheat sheet on paper.
