"""
The work behind the Publish button.

The window owns none of the conversion logic. Everything that decides what the
website says lives in the repository, in tools/word/, and runs under the
repository's own Node — so a fix to the converter reaches every machine on the
next run, without anyone reinstalling anything.

What lives here is only the part that almost never changes: finding the tools,
setting up a working copy the first time, and running the steps in order.
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

REPO_URL = "https://github.com/lalerushabh-commits/NRL-Curriculum-Docs.git"
SITE_URL = "https://lalerushabh-commits.github.io/NRL-Curriculum-Docs/"

WORKDIR = Path(os.environ.get("LOCALAPPDATA", Path.home())) / "NRL" / "CurriculumPublisher"
REPO = WORKDIR / "repo"
SETTINGS = WORKDIR / "settings.json"

DEFAULT_DOCX = Path.home() / "Desktop" / "NRL-Curriculum-Complete" / "NRL-Curriculum-Complete.docx"

# Windows: don't flash a console window for every command we run.
NO_WINDOW = 0x08000000 if sys.platform == "win32" else 0


class Failed(Exception):
    """Something went wrong in a way worth showing the author verbatim."""


@dataclass
class Tool:
    name: str
    path: str


def _which(name: str, extra: list[Path]) -> str | None:
    found = shutil.which(name)
    if found:
        return found
    for candidate in extra:
        # GitHub Desktop ships its own git in a versioned folder.
        for hit in sorted(candidate.parent.glob(candidate.name), reverse=True):
            if hit.exists():
                return str(hit)
    return None


def find_node() -> str:
    node = _which("node", [Path(r"C:\Program Files\nodejs\node.exe")])
    if not node:
        raise Failed(
            "Node.js is not installed on this computer.\n\n"
            "Install the LTS version from nodejs.org, then open this again."
        )
    return node


def find_git() -> str:
    local = Path(os.environ.get("LOCALAPPDATA", ""))
    git = _which(
        "git",
        [
            local / "GitHubDesktop" / "app-*" / "resources" / "app" / "git" / "cmd" / "git.exe",
            Path(r"C:\Program Files\Git\cmd\git.exe"),
        ],
    )
    if not git:
        raise Failed(
            "Git is not installed on this computer.\n\n"
            "Install GitHub Desktop from desktop.github.com and sign in once, then open this again."
        )
    return git


def load_settings() -> dict:
    if SETTINGS.exists():
        try:
            return json.loads(SETTINGS.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            pass
    return {}


def save_settings(settings: dict) -> None:
    WORKDIR.mkdir(parents=True, exist_ok=True)
    SETTINGS.write_text(json.dumps(settings, indent=2), encoding="utf-8")


def docx_path(settings: dict) -> Path:
    saved = settings.get("docx")
    return Path(saved) if saved else DEFAULT_DOCX


def run(cmd: list[str], cwd: Path | None, on_line) -> int:
    """Run a command, streaming each line out as it appears."""
    process = subprocess.Popen(
        cmd,
        cwd=str(cwd) if cwd else None,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        stdin=subprocess.DEVNULL,
        text=True,
        encoding="utf-8",
        errors="replace",
        bufsize=1,
        creationflags=NO_WINDOW,
    )
    assert process.stdout is not None
    for line in process.stdout:
        on_line(line.rstrip("\n"))
    return process.wait()


def ensure_ready(on_line) -> None:
    """
    Make sure there is a working copy of the site to publish from.

    This is a private copy the author never opens and never edits, which is why
    it is safe to reset it to whatever GitHub has before every run.
    """
    node = find_node()
    git = find_git()
    WORKDIR.mkdir(parents=True, exist_ok=True)

    if not (REPO / ".git").exists():
        on_line("Setting up for the first time. This takes a few minutes, once.")
        if REPO.exists():
            shutil.rmtree(REPO, ignore_errors=True)
        if run([git, "clone", REPO_URL, str(REPO)], WORKDIR, on_line) != 0:
            raise Failed("I could not download the website from GitHub. Check the internet connection.")
    else:
        on_line("Getting the latest copy of the website...")
        run([git, "fetch", "origin"], REPO, on_line)
        # The copy is ours alone, so anything left behind by a failed run goes.
        run([git, "reset", "--hard", "origin/main"], REPO, on_line)
        run([git, "clean", "-fdq"], REPO, on_line)

    # Reinstall only when the list of tools has actually changed.
    lock = REPO / "package-lock.json"
    stamp = WORKDIR / "installed-lock.txt"
    current = lock.read_text(encoding="utf-8") if lock.exists() else ""
    installed = stamp.read_text(encoding="utf-8") if stamp.exists() else None
    if not (REPO / "node_modules").exists() or installed != current:
        on_line("Installing the website tools. This takes a few minutes, once.")
        npm = "npm.cmd" if sys.platform == "win32" else "npm"
        if run([npm, "ci"], REPO, on_line) != 0:
            raise Failed("Setting up the website tools failed. Check the internet connection and try again.")
        stamp.write_text(current, encoding="utf-8")


def publish(docx: Path, check_only: bool, on_event, on_line) -> bool:
    """
    Run the publish steps. Returns True if it got all the way through.

    Progress arrives as JSON, one object per line, so the window can show a
    tidy list of steps instead of raw console output.
    """
    node = find_node()
    args = [
        node,
        str(REPO / "tools" / "word" / "publish.mjs"),
        "--docx",
        str(docx),
        "--json",
    ]
    if check_only:
        args.append("--check-only")

    ok = True

    def handle(line: str) -> None:
        nonlocal ok
        line = line.strip()
        if not line:
            return
        if line.startswith("{"):
            try:
                event = json.loads(line)
            except json.JSONDecodeError:
                on_line(line)
                return
            if event.get("step") == "error":
                ok = False
            on_event(event)
        else:
            on_line(line)

    code = run(args, REPO, handle)
    return ok and code == 0
