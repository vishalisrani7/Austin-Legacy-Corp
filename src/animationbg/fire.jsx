import { useEffect, useRef } from "react";

export default function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let startTime = performance.now();
    let progress = 0.3;
    const vertexShaderSrc = `
      precision mediump float;
      attribute vec2 a_position;
      varying vec2 vUv;

      void main() {
        vUv = a_position;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSrc = `
      precision mediump float;

      varying vec2 vUv;
      uniform vec2 u_resolution;
      uniform float u_progress;
      uniform float u_time;
      uniform sampler2D u_text;

      float rand(vec2 n) {
        return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
      }

      float noise(vec2 n) {
        const vec2 d = vec2(0., 1.);
        vec2 b = floor(n), f = smoothstep(vec2(0.), vec2(1.), fract(n));
        return mix(
          mix(rand(b), rand(b + d.yx), f.x),
          mix(rand(b + d.xy), rand(b + d.yy), f.x),
          f.y
        );
      }

      float fbm(vec2 n) {
        float total = 0.0;
        float amp = 0.4;
        for (int i = 0; i < 4; i++) {
          total += noise(n) * amp;
          n *= 2.0;
          amp *= 0.6;
        }
        return total;
      }

      void main() {
        vec2 uv = vUv;
        uv.x *= min(1., u_resolution.x / u_resolution.y);
        uv.y *= min(1., u_resolution.y / u_resolution.x);

        vec2 screenUv = vUv * 0.5 + 0.5;
        screenUv.y = 1.0 - screenUv.y;

        float t = u_progress;
        vec4 textColor = texture2D(u_text, screenUv);
        vec3 color = textColor.rgb;

        float main_noise = 1. - fbm(.75 * uv + 10. - vec2(.3, .9 * t));
        float darkness = smoothstep(main_noise - .1, main_noise, t);
        color -= vec3(.99, .95, .99) * darkness;

        vec3 fire = fbm(6. * uv - vec2(0., .005 * u_time)) * vec3(6., 1.4, 0.);
        float show_fire = smoothstep(.4, .9, fbm(10. * uv + 2. - vec2(0., .005 * u_time)));
        float border = .02 * show_fire;

        float edge = smoothstep(main_noise - border, main_noise - .5 * border, t);
        edge *= (1. - smoothstep(main_noise - .5 * border, main_noise, t));
        color += fire * edge;

        float opacity = 1. - smoothstep(main_noise - .0005, main_noise, t);
        gl_FragColor = vec4(color, opacity);
      }
    `;

    const compile = (type, src) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexShaderSrc));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentShaderSrc));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uProgress = gl.getUniformLocation(program, "u_progress");
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const textCanvas = document.createElement("canvas");
    textCanvas.width = 2048;
    textCanvas.height = 1024;
    const ctx = textCanvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 2048, 1024);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    const img = new Image();
    img.src = "/ALC.png"; 
    img.crossOrigin = "Anonymous"; 

    img.onload = () => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, textCanvas.width, textCanvas.height);
      const scale = Math.min(
        (textCanvas.width * 0.5) / img.width, 
        (textCanvas.height * 0.5) / img.height
      ); 
      
      const w = img.width * scale;
      const h = img.height * scale;
      const x = (textCanvas.width - w) / 2;
      const y = (textCanvas.height - h) / 2;
      ctx.drawImage(img, x, y, w, h);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
    };

    const resize = () => {
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    };

    const ease = t =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const render = () => {
      const elapsed = (performance.now() - startTime) / 8000;
      if (elapsed <= 1) progress = 0.3 + 0.7 * ease(elapsed);

      gl.uniform1f(uTime, performance.now());
      gl.uniform1f(uProgress, progress);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-black via-[#1a1a2e] to-[#16213e]">
        <div className="text-center px-6">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-yellow-400 to-yellow-300 bg-clip-text text-transparent">
            We create experiences
          </h1>
          <p className="mt-6 text-2xl text-white/90 max-w-3xl mx-auto">
            Not simple websites but real immersive experiences
          </p>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-10"
      />
    </>
  );
}