# Alex the Allegator 4 — asset conversion

These scripts generate `public/data/` from two sources:

- the original game, "Alex the Allegator 4" by Johan Peitz / Free Lunch Design
  (2003, GPL): `alex4src_data.zip` from
  <https://sourceforge.net/projects/allegator/files/Alex4/source%20and%20data/>
- Alex4 Web Edition, the 2012 melonJS 0.9 remake: this repository, as it was
  at commit `11c7062`

```sh
unzip alex4src_data.zip -d /tmp/alex4
git clone https://github.com/mixelstudio/Alex4-WE /tmp/alex4-we
git -C /tmp/alex4-we checkout 11c7062

# sprite atlas, tileset, bitmap fonts, sounds (needs Pillow and ffmpeg)
python3 build_assets.py /tmp/alex4/alex4src/data /tmp/alex4-we/data ../public/data

# Tiled maps
python3 build_levels.py /tmp/alex4/alex4src/data /tmp/alex4-we/data ../public/data/map
```

- `allegro_dat.py` reads the password-protected Allegro 4 datafiles
- `maps.py` reads the original levels (`maps.dat`)
- `build_assets.py` converts the original bitmaps (4x, original palette) into
  a texture atlas and a tileset, widens the treetops of the cut scenes, adds
  the missing punctuation to the Alex4-WE bitmap fonts, converts the sound
  effects Alex4-WE did not have, and renders the intro and outro songs from
  the original music module (needs ffmpeg built with libopenmpt)
- `build_levels.py` writes levels 1-6 from the Alex4-WE Tiled maps, and
  converts levels 7-12 and the scenes of the intro and the outro from the
  original data. Every map
  gets the same layers: the parallax images, a "Foreground" tile layer, a
  "collision" object layer (solid rectangles and the breakable blocks) and an
  "entities" object layer matched to the classes registered in `src/game/createGame.ts`

Like the original game, these scripts and the files they produce are GPL —
see `LICENSE`.
