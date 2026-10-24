# Star Up / Blue Cutout

Separate experimental template. Existing `/star-up/` is preserved.

The web uses generated 2D urban illustrations, the original Hamster Hub character cutouts, and independently moving foreground planes. Scroll changes their depth offsets and scene. Only the small cube accent uses CSS 3D; this version does not load the old polygon city or a WebGL engine.

`blender/star-up-layered.blend` is an editable, packed 2.5D composition with background, original mascot and foreground at separate depths, a camera dolly and one real mesh cube. `build_layered.py` rebuilds it in Blender 4.5. Web motion is implemented separately in `cinematic.js`, not a prerendered Blender video.

Run a static HTTP server in the parent folder and open `/star-up-cinematic/`. Price: ฿21,890 / 1 year. Months 1–2 and 12 remain provisional, as labeled in the course information.

Checks: desktop 1440 and mobile 390, image loading, horizontal overflow, chapter/mascot switching, scroll depth, motion pause, monthly accordions. Reduced motion honored. All artwork stays outside the HTML reading layer.

## Generated image set

Built-in image_gen was used, with the user's two Persona urban references as visual direction. Rejected scenic moonlit assets are not used.

- `assets/graphic-city.webp`: New original Persona-inspired graphic urban intersection; black/ivory architecture, electric cobalt sky, dramatic skewed perspective, cables, zebra crossing, rough screenprint/halftone. Quiet upper-left area for copy; no characters, text, moon, realistic lighting or scenic painting.
- `assets/graphic-alley.webp`: Same black/ivory/cobalt ink language; narrow urban alley and overhead bridge, deep receding perspective, abstract cobalt paint slashes, quiet left wall, no lettering or characters.
- `assets/graphic-ledge.webp`: Transparent foreground rooftop fragment; concrete ledge, steel girder, ventilation unit, lamp, antennae and loose shards. Black/ivory/cobalt screenprint, full silhouette with transparent margins.

The three image prompts used those descriptions with the reference files supplied directly to the built-in generation tool. Original hamster assets (`pose-*.webp`, `team.webp`, `closing.webp`) were reused unchanged rather than regenerated.
