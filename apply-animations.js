const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

function replaceStr(oldStr, newStr) {
  if (code.includes(oldStr)) {
    code = code.replace(oldStr, newStr);
  } else {
    code = code.replace(new RegExp(oldStr.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\\\$&").replace(/\s+/g, '\\s+')), newStr);
  }
}

// Wrap main hero text block
replaceStr(
  '<main className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-6 pt-12 md:pt-20 pb-20 md:pb-32 max-w-5xl mx-auto animate-in slide-in-from-bottom-8 fade-in duration-1000">',
  '<main className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-6 pt-12 md:pt-20 pb-20 md:pb-32 max-w-5xl mx-auto">\n      <AnimatedSection direction="up">'
);
replaceStr(
  '</a>\n        </div>\n      </main>',
  '</a>\n        </div>\n      </AnimatedSection>\n      </main>'
);

// Wrap mockup
replaceStr(
  '<div className="relative z-10 max-w-5xl mx-auto px-6 pb-32">\n         {/* Perspective Wrapper */}',
  '<div className="relative z-10 max-w-5xl mx-auto px-6 pb-32">\n         <AnimatedSection direction="up" delay={0.2}>\n         {/* Perspective Wrapper */}'
);
replaceStr(
  'pointer-events-none rounded-[2rem]" />\n         </div>\n      </div>',
  'pointer-events-none rounded-[2rem]" />\n         </div>\n         </AnimatedSection>\n      </div>'
);

// Wrap features header
replaceStr(
  '<h2 className="text-3xl md:text-5xl font-bold text-center mb-4 tracking-tight">Kekuatan di Tangan Anda</h2>',
  '<AnimatedSection direction="up">\n            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 tracking-tight">Kekuatan di Tangan Anda</h2>\n            </AnimatedSection>'
);

// Feature 1
replaceStr(
  '{/* Feature 1 */}\n               <div',
  '{/* Feature 1 */}\n               <AnimatedSection direction="up" delay={0.1}>\n               <div'
);
replaceStr(
  'absulut secara *real-time* ke satuan detik dan dikalkulasikan ke harga yang selalu berjalan dinamis.\n                  </p>\n               </div>',
  'absulut secara *real-time* ke satuan detik dan dikalkulasikan ke harga yang selalu berjalan dinamis.\n                  </p>\n               </div>\n               </AnimatedSection>'
);

// Feature 2
replaceStr(
  '{/* Feature 2 */}\n               <div className="bg-surface',
  '{/* Feature 2 */}\n               <AnimatedSection direction="up" delay={0.2}>\n               <div className="bg-surface'
);
replaceStr(
  'dikorupsi staf.\n                  </p>\n               </div>',
  'dikorupsi staf.\n                  </p>\n               </div>\n               </AnimatedSection>'
);

// Feature 3
replaceStr(
  '{/* Feature 3 */}\n               <div className="bg-surface',
  '{/* Feature 3 */}\n               <AnimatedSection direction="up" delay={0.3}>\n               <div className="bg-surface'
);
replaceStr(
  'buku nota yang hilang.\n                  </p>\n               </div>',
  'buku nota yang hilang.\n                  </p>\n               </div>\n               </AnimatedSection>'
);

// Feature 4
replaceStr(
  '{/* Feature 4: Lg spans 2 cols */}\n               <div className="bg-surface',
  '{/* Feature 4: Lg spans 2 cols */}\n               <AnimatedSection direction="up" delay={0.4}>\n               <div className="bg-surface'
);
replaceStr(
  'kalkulasi.\n                  </p>\n               </div>',
  'kalkulasi.\n                  </p>\n               </div>\n               </AnimatedSection>'
);

// Feature 5
replaceStr(
  '{/* Feature 5 */}\n                <div className="bg-surface',
  '{/* Feature 5 */}\n                <AnimatedSection direction="up" delay={0.5}>\n                <div className="bg-surface'
);
replaceStr(
  'nyaman.\n                  </p>\n               </div>\n            </div>',
  'nyaman.\n                  </p>\n               </div>\n                </AnimatedSection>\n            </div>'
);

// Step 1
replaceStr(
  '{/* Step 1 */}\n               <div className="bg-surface',
  '{/* Step 1 */}\n               <AnimatedSection direction="up" delay={0.1}>\n               <div className="bg-surface'
);
replaceStr(
  'per jamnya.\n                  </p>\n               </div>',
  'per jamnya.\n                  </p>\n               </div>\n               </AnimatedSection>'
);

// Step 2
replaceStr(
  '{/* Step 2 */}\n               <div className="bg-surface',
  '{/* Step 2 */}\n               <AnimatedSection direction="up" delay={0.3}>\n               <div className="bg-surface'
);
replaceStr(
  'berjalan.\n                  </p>\n               </div>',
  'berjalan.\n                  </p>\n               </div>\n               </AnimatedSection>'
);

// Step 3
replaceStr(
  '{/* Step 3 */}\n               <div className="bg-surface',
  '{/* Step 3 */}\n               <AnimatedSection direction="up" delay={0.5}>\n               <div className="bg-surface'
);
replaceStr(
  'WhatsApp.\n                  </p>\n               </div>\n            </div>',
  'WhatsApp.\n                  </p>\n               </div>\n               </AnimatedSection>\n            </div>'
);


// Pricing
replaceStr(
  '{/* Free Tier */}\n            <div className="bg-surface',
  '{/* Free Tier */}\n            <AnimatedSection direction="right" delay={0.1} className="flex">\n            <div className="bg-surface w-full'
);
replaceStr(
  'Coba Sekarang\n              </Link>\n            </div>\n\n            {/* Pro Tier */}',
  'Coba Sekarang\n              </Link>\n            </div>\n            </AnimatedSection>\n\n            {/* Pro Tier */}'
);

replaceStr(
  '{/* Pro Tier */}\n            <div className="bg-gradient-to-b',
  '{/* Pro Tier */}\n            <AnimatedSection direction="left" delay={0.3} className="flex">\n            <div className="bg-gradient-to-b w-full'
);
replaceStr(
  'Mulai Berlangganan <Rocket className="w-4 h-4 md:w-5 md:h-5" />\n              </Link>\n            </div>\n          </div>',
  'Mulai Berlangganan <Rocket className="w-4 h-4 md:w-5 md:h-5" />\n              </Link>\n            </div>\n            </AnimatedSection>\n          </div>'
);

// CTA
replaceStr(
  '<div className="bg-gradient-to-r from-green-900/40 via-primary/20',
  '<AnimatedSection direction="up">\n          <div className="bg-gradient-to-r from-green-900/40 via-primary/20'
);
replaceStr(
  'Buat Akun Gratis Sekarang\n              </Link>\n            </div>\n          </div>\n        </div>',
  'Buat Akun Gratis Sekarang\n              </Link>\n            </div>\n          </div>\n          </AnimatedSection>\n        </div>'
);

fs.writeFileSync('src/app/page.tsx', code);
console.log('Applied changes!');
