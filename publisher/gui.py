"""
NRL Curriculum Publisher — the window the author double-clicks.

One job: turn the Word document into the website. Everything it shows is
written for someone who has never used a terminal and never will.
"""

from __future__ import annotations

import queue
import threading
import tkinter as tk
import webbrowser
from pathlib import Path
from tkinter import filedialog, ttk

import steps

BG = "#12131a"
FG = "#e8e9f0"
MUTED = "#8b8fa3"
ACCENT = "#4754e9"
OK = "#3fb950"
BAD = "#f05252"
WARN = "#d29922"


class Publisher(tk.Tk):
    def __init__(self) -> None:
        super().__init__()
        self.title("NRL Curriculum Publisher")
        self.geometry("760x560")
        self.minsize(680, 480)
        self.configure(bg=BG)

        self.settings = steps.load_settings()
        self.docx = steps.docx_path(self.settings)
        self.events: queue.Queue = queue.Queue()
        self.busy = False

        self._build()
        self._pump()

    # ------------------------------------------------------------- layout

    def _build(self) -> None:
        head = tk.Frame(self, bg=BG)
        head.pack(fill="x", padx=24, pady=(22, 8))

        tk.Label(head, text="NRL Curriculum", bg=BG, fg=FG,
                 font=("Segoe UI Semibold", 19)).pack(anchor="w")
        tk.Label(head, text="Turn the Word document into the website.",
                 bg=BG, fg=MUTED, font=("Segoe UI", 10)).pack(anchor="w", pady=(2, 0))

        doc = tk.Frame(self, bg="#191b25", highlightthickness=0)
        doc.pack(fill="x", padx=24, pady=(14, 0))
        inner = tk.Frame(doc, bg="#191b25")
        inner.pack(fill="x", padx=14, pady=12)

        tk.Label(inner, text="WORD DOCUMENT", bg="#191b25", fg=MUTED,
                 font=("Segoe UI", 8, "bold")).pack(anchor="w")
        self.doc_label = tk.Label(inner, text=str(self.docx), bg="#191b25", fg=FG,
                                  font=("Segoe UI", 10), anchor="w", justify="left", wraplength=560)
        self.doc_label.pack(anchor="w", fill="x", pady=(3, 0))
        tk.Button(inner, text="Choose a different file...", command=self._choose,
                  bg="#191b25", fg=MUTED, bd=0, relief="flat", cursor="hand2",
                  activebackground="#191b25", activeforeground=FG,
                  font=("Segoe UI", 9, "underline")).pack(anchor="w", pady=(6, 0))

        buttons = tk.Frame(self, bg=BG)
        buttons.pack(fill="x", padx=24, pady=(16, 6))

        self.publish_btn = tk.Button(
            buttons, text="Publish to the website", command=lambda: self._start(False),
            bg=ACCENT, fg="white", bd=0, relief="flat", cursor="hand2",
            activebackground="#3a46c4", activeforeground="white",
            font=("Segoe UI Semibold", 11), padx=22, pady=11,
        )
        self.publish_btn.pack(side="left")

        self.check_btn = tk.Button(
            buttons, text="Check without publishing", command=lambda: self._start(True),
            bg="#262936", fg=FG, bd=0, relief="flat", cursor="hand2",
            activebackground="#31354a", activeforeground=FG,
            font=("Segoe UI", 10), padx=18, pady=11,
        )
        self.check_btn.pack(side="left", padx=(10, 0))

        self.progress = ttk.Progressbar(self, mode="indeterminate")

        self.status = tk.Label(self, text="Ready.", bg=BG, fg=MUTED,
                               font=("Segoe UI", 10), anchor="w")
        self.status.pack(fill="x", padx=24, pady=(10, 4))

        log_frame = tk.Frame(self, bg=BG)
        log_frame.pack(fill="both", expand=True, padx=24, pady=(0, 20))
        self.log = tk.Text(log_frame, bg="#0d0e14", fg=FG, bd=0, relief="flat",
                           font=("Consolas", 9), wrap="word", padx=12, pady=10,
                           insertbackground=FG, state="disabled")
        scroll = tk.Scrollbar(log_frame, command=self.log.yview)
        self.log.configure(yscrollcommand=scroll.set)
        scroll.pack(side="right", fill="y")
        self.log.pack(side="left", fill="both", expand=True)

        for tag, colour in (("ok", OK), ("bad", BAD), ("warn", WARN), ("muted", MUTED)):
            self.log.tag_configure(tag, foreground=colour)

        self.link = tk.Label(self, text="", bg=BG, fg=ACCENT, cursor="hand2",
                             font=("Segoe UI", 10, "underline"))
        self.link.bind("<Button-1>", lambda _e: webbrowser.open(steps.SITE_URL))

    # -------------------------------------------------------------- actions

    def _choose(self) -> None:
        picked = filedialog.askopenfilename(
            title="Where is the curriculum Word document?",
            filetypes=[("Word documents", "*.docx")],
            initialdir=str(self.docx.parent) if self.docx.parent.exists() else str(Path.home()),
        )
        if picked:
            self.docx = Path(picked)
            self.settings["docx"] = str(self.docx)
            steps.save_settings(self.settings)
            self.doc_label.configure(text=str(self.docx))

    def _start(self, check_only: bool) -> None:
        if self.busy:
            return
        self.busy = True
        self.publish_btn.configure(state="disabled")
        self.check_btn.configure(state="disabled")
        self.link.pack_forget()
        self.progress.pack(fill="x", padx=24, pady=(2, 0))
        self.progress.start(12)
        self.log.configure(state="normal")
        self.log.delete("1.0", "end")
        self.log.configure(state="disabled")
        threading.Thread(target=self._work, args=(check_only,), daemon=True).start()

    def _work(self, check_only: bool) -> None:
        put = self.events.put
        try:
            steps.ensure_ready(lambda line: put(("line", line)))
            ok = steps.publish(
                self.docx,
                check_only,
                lambda event: put(("event", event)),
                lambda line: put(("line", line)),
            )
            put(("finished", ok and not check_only))
        except steps.Failed as e:
            put(("event", {"step": "error", "message": str(e)}))
            put(("finished", False))
        except Exception as e:  # noqa: BLE001 - last resort, still shown to the author
            put(("event", {"step": "error", "message": f"Something unexpected went wrong.\n\n{e}"}))
            put(("finished", False))

    # ---------------------------------------------------------------- pump

    def _pump(self) -> None:
        try:
            while True:
                kind, payload = self.events.get_nowait()
                if kind == "line":
                    self._write(payload, "muted")
                elif kind == "event":
                    self._event(payload)
                elif kind == "finished":
                    self._finish(payload)
        except queue.Empty:
            pass
        self.after(60, self._pump)

    def _event(self, event: dict) -> None:
        step = event.get("step", "")
        message = event.get("message", "")
        tag = {"error": "bad", "done": "ok", "warn": "warn"}.get(step, None)
        self._write(message, tag)
        for line in event.get("detail", []) or []:
            self._write(f"    {line}", "bad")
        if step != "warn":
            self.status.configure(text=message, fg=BAD if step == "error" else MUTED)

    def _finish(self, published: bool) -> None:
        self.busy = False
        self.progress.stop()
        self.progress.pack_forget()
        self.publish_btn.configure(state="normal")
        self.check_btn.configure(state="normal")
        if published:
            self.link.configure(text="Open the website")
            self.link.pack(anchor="w", padx=24, pady=(0, 8))

    def _write(self, text: str, tag: str | None = None) -> None:
        self.log.configure(state="normal")
        self.log.insert("end", f"{text}\n", tag or "")
        self.log.see("end")
        self.log.configure(state="disabled")


if __name__ == "__main__":
    Publisher().mainloop()
