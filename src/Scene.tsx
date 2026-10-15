import { MengToSketchbookLandingPage } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export function Scene() {
  return (
    <div className="shader-frame">
      <MengToSketchbookLandingPage
        headingFont="instrument-serif"
        bodyFont="newsreader"
        headingWeight="400"
        bodyWeight="400"
        primaryColor="#2b2721"
        headingSize={30}
        bodySize={20}
        headingLetterSpacing={0.010}
        applyScene={(frame) => {
          const doc = frame.contentDocument;
          if (!doc) return;
          const styleId = "mobile-interaction-touch-enhancements";
          if (doc.getElementById(styleId)) return;
          const style = doc.createElement("style");
          style.id = styleId;
          style.textContent = `
            @media (pointer: coarse) {
              .loupe.on { display: block !important; }
            }
            .loupe, .loupe .ring, .loupe .grip {
              touch-action: none;
            }
          `;
          doc.head.appendChild(style);
        }}
      />
    </div>
  );
}
