use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Segment {
    pub length: f64,
    pub angle: f64,
    pub angular_speed: f64,
    pub alpha: f64,
    pub color_speed: f64,
}

#[wasm_bindgen]
pub struct Spirograph {
    segments: Vec<Segment>,
    base_angle: f64,
    speed: f64,
    width: usize,
    height: usize,
    buffer: Vec<u8>, // RGBA pixel buffer
}

#[wasm_bindgen]
impl Spirograph {
    #[wasm_bindgen(constructor)]
    pub fn new(segments: js_sys::Array, speed: f64, width: usize, height: usize) -> Spirograph {
        let segments = segments.iter().map(|s| {
            let obj = js_sys::Object::from(s);
            Segment {
                length: js_sys::Reflect::get(&obj, &"length".into()).unwrap().as_f64().unwrap(),
                angle: js_sys::Reflect::get(&obj, &"angle".into()).unwrap().as_f64().unwrap(),
                angular_speed: js_sys::Reflect::get(&obj, &"angularSpeed".into()).unwrap().as_f64().unwrap(),
                alpha: js_sys::Reflect::get(&obj, &"alpha".into()).unwrap().as_f64().unwrap(),
                color_speed: js_sys::Reflect::get(&obj, &"colorSpeed".into()).unwrap().as_f64().unwrap(),
            }
        }).collect();
        let buffer = vec![0; width * height * 4];
        Spirograph { segments, base_angle: 0.0, speed, width, height, buffer }
    }

    pub fn clear_buffer(&mut self) {
        for px in self.buffer.iter_mut() {
            *px = 0;
        }
    }

    pub fn draw_points(&mut self, steps_per_frame: u32, scale: f64) {
        let width = self.width as f64;
        let height = self.height as f64;
        for _ in 0..steps_per_frame {
            let mut x = width / 2.0;
            let mut y = height / 2.0;
            let mut angle_sum = 0.0;
            self.base_angle += self.speed / steps_per_frame as f64;
            for seg in &mut self.segments {
                seg.angle = seg.angular_speed * self.base_angle;
                angle_sum += seg.angle;
                x += seg.length * scale * angle_sum.cos();
                y += seg.length * scale * angle_sum.sin();
                let hue = ((seg.color_speed) * self.base_angle * 180.0 / std::f64::consts::PI) % 360.0;
                let alpha = seg.alpha / 100.0;
                // Convert hue to RGB
                let (r, g, b) = hsl_to_rgb(hue, 1.0, 0.5);
                // Blend into buffer
                let xi = x.round() as isize;
                let yi = y.round() as isize;
                if xi >= 0 && xi < self.width as isize && yi >= 0 && yi < self.height as isize {
                    let idx = (yi as usize * self.width + xi as usize) * 4;
                    blend_pixel(&mut self.buffer[idx..idx+4], r, g, b, alpha);
                }
            }
        }
    }

    #[wasm_bindgen(js_name = getPixelBuffer)]
    pub fn get_pixel_buffer(&self) -> js_sys::Uint8Array {
        // Expose the buffer as a Uint8Array to JS (must use unsafe block)
        unsafe { js_sys::Uint8Array::view(&self.buffer) }
    }

    pub fn set_segments(&mut self, segments: js_sys::Array) {
        self.segments = segments.iter().map(|s| {
            let obj = js_sys::Object::from(s);
            Segment {
                length: js_sys::Reflect::get(&obj, &"length".into()).unwrap().as_f64().unwrap(),
                angle: js_sys::Reflect::get(&obj, &"angle".into()).unwrap().as_f64().unwrap(),
                angular_speed: js_sys::Reflect::get(&obj, &"angularSpeed".into()).unwrap().as_f64().unwrap(),
                alpha: js_sys::Reflect::get(&obj, &"alpha".into()).unwrap().as_f64().unwrap(),
                color_speed: js_sys::Reflect::get(&obj, &"colorSpeed".into()).unwrap().as_f64().unwrap(),
            }
        }).collect();
    }

    pub fn set_speed(&mut self, speed: f64) {
        self.speed = speed;
    }
}

// Helper: blend RGBA into buffer with alpha
fn blend_pixel(px: &mut [u8], r: u8, g: u8, b: u8, alpha: f64) {
    let a = (alpha * 255.0).clamp(0.0, 255.0) as u8;
    let inv_a = 255 - a;
    px[0] = ((r as u16 * a as u16 + px[0] as u16 * inv_a as u16) / 255) as u8;
    px[1] = ((g as u16 * a as u16 + px[1] as u16 * inv_a as u16) / 255) as u8;
    px[2] = ((b as u16 * a as u16 + px[2] as u16 * inv_a as u16) / 255) as u8;
    px[3] = 255;
}

// Helper: HSL to RGB
fn hsl_to_rgb(h: f64, s: f64, l: f64) -> (u8, u8, u8) {
    let c = (1.0 - (2.0 * l - 1.0).abs()) * s;
    let h_ = h / 60.0;
    let x = c * (1.0 - ((h_ % 2.0) - 1.0).abs());
    let (r1, g1, b1) = match h_ as u32 {
        0 => (c, x, 0.0),
        1 => (x, c, 0.0),
        2 => (0.0, c, x),
        3 => (0.0, x, c),
        4 => (x, 0.0, c),
        5 => (c, 0.0, x),
        _ => (0.0, 0.0, 0.0),
    };
    let m = l - c / 2.0;
    (
        ((r1 + m) * 255.0).round() as u8,
        ((g1 + m) * 255.0).round() as u8,
        ((b1 + m) * 255.0).round() as u8,
    )
}