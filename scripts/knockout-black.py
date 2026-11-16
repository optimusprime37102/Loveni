from pathlib import Path

from PIL import Image


def knock_black(src: Path, dest: Path, threshold: int = 32) -> None:
    im = Image.open(src).convert("RGBA")
    pixels = im.load()
    width, height = im.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            brightness = (r + g + b) / 3
            if brightness <= threshold:
                pixels[x, y] = (r, g, b, 0)
            elif brightness < threshold + 24 and a > 0:
                fade = int(((brightness - threshold) / 24) * a)
                pixels[x, y] = (r, g, b, max(0, min(255, fade)))

    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest)
    print(f"wrote {dest} {im.size}")


def main() -> None:
    assets = Path("assets/images")
    knock_black(assets / "splash-icon.png", assets / "splash-logo.png")
    knock_black(assets / "splash-icon-footer.png", assets / "splash-footer.png")


if __name__ == "__main__":
    main()
