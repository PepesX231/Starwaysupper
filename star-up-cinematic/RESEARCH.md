# Updated direction: Blue Cutout

The polygon-city draft was rejected. The current template uses new Persona-inspired high-contrast 2D city, alley and transparent rooftop imagery with original hamster cutouts. Web depth is independent image-layer motion; the packed Blender file is an editable companion composition. See README.md.

## Previous research notes

# Star Up — blue cinematic template study

This is a separate experiment. The existing Star Up and Super Express sites are preserved. Unpublished game-UI work was archived locally as `outputs/star-up-game-ui-v3-draft`.

## Reference observations and decisions

- Torn-paper eye closeups: use a brief diagonal chapter cut-in as a framing device, not repeated flashing.
- Zigzag editorial composition: five clear chapters along a single spatial route, with a visible chapter index and reversible navigation.
- Agent-selection reference: a dominant 2D character silhouette on a real 3D stage. Keep interface labels as readable HTML.
- Blue interpretation of the city references: actual building facades, windows, overhead cable silhouettes, crosswalk markings and strong vanishing points.
- Alley and subway references: forward camera translation must create genuine foreground/midground/background parallax, rather than scaling one background image.
- Collage/Pinterest reference: a few thin floating paper/card meshes at different distances establish depth during transitions. Avoid filling the reading area.
- Characters remain original Hamster Hub 2D cutouts; supplied third-party characters and game logos are references only and are not used as production assets.
- Palette: cobalt/electric blue, midnight navy, icy cyan and white. No red environment palette.

## Five locations

1. Gateway / arrival: crosswalk, city gate and creator mascot.
2. Build alley: workspace, code display and first-game illustration.
3. Rooftop squad studio: camera rises, teamwork stage and skyline.
4. Skybridge showcase: actual community game images on layered display planes.
5. Launch plaza: all three mascots, blue flag, course price and next action.

## Apple guidance applied

Apple's Motion guidance favors purposeful, optional movement that supports comprehension. This prototype preserves native scrolling, offers a camera pause control and a direct link to the course information, and uses a static camera when reduced motion is requested. Text remains in HTML with sufficient contrast, keyboard-focus styles, and large controls. Apple Design Resources was studied for hierarchy and legibility; no Apple-only font or symbol asset is redistributed.

## Sources

- Pinterest reference supplied by the user: https://pin.it/5HCLjUzrq — resolves to https://www.pinterest.com/pin/862650503597189455/ ; viewed in browser.
- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines
- Apple Motion: https://developer.apple.com/design/human-interface-guidelines/motion
- Apple Design Principles: https://developer.apple.com/design/human-interface-guidelines/design-principles
- Apple Design Resources: https://developer.apple.com/design/resources/
- Three.js GLTFLoader: https://threejs.org/docs/pages/GLTFLoader

## Implementation

The environment and camera animation are authored in Blender. `blender/star-up-city.blend` is the editable source. `assets/star-up-city.glb` is the real-time web scene. `assets/camera-track.json` contains samples of the Blender camera animation, transformed into glTF coordinates. Three.js is vendored at version 0.180.0 with its MIT license. No runtime CDN is required.

Course content is reused from the existing Star Up brief: 1 year, THB 21,890. Months 1–2 and 12 remain a provisional outline. This prototype does not guarantee income, competition admission or university admission.
