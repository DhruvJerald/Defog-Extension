import pyautogui
import random
import string
import tkinter as tk

# (kill switch control)
running = True

# window stuff
root = tk.Tk()
root.title("Status")

label = tk.Label(root, text="Running...", font=("Arial", 14))
label.pack(padx=20, pady=20)

# kill switch function
def stop_program(event=None):
    global running
    running = False
    root.destroy()   

# 🔹 BIND ESC KEY
root.bind("<Escape>", stop_program)

# 🔁 
def run_cycle():
    global running

    if not running:
        return  

    # randomizer
    length = random.randint(5, 10)
    text = ''.join(random.choice(string.ascii_lowercase) for _ in range(length))

    # type
    pyautogui.write(text)

    # 🔹delay
    root.after(1000, delete_text, text)


def delete_text(text):
    global running

    if not running:
        return

    for _ in range(len(text)):
        pyautogui.press('backspace')

    # 🔹 MOUSE MOVEMENT
    dx = random.randint(-10, 10)
    dy = random.randint(-10, 10)
    pyautogui.moveRel(dx, dy, duration=0.3)
    pyautogui.click()

    # 🔁 SCHEDULE NEXT CYCLE
    root.after(2000, run_cycle)


# 🔹 START FIRST CYCLE
root.after(1000, run_cycle)

# 🔹 START GUI LOOP (ALWAYS LAST)
root.mainloop()
        

