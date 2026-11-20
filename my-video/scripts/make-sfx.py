"""Erzeugt die Soundeffekte des Videos synthetisch (keine fremden Audiodateien)."""
import wave, sys, numpy as np
SR = 44100
OUT = sys.argv[1]
rng = np.random.default_rng(1)

def t(d): return np.arange(int(SR * d)) / SR

def save(name, x, gain=0.8):
    x = x / (np.max(np.abs(x)) + 1e-9) * gain
    fade = int(0.01 * SR); x[-fade:] *= np.linspace(1, 0, fade)
    y = (x * 32767).astype(np.int16)
    with wave.open(f"{OUT}/{name}.wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())

def strike(d=1.6, f=1180):
    tt = t(d); x = np.zeros_like(tt)
    for ratio, amp, dec in [(1, 1, 2.2), (2.0, .5, 3.5), (2.76, .35, 4.5), (5.4, .15, 7), (0.5, .25, 1.8)]:
        x += amp * np.sin(2*np.pi*f*ratio*tt) * np.exp(-dec*tt)
    x[:int(.003*SR)] *= np.linspace(0, 1, int(.003*SR))
    return x

# Glocke: mehrere Schläge in 1,5 s, dann Ausklingen
d = 2.4; bell = np.zeros(int(SR*d))
for i, s in enumerate([0, .26, .52, .78, 1.04, 1.3]):
    st = strike(d - s + 0.01, 1180 if i % 2 == 0 else 1170) * (1 - i*0.08)
    bell[int(s*SR):] += st[:len(bell) - int(s*SR)]
save("bell", bell, 0.7)

# Pop für einblendende Begriffe
tt = t(.12); f = np.linspace(520, 880, len(tt))
save("pop", np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-tt*35), 0.35)

# Tropfen (Speichel)
tt = t(.25); f = 700 + 1300*(tt/.25)**.6
save("drip", np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-tt*22), 0.4)

# Napf wird abgestellt
tt = t(.5); x = sum(a*np.sin(2*np.pi*fr*tt)*np.exp(-tt*k) for fr, a, k in [(420,1,12),(1130,.5,18),(2350,.25,25)])
x[:int(.04*SR)] += rng.normal(0, .4, int(.04*SR)) * np.exp(-t(.04)*80)
save("clink", x, 0.45)

# Übergang (Whoosh): gefiltertes Rauschen
tt = t(.6); n = rng.normal(0, 1, len(tt))
k = 60; n = np.convolve(n, np.ones(k)/k, mode="same")
env = np.sin(np.pi * tt/.6)**2
save("whoosh", n*env, 0.25)

# Zahnarztbohrer: hohes Sirren mit Schwankung, 3 s
tt = t(3.0); f = 1500 + 40*np.sin(2*np.pi*7*tt) + 300*np.minimum(tt/.3, 1)
ph = 2*np.pi*np.cumsum(f)/SR
x = np.sin(ph) + .5*np.sin(2*ph) + .3*np.sin(3*ph) + .15*rng.normal(0,1,len(tt))
env = np.minimum(tt/.15, 1) * np.minimum((3.0-tt)/.3, 1)
save("drill", x*env, 0.35)

# Erfolgs-Akkord
tt = t(1.4); x = np.zeros_like(tt)
for i, fr in enumerate([523.25, 659.25, 783.99]):
    s = int(i*.09*SR); seg = tt[:len(tt)-s]
    x[s:] += (np.sin(2*np.pi*fr*seg) + .3*np.sin(4*np.pi*fr*seg)) * np.exp(-seg*2.5)
save("chime", x, 0.45)
print("ok")

# Mausklick
tt = t(.06); x = rng.normal(0, 1, len(tt)) * np.exp(-tt*120) + np.sin(2*np.pi*2400*tt) * np.exp(-tt*90)
save("click", x, 0.4)

# Tastaturtippen, 3 s (wird im Video passend abgeschnitten)
d = 3.0; typing = np.zeros(int(SR*d)); pos = 0.0
while pos < d - 0.1:
    k = t(.04); f = rng.uniform(1800, 3200)
    hit = rng.normal(0, 1, len(k)) * np.exp(-k*150) * .6 + np.sin(2*np.pi*f*k) * np.exp(-k*200) * .4
    i = int(pos*SR); typing[i:i+len(hit)] += hit * rng.uniform(.6, 1)
    pos += rng.uniform(.06, .13)
save("typing", typing, 0.3)
print("ok2")
