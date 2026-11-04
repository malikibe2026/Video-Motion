"""Demo: grouped bar chart for the fictional test data, 9:16, built in Manim.

Run: manim -r 1080,1920 --fps 30 -o demo statistik_demo.py StatistikDemo
"""
import csv
from pathlib import Path

from manim import (
    BLUE_E, DOWN, RIGHT, UP, Create, FadeIn,
    Line, Rectangle, Scene, Text, VGroup, Write, config, smooth,
)

CSV_PATH = Path("/home/user/Video-Motion/templates/contoh-ujian.csv")

# 9:16 frame: width 9, height 16 units
config.frame_width = 9
config.frame_height = 16
config.background_color = "#FFFFFF"

ACCENT = BLUE_E
GREY = "#8A93A0"
TEXT = "#1A1A1A"
YEAR_COLOURS = {"2022": "#C4CAD3", "2023": "#8A93A0", "2024": "#0B3D91"}


def load():
    rows = list(csv.DictReader(CSV_PATH.open(encoding="utf-8")))
    data = {}
    for r in rows:
        data.setdefault(r["negeri"], {})[r["tahun"]] = float(r["penduduk_ribu"])
    return data


class StatistikDemo(Scene):
    def construct(self):
        data = load()
        states = list(data.keys())
        years = ["2022", "2023", "2024"]
        vmax = 1400.0
        base_y = -5.0
        scale = 9.0 / vmax  # bar height units per thousand people

        title = Text("Penduduk mengikut negeri", color=TEXT, font_size=40, font="Inter").to_edge(UP, buff=0.8)
        sub = Text("Data rekaan untuk ujian", color=GREY, font_size=24, font="Inter").next_to(title, DOWN, buff=0.25)
        self.play(Write(title), FadeIn(sub), run_time=1.2)

        groups = VGroup()
        value_labels = []
        bars_by_state = {}
        group_w = 2.1
        for gi, state in enumerate(states):
            x0 = -group_w * (len(states) - 1) / 2 + gi * group_w
            bars = []
            for yi, y in enumerate(years):
                v = data[state][y]
                h = v * scale
                bar = Rectangle(width=0.46, height=h, fill_color=YEAR_COLOURS[y], fill_opacity=1,
                                stroke_width=0)
                bar.move_to([x0 + (yi - 1) * 0.56, base_y + h / 2, 0])
                bars.append((bar, v, h))
                groups.add(bar)
            bars_by_state[state] = bars
            name = Text(state, color=TEXT, font_size=30, font="Inter").move_to([x0, base_y - 0.6, 0])
            self.add(name)

        axis = Line([-4.0, base_y, 0], [4.0, base_y, 0], color=TEXT, stroke_width=3)
        self.play(Create(axis), run_time=0.6)

        # grow bars one state at a time, counting numbers up
        for state in states:
            anims = []
            for bar, v, h in bars_by_state[state]:
                bar.stretch_to_fit_height(0.001)
                bar.move_to([bar.get_center()[0], base_y, 0])
                anims.append(bar.animate(rate_func=smooth).stretch_to_fit_height(h)
                             .move_to([bar.get_center()[0], base_y + h / 2, 0]))
            self.play(*anims, run_time=1.2)
            for bar, v, h in bars_by_state[state]:
                lbl = Text(f"{v:,.0f}", color=TEXT, font_size=18, font="Inter")
                lbl.next_to(bar, UP, buff=0.12)
                self.add(lbl)
                self.play(FadeIn(lbl), run_time=0.2)

        legend = VGroup()
        for i, y in enumerate(years):
            sw = Rectangle(width=0.35, height=0.35, fill_color=YEAR_COLOURS[y], fill_opacity=1, stroke_width=0)
            t = Text(y, color=TEXT, font_size=24, font="Inter")
            t.next_to(sw, RIGHT, buff=0.15)
            legend.add(VGroup(sw, t))
        legend.arrange(RIGHT, buff=0.7).to_edge(DOWN, buff=1.4)
        self.play(FadeIn(legend), run_time=0.6)

        source = Text("Sumber: Data rekaan untuk ujian", color=GREY, font_size=20, font="Inter").to_edge(DOWN, buff=0.6)
        self.play(FadeIn(source), run_time=0.6)
        self.wait(1.2)
