import math
import subprocess

WIDTH = 400
HEIGHT = 400

# Initialize image buffer (RGB)
pixels = bytearray(WIDTH * HEIGHT * 3)

def set_pixel(x, y, r, g, b, a=1.0):
    if 0 <= x < WIDTH and 0 <= y < HEIGHT:
        idx = (y * WIDTH + x) * 3
        if a >= 1.0:
            pixels[idx] = int(r)
            pixels[idx+1] = int(g)
            pixels[idx+2] = int(b)
        else:
            bg_r = pixels[idx]
            bg_g = pixels[idx+1]
            bg_b = pixels[idx+2]
            pixels[idx] = int(r * a + bg_r * (1.0 - a))
            pixels[idx+1] = int(g * a + bg_g * (1.0 - a))
            pixels[idx+2] = int(b * a + bg_b * (1.0 - a))

# 1. Background: studio light-blue gradient matching the uploaded photo
for y in range(HEIGHT):
    factor = y / HEIGHT
    # Soft blue: top #b6cde8 (182, 205, 232) to bottom #8caedb (140, 174, 219)
    r = 182 * (1 - factor) + 140 * factor
    g = 205 * (1 - factor) + 174 * factor
    b = 232 * (1 - factor) + 219 * factor
    for x in range(WIDTH):
        idx = (y * WIDTH + x) * 3
        pixels[idx] = int(r)
        pixels[idx+1] = int(g)
        pixels[idx+2] = int(b)

# 2. Shoulders & Dark Shirt
for y in range(290, HEIGHT):
    for x in range(WIDTH):
        dx = x - 200
        dy = y - 360
        if (dx * dx) / (160 * 160) + (dy * dy) / (75 * 75) <= 1.0 or y >= 360:
            # Collar / crewneck cut
            neck_dx = x - 200
            neck_dy = y - 305
            if (neck_dx * neck_dx) / (45 * 45) + (neck_dy * neck_dy) / (25 * 25) > 1.0 or y > 330:
                # Dark navy/slate shirt
                set_pixel(x, y, 28, 38, 54)

# 3. Neck
for y in range(235, 330):
    for x in range(WIDTH):
        dx = abs(x - 200)
        width_at_y = 38 + (y - 235) * 0.15
        if dx <= width_at_y:
            # Neck skin color with shadow
            shadow_factor = max(0.0, min(1.0, (y - 235) / 50))
            nr = 215 * (1 - shadow_factor * 0.15)
            ng = 175 * (1 - shadow_factor * 0.18)
            nb = 150 * (1 - shadow_factor * 0.20)
            set_pixel(x, y, nr, ng, nb)

# 4. Ears
for y in range(185, 235):
    for x in range(WIDTH):
        # Left ear
        dx_l = x - 132
        dy_l = y - 208
        if (dx_l * dx_l) / (12 * 12) + (dy_l * dy_l) / (22 * 22) <= 1.0:
            set_pixel(x, y, 232, 190, 166)
        # Right ear
        dx_r = x - 268
        dy_r = y - 208
        if (dx_r * dx_r) / (12 * 12) + (dy_r * dy_r) / (22 * 22) <= 1.0:
            set_pixel(x, y, 232, 190, 166)

# 5. Face / Jaw Structure (Oval jaw)
for y in range(120, 285):
    for x in range(WIDTH):
        dx = x - 200
        # Shape: wider at cheekbones (y ~ 185), tapered at jaw (y ~ 275)
        if y < 185:
            rx = 68
            ry = 65
            dy = y - 185
        else:
            t = (y - 185) / 95.0
            rx = 68 * (1.0 - t * 0.45)
            ry = 95
            dy = y - 185

        if (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1.0:
            # Face shading
            dist_from_center = math.sqrt(dx*dx + dy*dy) / 70.0
            dist_from_center = min(1.0, dist_from_center)
            fr = 248 * (1.0 - dist_from_center * 0.08)
            fg = 212 * (1.0 - dist_from_center * 0.12)
            fb = 188 * (1.0 - dist_from_center * 0.15)
            set_pixel(x, y, fr, fg, fb)

# 6. Cheeks warmth
for y in range(195, 230):
    for x in range(WIDTH):
        for cx in (162, 238):
            dx = x - cx
            dy = y - 212
            if (dx * dx) / (18 * 18) + (dy * dy) / (12 * 12) <= 1.0:
                set_pixel(x, y, 235, 155, 155, 0.22)

# 7. Eyebrows (Natural Brown, arched)
def draw_brow(cx, cy, flip=False):
    for ox in range(-20, 22):
        x = cx + ox
        arch = -math.cos(ox / 14.0) * 4.0
        y_center = cy + arch
        for oy in range(-3, 4):
            y = int(y_center + oy)
            # Brown tone
            alpha = max(0.0, 1.0 - abs(oy) / 3.5)
            set_pixel(x, y, 75, 48, 28, alpha * 0.85)

draw_brow(168, 166)
draw_brow(232, 166, flip=True)

# 8. Eyes (Brown/hazel eyes, cheerful friendly expression)
def draw_eye(cx, cy):
    # Eye white
    for y in range(cy - 8, cy + 9):
        for x in range(cx - 16, cx + 17):
            dx = x - cx
            dy = y - cy
            if (dx * dx) / (15 * 15) + (dy * dy) / (7.5 * 7.5) <= 1.0:
                set_pixel(x, y, 252, 252, 252)
    # Iris (warm brown/hazel)
    for y in range(cy - 7, cy + 8):
        for x in range(cx - 7, cx + 8):
            dx = x - cx
            dy = y - cy
            if dx*dx + dy*dy <= 36:
                set_pixel(x, y, 92, 60, 36)
            if dx*dx + dy*dy <= 12:
                # Pupil
                set_pixel(x, y, 25, 18, 12)
    # Catchlight highlight
    set_pixel(cx + 2, cy - 2, 255, 255, 255)
    set_pixel(cx + 3, cy - 2, 255, 255, 255)
    set_pixel(cx + 2, cy - 1, 255, 255, 255)
    # Upper eyelid line
    for ox in range(-16, 17):
        x = cx + ox
        y = int(cy - 7 - math.cos(ox / 12.0) * 1.5)
        set_pixel(x, y, 55, 35, 22, 0.9)
        set_pixel(x, y + 1, 75, 45, 30, 0.5)

draw_eye(168, 182)
draw_eye(232, 182)

# 9. Nose (Defined bridge and soft tip)
for y in range(175, 222):
    # bridge highlight & shading
    set_pixel(199, y, 255, 225, 205, 0.4)
    set_pixel(200, y, 255, 230, 210, 0.5)
    set_pixel(203, y, 195, 145, 120, 0.25)
# Nose tip & nostrils
for x in range(192, 209):
    dy = abs(x - 200)
    y = int(220 - dy * 0.3)
    set_pixel(x, y, 210, 155, 130, 0.6)
set_pixel(192, 221, 150, 95, 75, 0.7)
set_pixel(208, 221, 150, 95, 75, 0.7)

# 10. Smile (Warm, pleasant smile with teeth visible, matching photo)
for y in range(235, 258):
    for x in range(176, 225):
        dx = x - 200
        # Lip curve
        top_lip = 237 + (dx*dx) / 140.0
        bottom_lip = 252 - (dx*dx) / 180.0
        if top_lip <= y <= bottom_lip:
            # Inside smile
            if y < top_lip + 5:
                # White teeth
                set_pixel(x, y, 250, 250, 250)
            else:
                # Soft mouth shadow / tongue
                set_pixel(x, y, 175, 65, 65)

# Outer lip lines
for x in range(175, 226):
    dx = x - 200
    y_top = int(236 + (dx*dx) / 140.0)
    set_pixel(x, y_top, 200, 110, 105, 0.7)
    y_bot = int(253 - (dx*dx) / 180.0)
    set_pixel(x, y_bot, 215, 125, 120, 0.8)

# 11. Hair (Short brown, swept back/up on top, tapered sides, as in photo)
# Top volume
for y in range(65, 160):
    for x in range(WIDTH):
        dx = x - 200
        # Top swept up
        t = (y - 65) / 95.0
        rx = 75 + t * 4
        ry = 65
        dy = y - 130
        if (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1.0:
            if y < 140:
                # Hair strand variation
                strand = math.sin((x * 0.4) + (y * 0.2)) * 15
                hr = max(0, min(255, int(68 + strand)))
                hg = max(0, min(255, int(45 + strand * 0.7)))
                hb = max(0, min(255, int(26 + strand * 0.5)))
                set_pixel(x, y, hr, hg, hb)

# Sides of hair
for y in range(130, 210):
    for x in range(WIDTH):
        # Left side
        if 124 <= x <= 136 and abs(y - 170) < 35:
            set_pixel(x, y, 62, 40, 24, 0.9)
        # Right side
        if 264 <= x <= 276 and abs(y - 170) < 35:
            set_pixel(x, y, 62, 40, 24, 0.9)

# Write PPM
header = f"P6\n{WIDTH} {HEIGHT}\n255\n".encode("ascii")
with open("/tmp/luc_portrait.ppm", "wb") as f:
    f.write(header + pixels)

print("PPM generated successfully.")
