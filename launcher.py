import subprocess
import sys
import os
import time
import webbrowser
import threading

def open_browser():
    time.sleep(2)
    webbrowser.open("http://127.0.0.1:8000")

def find_project_root():
    if getattr(sys, 'frozen', False):
        base_dir = os.path.dirname(sys.executable)
    else:
        base_dir = os.path.dirname(os.path.abspath(__file__))
    if os.path.basename(base_dir) == "dist":
        base_dir = os.path.dirname(base_dir)
    return base_dir

def main():
    base_dir = find_project_root()
    os.chdir(base_dir)

    print("CV Builder - Starting server...")

    process = subprocess.Popen(
        ["python", "main.py"],
        cwd=base_dir,
        creationflags=subprocess.CREATE_NEW_CONSOLE
    )

    print(f"Server starting in new terminal (PID: {process.pid})")

    browser_thread = threading.Thread(target=open_browser, daemon=True)
    browser_thread.start()

    print("Browser opening at http://127.0.0.1:8000")
    print("Close the server terminal to stop.\n")

    try:
        process.wait()
    except KeyboardInterrupt:
        process.terminate()
        process.wait()

if __name__ == "__main__":
    main()
