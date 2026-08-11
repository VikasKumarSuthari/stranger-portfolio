import wave
import math
import random
import struct
import os

def generate_tone(filename, duration, freq_start, freq_end=None, vol=0.5, type='sine'):
    sample_rate = 44100
    n_frames = int(duration * sample_rate)
    
    with wave.open(filename, 'w') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(sample_rate)
        
        for i in range(n_frames):
            t = i / sample_rate
            
            # Frequency modulation
            if freq_end:
                freq = freq_start + (freq_end - freq_start) * (i / n_frames)
            else:
                freq = freq_start

            # Waveform generation
            if type == 'sine':
                value = math.sin(2 * math.pi * freq * t)
            elif type == 'noise':
                value = random.uniform(-1, 1)
            elif type == 'sawtooth':
                value = 2 * (t * freq - math.floor(0.5 + t * freq))
            
            # Amplitude modulation (envelope) - simple fade out
            envelope = 1.0 - (i / n_frames)
            
            data = struct.pack('<h', int(value * vol * envelope * 32767.0))
            f.writeframesraw(data)

def generate_ambient(filename, duration):
    sample_rate = 44100
    n_frames = int(duration * sample_rate)
    
    with wave.open(filename, 'w') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(sample_rate)
        
        for i in range(n_frames):
            # Low frequency drone + noise
            t = i / sample_rate
            
            # Layer 1: Low Sine
            v1 = math.sin(2 * math.pi * 60 * t) * 0.5
            
            # Layer 2: Subtle Noise
            v2 = random.uniform(-0.1, 0.1)
            
            # Mix
            value = (v1 + v2) * 0.5
            
            data = struct.pack('<h', int(value * 32767.0))
            f.writeframesraw(data)

os.makedirs('public/sounds', exist_ok=True)

# 1. Hover - High pitch sci-fi chirp
generate_tone('public/sounds/hover.wav', 0.1, 800, 1200, vol=0.3)

# 2. Click - Quick mechanical blip
generate_tone('public/sounds/click.wav', 0.05, 200, 50, vol=0.5, type='sawtooth')

# 3. Transition - Deep "Whoosh" / THX style slide
generate_tone('public/sounds/transition.wav', 1.5, 100, 8000, vol=0.6, type='sawtooth')

# 4. Ambient Normal - Steady low hum
generate_ambient('public/sounds/ambient-normal.wav', 5.0)

# 5. Ambient Upside Down - Unsettling noise
generate_tone('public/sounds/ambient-upside-down.wav', 5.0, 40, 45, vol=0.6, type='noise')

print("Sounds generated.")
