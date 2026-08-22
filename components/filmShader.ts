/**
 * The film, put through a shader.
 *
 * The video is uploaded as a texture and drawn on a single full-screen
 * triangle. Two things happen to it, and both are tied to how fast the visitor
 * is scrolling rather than to a clock:
 *
 *   - a lateral wave that leans the picture in the direction of travel, so the
 *     board reads as having mass, and
 *   - a chromatic split that opens as the wave grows, the way a lens separates
 *     colour toward its edges.
 *
 * At rest both fall to zero and the frame is a pixel-exact copy of the video.
 * That is the point: the effect is a consequence of movement, not a filter
 * sitting permanently on top of the footage.
 *
 * Raw WebGL, no library. The whole thing is one program, two triangles' worth
 * of vertices expressed as one, and a single texture unit.
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;

uniform sampler2D uTex;
uniform vec2  uCanvas;   // drawing buffer size
uniform vec2  uVideo;    // intrinsic video size
uniform float uVel;      // -1..1, signed scroll velocity, already smoothed
uniform float uTime;

varying vec2 vUv;

/*
 * Cover-fit: the video keeps its own aspect and is cropped, never stretched.
 *
 * The sampled rectangle has to *shrink* on the overflowing axis, so this
 * multiplies. Dividing expands the sample beyond the texture instead, which is
 * contain-fit — and with the out-of-range branch below that painted the whole
 * frame flat.
 */
vec2 cover(vec2 uv) {
  float canvasAspect = uCanvas.x / uCanvas.y;
  float videoAspect  = uVideo.x / uVideo.y;
  vec2 scale = canvasAspect > videoAspect
    ? vec2(1.0, videoAspect / canvasAspect)
    : vec2(canvasAspect / videoAspect, 1.0);
  return (uv - 0.5) * scale + 0.5;
}

void main() {
  vec2 uv = cover(vUv);

  float speed = abs(uVel);

  /*
   * Three texture samples cost three times one, and at rest there is nothing
   * for the extra two to show — the split is zero and they land on the same
   * texel. Below a threshold the shader takes the cheap path and reads once.
   * On a still page, which is most of the time a reader spends here, this is
   * the difference between paying for the effect and not.
   */
  if (speed < 0.012) {
    uv = clamp(uv, 0.0015, 0.9985);
    /* Deliberately not named "flat" -- that is a reserved word in GLSL and
       the whole program then fails to compile, which silently drops the
       effect on every device. */
    vec3 still = texture2D(uTex, uv).rgb;
    still *= 1.0 - 0.05 * step(0.5, fract(gl_FragCoord.y * 0.5));
    gl_FragColor = vec4(still, 1.0);
    return;
  }

  /*
   * The wave. Strongest across the middle of the frame and tapering to nothing
   * at the top and bottom edges, so the picture never tears away from the
   * scrim it sits under.
   */
  float edge = sin(vUv.y * 3.14159);
  float wave = sin(vUv.y * 7.0 + uTime * 0.6);
  uv.x += wave * edge * uVel * 0.055;
  uv.y += uVel * edge * 0.012;

  /* The wave can push a sample past the edge; clamping repeats the outermost
     column rather than showing a hole. */
  uv = clamp(uv, 0.0015, 0.9985);

  /* The split grows with speed and leans the way the page is moving. */
  float split = speed * 0.011;
  float r = texture2D(uTex, clamp(uv + vec2(split, 0.0), 0.0015, 0.9985)).r;
  float g = texture2D(uTex, uv).g;
  float b = texture2D(uTex, clamp(uv - vec2(split, 0.0), 0.0015, 0.9985)).b;
  vec3 col = vec3(r, g, b);

  /* A faint scanline, fixed to the screen rather than the picture, so the
     frame reads as displayed. */
  col *= 1.0 - 0.05 * step(0.5, fract(gl_FragCoord.y * 0.5));

  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    /*
     * A compile failure is survivable — the caller falls back to the plain
     * video — but it must not be silent. A single reserved word cost this
     * effect on every device once already, and the only symptom was its
     * quiet absence.
     */
    if (process.env.NODE_ENV !== "production") {
      console.error("[film] shader failed to compile:", gl.getShaderInfoLog(shader));
    }
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export type FilmRenderer = {
  /** Draw one frame. `vel` is signed and normalised; `fresh` re-uploads the texture. */
  render(vel: number, fresh: boolean): void;
  resize(): void;
  destroy(): void;
};

/**
 * Returns null whenever the shader path should not be taken at all — no
 * context, a driver that refuses to compile, or a machine that has told us it
 * cannot afford it. The caller then shows the plain video, which is a complete
 * experience on its own.
 */
export function createFilmRenderer(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
): FilmRenderer | null {
  const gl = (canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: false,
  }) ?? null) as WebGLRenderingContext | null;
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  // One oversized triangle covers the viewport with no seam down the middle,
  // which two triangles would have.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uTex = gl.getUniformLocation(program, "uTex");
  const uCanvas = gl.getUniformLocation(program, "uCanvas");
  const uVideo = gl.getUniformLocation(program, "uVideo");
  const uVel = gl.getUniformLocation(program, "uVel");
  const uTime = gl.getUniformLocation(program, "uTime");

  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // The video is not a power of two, so wrapping has to be clamped and there
  // can be no mipmaps.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.uniform1i(uTex, 0);

  /*
   * The texture is re-uploaded when the frame could have changed, and for a
   * short warm-up after the renderer is built.
   *
   * A single upload at construction is not safe: at that moment the video has
   * only just fired `loadeddata` and is still transitioning in, and a frame
   * grabbed then can come back empty — which leaves a black texture for the
   * rest of the session, because a scrubbed film never "plays" a new frame to
   * trigger a second attempt.
   */
  let lastUploadedTime = -1;
  let warmup = 90;
  const start = performance.now();

  function resize() {
    /*
     * Deliberately under-sampled.
     *
     * The canvas is stretched to fit by CSS, so it does not need device
     * pixels — and this is dark, soft, out-of-focus footage sitting behind a
     * scrim, where the loss is invisible and the saving is quadratic. At 0.7
     * the shader touches half the fragments it otherwise would.
     */
    const dpr = Math.min(window.devicePixelRatio || 1, 1) * 0.7;
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (w === 0 || h === 0) return;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl!.viewport(0, 0, w, h);
    gl!.uniform2f(uCanvas, w, h);
  }

  function render(vel: number, fresh: boolean) {
    if (video.readyState < 2) return;
    resize();

    /*
     * Beyond the warm-up the texture is only re-uploaded when the frame
     * actually changed. The film is scrubbed, not played, so its frame changes
     * on a seek and at no other time — uploading 1080p on every animation
     * frame regardless would be the most expensive thing on the page and would
     * buy nothing.
     */
    if (fresh || warmup > 0 || video.currentTime !== lastUploadedTime) {
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGB, gl!.RGB, gl!.UNSIGNED_BYTE, video);
      gl!.uniform2f(uVideo, video.videoWidth || 1920, video.videoHeight || 1080);
      lastUploadedTime = video.currentTime;
      if (warmup > 0) warmup -= 1;
    }

    gl!.uniform1f(uVel, vel);
    gl!.uniform1f(uTime, (performance.now() - start) / 1000);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
  }

  function destroy() {
    gl!.deleteTexture(texture);
    gl!.deleteBuffer(buffer);
    gl!.deleteProgram(program);
    gl!.deleteShader(vs!);
    gl!.deleteShader(fs!);
    const lose = gl!.getExtension("WEBGL_lose_context");
    lose?.loseContext();
  }

  resize();
  return { render, resize, destroy };
}
