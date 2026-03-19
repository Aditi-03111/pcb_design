"""AI PCB Assistant - KiCad Action Plugin."""

__version__ = "0.1.0"

# Do NOT import plugin.py here — it imports wx, pcbnew, etc. which may not
# be available at package-scan time and will crash KiCad's plugin loader.
# Registration is handled by pcbnew_action.py which KiCad loads explicitly.
