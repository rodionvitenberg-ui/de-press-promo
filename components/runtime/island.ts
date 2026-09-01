import { SceneGL } from "../legacy/glscene";
import { easeOutQuad, easeOutQuart, tween, type TweenHandle } from "./easing";
import { lerp } from "./lerp";
import type { SceneDataJson, SceneKeypoint } from "./types";

/** Legacy island asset roots (window.Site.assetsRoot was always ""). */
const ISLAND_ASSETS = "/static/assets/island";

/** Per-page island profile (legacy page modules set these literally). */
export type IslandProfile = {
  state: string;
  matcap: [number, number];
  /** xl-only intro matcap (home): crossfaded to `matcap` during the intro. */
  initialMatcap?: [number, number];
  /** xl-only intro progress target (home). */
  initialProgress?: number;
};

export type IslandOptions = {
  data: SceneDataJson;
  reduced: boolean;
  container: HTMLElement;
  scene: HTMLElement;
  /** Modernizr.touchevents equivalent — gates the mouse parallax. */
  touch: boolean;
};

/**
 * Port of the legacy `Island` singleton (src/js/scene/index.js): owns the
 * SceneGL instance, the scroll-driven animation progress, the mouse parallax
 * and the intro sequence. All formulas are 1:1 with the bundle.
 */
export class Island {
  readonly GL: SceneGL;

  private readonly data: SceneDataJson;
  private readonly scene: HTMLElement;
  private readonly touch: boolean;

  state: string | null = null;
  matcap: [number, number] | null = null;
  initialMatcap: [number, number] | null = null;
  initialProgress = { value: 0 };

  private matcapProgress = { value: 0 };
  private animationProgress = { value: 0, dest: 0 };
  private dest = { x: 0, y: 0 };
  private mouse = { x: 0, y: 0 };
  private keypoints: SceneKeypoint[] | null = null;
  pageHeight = 0;

  private render = false;
  private visible = false;
  private initiated = false;

  private raf = 0;
  private tweens: TweenHandle[] = [];
  private bound = false;

  private readonly onScrollBound = () => this.onScroll();
  private readonly onResizeBound = () => this.onResize();
  private readonly onMoveBound = (e: MouseEvent) => this.onMove(e);

  constructor(options: IslandOptions) {
    this.data = options.data;
    this.scene = options.scene;
    this.touch = options.touch;

    this.GL = new SceneGL({
      data: options.data,
      reduced: options.reduced,
      container: options.container,
      imagePath: `${ISLAND_ASSETS}/images/island/final/`,
      dracoPath: `${ISLAND_ASSETS}/draco/`,
      modelPath: `${ISLAND_ASSETS}/models/`,
    });
  }

  /** Page profile (legacy page modules assign these before boot completes). */
  setProfile(profile: IslandProfile): void {
    this.state = profile.state;
    this.matcap = profile.matcap;
    this.initialMatcap = profile.initialMatcap ?? null;
    this.initialProgress = { value: profile.initialProgress ?? 0 };
  }

  load(): Promise<void> {
    return this.GL.load();
  }

  /** Legacy `loaded()`: retina SSAA configuration once the assets landed. */
  loaded(): void {
    if (window.disable_scene) return;

    if (window.devicePixelRatio > 1) {
      this.GL.setSSAA(true);
      this.GL.setSSAAQuality(1);
      this.GL.setPixelRatio(1);
    }
  }

  /** Intro sequence: matcap crossfade (3s) + progress tween (1.8s) → unlock. */
  init(): void {
    if (window.disable_scene) return;

    const onMatcapUpdate = () => {
      this.GL.setMatcapProgress(this.matcapProgress.value);
    };
    const onAnimationUpdate = () => {
      this.GL.setAnimationProgress(this.animationProgress.value);
      this.initiated = true;
    };
    const onComplete = () => {
      document.body.classList.remove("lock-scroll");
    };

    window.setTimeout(() => {
      if (this.initialMatcap && this.matcap) {
        // Crossfade the intro matcap → page matcap over 3s (Quad.easeOut).
        this.GL.setMatcap(this.matcap[0], this.matcap[1]);
        this.GL.setMatcapProgress(0);
        this.tweens.push(
          tween(this.matcapProgress, 3000, 0, 1, easeOutQuad, onMatcapUpdate),
        );
      }
      this.tweens.push(
        tween(
          this.animationProgress,
          1800,
          0,
          this.initialProgress.value,
          easeOutQuart,
          onAnimationUpdate,
          onComplete,
        ),
      );
    }, 100);
  }

  /** Legacy `show()`: bind inputs, set state + initial matcap, reveal scene. */
  show(): void {
    if (window.disable_scene || !this.state) return;

    this.render = true;
    this.visible = true;
    this.keypoints = this.data.STATES[this.state]?.KEYPOINTS ?? null;
    this.GL.setState(this.state);

    if (this.matcap && !this.initiated) {
      const m = this.initialMatcap ?? this.matcap;
      this.GL.setMatcap(m[0], m[1]);
      this.GL.setMatcapProgress(1);
    }

    this.GL.setAnimationProgress(this.animationProgress.value, true);
    this.scene.classList.add("is-visible");

    this.bindListeners();
    this.onResize();
    this.onScroll();
  }

  /** Legacy `menu()`: fullscreen menu scene state. */
  menu(): void {
    if (window.disable_scene) return;

    this.render = true;
    this.GL.setState("MENU_STATE");
    this.GL.setMatcap(1, 0);
    this.GL.setMatcapProgress(1);
    this.GL.setAnimationProgress(1, true);
    this.scene.classList.add("is-visible");
  }

  /** Return from the menu to the page state. */
  leaveMenu(): void {
    if (window.disable_scene || !this.state) return;
    this.keypoints = this.data.STATES[this.state]?.KEYPOINTS ?? null;
    this.GL.setState(this.state);
    if (this.matcap) {
      this.GL.setMatcap(this.matcap[0], this.matcap[1]);
      this.GL.setMatcapProgress(1);
    }
    this.onResize();
    this.onScroll();
    this.GL.setAnimationProgress(this.animationProgress.value, true);
  }

  /** Legacy `hide()`. */
  hide(): void {
    this.scene.classList.remove("is-visible");
    this.visible = false;
  }

  /** Legacy `reset()`. */
  reset(): void {
    this.state = null;
    this.matcap = null;
    this.render = false;
    this.visible = false;
    this.initiated = false;
    this.initialMatcap = null;
    this.initialProgress = { value: 0 };
    this.animationProgress = { value: 0, dest: 0 };
    this.hide();
  }

  /** Frame tick (legacy `update`, driven by the runtime RAF loop). */
  update(): void {
    if (!this.render) return;

    this.GL.update();
    this.animationProgress.dest = Math.min(
      lerp(this.animationProgress.dest, this.animationProgress.value, 0.2),
      1,
    );
    this.GL.setAnimationProgress(this.animationProgress.dest, true);

    if (!this.touch) {
      this.dest.x = lerp(this.dest.x, this.mouse.x, 0.1);
      this.dest.y = lerp(this.dest.y, this.mouse.y, 0.1);
      this.GL.setMouse(this.dest);
    }
  }

  /** Legacy `onScroll` — exact KEYPOINTS interpolation. */
  onScroll(): void {
    if (!this.keypoints) return;

    const S = window.pageYOffset;
    for (let i = 0; i < this.keypoints.length; i++) {
      const PA = this.keypoints[i];
      const PB = this.keypoints[i + 1];

      const TA = PA.top ?? 0;
      const TB = PB ? (PB.top ?? 0) : this.pageHeight - window.innerHeight;
      const VA = PA.value;
      const VB = PB ? PB.value : VA;

      const P = S - TA;
      const R = P * (S - TB);
      const D = Math.abs(TA - TB);

      if (R <= 0) {
        if (PA.visible === false) {
          if (this.visible) {
            this.visible = false;
            this.scene.classList.remove("is-visible");
          }
        } else if (!this.visible) {
          this.visible = true;
          this.scene.classList.add("is-visible");
        }

        const N = Math.min(P / D, 1);
        const A = lerp(VA, VB, N);
        this.animationProgress.value = A;
      }
    }
  }

  /** Legacy `onResize` — page height + keypoint anchors. */
  onResize(): void {
    if (window.disable_scene) return;

    this.pageHeight = Math.max(
      document.body.clientHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight,
    );

    if (!this.keypoints) return;
    for (const point of this.keypoints) {
      const el = document.querySelector(point.element);
      if (!el) continue;
      const offset = point.offset || 0;
      point.top =
        el.getBoundingClientRect().top +
        window.pageYOffset -
        window.innerHeight / 2 +
        offset;
    }
  }

  /** Legacy `onMove` — normalized mouse position. */
  onMove(e: MouseEvent): void {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y =
      -((window.innerHeight - e.clientY) / window.innerHeight) * 2 + 1;
  }

  private bindListeners(): void {
    if (this.bound) return;
    this.bound = true;
    window.addEventListener("scroll", this.onScrollBound);
    window.addEventListener("resize", this.onResizeBound);
    if (!this.touch) {
      window.addEventListener("mousemove", this.onMoveBound);
    }
  }

  startLoop(): void {
    if (this.raf) return;
    const step = () => {
      this.update();
      this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  }

  destroy(): void {
    for (const t of this.tweens) t.cancel();
    this.tweens = [];
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    window.removeEventListener("scroll", this.onScrollBound);
    window.removeEventListener("resize", this.onResizeBound);
    window.removeEventListener("mousemove", this.onMoveBound);
    this.reset();
  }
}
